import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Platform
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { appIcons } from "../../../services/utilities/assets";
import { Loader } from "../../../components/Loader";
import useCallApi from "../../../hooks/useCallApi";
import useComplaints from "../../../hooks/useComplaints";
import { toastSuccess, toastError } from "../../../services/utilities/toast/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const SubmitComplaint = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [media, setMedia] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const { uploadFile } = useCallApi();
    const { createComplaint } = useComplaints();

    
   
    const handleSubmit = async () => {
        if (!title.trim() || !details.trim()) {
            Alert.alert("Error", "Please fill in title and details");
            return;
        }

        setSubmitting(true);
        try {
            let mediaUrls = [];
            if (media.length > 0) {
                const uploadPromises = media.map(file => uploadFile(file));
                mediaUrls = await Promise.all(uploadPromises);
            }

            const payload = {
                title,
                description: details,
                category: "other",
                priority: "medium",
                media: mediaUrls
            };

            const response = await createComplaint(payload);

            if (response?.success) {
                toastSuccess({ text: "Complaint submitted successfully" });
                navigation.goBack();
            } else {
                toastError({ text: "Failed to submit complaint" });
            }
        } catch (error) {
            console.log("Submit complaint error", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container,{
            paddingTop: insets.top+0
        }]}>
            <SecondHeader onPress={() => navigation.goBack()} title="Submit Complaint" />

            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Description */}
                <Text style={styles.description}>
                    Please describe your issue below and attach any relevant photos.
                </Text>

                {/* Input fields */}
                <Text style={styles.label}>Subject</Text>
                <AppTextInput
                    placeholder="Complaint subject"
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: heightPixel(14) }}
                />

                <Text style={styles.label}>Description</Text>
                <AppTextInput
                    placeholder="Add complaint detail"
                    value={details}
                    onChangeText={setDetails}
                    multiline
                    style={styles.textArea}
                />

               

                {/* Submit Button */}
                <AppButton
                    title="Submit Complaint"
                    style={{ backgroundColor: colors.themeColor, marginTop: heightPixel(20) }}
                    textStyle={{ color: colors.white }}
                    onPress={handleSubmit}
                    disabled={submitting}
                />
            </KeyboardAwareScrollView>
            <Loader isVisible={submitting} />
        </SafeAreaView>
    );
};

export default SubmitComplaint;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        paddingHorizontal: widthPixel(20),
        paddingVertical: heightPixel(20),
        paddingBottom: heightPixel(40)
    },
    description: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginBottom: heightPixel(20),
    },
    label: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
        marginBottom: heightPixel(8),
    },
    textArea: {
        height: heightPixel(150),
        textAlignVertical: "top",
        marginBottom: heightPixel(14),
    },
    picturesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(10),
    },
    uploadBox: {
        width: widthPixel(80),
        height: widthPixel(80),
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
        fontSize: fontPixel(10),
        color: colors.themeColor,
        textAlign: "center",
        fontFamily: fonts.NunitoRegular
    },
    pictureWrapper: {
        position: "relative",
        marginRight: widthPixel(10),
    },
    picture: {
        width: widthPixel(80),
        height: widthPixel(80),
        borderRadius: widthPixel(8),
    },
    removeBtn: {
        position: "absolute",
        top: -6,
        right: -6,
        width: widthPixel(20),
        height: widthPixel(20),
        borderRadius: widthPixel(10),
        backgroundColor: colors.red || "red",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },
    removeText: {
        color: colors.white,
        fontSize: fontPixel(10),
        fontWeight: "bold",
    },
    footer: {
        marginTop: "auto",
        marginBottom: heightPixel(20),
    },
});