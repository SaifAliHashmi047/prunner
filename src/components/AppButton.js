import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../services/utilities/colors";

const AppButton = ({ title, onPress, style, textStyle ,disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: colors.themeColor,
        fontSize: 16,
        fontWeight: "600",
    },
});
