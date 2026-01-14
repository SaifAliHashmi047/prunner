import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    Image,
    Alert
} from "react-native";
import { useDispatch } from 'react-redux';
import { clearUserData, setUserData } from '../../../services/store/slices/userSlice';
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCallApi from "../../../hooks/useCallApi";
import { useAppSelector } from "../../../services/store/hooks";
import { toastError } from "../../../services/utilities/toast/toast";

const settingsOptions = [
    { id: 1, label: "Edit Profile", icon: appIcons.user, route: routes.editProfile },
    { id: 3, label: "Notification Setting", icon: appIcons.notification, isToggle: true },
    { id: 4, label: "Feedback", icon: appIcons.feedback, route: routes.feedback },
    { id: 5, label: "Update Password", icon: appIcons.lock, route: routes.updatePassword },
    { id: 6, label: "Contact Us", icon: appIcons.contact, route: routes.contactUs },
    { id: 7, label: "About App", icon: appIcons.info, route: routes.aboutUs },
    { id: 8, label: "Privacy Policy", icon: appIcons.privacy, route: routes.privacyPolicy },
    { id: 9, label: "Terms of Use", icon: appIcons.terms, route: routes.termsOfUse },
    { id: 10, label: "Logout", icon: appIcons.logout },
    { id: 11, label: "Delete Account", icon: appIcons.delete, route: routes.deleteAccount, isDeleteAccount: true },
    {
        id: 12,
        label: "Upload License",
        icon: appIcons.camera,
        route: routes.uploadLicense,
    }
];

const Settings = ({ navigation }) => {
    const { user } = useAppSelector((state) => state.user);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(user?.isNotification ?? true);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { callApi } = useCallApi();

    useEffect(() => {
        if (user) {
            setIsNotificationEnabled(user.isNotification ?? true);
        }
    }, [user]);

    const toggleNotification = async (newValue) => {
        // Optimistic update
        setIsNotificationEnabled(newValue);

        try {
            const response = await callApi(
                "user/update-me",
                "PATCH",
                { isNotification: newValue }
            );

            if (response?.success) {
                // Update Redux store to persist state
                dispatch(setUserData({ ...user, isNotification: newValue }));
            } else {
                throw new Error(response?.message || "Failed to update settings");
            }
        } catch (error) {
            console.log("Toggle notification error", error);
            // Revert state on error
            setIsNotificationEnabled(!newValue);
            toastError({ text: "Failed to update notification settings" });
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        // Clear user data from Redux store
                        await AsyncStorage.clear();
                        dispatch(clearUserData());
                        // Navigate to login screen
                        navigation.reset({
                            index: 0,
                            routes: [{ name: routes.auth, params: { screen: routes.login } }],
                        });
                    },
                },
            ],
            { cancelable: true }
        );

    };

    return (
        <SafeAreaView style={[styles.container, {
            paddingTop: insets.top
        }]}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: widthPixel(20) }}>
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Setting" />

                {/* List */}
                {settingsOptions.map((item) => user?.role !== "forklift" && item?.id===12 ? null : (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.optionRow}
                        activeOpacity={item.isToggle ? 1 : 0.7}
                        onPress={() => {
                            if (item.label === "Logout") {
                                handleLogout();
                            } else if (item.route) {
                                // Navigate to auth stack for uploadLicense
                                if (item.route === routes.uploadLicense) {
                                    navigation.navigate(routes.auth, {
                                        screen: routes.uploadLicense,
                                    });
                                } else {
                                navigation.navigate(item.route);
                                }
                            }
                        }}
                    >
                        <View style={styles.optionLeft}>
                            <Image source={item.icon} style={[styles.icon, item.isDeleteAccount && styles.deleteIcon]} />
                            <Text style={[styles.optionText, item.isDeleteAccount && styles.deleteText]}>{item.label}</Text>
                        </View>
                        {item.isToggle ? (
                            <Switch
                                value={isNotificationEnabled}
                                onValueChange={toggleNotification}
                                thumbColor={isNotificationEnabled ? colors.white : "#f4f3f4"}
                                trackColor={{ false: "#ccc", true: colors.themeColor }}
                            />
                        ) : null}
                    </TouchableOpacity>
                ))}

                {/* Description */}
                <Text style={styles.description}>
                    Donec vestibulum, velit sit amet dapibus rutrum, elit felis bibendum tellus, euismod sagittis neque enim eu felis.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: heightPixel(16),
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: widthPixel(22),
        height: widthPixel(22),
        marginRight: widthPixel(12),
        resizeMode: "contain",
    },
    optionText: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoRegular,
        color: colors.black,
    },
    description: {
        fontSize: fontPixel(13),
        fontFamily: fonts.NunitoRegular,
        color: "#888",
        marginVertical: heightPixel(16),
    },
    deleteText: {
        color: "red",
    },
    deleteIcon: {
        tintColor: "red",
    },
});