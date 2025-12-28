import React, { useState } from "react";
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { AppHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";

const ChangePassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleUpdatePassword = () => {
    // Add your password update logic here
    console.log("Password updated:", password);
    navigation.navigate(routes.auth, {
      screen: routes.login
    }); // Navigate to Login screen after password update
  }


  return (
    <SafeAreaView style={styles.safeArea}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AppHeader
          title="Create your Password"
          subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
          onBack={() => navigation.goBack()}
        />

        {/* Email Input */}
        <AppTextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <AppTextInput
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
        />

        {/* Next Button */}
        <View style={styles.footer}>
          <AppButton
            title="Update Password"
            onPress={handleUpdatePassword}
            style={{
              backgroundColor: colors.themeColor,
            }} textStyle={{
              color: colors.white,
            }}
          />
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChangePassword




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(20),
  },
  footer: {
    marginTop: "auto",
    marginBottom: heightPixel(20),
  },
});