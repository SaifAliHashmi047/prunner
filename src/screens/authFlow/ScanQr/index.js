import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { AppHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";

const ScanQr = ({ navigation }) => {
    const handleScan = () => {
        // Logic for scanning QR code goes here
        console.log("Scan button pressed");
        navigation.navigate(routes.auth, {
            screen: routes.scanPage
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header with Logout option */}
                <AppHeader
                    title="Scan QR Code"
                // onBack={() => navigation.goBack()}
                />

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={styles.contentSubtitle}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at maximus nisi. Proin in orci ligula. Morbi tincidunt, leo nec aliquam gravida, felis enim auctor sapien, a dictum velit ipsum ut leo.
                    </Text>
                    <Text style={styles.contentSubtitle}>
                        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus scelerisque consectetur ligula, quis varius felis molestie in. Pellentesque quis maximus dolor. Vestibulum a luctus nisl. Phasellus vitae consequat tellus, quis pharetra tortor.
                    </Text>
                </View>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <AppButton
                        title="SCAN"
                        onPress={handleScan}
                        style={{ borderColor: colors.themeColor, borderWidth: 1 }}
                        textStyle={{ color: colors.themeColor }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ScanQr;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingTop: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: heightPixel(20),
        paddingTop: heightPixel(20),
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: heightPixel(20),
        paddingHorizontal: widthPixel(10),
    },
    headerTitle: {
        fontSize: fontPixel(18),
        fontWeight: "600",
        color: colors.black,
    },
    logoutText: {
        fontSize: fontPixel(14),
        color: colors.themeColor,
    },
    content: {
        flex: 1,
        paddingTop: heightPixel(10),
    },
    contentTitle: {
        fontSize: fontPixel(24),
        fontWeight: "bold",
        color: colors.black,
        marginBottom: heightPixel(10),
    },
    contentSubtitle: {
        fontSize: fontPixel(14),
        color: colors.black,
        marginBottom: heightPixel(15),
        lineHeight: 22,
    },
    footer: {
        paddingBottom: heightPixel(20),
    },
});