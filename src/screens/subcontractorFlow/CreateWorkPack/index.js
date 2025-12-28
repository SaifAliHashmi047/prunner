import { Text, KeyboardAvoidingView, StyleSheet, View, Platform, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SecondHeader, AppTextInput, AppButton } from '../../../components';
import { colors } from '../../../services/utilities/colors';
import { heightPixel, widthPixel, fontPixel } from '../../../services/constant';

const CreateWorkPack = ({ navigation }) => {
    const [workPackTitle, setWorkPackTitle] = useState("");

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
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <AppButton
                        title="Create Work Pack"
                        style={styles.button}
                        textStyle={styles.buttonText}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </KeyboardAvoidingView>
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