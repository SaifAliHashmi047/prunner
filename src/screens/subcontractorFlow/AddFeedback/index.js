import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    FlatList,
    ScrollView,
    Modal
} from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { useSelector } from "react-redux";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import useCallApi from "../../../hooks/useCallApi";
import useSite from "../../../hooks/useSite";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const AddFeedback = ({ navigation, route }) => {
    const { user } = useSelector((state) => state.user);
    const { getSites } = useSite();

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState([]);
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [selectedSiteName, setSelectedSiteName] = useState("");
    const [showSiteModal, setShowSiteModal] = useState(false);
    const [loadingSites, setLoadingSites] = useState(false);
    const { callApi, uploadFile } = useCallApi();

    // Default rating to 5 as per request example "rating": 5
    // Unless UI is added for star rating, we keep it internal or fixed.
    const [rating, setRating] = useState(5);

    // Fetch sites on mount
    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            setLoadingSites(true);
            const sitesList = await getSites();
            if (sitesList && sitesList.length > 0) {
                setSites(sitesList);
            }
        } catch (error) {
            console.log("Error fetching sites", error);
        } finally {
            setLoadingSites(false);
        }
    };

    const handleSelectSite = (site) => {
        setSelectedSiteId(site._id);
        setSelectedSiteName(site.name || "Select Site");
        setShowSiteModal(false);
    };

    const handleRemovePicture = (id) => {
        setPictures(pictures.filter((pic) => pic.id !== id));
    };

    const handleUploadPicture = async () => {
        try {
            const permissionType = "gallery"; // or "gallerynocrop"
            const image = await Image_Picker(permissionType);
            if (image && image.path) {
                const newPic = {
                    id: String(Date.now()),
                    uri: image.path,
                    type: image.mime,
                    name: `image_${Date.now()}.jpg`
                };
                setPictures([...pictures, newPic]);
            }
        } catch (error) {
            console.log("Image picker error", error);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toastError({ text: "Please enter feedback title" });
            return;
        }
        if (!details.trim()) {
            toastError({ text: "Please enter details" });
            return;
        }
        if (!selectedSiteId) {
            toastError({ text: "Please select a site" });
            return;
        }

        try {
            setLoading(true);

            // Upload images first
            const uploadedUrls = [];
            for (const pic of pictures) {
                console.log("pic", pic);

                const url = await uploadFile({
                    uri: pic.uri,
                    type: pic.type || "image/jpeg",
                    name: pic.name
                });
                if (url) {
                    uploadedUrls.push(url);
                }
            }

            const payload = {
                title: title,
                description: details,
                rating: rating,
                siteId: selectedSiteId,
                media: uploadedUrls
            };

            const response = await callApi("feedback", "POST", payload);

            if (response?.success) {
                toastSuccess({ text: "Feedback submitted successfully" });
                navigation.goBack();
            } else {
                toastError({ text: response?.message || "Failed to submit feedback" });
            }

        } catch (error) {
            console.log("Submit feedback error", error);
            toastError({ text: error?.response?.data?.message || "Failed to submit feedback" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                paddingTop: heightPixel(20),
                paddingHorizontal: widthPixel(10),
            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Add Feedback" />

                <ScrollView contentContainerStyle={{ paddingBottom: heightPixel(20) }} showsVerticalScrollIndicator={false}>
                    {/* Description */}
                    <Text style={styles.description}>
                        Please provide your feedback below.
                    </Text>

                    {/* Input fields */}
                    {/* Site Selection Dropdown */}
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowSiteModal(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dropdownText, styles.placeholder]}>
                            {selectedSiteName || "Select a site"}
                        </Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>

                    <AppTextInput
                        placeholder="Feedback title"
                        value={title}
                        onChangeText={setTitle}
                        style={{ marginBottom: heightPixel(14), marginTop: heightPixel(14) }}
                    />

                    <AppTextInput
                        placeholder="Add detailed feedback"
                        value={details}
                        onChangeText={setDetails}
                        style={[styles.textArea]}
                        multiline
                        textAlignVertical="top"
                    />

                    {/* Rating */}
                    <Text style={styles.sectionTitle}>Rate your experience</Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Text style={[styles.star, { color: star <= rating ? "#FFD700" : colors.grey300 }]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Add Pictures */}
                    <Text style={styles.sectionTitle}>Add Pictures</Text>
                    <View style={styles.picturesRow}>
                        {/* Upload Button */}
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={handleUploadPicture}
                        >
                            <Image source={appIcons.gallery} style={styles.uploadIcon} />
                            <Text style={styles.uploadText}>Upload Picture</Text>
                        </TouchableOpacity>

                        {/* Render Uploaded Pictures */}
                        <FlatList
                            horizontal
                            data={pictures}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.pictureWrapper}>
                                    <Image source={{ uri: item.uri }} style={styles.picture} />
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => handleRemovePicture(item.id)}
                                    >
                                        <Text style={styles.removeText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.footer}>
                    <AppButton
                        title={loading ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                        style={[styles.button, loading && { opacity: 0.5 }]}
                        textStyle={{ color: colors.white }}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </View>

            </View>
            <Loader isVisible={loading} />

            {/* Site Selection Modal */}
            <Modal
                visible={showSiteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSiteModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Site</Text>
                            <TouchableOpacity
                                onPress={() => setShowSiteModal(false)}
                                style={styles.modalCloseButton}
                            >
                                <Text style={styles.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {loadingSites ? (
                            <View style={styles.modalLoading}>
                                <Text style={styles.modalLoadingText}>Loading sites...</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={sites}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.siteItem,
                                            selectedSiteId === item._id && styles.siteItemSelected
                                        ]}
                                        onPress={() => handleSelectSite(item)}
                                    >
                                        <Text style={[
                                            styles.siteItemText,
                                            selectedSiteId === item._id && styles.siteItemTextSelected
                                        ]}>
                                            {item.name || "Unnamed Site"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.modalEmpty}>
                                        <Text style={styles.modalEmptyText}>No sites available</Text>
                                    </View>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AddFeedback;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: widthPixel(15),
    },
    description: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginVertical: heightPixel(14),
    },
    textArea: {
        height: heightPixel(120),
        marginBottom: heightPixel(14),
        paddingTop: heightPixel(10),
    },
    sectionTitle: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
     color:colors.grey200,
        marginBottom: heightPixel(10),
    },
    picturesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(20),
     },
    uploadBox: {
        width: widthPixel(100),
        height: widthPixel(100),
        borderRadius: widthPixel(8),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
        marginRight: widthPixel(10),
    },
    uploadIcon: {
        width: widthPixel(24),
        height: widthPixel(24),
        tintColor: colors.themeColor,
        marginBottom: heightPixel(6),
    },
    uploadText: {
        fontSize: fontPixel(12),
        color: colors.themeColor,
        textAlign: "center",
    },
    pictureWrapper: {
        position: "relative",
        marginRight: widthPixel(10),
    },
    picture: {
        width: widthPixel(100),
        height: widthPixel(100),
        borderRadius: widthPixel(8),
    },
    removeBtn: {
        position: "absolute",
        top: 0,
        right: 0,
        width: widthPixel(22),
        height: widthPixel(22),
        borderRadius: widthPixel(11),
        backgroundColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
    },
    removeText: {
        color: colors.white,
        fontSize: fontPixel(12),
        fontWeight: "700",
    },
    footer: {
        marginTop: "auto",
        marginBottom: heightPixel(20),
    },
    button: {
        backgroundColor: colors.themeColor,
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: heightPixel(20),
        gap: widthPixel(10),
    },
    star: {
        fontSize: fontPixel(32),
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        borderRadius: widthPixel(8),
        paddingHorizontal: widthPixel(15),
        paddingVertical: heightPixel(14),
        marginBottom: heightPixel(14),
    },
    dropdownText: {
        flex: 1,
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.gray,
    },
    placeholder: {
        color: colors.grey300,
    },
    dropdownArrow: {
        fontSize: fontPixel(12),
        color: colors.grey200,
        marginLeft: widthPixel(10),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        maxHeight: "70%",
        backgroundColor: colors.white,
        borderRadius: widthPixel(12),
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: widthPixel(20),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    modalTitle: {
        fontSize: fontPixel(18),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
    },
    modalCloseButton: {
        width: heightPixel(30),
        height: heightPixel(30),
        justifyContent: "center",
        alignItems: "center",
    },
    modalCloseText: {
        fontSize: fontPixel(20),
        color: colors.gray,
        fontWeight: "bold",
    },
    modalLoading: {
        padding: widthPixel(40),
        alignItems: "center",
    },
    modalLoadingText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
    },
    siteItem: {
        padding: widthPixel(15),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    siteItemSelected: {
        backgroundColor: "#F7F1FF",
    },
    siteItemText: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoRegular,
        color: colors.black,
    },
    siteItemTextSelected: {
        fontFamily: fonts.NunitoSemiBold,
        color: colors.themeColor,
    },
    modalEmpty: {
        padding: widthPixel(40),
        alignItems: "center",
    },
    modalEmptyText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
    },
});
