import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { appIcons } from "../services/utilities/assets";
import { widthPixel, heightPixel } from "../services/constant";
import { colors } from "../services/utilities/colors";
import { fonts } from "../services/utilities/fonts";

const ForkLiftHeader = ({ title, onPress, subtitle, titleStyle, subtitleStyle , iconStyle }) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onPress} style={styles.iconButton}>
                <Image source={appIcons.backArrow} style={[styles.icon , iconStyle]} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text style={[styles.title, titleStyle]}>{title}</Text>
                <Text style={[styles.subtitle, subtitleStyle]}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "column",
        // paddingHorizontal: widthPixel(20),
        // paddingTop: heightPixel(20),
        // paddingBottom: heightPixel(15),
        // backgroundColor: colors.white,
    },
    iconButton: {
        // padding: heightPixel(5),
        marginBottom: heightPixel(15),
        alignSelf: "flex-start",
    },
    icon: {
        width: widthPixel(24),
        height: widthPixel(24),
        resizeMode: "contain",
    },
    textContainer: {
        // flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    title: {
        fontSize: widthPixel(20),
        fontWeight: "700",
        fontFamily: fonts.NunitoBold,
        color: colors.black,
        marginBottom: heightPixel(8),
        textAlign: "left",
    },
    subtitle: {
        fontSize: widthPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.greyText,
        lineHeight: heightPixel(20),
        textAlign: "left",
    },
});

export default ForkLiftHeader;
