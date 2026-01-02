import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    FlatList,
    ScrollView
} from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { useSelector } from "react-redux";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import useCallApi from "../../../hooks/useCallApi";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const AddFeedback = ({ navigation, route }) => {
    const { user } = useSelector((state) => state.user);
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(false);
    const { callApi, uploadFile } = useCallApi();

    // Default rating to 5 as per request example "rating": 5
    // Unless UI is added for star rating, we keep it internal or fixed.
    const [rating, setRating] = useState(5);

    // Assuming siteId comes from route params or is required. 
    // If not passed, we might need a fallback or it might be null.
    // user request: "siteId": "string"
    const siteId = route?.params?.siteId || "default-site-id";

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
                siteId: siteId,
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
                    <AppTextInput
                        placeholder="Feedback title"
                        value={title}
                        onChangeText={setTitle}
                        style={{ marginBottom: heightPixel(14) }}
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
        </SafeAreaView>
    );
};

export default AddFeedback;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: widthPixel(20),
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
        color: colors.black,
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
        top: -6,
        right: -6,
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
});
