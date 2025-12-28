import React from "react";
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

const DATA = [
    {
        id: "1",
        site: "Dubai Mall",
        tasks: "3 Active Task",
        status: "Assigned Site",
        image: "https://picsum.photos/200/200",
    },
    {
        id: "2",
        site: "Dubai Mall",
        tasks: "3 Active Task",
        status: "",
        image: "https://picsum.photos/200/201",
    },
    {
        id: "3",
        site: "Dubai Mall",
        tasks: "3 Active Task",
        status: "",
        image: "https://picsum.photos/200/202",
    },
];

const ForkHomeDetail = ({ navigation }) => {
    const renderSiteCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.replace(routes.forkliftFlow)}>
            <Image source={{ uri: item.image }} style={styles.siteImage} />
            <View style={{ flex: 1, marginLeft: widthPixel(12) }}>
                <Text style={styles.siteName}>{item.site}</Text>
                <Text style={styles.taskText}>{item.tasks}</Text>
            </View>
            {item.status ? <Text style={styles.status}>{item.status}</Text> : null}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={{
                flex: 1,
                paddingHorizontal: widthPixel(20),

            }}>
                <View style={styles.headerRow}>
                    <Image
                        source={appIcons.dummyPic}
                        style={styles.avatar}
                    />
                    <View style={{ flex: 1, marginLeft: widthPixel(10) }}>
                        <Text style={styles.greeting}>Hi, Rudy</Text>
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
                    <Image
                        source={appIcons.dummyPic}
                        style={styles.builderAvatar}
                    />
                    <Text style={styles.builderName}>Builder Name</Text>
                </View>

                {/* Site Cards */}
                <FlatList
                    data={DATA}
                    renderItem={renderSiteCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: heightPixel(20) }}
                />
            </View>

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
        width: widthPixel(50),
        height: widthPixel(50),
        borderRadius: widthPixel(25),
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