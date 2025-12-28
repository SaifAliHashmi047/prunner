import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCallApi from "../../../hooks/useCallApi";
import { toastError } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const WorkPack = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { callApi } = useCallApi();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchWorkPacks = useCallback(async (pageNum, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await callApi("workpacks", "GET", null, {
                page: pageNum,
                limit: 10
            });

            if (response?.success && response?.data) {
                const newWorkPacks = response.data.workpacks || [];
                const pagination = response.data.pagination;

                if (isRefresh || pageNum === 1) {
                    setData(newWorkPacks);
                } else {
                    setData(prev => [...prev, ...newWorkPacks]);
                }

                // Check if we have loaded all pages
                if (pagination && pagination.currentPage >= pagination.totalPages) {
                    setHasMore(false);
                } else if (newWorkPacks.length === 0) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                setPage(pageNum);

            } else {
                if (pageNum === 1 && !isRefresh) {
                    // Only show error on initial load failure or handle gracefully
                    // toastError({ text: response?.message || "Failed to load work packs" });
                }
            }

        } catch (error) {
            console.log("Fetch workpacks error", error);
            // toastError({ text: "Failed to load work packs" });
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [callApi]);

    useEffect(() => {
        fetchWorkPacks(1);
    }, [fetchWorkPacks]);

    const onRefresh = () => {
        setHasMore(true);
        fetchWorkPacks(1, true);
    };

    const loadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchWorkPacks(page + 1);
        }
    };

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
                                <Text style={styles.time}>{item.createdAt}</Text>
                            </View>
                            <Text style={styles.workPackDescription} numberOfLines={2}>
                                {item.createdBy || "Admin"}: {item.description}
                            </Text>
                            {/* Adding a line under each item */}
                            <View style={styles.separator} />
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.createWorkPack);
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