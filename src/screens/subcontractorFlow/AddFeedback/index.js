import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    FlatList,
} from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";

const AddFeedback = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [pictures, setPictures] = useState([
        { id: "1", uri: "https://picsum.photos/200/300" },
    ]);

    const handleRemovePicture = (id) => {
        setPictures(pictures.filter((pic) => pic.id !== id));
    };

    const handleUploadPicture = () => {
        const newPic = {
            id: String(pictures.length + 1),
            uri: "https://picsum.photos/200/400",
        };
        setPictures([...pictures, newPic]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                paddingTop: heightPixel(20),
                paddingHorizontal: widthPixel(10),
            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Add Feedback" />

                {/* Description */}
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor
                    lectus augue
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
                    // style={[styles.textArea]}
                    multiline
                />

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

                {/* Submit Button */}
                <View style={styles.footer}>
                    <AppButton
                        title="SUBMIT FEEDBACK"
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        onPress={() => navigation.popToTop()}
                    />
                </View>

            </View>

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
