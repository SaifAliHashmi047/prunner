import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const inventoryData = [
    { id: "1", name: "Sand", quantity: "2", unit: "Cubic m", icon: appIcons.sand },
    { id: "2", name: "Cement Bags", quantity: "500", unit: "Bags", icon: appIcons.cement },
    { id: "3", name: "Steel Rods", quantity: "10", unit: "Tons", icon: appIcons.steel },
    { id: "4", name: "Bricks", quantity: "10,000", unit: "Units", icon: appIcons.bricks },
    { id: "5", name: "Gravel", quantity: "150", unit: "Cubic m", icon: appIcons.gravel },
    { id: "6", name: "Paint Buckets (20L)", quantity: "293", unit: "Buckets", icon: appIcons.paint },
];

const CreateInventory = ({ navigation }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [customName, setCustomName] = useState("");

    const handleSelect = (id) => {
        setSelectedItem(id);
        if (id !== "custom") setCustomName("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Inventory" />

                {/* Custom Option */}
                <TouchableOpacity
                    style={[styles.card, selectedItem === "custom"]}
                    onPress={() => handleSelect("custom")}
                >
                    <View style={{ flex: 1, }}>
                        <Text style={styles.itemName}>Custom</Text>
                        {selectedItem === "custom" && (
                            <AppTextInput
                                placeholder="Enter name"
                                value={customName}
                                onChangeText={setCustomName}
                                style={styles.input}
                            />
                        )}
                    </View>
                    <View
                        style={[
                            styles.radioOuter,
                            selectedItem === "custom" && styles.radioOuterActive,
                            {
                                marginLeft: widthPixel(10),
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: widthPixel(5),
                                marginTop: widthPixel(-80)
                            }
                        ]}
                    >
                        {selectedItem === "custom" && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>

                {/* Inventory List */}
                {inventoryData.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.card, selectedItem === item.id]}
                        onPress={() => handleSelect(item.id)}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                            <Image source={item.icon} style={styles.icon} />
                            <View style={{ marginLeft: widthPixel(12), flex: 1 }}>
                                <Text style={styles.itemName}>{item.name}</Text>

                            </View>
                        </View>
                        <View style={{
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            flexDirection: "row",
                            width: widthPixel(100)
                        }}>
                            <Text style={styles.itemQty}>
                                {item.quantity} {item.unit}
                            </Text>
                            <View
                                style={[
                                    styles.radioOuter,
                                    selectedItem === item.id && styles.radioOuterActive,
                                ]}
                            >
                                {selectedItem === item.id && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Bottom Button */}
                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20) }}>
                    <AppButton
                        title="NEXT"
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        onPress={() => navigation.navigate(routes.taskUser)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateInventory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    card: {
        marginTop: heightPixel(10),
        backgroundColor: colors.white,
        borderRadius: widthPixel(10),
        paddingVertical: heightPixel(14),
        paddingHorizontal: widthPixel(14),
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(12),

        // borderWidth: 1,
        // borderColor: "#DDD",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    activeCard: {
        borderColor: colors.themeColor,
        backgroundColor: "#F7F1FF",
    },
    icon: {
        width: widthPixel(30),
        height: widthPixel(30),
        resizeMode: "contain",
    },
    itemName: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
    },
    itemQty: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: "#777",
        marginTop: 2,
    },
    input: {
        marginTop: heightPixel(8),
        width: "100%",
        flex: 1,
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: widthPixel(8),
        // padding: widthPixel(10),
        // fontSize: fontPixel(14),
        // color: colors.black,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    radioOuterActive: {
        borderColor: colors.themeColor,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.themeColor,
    },
});
