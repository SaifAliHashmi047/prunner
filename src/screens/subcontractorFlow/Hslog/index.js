import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import useCallApi from "../../../hooks/useCallApi";
import { Loader } from "../../../components/Loader";

const HsLog = ({ navigation }) => {
    const { callApi } = useCallApi();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchLogs = useCallback(async (pageNum, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await callApi("hs-logs", "GET", null, {
                page: pageNum,
                limit: 10
            });

            if (response?.success && response?.data) {
                const newLogs = response.data.hsLogs || [];
                const pagination = response.data.pagination;

                if (isRefresh || pageNum === 1) {
                    setLogs(newLogs);
                } else {
                    setLogs(prev => [...prev, ...newLogs]);
                }

                if (pagination && pagination.currentPage >= pagination.totalPages) {
                    setHasMore(false);
                } else if (newLogs.length === 0) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                setPage(pageNum);
            }
        } catch (error) {
            console.log("Fetch HS logs error", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [callApi]);

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const onRefresh = () => {
        setHasMore(true);
        fetchLogs(1, true);
    };

    const loadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchLogs(page + 1);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={colors.themeColor} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                <Text style={{ fontSize: 16, color: colors.greyBg, fontFamily: fonts.NunitoRegular }}>No logs found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="H&S Log"
                />

                <FlatList
                    data={logs}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.themeColor]} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={logs.length === 0 ? { flex: 1 } : { paddingBottom: heightPixel(20) }}
                    renderItem={({ item }) => (
                        <View style={styles.workPackItem}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Image source={appIcons.warning} style={{ width: widthPixel(20), height: widthPixel(20), resizeMode: "contain", }} />
                                    <Text style={styles.workPackName}>{item.title}</Text>
                                </View>
                                {item.status === 'active' ? <View style={styles.countContainer}>
                                    <Text style={styles.count}>Active</Text>
                                </View> : null}
                            </View>
                            <Text style={styles.workPackDescription}>{item.precaution}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Text style={[styles.workPackName, {
                                        fontSize: fontPixel(14),
                                    }]}>Active Date </Text>
                                </View>
                                <Image source={appIcons.calandar} style={{ width: widthPixel(20), height: widthPixel(20), resizeMode: "contain", }} />
                                <Text style={styles.time}>{item.date}</Text>
                            </View>
                            {/* Adding a line under each item */}
                        </View>
                    )}
                />
            </View>
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
        color: colors.grey,
        fontFamily: fonts.NunitoRegular,
        marginLeft: widthPixel(10),
    },
    countContainer: {
        height: heightPixel(25),
        width: widthPixel(80),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: widthPixel(8),
        backgroundColor: '#EDE2FF',
    },
    count: {
        color: colors.themeColor,
        fontWeight: "400",
        textAlign: "center",
        fontSize: widthPixel(10),
        fontFamily: fonts.NunitoRegular,
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
});

export default HsLog;