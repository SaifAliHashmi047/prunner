import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import useSite from "../../../hooks/useSite";
import { Loader } from "../../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSite } from "../../../services/store/slices/siteSlice";
import SafeImageBackground from "../../../components/SafeImageBackground";

const ForkHomeDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { sites, loading, fetchSites } = useSite();
    const { user } = useSelector((state) => state.user);
    console.log("usr", user);
    useEffect(() => {
        fetchSites(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSitePress = (site) => {
        // dispatch(setSelectedSite(site));
        navigation.replace(routes.forkliftFlow);
    };

    const renderSiteCard = ({ item }) => {
        const siteName = item?.name || item?.siteName || "Unknown Site";
        const siteImage = item?.image || item?.imageUrl || item?.siteImage || null;
        const taskCount = item?.taskCount || item?.tasks?.length || item?.activeTasks || 0;
        const taskText = taskCount > 0 ? `${taskCount} Active Task${taskCount > 1 ? "s" : ""}` : "No Active Tasks";
        const status = item?.status || (item?.isAssigned ? "Assigned Site" : "");

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleSitePress(item)}>
                <SafeImageBackground
                    name={siteName}
                    source={{ uri: siteImage }}
                    style={styles.siteImage}
                />
                <View style={{ flex: 1, marginLeft: widthPixel(12) }}>
                    <Text style={styles.siteName}>{siteName}</Text>
                    <Text style={styles.taskText}>{taskText}</Text>
                </View>
                {status ? <Text style={styles.status}>{status}</Text> : null}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={{
                flex: 1,
                paddingHorizontal: widthPixel(20),

            }}>
                <View style={styles.headerRow}>
                    <SafeImageBackground
                        name={user?.name}
                        source={{ uri: user?.image }}
                        style={styles.avatar}
                    />

                    <View style={{ flex: 1, marginLeft: widthPixel(10) }}>
                        <Text style={styles.greeting}>Hi, {user?.name}</Text>
                        <Text style={styles.subGreeting}>Welcome back to Project Runner!</Text>
                    </View>

                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate(routes.settings)}>
                        <Image source={appIcons.settings} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor lectus augue
                </Text>

                {/* Builder Info */}
                <View style={styles.builderRow}>
                    <SafeImageBackground
                        name={user?.name}
                        source={{ uri: user?.image }}
                        style={styles.avatar}
                    />
                    <Text style={styles.builderName}>{user?.name}</Text>
                </View>

                {/* Site Cards */}
                <FlatList
                    data={sites}
                    renderItem={renderSiteCard}
                    keyExtractor={(item) => item?._id || item?.id || `site-${Math.random()}`}
                    contentContainerStyle={{ padding: heightPixel(2), paddingBottom: heightPixel(20) }}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={{ paddingVertical: heightPixel(40), alignItems: "center" }}>
                                <Text style={{ fontSize: fontPixel(14), color: colors.greyBg, fontFamily: fonts.NunitoRegular }}>
                                    No sites found
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </View>
            <Loader isVisible={loading} />
        </SafeAreaView>
    );
};

export default ForkHomeDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: widthPixel(16),
        paddingTop: heightPixel(10),
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: heightPixel(16),
    },
    avatar: {
        width: heightPixel(50),
        height: heightPixel(50),
        borderRadius: heightPixel(25),
    },
    greeting: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
    },
    subGreeting: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: '#9CA3AF',
    },
    iconBtn: {
        marginLeft: widthPixel(12),
    },
    icon: {
        width: widthPixel(22),
        height: widthPixel(22),
        resizeMode: "contain",
        // tintColor: colors.black,
    },
    description: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: colors.darkGray,
        marginVertical: heightPixel(12),
    },
    builderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(14),
    },
    builderAvatar: {
        width: widthPixel(40),
        height: widthPixel(40),
        borderRadius: widthPixel(20),
        marginRight: widthPixel(10),
    },
    builderName: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoMedium,
        color: colors.black,
        fontWeight: "500",
        marginLeft: widthPixel(10)
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: widthPixel(12),
        // padding: widthPixel(12),
        paddingVertical: heightPixel(12),
        paddingHorizontal: widthPixel(8),
        marginBottom: heightPixel(12),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    siteImage: {
        width: widthPixel(50),
        height: widthPixel(50),
        borderRadius: widthPixel(8),
        // padding: widthPixel(4),
        backgroundColor: colors.lightGrey,
    },
    siteName: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.themeColor,
    },
    taskText: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: '#6F6F6F',
        fontWeight: "400",
    },
    status: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: "green",
        fontWeight: "400",
    },
});