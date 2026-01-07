import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, Platform, ScrollView } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../../../components/Loader";
import useFeedback from "../../../hooks/useFeedback";

const SiteFeedback = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    
    // Use the feedback hook with "site" endpoint
    const {
        feedback: data,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        fetchFeedback,
        loadMore,
        onRefresh,
    } = useFeedback();

    useEffect(() => {
        fetchFeedback(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.themeColor} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null; // Loader covers this
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No feedback found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="Site Feedback"
                />

                <FlatList
                    data={data}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.themeColor]} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={data.length === 0 ? { flex: 1 } : { paddingBottom: heightPixel(80) }}
                    renderItem={({ item }) => {
                        // Format date
                        const date = new Date(item.createdAt || item.created_at || Date.now());
                        const formattedDate = date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        });

                        // Render rating stars
                        const renderRating = () => {
                            const stars = [];
                            const rating = item.rating || 0;
                            for (let i = 1; i <= 5; i++) {
                                stars.push(
                                    <Text key={i} style={styles.star}>
                                        {i <= rating ? '★' : '☆'}
                                    </Text>
                                );
                            }
                            return stars;
                        };

                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate(routes.siteFeedbackDetail, {
                                        feedback: item,
                                    })
                                }
                                style={styles.workPackItem}
                            >
                                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.workPackName}>{item.title || "No title"}</Text>
                                        <Text style={[styles.workPackDescription, { marginTop: heightPixel(4) }]}>
                                            {item.description || "No description"}
                                        </Text>
                                        {item.siteId && (
                                            <View style={{ marginTop: heightPixel(6) }}>
                                                <Text style={[styles.siteInfo, { marginBottom: heightPixel(2) }]}>
                                                    📍 Site: {item.siteId.name || "Unknown"}
                                                </Text>
                                                {item.siteId.location?.address && (
                                                    <Text style={styles.siteInfo}>
                                                        {item.siteId.location.address}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ alignItems: "flex-end", marginLeft: widthPixel(12) }}>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: item.status === 'active' ? '#E8F5E9' : '#FFEBEE' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: item.status === 'active' ? '#4CAF50' : '#F44336' }
                                            ]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                        <Text style={styles.time}>{formattedDate}</Text>
                                    </View>
                                </View>
                                
                                {/* Rating */}
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: heightPixel(8) }}>
                                    <Text style={styles.ratingLabel}>Rating: </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {renderRating()}
                                    </View>
                                </View>

                                {/* Media Images */}
                                {item.media && item.media.length > 0 && (
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: heightPixel(12) }}
                                    >
                                        {item.media.map((imageUrl, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: imageUrl }}
                                                style={styles.mediaImage}
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </ScrollView>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.addFeedback)
            }}>
                <Image source={appIcons.plus} style={{ width: widthPixel(24), height: widthPixel(24), tintColor: colors.white }} />
            </TouchableOpacity>
            <Loader isVisible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || "#F4F4F4",
        paddingTop: Platform.OS === 'android' ? heightPixel(10) : 0,

    },
    content: {
        flex: 1,
        // paddingTop: heightPixel(16),
        paddingHorizontal: widthPixel(10),
        backgroundColor: colors.white,
        marginTop: heightPixel(16),
    },
    workPackItem: {
        paddingVertical: heightPixel(12),
        paddingHorizontal: widthPixel(12),
        borderRadius: widthPixel(8),
        marginBottom: heightPixel(12),
        marginTop: heightPixel(8),
        backgroundColor: colors.white,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    workPackName: {
        fontSize: fontPixel(18),
        fontWeight: "600",
        color: colors.grey300,
        fontFamily: fonts.NunitoSemiBold,
    },
    workPackDescription: {
        fontSize: widthPixel(14),
        color: colors.greyBg,
        marginVertical: heightPixel(6),
        fontFamily: fonts.NunitoRegular,
    },
    time: {
        fontSize: widthPixel(12),
        color: colors.themeColor,
        fontFamily: fonts.NunitoRegular,
        marginLeft: widthPixel(10),
    },
    countContainer: {
        height: heightPixel(16),
        width: widthPixel(16),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: widthPixel(8),
        backgroundColor: colors.blue,
    },
    count: {
        color: colors.white,
        fontWeight: "400",
        textAlign: "center",
        fontSize: widthPixel(10),
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#E8E8E8',
        marginTop: heightPixel(4),
    },
    fab: {
        position: "absolute",
        right: widthPixel(24),
        bottom: heightPixel(24),
        width: widthPixel(46),
        height: widthPixel(46),
        borderRadius: widthPixel(18),
        backgroundColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
    footerLoader: {
        paddingVertical: heightPixel(20),
        alignItems: "center",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: fontPixel(16),
        color: colors.greyBg,
        fontFamily: fonts.NunitoRegular,
    },
    statusBadge: {
        paddingHorizontal: widthPixel(8),
        paddingVertical: heightPixel(4),
        borderRadius: widthPixel(4),
        marginBottom: heightPixel(4),
    },
    statusText: {
        fontSize: fontPixel(12),
        fontWeight: "600",
        fontFamily: fonts.NunitoSemiBold,
        textTransform: "capitalize",
    },
    createdByLabel: {
        fontSize: fontPixel(12),
        color: colors.greyBg,
        fontFamily: fonts.NunitoRegular,
    },
    createdByName: {
        fontSize: fontPixel(12),
        color: colors.grey300,
        fontFamily: fonts.NunitoSemiBold,
        fontWeight: "600",
    },
    employeeCount: {
        fontSize: fontPixel(12),
        color: colors.grey300,
        fontFamily: fonts.NunitoRegular,
    },
    ratingLabel: {
        fontSize: fontPixel(12),
        color: colors.greyBg,
        fontFamily: fonts.NunitoRegular,
        marginRight: widthPixel(4),
    },
    star: {
        fontSize: fontPixel(16),
        color: '#FFD700',
        marginRight: widthPixel(2),
    },
    siteInfo: {
        fontSize: fontPixel(12),
        color: colors.greyBg,
        fontFamily: fonts.NunitoRegular,
    },
    mediaImage: {
        width: widthPixel(80),
        height: widthPixel(80),
        borderRadius: widthPixel(8),
        marginRight: widthPixel(8),
        backgroundColor: colors.greyBg,
    },
});

export default SiteFeedback;