import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCallApi from "../../../hooks/useCallApi";
import { Loader } from "../../../components/Loader";
import { routes } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

const FeedBack = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { callApi } = useCallApi();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeedback = useCallback(async (pageNum, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await callApi("feedback/my-feedback", "GET", null, {
                page: pageNum,
                limit: 10
            });

            if (response?.success && response?.data) {
                const newFeedback = response.data.feedback || response.data.feedbacks || [];
                const pagination = response.data.pagination;

                if (isRefresh || pageNum === 1) {
                    setData(newFeedback);
                } else {
                    setData(prev => [...prev, ...newFeedback]);
                }

                if (pagination && pagination.currentPage >= pagination.totalPages) {
                    setHasMore(false);
                } else if (newFeedback.length === 0) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                setPage(pageNum);
            }

        } catch (error) {
            console.log("Fetch feedback error", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [callApi]);

    useEffect(() => {
        fetchFeedback(1);
    }, []);

    const onRefresh = () => {
        setHasMore(true);
        fetchFeedback(1, true);
    };

    const loadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchFeedback(page + 1);
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
        if (loading) return null; // Loader is handled by global Loader component or initial state
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No feedback found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top+0 }]}>
            <View style={styles.content}>
                {/* <SecondHeader onPress={() => navigation.goBack()} title="Feedback" /> */}

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
                    contentContainerStyle={data.length === 0 ? { flex: 1 } : {padding:heightPixel(3), paddingBottom: heightPixel(80) }}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.row}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.date}>{item.createdAt}</Text>
                            </View>
                            <Text style={styles.description} numberOfLines={2}>
                                {item.details}
                            </Text>
                        </View>
                    )}
                />
            </View>

            <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.addFeedback);
            }}>
                <Image source={appIcons.plus} style={{ width: widthPixel(24), height: widthPixel(24), tintColor: colors.white }} />
            </TouchableOpacity>

            <Loader isVisible={loading} />
        </SafeAreaView>
    );
};

export default FeedBack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: widthPixel(20),
        marginTop: heightPixel(10),
    },
    itemContainer: {
        backgroundColor: colors.white,
        borderRadius: widthPixel(10),
        padding: widthPixel(15),
        marginBottom: heightPixel(15),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#f0f0f0"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: heightPixel(8),
    },
    title: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoBold,
        color: colors.black,
        flex: 1,
    },
    date: {
        fontSize: fontPixel(12),
        fontFamily: fonts.NunitoRegular,
        color: colors.greyBg,
    },
    description: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
    },
    fab: {
        position: "absolute",
        right: widthPixel(24),
        bottom: heightPixel(24),
        width: widthPixel(50),
        height: widthPixel(50),
        borderRadius: widthPixel(25),
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
