import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";

const SubmitComplaint = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");


    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                paddingTop: heightPixel(20),
                paddingHorizontal: widthPixel(10),
            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Submit Complaint" />

                {/* Description */}
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor
                    lectus augue
                </Text>

                {/* Input fields */}
                <AppTextInput
                    placeholder="Complaint subject"
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: heightPixel(14) }}
                />

                <AppTextInput
                    placeholder="Add complaint detail"
                    value={details}
                    onChangeText={setDetails}
                    multiline
                />

                {/* Submit Button */}
                <View style={styles.footer}>
                    <AppButton
                        title="Submit Complaint"
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        onPress={() => navigation.goBack()}
                    />
                </View>

            </View>

        </SafeAreaView>
    );
};

export default SubmitComplaint;

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
        height: heightPixel(300),
        textAlignVertical: "top",
        marginBottom: heightPixel(14),
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
});