import React, { useState } from "react";
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
import { clearUserData } from '../../../services/store/slices/userSlice';
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

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
];

const Settings = ({ navigation }) => {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const dispatch = useDispatch();

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
                    onPress: () => {
                        // Clear user data from Redux store
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: widthPixel(20) }}>
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Setting" />

                {/* List */}
                {settingsOptions.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.optionRow}
                        activeOpacity={item.isToggle ? 1 : 0.7}
                        onPress={() => {
                            if (item.label === "Logout") {
                                handleLogout();
                            } else if (item.route) {
                                navigation.navigate(item.route);
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
                                onValueChange={setIsNotificationEnabled}
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