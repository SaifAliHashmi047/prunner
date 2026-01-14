import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ForkLiftHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import useForkliftDocs from "../../../hooks/useForkliftDocs";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../services/store/slices/userSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TellAboutVehicle = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { registerVehicle, loading, uploading } = useForkliftDocs();
    const dispatch = useDispatch();
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [vehicleImages, setVehicleImages] = useState([]);

    const handleUploadPicture = () => {
        Alert.alert(
            "Add Vehicle Pictures",
            "Choose an option to add vehicle pictures",
            [
                {
                    text: "Take Photo",
                    onPress: () => launchCamera({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
                        if (response.assets && response.assets.length > 0) {
                            const asset = response.assets[0];
                            const newPic = {
                                id: String(vehicleImages.length + 1),
                                uri: asset.uri,
                                type: asset.type || "image/jpeg",
                                name: asset.fileName || `vehicle_${Date.now()}.jpg`,
                                size: asset.fileSize || 0,
                            };
                            setVehicleImages([...vehicleImages, newPic]);
                        }
                    }),
                },
                {
                    text: "Choose from Gallery",
                    onPress: () => launchImageLibrary({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
                        if (response.assets && response.assets.length > 0) {
                            const asset = response.assets[0];
                            const newPic = {
                                id: String(vehicleImages.length + 1),
                                uri: asset.uri,
                                type: asset.type || "image/jpeg",
                                name: asset.fileName || `vehicle_${Date.now()}.jpg`,
                                size: asset.fileSize || 0,
                            };
                            setVehicleImages([...vehicleImages, newPic]);
                        }
                    }),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const handleRemovePicture = (id) => {
        setVehicleImages(vehicleImages.filter((pic) => pic.id !== id));
    };

    const handleNext = async () => {
        if (!vehiclePlateNumber.trim()) {
            toastError({ text: "Please enter vehicle plate number" });
            return;
        }
        if (!registrationNumber.trim()) {
            toastError({ text: "Please enter vehicle registration numbeere" });
            return;
        }

        try {
            const response = await registerVehicle(
                vehiclePlateNumber,
                registrationNumber,
                vehicleImages,
                null // registrationCardImage - can be added later if needed
            );

            if (response?.success) {
                if (response?.data?.user) {
                    dispatch(setUserData(response.data.user));
                }
                toastSuccess({ text: response?.message || "Vehicle information saved successfully" });
                // Navigate to next screen or back
                navigation.navigate(routes.uploadVehicleRegistration);
            } else {
                toastError({ text: response?.message || "Failed to save vehicle information" });
            }
        } catch (error) {
            const msg =
                error?.message || error?.response?.data?.message || "Failed to save vehicle information";
            toastError({ text: msg });
        }
    };

    return (
        <SafeAreaView style={[styles.container,{
            paddingTop:insets.top   
        }]}>
            <View style={styles.content}>
                <ForkLiftHeader
                    title="Tell About your Vehicle"
                    subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
                    onPress={() => navigation.goBack()}
                />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <AppTextInput
                            placeholder="Enter vehicle plate number"
                            value={vehiclePlateNumber}
                            onChangeText={setVehiclePlateNumber}
                        />

                        <AppTextInput
                            placeholder="Enter registration number"
                            value={registrationNumber}
                            onChangeText={setRegistrationNumber}
                        />
                    </View>

                    {/* Image Upload Section */}
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Add Vehicle Pictures</Text>

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
                                data={vehicleImages}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ padding: widthPixel(10) }}
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
                    </View>
                </ScrollView>

                {/* Next Button */}
                <View style={styles.buttonContainer}>
                    <AppButton
                        title={loading || uploading ? "SUBMITTING..." : "NEXT"}
                        onPress={handleNext}
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        disabled={loading || uploading}
                    />
                </View>
            </View>
            <Loader isVisible={loading || uploading} />
        </SafeAreaView>
    );
};

export default TellAboutVehicle;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: widthPixel(20),
    },
    scrollView: {
        flex: 1,
    },
    inputContainer: {
        marginTop: heightPixel(30),
    },
    imageSection: {
        marginTop: heightPixel(20),
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
        overflow: "visible",
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
    buttonContainer: {
        paddingVertical: heightPixel(20),
    },
    nextButton: {
        backgroundColor: colors.greyText,
        borderRadius: widthPixel(10),
        paddingVertical: heightPixel(15),
    },
    nextButtonText: {
        color: colors.white,
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
        textAlign: "center",
    },
});