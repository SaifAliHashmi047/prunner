import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import { fonts } from "../services/utilities/fonts";
import { appIcons } from "../services/utilities/assets";

const UploadButton = ({ title = "Browse files", onPress, style, disabled }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.uploadBox, disabled && styles.disabled, style]}
            activeOpacity={0.7}
        >
            <Image
                source={appIcons.upload}
                style={[styles.uploadIcon, disabled && styles.disabledIcon]}
            />
            <Text style={[styles.uploadText, disabled && styles.disabledText]}>
                {title}
            </Text>
        </TouchableOpacity>
        
    );
};

export default UploadButton;

const styles = StyleSheet.create({
    uploadBox: {
        width: "100%",
        height: heightPixel(150),
        borderRadius: widthPixel(10),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.darkGray,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
    },
    uploadIcon: {
        width: heightPixel(30),
        height: heightPixel(30),
        tintColor: colors.grey300,
        marginBottom: heightPixel(10),
        resizeMode: "contain",
    },
    uploadText: {
        fontSize: fontPixel(14),
        color: colors.blue,
        fontFamily: fonts.NunitoSemiBold,
    },
    disabled: {
        opacity: 0.5,
        borderColor: "#ccc",
    },
    disabledIcon: {
        tintColor: "#ccc",
    },
    disabledText: {
        color: "#ccc",
    },
});