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
        name: "Work Pack Name",
        adminName: "Admin",
        description: "Nunc mauris arcu, auctor sit amet ante porta cursus....",
        time: "8:25 PM",
        count: 4,
    },
    {
        id: "2",
        name: "Work Pack Name",
        adminName: "Admin",
        description: "Nunc mauris arcu, auctor sit amet ante porta cursus....",
        time: "8:25 PM",
        count: 4,
    },
    {
        id: "3",
        name: "Work Pack Name",
        adminName: "Admin",
        description: "Nunc mauris arcu, auctor sit amet ante porta cursus....",
        time: "8:25 PM",
        count: 4,
    },
    {
        id: "4",
        name: "Work Pack Name",
        adminName: "Admin",
        description: "Nunc mauris arcu, auctor sit amet ante porta cursus....",
        time: "8:25 PM",
        count: 4,
    },
];

const WorkPack = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="Work Pack"
                />

                <FlatList
                    data={DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.workPackItem}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                    <Text style={styles.workPackName}>{item.name}</Text>
                                    <View style={styles.countContainer}>
                                        <Text style={styles.count}>{item.count}</Text>
                                    </View>
                                </View>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <Text style={styles.workPackDescription}>{item.adminName}: {item.description}</Text>
                            {/* Adding a line under each item */}
                            <View style={styles.separator} />
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate(routes.createWorkPack);
            }}>
                <Image source={appIcons.plus} style={{ width: widthPixel(24), height: widthPixel(24), tintColor: colors.white }} />
            </TouchableOpacity>
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
    },
    time: {
        fontSize: widthPixel(12),
        color: colors.greyBg,
    },
    countContainer: {
        height: heightPixel(16),
        width: widthPixel(16),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: widthPixel(8),
        backgroundColor: colors.blue,
    },
    count: {
        color: colors.white,
        fontWeight: "400",
        textAlign: "center",
        fontSize: widthPixel(10),
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

export default WorkPack;