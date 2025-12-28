import React, { useState } from "react";
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

const EditProfile = ({ navigation }) => {
    const [name, setName] = useState("Ali");
    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(
        "https://randomuser.me/api/portraits/women/44.jpg"
    );

    const handleImagePick = () => {
        // TODO: open image picker
        console.log("Change profile image pressed");
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
                        onPress={() => {
                            setModalVisible(true);
                            setTimeout(() => {
                                setModalVisible(false);
                                navigation.goBack();
                            }, 2000);
                        }}
                    />

                </View>
            </View>
            <AppModal
                title="Profile Updated"
                subtitle="Your profile has been successfully updated."
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
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
