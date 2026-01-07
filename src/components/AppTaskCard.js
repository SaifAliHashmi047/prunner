import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { appIcons } from "../services/utilities/assets";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import SafeImageBackground from "./SafeImageBackground";



const NAME_COL_W = widthPixel(90);

const AppTaskCard = ({
    taskTitle,
    userName,
    userImage,
    status,
    material1,
    material1Qty,
    material2,
    material2Qty,
    date,
    time,
    onPress,
    style,
}) => {
    const statusColor =
        status === "Completed"
            ? "#1BAA32"
            : status === "Pending"
                ? '#0242B1'
                : status === "Material Picked"
                    ? "#F59E0B"
                    : colors.textGray;

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, style]}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <SafeImageBackground
                        source={{uri:userImage}}
                        style={styles.profileImage}
                        name={userName}
                    />
                    <Text style={styles.userName} numberOfLines={1}>
                        {taskTitle}
                    </Text>
                </View>
                <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Content */}
            <View style={styles.cardContent}>
                {/* Material */}
                <Text style={styles.sectionTitle}>Material</Text>

                <View style={styles.row}>
                    <Image source={appIcons.sand} style={styles.icon} />
                    <Text style={styles.materialName}>{material1}</Text>
                    <Text style={styles.materialQty}>{material1Qty}</Text>
                </View>

                <View style={styles.row}>
                    <Image source={appIcons.bricks} style={styles.icon} />
                    <Text style={styles.materialName}>{material2}</Text>
                    <Text style={styles.materialQty}>{material2Qty}</Text>
                </View>

                {/* Date & Time */}
                <Text style={[styles.sectionTitle, { marginTop: heightPixel(12) }]}>Date & Time</Text>

                <View style={styles.row}>
                    <View style={styles.inlineGroup}>
                        <Image source={appIcons.date} style={styles.icon} />
                        <Text style={styles.inlineText}>{date}</Text>
                    </View>
                    <View style={[styles.inlineGroup, { marginLeft: widthPixel(18) }]}>
                        <Image source={appIcons.time} style={styles.icon} />
                        <Text style={styles.inlineText}>{time}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default AppTaskCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: heightPixel(12),
        padding: heightPixel(16),
        marginBottom: heightPixel(16),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
    },
    profileImage: {
        width: widthPixel(40),
        height: widthPixel(40),
        borderRadius: widthPixel(20),
        marginRight: widthPixel(10),
    },
    userName: {
        fontSize: fontPixel(16),
        fontWeight: "500",
        color: colors.black,
        maxWidth: "70%",
    },
    status: {
        fontSize: fontPixel(14),
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginVertical: heightPixel(10),
    },
    cardContent: {
        marginTop: heightPixel(4),
    },
    sectionTitle: {
        fontWeight: "500",
        fontSize: fontPixel(16),
        color: '#333333',
        marginBottom: heightPixel(8),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(8),
    },
    icon: {
        width: widthPixel(20),
        height: widthPixel(20),
        marginRight: widthPixel(8),
        resizeMode: "contain",
    },
    materialName: {
        width: NAME_COL_W, // keeps the quantities lined up
        fontSize: fontPixel(14),
        color: colors.greyText || "#444",
    },
    materialQty: {
        fontSize: fontPixel(14),
        fontWeight: "600",
        color: colors.greyText,
    },
    inlineGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    inlineText: {
        fontSize: fontPixel(14),
        color: '#343433',
        marginLeft: widthPixel(6),
        fontWeight: "500",
    },
});
