import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SecondHeader, AppButton, AppTextInput, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCallApi from "../../../hooks/useCallApi";
import { useAppSelector } from "../../../services/store/hooks";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { AccountType } from "../../authFlow";

const EditProfile = ({ navigation }) => {
    const { user } = useAppSelector((state) => state.user);
    const { callApi } = useCallApi();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState(user?.name || "");
    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(
        "https://randomuser.me/api/portraits/women/44.jpg"
    );
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user?._id) {
                    const response = await callApi(`user/${user._id}`);
                    if (response?.data) {
                        setName(response.data.name || name);
                        // setProfileImage(response.data.profileImage || profileImage); // Update if API returns image
                    }
                }
            } catch (error) {
                console.log("Error fetching user data", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        // Check if name has changed from initial user name
        const initialName = user?.name || "";
        if (name !== initialName && name.trim().length > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, user]);

    const handleImagePick = () => {
        // TODO: open image pickera
        console.log("Change profile image pressed");
    };

    const handleUpdate = async () => {
        if (!name.trim()) {
            toastError({ text: "Name is required" });
            return;
        }

        try {
            setLoading(true);

            // Payload as requested
            const payload = {
                name: name,

            };

            const response = await callApi("user/update-me", "PATCH", payload);

            if (response?.success) {
                // Show success modal
                setModalVisible(true);
                // toastSuccess({ text: "Profile updated successfully" });

                setTimeout(() => {
                    setModalVisible(false);
                    navigation.goBack();
                }, 2000);
            } else {
                if (response?.message) {
                    toastError({ text: response.message });
                }
            }

        } catch (error) {
            // Error handling is mostly done in useCallApi or here if needed
            console.log("Update profile error", error);
            const errorMessage = error?.response?.data?.message || "Failed to update profile";
            toastError({ text: errorMessage });
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                backgroundColor: colors.white,
                paddingTop: insets.top,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            extraScrollHeight={20}
        >
            {/* Header */}
            <View style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                paddingHorizontal: widthPixel(20),
            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Edit Profile" />

                {/* Profile Image */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
                        <Image source={appIcons.pcamera} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Input */}
                <AppTextInput
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    style={{ marginTop: heightPixel(30) }}
                />
                <AccountType />
                {/* Update Button */}
                <View style={{
                    marginTop: "auto",
                    width: "100%",
                    marginBottom: heightPixel(30),
                }}>
                    <AppButton
                        title={loading ? "UPDATING..." : "UPDATE"}
                        style={[styles.updateButton, (isButtonDisabled || loading) && { opacity: 0.5 }]}
                        textStyle={{ color: colors.white }}
                        onPress={handleUpdate}
                        disabled={isButtonDisabled || loading}
                    />

                </View>
            </View>

            <AppModal
                title="Profile Updated"
                subtitle="Your profile has been successfully updated."
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
            <Loader isVisible={isFetching} />
        </KeyboardAwareScrollView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center",
        paddingHorizontal: widthPixel(20),
    },
    imageWrapper: {
        marginTop: heightPixel(30),
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        width: widthPixel(120),
        height: widthPixel(120),
        borderRadius: widthPixel(60),
    },
    cameraIcon: {
        position: "absolute",
        bottom: 4,
        right: 1,
    },
    icon: {
        width: widthPixel(25),
        height: widthPixel(25),
        resizeMode: "contain",
    },
    updateButton: {
        backgroundColor: colors.themeColor,
        width: "100%",
    },
});
