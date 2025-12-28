import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native";
import { SecondHeader, AppTextInput, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const DeleteAccount = ({ navigation }) => {
  const [password, setPassword] = useState("");

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.log("Delete account with password:", password);
    // Navigate to account deleted confirmation screen
    navigation.navigate(routes.accountDeleted);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <SecondHeader onPress={() => navigation.goBack()} title="Delete Account" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Warning Section */}
        <View style={styles.warningSection}>
          <View style={styles.warningHeader}>
            <Image source={appIcons.warning} style={styles.warningIcon} />
            <Text style={styles.warningTitle}>Delete your account will:</Text>
          </View>
          
          <Text style={styles.warningText}>
            We're sorry to see you go. If you're sure you want to delete your Project Runner, please be aware that this action is permanent and cannot be undone. All of your personal information, including your Project Runner and settings, will be permanently deleted.
          </Text>
          
          <Text style={styles.supportText}>
            If you're having trouble with your account or have concerns, please reach out to us at support@projectrunner.com before proceeding with the account deletion. We'd love to help you resolve any issues and keep you as a valued Project Runner user.
          </Text>
        </View>

        {/* Password Input */}
        <View style={styles.inputSection}>
          <AppTextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.passwordInput}
          />
        </View>

        {/* Delete Button */}
        <View style={styles.buttonSection}>
          <AppButton
            title="DELETE ACCOUNT"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            // disabled={!password.trim()}
          />
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(20),
  },
  header: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: heightPixel(20),
  },
  warningSection: {
    marginTop: heightPixel(20),
    marginBottom: heightPixel(30),
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPixel(15),
  },
  warningIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    marginRight: widthPixel(10),
    tintColor: colors.themeColor,
  },
  warningTitle: {
    fontSize: fontPixel(16),
    fontWeight: "600",
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  warningText: {
    fontSize: fontPixel(14),
    lineHeight: heightPixel(22),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
    textAlign: "justify",
    marginBottom: heightPixel(15),
  },
  supportText: {
    fontSize: fontPixel(14),
    lineHeight: heightPixel(22),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
    textAlign: "justify",
  },
  inputSection: {
    marginBottom: heightPixel(30),
  },
  passwordInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: widthPixel(10),
    paddingHorizontal: widthPixel(15),
    height: heightPixel(50),
  },
  buttonSection: {
    marginTop: "auto",
    paddingBottom: heightPixel(20),
  },
  deleteButton: {
    backgroundColor: colors.themeColor,
    borderRadius: widthPixel(10),
    height: heightPixel(50),
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: fontPixel(16),
    fontWeight: "600",
    fontFamily: fonts.NunitoSemiBold,
  },
});
