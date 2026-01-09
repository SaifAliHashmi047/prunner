import React, { useState } from "react";
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { AppHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { useRoute } from "@react-navigation/native";
import axiosInstance from "../../../api/axiosInstance";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const ChangePassword = ({ navigation }) => {
  const route = useRoute();
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  // Get email from route params
  const email = route?.params?.email || "";

  // Validation function
  const validateForm = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let isValid = true;

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleUpdatePassword = async () => {
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show first validation error
      if (validation.errors.password) {
        toastError({ text: validation.errors.password });
      } else if (validation.errors.confirmPassword) {
        toastError({ text: validation.errors.confirmPassword });
      }
      return;
    }

    // Check if email is available
    if (!email.trim()) {
      toastError({ text: "Email is required. Please go back and try again." });
      return;
    }

    try {
      setLoading(true);

      // Call reset password API
      const response = await axiosInstance.post(
        "auth/resetPassword",
        {
          email: email.trim(),
          password: password,
        },
        { skipAuth: true }
      );

      // Check response structure
      if (response?.data?.success) {
        toastSuccess({ text: response?.data?.message || "Password reset successfully!" });
        
        // Navigate to Login screen after password update
    navigation.navigate(routes.auth, {
          screen: routes.login,
        });
      } else {
        throw new Error(response?.data?.message || "Failed to reset password");
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        error?.data?.message ||
        "Failed to reset password. Please try again.";

      toastError({ text: errorMessage });
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
            title={loading ? "Updating..." : "Update Password"}
            onPress={handleUpdatePassword}
            style={{
              backgroundColor: colors.themeColor,
            }}
            textStyle={{
              color: colors.white,
            }}
            disabled={loading}
          />
        </View>

      </KeyboardAvoidingView>
      <Loader isVisible={loading} />
    </SafeAreaView>
  );
};

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