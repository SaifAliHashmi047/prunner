import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../../../components/Loader";
import useWorkpacks from "../../../hooks/useWorkpacks";
import { useFocusEffect } from "@react-navigation/native";

const WorkPack = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const { workpacks, loading, refreshing, loadingMore, loadMore, onRefresh, fetchWorkPacks } = useWorkpacks();
    console.log("workpacks,", workpacks);

    useFocusEffect(useCallback(() => {
        fetchWorkPacks(1);
    }, [fetchWorkPacks]));

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
                <Text style={styles.emptyText}>No work packs found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, {
            paddingTop: insets.top
        }]}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="Work Pack"
                />

                <FlatList
                    data={workpacks}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.themeColor]} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={workpacks.length === 0 ? { flex: 1 } : { paddingBottom: heightPixel(80) }}
                    renderItem={({ item }) => (
                        <View style={styles.workPackItem}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Text style={styles.workPackName}>{item.title}</Text>
                                    {/* Count is not in API response, omitting or using placeholder if needed */}
                                    {/* <View style={styles.countContainer}>
                                        <Text style={styles.count}>0</Text>
                                    </View> */}
                                </View>
                                <Text style={styles.time}>{item?.createdAt}</Text>
                            </View>
                            <Text style={styles.workPackDescription} numberOfLines={2}>
                                {item?.createdBy?.email || "Admin"}: {item.description}
                            </Text>
                            {/* Adding a line under each item */}
                            <View style={styles.separator} />
                        </View>
                    )}
                />
            </View>
            {/* <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.createWorkPack);
            }}>
                <Image source={appIcons.plus} style={{ width: widthPixel(24), height: widthPixel(24), tintColor: colors.white }} />
            </TouchableOpacity> */}
            <Loader isVisible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || "#F4F4F4",

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
    },
    time: {
        fontSize: widthPixel(12),
        color: colors.greyBg,
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
    }
});

export default WorkPack;