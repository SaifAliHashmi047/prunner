import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";

const DATA = [

    {
        id: "1",
        name: "Crane in Operation",
        description: "A crane is currently in operation on site. Always maintain a safe distance from the lifting zone to avoid accidents from swinging loads or dropped...",
        time: "12-Dec-2023",
        isActive : true,
    },
    {
        id: "2",
        name: "Overhead Work in Progress",
        description: "A crane is currently in operation on site. Always maintain a safe distance from the lifting zone to avoid accidents from swinging loads or dropped...",
        time: "12-Dec-2023",
        isActive : false,
    }
];

const HsLog = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="H&S Log"
                />

                <FlatList
                    data={DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.workPackItem}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Image source={appIcons.warning} style={{ width: widthPixel(20), height: widthPixel(20), resizeMode: "contain", }} />
                                    <Text style={styles.workPackName}>{item.name}</Text>
                                </View>
                                {item.isActive ? <View style={styles.countContainer}>
                                    <Text style={styles.count}>Active</Text>
                                </View> : null}
                            </View>
                            <Text style={styles.workPackDescription}>{item.description}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Text style={[styles.workPackName, {
                                        fontSize: fontPixel(14),
                                    }]}>Active Date </Text>
                                </View>
                                <Image source={appIcons.calandar} style={{ width: widthPixel(20), height: widthPixel(20), resizeMode: "contain", }} />
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            {/* Adding a line under each item */}
                        </View>
                    )}
                />
            </View>
            {/* <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.addFeedback)
            }}>
                <Image source={appIcons.plus} style={{ width: widthPixel(24), height: widthPixel(24), tintColor: colors.white }} />
            </TouchableOpacity> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || "#F4F4F4",

    },
    content: {
        flex: 1,
        // paddingTop: heightPixel(16),
        paddingHorizontal: widthPixel(10),
        backgroundColor: colors.white,
        marginTop: heightPixel(16),
    },
    workPackItem: {
        paddingVertical: heightPixel(12),
        paddingHorizontal: widthPixel(12),
        borderRadius: widthPixel(8),
        marginBottom: heightPixel(12),
        marginTop: heightPixel(8),
        backgroundColor: colors.white,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    workPackName: {
        fontSize: fontPixel(18),
        fontWeight: "600",
        color: colors.grey300,
        fontFamily: fonts.NunitoSemiBold,
    },
    workPackDescription: {
        fontSize: widthPixel(14),
        color: colors.greyBg,
        marginVertical: heightPixel(6),
        fontFamily: fonts.NunitoRegular,
    },
    time: {
        fontSize: widthPixel(12),
        color: colors.grey,
        fontFamily: fonts.NunitoRegular,
        marginLeft: widthPixel(10),
    },
    countContainer: {
        height: heightPixel(25),
        width: widthPixel(80),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: widthPixel(8),
        backgroundColor: '#EDE2FF',
    },
    count: {
        color: colors.themeColor,
        fontWeight: "400",
        textAlign: "center",
        fontSize: widthPixel(10),
        fontFamily: fonts.NunitoRegular,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#E8E8E8',
        marginTop: heightPixel(4),
    },
    fab: {
        position: "absolute",
        right: widthPixel(24),
        bottom: heightPixel(24),
        width: widthPixel(46),
        height: widthPixel(46),
        borderRadius: widthPixel(18),
        backgroundColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
});

export default HsLog;