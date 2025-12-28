import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import { appIcons } from "../services/utilities/assets";


const AppCardHeader = ({
    title = "",
    onBack,
    rightIcon,
    onRightPress,
    containerStyle,
}) => {
    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.black }}>
            {/* the dark bg above mimics the design behind the rounded card */}
            <View style={[styles.card, containerStyle]}>
                <View style={styles.row}>
                    {/* Left: back */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onBack}
                        style={styles.iconBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Image
                            source={appIcons.back || appIcons.arrowLeft}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Center: title */}
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>

                    {/* Right: optional icon */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onRightPress}
                        style={styles.iconBtn}
                        disabled={!rightIcon}
                    >
                        {rightIcon ? (
                            <Image source={rightIcon} style={styles.icon} resizeMode="contain" />
                        ) : (
                            // keep space so title stays centered
                            <View style={{ width: widthPixel(24), height: widthPixel(24) }} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AppCardHeader;

const RADIUS = widthPixel(24);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        marginHorizontal: widthPixel(16),
        marginTop: heightPixel(10),
        borderTopLeftRadius: RADIUS,
        borderTopRightRadius: RADIUS,
        // subtle shadow
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 3,
            },
        }),
        paddingHorizontal: widthPixel(12),
        paddingBottom: heightPixel(8),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        height: heightPixel(56),
        justifyContent: "space-between",
    },
    iconBtn: {
        width: widthPixel(44),
        height: heightPixel(44),
        justifyContent: "center",
        alignItems: "flex-start",
    },
    icon: {
        width: widthPixel(24),
        height: widthPixel(24),
        tintColor: colors.black,
    },
    title: {
        position: "absolute",
        left: widthPixel(44),
        right: widthPixel(44),
        textAlign: "center",
        fontSize: fontPixel(18),
        fontWeight: "700",
        color: colors.black,
    },
});
