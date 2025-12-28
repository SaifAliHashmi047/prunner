import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { appIcons } from "../services/utilities/assets";
import { widthPixel, heightPixel } from "../services/constant";
import { colors } from "../services/utilities/colors";
import { fonts } from "../services/utilities/fonts";

const SecondHeader = ({ title, onPress }) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onPress} style={styles.iconButton}>
                <Image source={appIcons.backArrow} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.statusBar}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        // paddingHorizontal: widthPixel(10),
        // paddingTop: heightPixel(12),
        // backgroundColor: colors.white,
        justifyContent: "space-between",
    },
    iconButton: {
        // padding: heightPixel(10),
        paddingHorizontal: widthPixel(5),
    },
    icon: {
        width: widthPixel(24),
        height: widthPixel(24),
        resizeMode: "contain",
    },
    title: {
        fontSize: widthPixel(18),
        fontWeight: "600",
        fontFamily: fonts.NunitoSemiBold,
        color: '#141414',
        flex: 1,
        textAlign: "center",
    },
    statusBar: {
        width: widthPixel(60),
        height: widthPixel(2),
        // backgroundColor: colors.lightGray,
        // marginRight: widthPixel(10),
    },
});

export default SecondHeader;
