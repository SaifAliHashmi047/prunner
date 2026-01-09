import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Alert
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SecondHeader, AppButton, AppTextInput, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import useCallApi from "../../../hooks/useCallApi";
import { Loader } from "../../../components/Loader";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";

const UpdatePassword = ({ navigation }) => {
    const { callApi } = useCallApi();
    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [createPassword, setCreatePassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCreatePasswordVisible, setIsCreatePasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!password || !createPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        if (createPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                currentPassword: password,
                password: createPassword
            };
            const response = await callApi("user/update-password", "PATCH", payload);

            if (response?.success) {
                setModalVisible(true);
                toastSuccess({ text: "Password updated successfully" });
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.goBack();
                }, 2000);
            } else {
                toastError({ text: response?.message || "Something went wrong" });
            }
        } catch (error) {
            console.log("Update password error", error);
            toastError({ text: error?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                backgroundColor: colors.white,
                // paddingHorizontal: widthPixel(20),
                paddingTop: heightPixel(50),
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            extraScrollHeight={20}
        >
            {/* Header */}
            <View style={{
                flex: 1,
                width: "100%",
                // alignItems: "center",
                paddingHorizontal: widthPixel(20),
            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Update Password" />
                <Text style={{ fontSize: 16, color: colors.darkGray, marginTop: 10 }}>
                    Please enter your new password below.
                </Text>
                {/* Profile Image */}


                {/* Input */}
                <AppTextInput
                    placeholder="Enter your Previous Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={{ marginTop: heightPixel(30) }}
                />
                <AppTextInput
                    placeholder="Create New Password"
                    value={createPassword}
                    onChangeText={setCreatePassword}
                    secureTextEntry={!isCreatePasswordVisible}
                />
                <AppTextInput
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                />

                {/* Update Button */}
                <View style={{
                    marginTop: "auto",
                    width: "100%",
                    marginBottom: heightPixel(30),
                }}>
                    <AppButton
                        title="UPDATE"
                        style={styles.updateButton}
                        textStyle={{ color: colors.white }}
                        onPress={handleUpdate}
                    />

                </View>
            </View>
            <AppModal
                title="Password Updated"
                subtitle="Your password has been successfully updated."
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
            <Loader isVisible={loading} />
        </KeyboardAwareScrollView>
    );
};

export default UpdatePassword;

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
        // backgroundColor: colors.themeColor,
        // borderRadius: widthPixel(20),
        // padding: widthPixel(6),
    },
    icon: {
        width: widthPixel(25),
        height: widthPixel(25),
        resizeMode: "contain",
        // tintColor: colors.themeColor,
    },
    updateButton: {
        backgroundColor: colors.themeColor,
        // marginTop: heightPixel(30),
        width: "100%",
    },
});
