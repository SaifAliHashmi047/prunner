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
import useCallApi from "../../../hooks/useCallApi";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const inventoryData = [
    { id: "1", name: "Sand", unit: "Cubic m", icon: appIcons.sand },
    { id: "2", name: "Cement Bags", unit: "Bags", icon: appIcons.cement },
    { id: "3", name: "Steel Rods", unit: "Tons", icon: appIcons.steel },
    { id: "4", name: "Bricks", unit: "Units", icon: appIcons.bricks },
    { id: "5", name: "Gravel", unit: "Cubic m", icon: appIcons.gravel },
    { id: "6", name: "Paint Buckets (20L)", unit: "Buckets", icon: appIcons.paint },
];

const CreateInventory = ({ navigation }) => {
    const { callApi, uploadFile } = useCallApi();
    const [selectedItem, setSelectedItem] = useState(null);
    const [customName, setCustomName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [customImage, setCustomImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelect = (id) => {
        setSelectedItem(id);
        if (id !== "custom") {
            const item = inventoryData.find(i => i.id === id);
            setCustomName(item.name);
            setUnit(item.unit);
            setCustomImage(null); // Use default icon logic or ignore
        } else {
            setCustomName("");
            setUnit("");
            setCustomImage(null);
        }
    };

    const handleImagePick = async () => {
        try {
            const image = await Image_Picker("gallery");
            if (image && image.path) {
                setCustomImage({
                    uri: image.path,
                    type: image.mime,
                    name: `inventory_${Date.now()}.jpg`
                });
            }
        } catch (error) {
            console.log("Image picker error", error);
        }
    };

    const handleCreate = async () => {
        if (!selectedItem) {
            toastError({ text: "Please select an item" });
            return;
        }
        if (!customName.trim()) {
            toastError({ text: "Name is required" });
            return;
        }
        if (!quantity.trim()) {
            toastError({ text: "Quantity is required" });
            return;
        }
        if (selectedItem === "custom" && !unit.trim()) {
            toastError({ text: "Unit is required" }); // If custom, force unit?
            return;
        }

        try {
            setLoading(true);
            let imageUrl = "";

            // If custom and image selected, upload it
            if (selectedItem === "custom" && customImage) {
                imageUrl = await uploadFile({
                    uri: customImage.uri,
                    type: customImage.type,
                    name: customImage.name
                });
            } else if (selectedItem !== "custom") {
                // For predefined items, maybe we don't send image or sending a placeholder?
                // The API requires "image": "string".
                // I'll leave it empty or mock it if not custom, or maybe the backend handles it.
                // Assuming empty string is fine if utilizing existing icon on backend or not applicable.
                imageUrl = "default_icon_url"; // or leave empty ""
            }

            const formData = new FormData();
            formData.append("name", customName);
            formData.append("quantity", parseInt(quantity)); // Ensure number
            formData.append("itemUnit", unit);
            formData.append("image", imageUrl);

            const response = await callApi("inventory", "POST", formData, {}, true);

            if (response?.success) {
                toastSuccess({ text: "Inventory created successfully" });
                navigation.goBack(); // Or navigate to List
            } else {
                toastError({ text: response?.message || "Failed to create inventory" });
            }

        } catch (error) {
            console.log("Create inventory error", error);
            toastError({ text: error?.response?.data?.message || "Failed to create inventory" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Create Inventory" />

                {/* Custom Option */}
                <TouchableOpacity
                    style={[styles.card, selectedItem === "custom"]}
                    onPress={() => handleSelect("custom")}
                >
                    <View style={{ flex: 1, }}>
                        <Text style={styles.itemName}>Custom</Text>
                        {selectedItem === "custom" && (
                            <View>
                                <AppTextInput
                                    placeholder="Enter name"
                                    value={customName}
                                    onChangeText={setCustomName}
                                    style={styles.input}
                                />
                                <TouchableOpacity onPress={handleImagePick} style={styles.uploadBtn}>
                                    <Text style={styles.uploadText}>{customImage ? "Change Image" : "Upload Image"}</Text>
                                </TouchableOpacity>
                                {customImage && <Image source={{ uri: customImage.uri }} style={styles.previewImage} />}
                            </View>
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
                                marginTop: widthPixel(selectedItem === "custom" ? -40 : 0) // adjusted alignment
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
                        <View
                            style={[
                                styles.radioOuter,
                                selectedItem === item.id && styles.radioOuterActive,
                            ]}
                        >
                            {selectedItem === item.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Common Inputs */}
                {selectedItem && (
                    <View style={styles.inputContainer}>
                        <AppTextInput
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <AppTextInput
                            placeholder="Enter Unit (e.g., Bags, Kg)"
                            value={unit}
                            onChangeText={setUnit}
                            style={styles.input}
                            editable={selectedItem === "custom"} // Pre-filled for items?
                        />
                    </View>
                )}

                {/* Bottom Button */}
                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20), marginTop: heightPixel(20) }}>
                    <AppButton
                        title={loading ? "CREATING..." : "CREATE"}
                        style={[styles.button, loading && { opacity: 0.5 }]}
                        textStyle={{ color: colors.white }}
                        onPress={handleCreate}
                        disabled={loading}
                    />
                </View>
            </ScrollView>
            <Loader isVisible={loading} />
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
    uploadBtn: {
        marginTop: heightPixel(10),
        padding: 8,
        borderWidth: 1,
        borderColor: colors.themeColor,
        borderRadius: 6,
        alignItems: "center"
    },
    uploadText: {
        color: colors.themeColor,
        fontSize: fontPixel(12)
    },
    previewImage: {
        width: widthPixel(60),
        height: widthPixel(60),
        marginTop: 5,
        borderRadius: 5
    },
    inputContainer: {
        marginTop: heightPixel(20)
    },
    button: {
        backgroundColor: colors.themeColor,
    }
});
