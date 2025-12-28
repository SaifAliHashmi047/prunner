import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SecondHeader, AppButton, AppTextInput, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";

const FeedBack = ({ navigation }) => {
    const [name, setName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

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
                <SecondHeader onPress={() => navigation.goBack()} title="Feedback" />
                <Text style={{ fontSize: 16, color: colors.darkGray, marginTop: 10 }}>
                    We value your feedback. Please let us know your thoughts below.
                </Text>
                {/* Profile Image */}


                {/* Input */}
                <AppTextInput
                    placeholder="Enter your Feedback"
                    value={name}
                    onChangeText={setName}
                    style={{ marginTop: heightPixel(30) }}
                    multiline
                />

                {/* Update Button */}
                <View style={{
                    marginTop: "auto",
                    width: "100%",
                    marginBottom: heightPixel(30),
                }}>
                    <AppButton
                        title="Send Feedback"
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
                title="Feedback Sent"
                subtitle="Thank you for your feedback!"
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
        </KeyboardAwareScrollView>
    );
};

export default FeedBack;

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
