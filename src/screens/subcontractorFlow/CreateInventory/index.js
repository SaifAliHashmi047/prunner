import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import useCallApi from "../../../hooks/useCallApi";
import useInventory from "../../../hooks/useInventory";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import SafeImageBackground from "../../../components/SafeImageBackground";

const CreateInventory = ({ navigation, route }) => {
    const { uploadFile } = useCallApi();
    const { createInventory, inventory, loading: loadingInventory, refreshing, onRefresh, fetchInventory } = useInventory();
    const [selectedItem, setSelectedItem] = useState(null);
    const [customName, setCustomName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [customImage, setCustomImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInventory(1);
    }, []);

    const handleSelect = (id, item = null) => {
        setSelectedItem(id);
        if (id !== "custom" && item) {
            // Pre-fill form with selected inventory item data
            setCustomName(item.name || "");
            setUnit(item.itemUnit || "");
            setCustomImage(null);
            setQuantity(item.quantity?.toString() || "");
        } else {
            // Custom item - clear form
            setCustomName("");
            setUnit("");
            setCustomImage(null);
            setQuantity("");
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
        if (!unit.trim()) {
            toastError({ text: "Unit is required" });
            return;
        }

        try {
            setLoading(true);
            let imageUrl = "";

            // If custom item and image selected, upload it first to get the URL
            if (selectedItem === "custom" && customImage) {
                try {
                    imageUrl = await uploadFile({
                        uri: customImage.uri,
                        type: customImage.type || "image/jpeg",
                        name: customImage.name || `inventory_${Date.now()}.jpg`
                    });
                    if (!imageUrl) {
                        throw new Error("Failed to upload image");
                    }
                } catch (uploadError) {
                    console.log("Image upload error", uploadError);
                    toastError({ text: "Failed to upload image. Please try again." });
                    return;
                }
            }
            // For predefined items, image is optional - send empty string
            // The API requires "image": "string", so we send empty string if no image

            // Prepare JSON payload (not FormData)
            const payload = {
                name: customName.trim(),
                quantity: parseInt(quantity, 10) || 0,
                itemUnit: unit.trim(),
                image: imageUrl || "" // Empty string if no image uploaded
            };

            const response = await createInventory(payload);

            if (response?.success) {
                toastSuccess({ text: response?.message || "Inventory created successfully" });
                // Navigate back - the SelectInventoryForTask will refresh on focus
                navigation.goBack();
            } else {
                toastError({ text: response?.message || "Failed to create inventory" });
            }

        } catch (error) {
            console.log("Create inventory error", error);
            const errorMessage = error?.message || error?.response?.data?.message || "Failed to create inventory";
            toastError({ text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                {loadingInventory && inventory.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.themeColor} />
                        <Text style={styles.loadingText}>Loading inventory...</Text>
                    </View>
                ) : (
                    inventory.map((item) => {
                        const isSelected = selectedItem === item._id || selectedItem === item.id;
                        const iconSource = item.image ? { uri: item.image } : null;
                        
                        return (
                            <TouchableOpacity
                                key={item._id || item.id}
                                style={[styles.card, isSelected && styles.activeCard]}
                                onPress={() => handleSelect(item._id || item.id, item)}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                    <SafeImageBackground
                                        source={iconSource}
                                        name={item.name || "Item"}
                                        style={styles.icon}
                                    />
                                    <View style={{ marginLeft: widthPixel(12), flex: 1 }}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        {item.itemUnit && (
                                            <Text style={styles.itemUnit}>{item.itemUnit}</Text>
                                        )}
                                        {item.quantity !== undefined && (
                                            <Text style={styles.itemQty}>
                                                Qty: {item.quantity} {item.itemUnit || ""}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View
                                    style={[
                                        styles.radioOuter,
                                        isSelected && styles.radioOuterActive,
                                    ]}
                                >
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

                {!loadingInventory && inventory.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No inventory items found</Text>
                    </View>
                )}

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
            <Loader isVisible={loading || loadingInventory} />
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
    },
    loadingContainer: {
        paddingVertical: heightPixel(40),
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginTop: heightPixel(10),
    },
    emptyContainer: {
        paddingVertical: heightPixel(40),
        alignItems: "center",
    },
    emptyText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
    },
    itemUnit: {
        fontSize: fontPixel(12),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginTop: heightPixel(2),
    },
    itemQty: {
        fontSize: fontPixel(11),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginTop: heightPixel(2),
    },
});
