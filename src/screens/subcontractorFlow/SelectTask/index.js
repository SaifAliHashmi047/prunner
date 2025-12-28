import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    FlatList,
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const SelectTask = ({ navigation }) => {
    const [taskType, setTaskType] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
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
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor lectus augue
                </Text>

                {/* Task Type */}
                <Text style={styles.label}>Select Task Type</Text>
                <View>
                    <TouchableOpacity
                        style={[styles.optionBox, taskType === "Instant" && styles.activeOption]}
                        onPress={() => setTaskType("Instant")}
                    >
                        <Text style={[styles.optionText, taskType === "Instant" && styles.activeOptionText]}>
                            Instant
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionBox, taskType === "Schedule" && styles.activeOption]}
                        onPress={() => setTaskType("Schedule")}
                    >
                        <Text style={[styles.optionText, taskType === "Schedule" && styles.activeOptionText]}>
                            Schedule
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Time Input (only if Schedule) */}
                {taskType === "Schedule" && (
                    <>
                        <Text style={styles.label}>Select Time</Text>
                        <AppTextInput
                            placeholder="hh:mm AM"
                            value={time}
                            onChangeText={setTime}
                            keyboardType="default"
                        />
                    </>
                )}

                {/* Add Note */}
                <Text style={styles.label}>Add Note</Text>
                <AppTextInput
                    placeholder="Add details"
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                {/* Add Pictures */}
                <Text style={styles.label}>Add Pictures</Text>
                <View style={styles.picturesRow}>
                    {/* Upload Button */}
                    <TouchableOpacity style={styles.uploadBox} onPress={handleUploadPicture}>
                        <Image source={appIcons.gallery} style={styles.uploadIcon} />
                    </TouchableOpacity>
                    {/* Render Pictures */}
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

                {/* Bottom Button */}
                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20) }}>
                    <AppButton
                        title="NEXT"
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        onPress={() => navigation.navigate(routes.createInventory)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SelectTask;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subtitle: {
        fontSize: fontPixel(14),
        color: "#777",
        fontFamily: fonts.NunitoRegular,
        marginVertical: heightPixel(10),
    },
    label: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
        marginVertical: heightPixel(10),
    },
    optionBox: {
        backgroundColor: colors.white,
        paddingVertical: heightPixel(14),
        paddingHorizontal: widthPixel(14),
        borderRadius: widthPixel(8),
        marginBottom: heightPixel(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    optionText: {
        fontSize: fontPixel(14),
        color: colors.black,
        fontFamily: fonts.NunitoRegular,
        textAlign: "center",
    },
    activeOption: {
        backgroundColor: colors.themeColor,
    },
    activeOptionText: {
        color: colors.white,
        fontFamily: fonts.NunitoSemiBold,
    },
    picturesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(20),
    },
    uploadBox: {
        width: widthPixel(90),
        height: widthPixel(90),
        borderRadius: widthPixel(8),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
        marginRight: widthPixel(10),
    },
    uploadIcon: {
        width: widthPixel(28),
        height: widthPixel(28),
        tintColor: colors.themeColor,
    },
    pictureWrapper: {
        position: "relative",
        marginRight: widthPixel(10),
    },
    picture: {
        width: widthPixel(90),
        height: widthPixel(90),
        borderRadius: widthPixel(8),
    },
    removeBtn: {
        position: "absolute",
        top: 6,
        right: 6,
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
});
