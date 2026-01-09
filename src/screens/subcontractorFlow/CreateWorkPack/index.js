import { Text, KeyboardAvoidingView, StyleSheet, View, Platform, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SecondHeader, AppTextInput, AppButton } from '../../../components';
import { colors } from '../../../services/utilities/colors';
import { heightPixel, widthPixel, fontPixel } from '../../../services/constant';
import useCallApi from '../../../hooks/useCallApi';
import { toastError, toastSuccess } from '../../../services/utilities/toast/toast';
import { Loader } from '../../../components/Loader';

const CreateWorkPack = ({ navigation }) => {
    const [workPackTitle, setWorkPackTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const { callApi } = useCallApi();

    const handleCreate = async () => {
        if (!workPackTitle.trim()) {
            toastError({ text: "Please enter work pack title" });
            return;
        }
        if (!description.trim()) {
            toastError({ text: "Please enter description" });
            return;
        }

        try {
            setLoading(true);
            const response = await callApi("workpacks", "POST", {
                title: workPackTitle,
                description: description
            });

            if (response?.success) {
                toastSuccess({ text: "Work pack created successfully" });
                navigation.goBack();
            } else {
                toastError({ text: response?.message || "Failed to create work pack" });
            }
        } catch (error) {
            console.log("Create work pack error", error);
            toastError({ text: error?.response?.data?.message || "Failed to create work pack" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <SecondHeader
                    title="Create Work Pack"
                    onPress={() => navigation.goBack()}
                />

                {/* Scrollable content */}
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.descriptionText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor lectus augue.
                    </Text>

                    <AppTextInput
                        placeholder="Work Pack Title"
                        value={workPackTitle}
                        onChangeText={setWorkPackTitle}
                        style={styles.input}
                    />
                    <AppTextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, { height: heightPixel(100), paddingTop: heightPixel(10) }]}
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <AppButton
                        title={loading ? "Creating..." : "Create Work Pack"}
                        style={[styles.button, loading && { opacity: 0.5 }]}
                        textStyle={styles.buttonText}
                        onPress={handleCreate}
                        disabled={loading}
                    />
                </View>
            </KeyboardAvoidingView>
            <Loader isVisible={loading} />
        </SafeAreaView>
    );
}

export default CreateWorkPack;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: Platform.OS === 'android' ? heightPixel(25) : 0,
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        paddingHorizontal: widthPixel(20),
        paddingTop: heightPixel(20),
    },
    descriptionText: {
        fontSize: fontPixel(14),
        color: colors.greyBg, // grey color
        lineHeight: fontPixel(20),
        textAlign: "left",
        marginBottom: heightPixel(20),
    },
    input: {
        marginTop: heightPixel(10),
    },
    footer: {
        marginTop: "auto",
        marginBottom: heightPixel(20),
        paddingHorizontal: widthPixel(20),
    },
    button: {
        backgroundColor: colors.themeColor,
        borderRadius: widthPixel(8),
        paddingVertical: heightPixel(14),
    },
    buttonText: {
        color: colors.white,
        fontSize: fontPixel(16),
        fontWeight: "600",
    },
});