import React, { useState } from "react";
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { AppHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, emailFormat } from "../../../services/constant";
import { routes } from "../../../services/constant";
import axiosInstance from "../../../api/axiosInstance";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });

  // Validation function
  const validateForm = () => {
    const newErrors = { email: "" };
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailFormat.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    // Clear previous errors
    setErrors({ email: "" });

    // Validate form
    if (!validateForm()) {
      if (errors.email) {
        toastError({ text: errors.email });
      }
      return;
    }

    try {
      setLoading(true);

      // Call forgot password API
      const response = await axiosInstance.post(
        "auth/forgotPassword",
        {
          email: email.trim(),
        },
        { skipAuth: true }
      );

      // Check response structure
      if (response?.data?.success) {
        toastSuccess({ text: response?.data?.message || "Password reset email sent successfully!" });
        
        // Navigate to VerifyEmail screen with email
    navigation.navigate(routes.auth, {
          screen: routes.verifyEmail,
          params: { email: email.trim() },
        });
      } else {
        throw new Error(response?.data?.message || "Failed to send reset email");
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        error?.data?.message ||
        "Failed to send reset email. Please try again.";

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
          title="Forget Password"
          subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
          onBack={() => navigation.goBack()}
        />

        {/* Email Input */}
        <AppTextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Next Button */}
        <View style={styles.footer}>
          <AppButton
            title={loading ? "Sending..." : "NEXT"}
            onPress={handleNext}
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

export default Forgot;

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
