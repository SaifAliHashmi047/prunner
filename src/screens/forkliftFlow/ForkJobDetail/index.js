import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const ForkJobDetail = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <SecondHeader onPress={() => navigation.goBack()} title="Job Detail" />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: widthPixel(20), paddingBottom: heightPixel(100) }}
                showsVerticalScrollIndicator={false}
            >
                {/* User Info */}
                <View style={styles.userRow}>
                    <Image
                        source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.status}>Pending</Text>
                </View>

                {/* Site Map */}
                <Text style={styles.sectionTitle}>Site Map</Text>
                <Image
                    source={appImages.jobMap}
                    style={styles.siteMap}
                    resizeMode="cover"
                />

                {/* Date & Time */}
                <Text style={styles.sectionTitle}>Date & Time</Text>
                <View style={styles.rowBox}>
                    <View style={styles.iconText}>
                        <Image source={appIcons.calandar} style={styles.icon} />
                        <Text style={styles.rowText}>12 Dec</Text>
                    </View>
                    <View style={styles.iconText}>
                        <Image source={appIcons.time} style={styles.icon} />
                        <Text style={styles.rowText}>02:30 PM</Text>
                    </View>
                </View>

                {/* Items */}
                <Text style={styles.sectionTitle}>Item to Deliver</Text>
                <View style={styles.rowBox}>
                    <View style={styles.iconText}>
                        <Image source={appIcons.steel} style={styles.itemIcon} />
                        <Text style={styles.rowText}>Steel Rods</Text>
                    </View>
                    <Text style={styles.rowText}>10 Tons</Text>
                </View>
                <View style={styles.rowBox}>
                    <View style={styles.iconText}>
                        <Image source={appIcons.bricks} style={styles.itemIcon} />
                        <Text style={styles.rowText}>Bricks</Text>
                    </View>
                    <Text style={styles.rowText}>10,000 Units</Text>
                </View>

                {/* Pictures */}
                <Text style={styles.sectionTitle}>Pictures</Text>
                <View style={{ flexDirection: "row", gap: widthPixel(12) }}>
                    <Image
                        source={{ uri: "https://picsum.photos/200/300" }}
                        style={styles.picture}
                    />
                    <Image
                        source={{ uri: "https://picsum.photos/200/301" }}
                        style={styles.picture}
                    />
                </View>
                <View style={styles.footer}>
                    <AppButton
                        title="Cancel"
                        onPress={() => navigation.navigate(routes.cancelJob)}
                        style={{
                            marginTop: heightPixel(20),
                            borderWidth: 1,
                            borderColor: 'red',
                        }}
                        textStyle={{
                            color: 'red',
                            fontFamily: fonts.NunitoSemiBold,
                        }}
                    />

                </View>
            </ScrollView>

            {/* Button pinned at bottom */}

            <View style={{
                paddingHorizontal: heightPixel(16),

            }}>
                <AppButton
                    title="Start Now"
                    onPress={() => navigation.navigate(routes.materialPicked)}
                    style={{
                        marginTop: heightPixel(20),
                        borderWidth: 1,
                        borderColor: colors.themeColor
                    }}
                    textStyle={{
                        color: colors.themeColor,
                        fontFamily: fonts.NunitoSemiBold,
                    }}
                />
            </View>

        </SafeAreaView>
    );
};

export default ForkJobDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: heightPixel(10),
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: heightPixel(16),
        marginBottom: heightPixel(12),
    },
    avatar: {
        width: widthPixel(40),
        height: widthPixel(40),
        borderRadius: widthPixel(20),
        marginRight: widthPixel(10),
    },
    userName: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
        flex: 1,
    },
    status: {
        fontSize: fontPixel(14),
        color: colors.themeColor,
        fontFamily: fonts.NunitoSemiBold,
    },
    sectionTitle: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
        marginVertical: heightPixel(10),
    },
    siteMap: {
        width: "100%",
        height: heightPixel(160),
        borderRadius: widthPixel(8),
        marginBottom: heightPixel(16),
    },
    rowBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: widthPixel(8),
        paddingVertical: heightPixel(12),
        paddingHorizontal: widthPixel(14),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: heightPixel(10),
    },
    iconText: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: widthPixel(20),
        height: widthPixel(20),
        marginRight: widthPixel(8),
        resizeMode: "contain",
    },
    itemIcon: {
        width: widthPixel(22),
        height: widthPixel(22),
        marginRight: widthPixel(8),
        resizeMode: "contain",
    },
    rowText: {
        fontSize: fontPixel(14),
        color: colors.black,
        fontFamily: fonts.NunitoRegular,
    },
    picture: {
        width: widthPixel(100),
        height: widthPixel(80),
        borderRadius: widthPixel(6),
    },
    footer: {
        // paddingHorizontal: widthPixel(20),
        // paddingVertical: heightPixel(12),
        // borderTopWidth: 1,
        // borderTopColor: colors.greyLight,
        // backgroundColor: colors.white,
    },
});