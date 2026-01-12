import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { AppHeader, AppOtp, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import {
  heightPixel,
  widthPixel,
  fontPixel,
  emailFormat,
} from "../../../services/constant";
import { routes } from "../../../services/constant";
import { useRoute } from "@react-navigation/native";
import axiosInstance from "../../../api/axiosInstance";
import {
  toastError,
  toastSuccess,
} from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "../../../services/store/slices/userSlice";
import { useDispatch } from "react-redux";

const VerifyOTP = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Get email from route params or use empty string
  const email = route?.params?.email || "";

  // Validation function
  const validateForm = () => {
    if (!email.trim()) {
      toastError({ text: "Email is required" });
      return false;
    }

    if (!otp.trim()) {
      toastError({ text: "OTP is required" });
      return false;
    }

    if (otp.length !== 6) {
      toastError({ text: "OTP must be 6 digits" });
      return false;
    }

    if (!/^\d+$/.test(otp)) {
      toastError({ text: "OTP must contain only numbers" });
      return false;
    }

    return true;
  };

  // Handle verify OTP
  const handleVerify = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Call verify API
      const response = await axiosInstance.post(
        "auth/verify",
        {
          email: email.trim(),
          otp: otp.trim(),
        },
        { skipAuth: true }
      );
      const token = response?.data?.data?.token;
      const refreshToken = response?.data?.data?.refreshToken;
      if (token) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
        dispatch(setUserData(response?.data?.data?.user));
      }
      if (refreshToken) {
        await AsyncStorage.setItem("refreshToken", refreshToken);
      }
      // Show success message
      toastSuccess({ text: "Email verified successfully!" });
      console.log("response", JSON.stringify(response, null, 2));

      // Navigate to account type screen
      navigation.navigate(routes.auth, {
        screen: routes.accountType,
      });
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Verification failed. Please check your OTP and try again.";

      toastError({ text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (timer > 0) {
      return; // Don't allow resend if timer is still running
    }

    if (!email.trim()) {
      toastError({ text: "Email is required" });
      return;
    }

    try {
      setResendLoading(true);

      // Call resend OTP API
      const response = await axiosInstance.post(
        "auth/sendOTP",
        {
          email: email.trim(),
        },
        { skipAuth: true }
      );

      // Show success message
      toastSuccess({ text: "OTP has been resent to your email" });

      // Reset timer
      setTimer(60);
      setOtp(""); // Clear OTP input
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      toastError({ text: errorMessage });
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <AppHeader
          title="Verify Email"
          subtitle={`Enter the 6-digit code sent to ${
            email || "your email address"
          }.`}
          onBack={() => navigation.goBack()}
        />

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <AppOtp value={otp} onChange={setOtp} />

          {/* Timer / Resend */}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.timerContainer}>
            {timer > 0 ? (
              <Text style={styles.timerCount}>
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleResend}
              disabled={timer > 0 || resendLoading}
              style={timer > 0 && styles.disabledButton}
            >
              <Text
                style={[
                  styles.resendText,
                  (timer > 0 || resendLoading) && styles.disabledText,
                ]}
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <AppButton
            title={loading ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
      <Loader isVisible={loading || resendLoading} />
    </SafeAreaView>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    backgroundColor: colors.white,
  },
  otpContainer: {
    flex: 1,
  },
  timerContainer: {
    // marginTop: heightPixel(20),
    alignItems: "center",
  },
  timerText: {
    fontSize: fontPixel(14),
    color: colors.black,
  },
  timerCount: {
    fontWeight: "600",
    color: "#008C0E",
    fontSize: fontPixel(24),
  },
  resendText: {
    fontSize: fontPixel(14),
    color: colors.darkGray,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.darkGray,
    opacity: 0.5,
  },
  footer: {
    paddingBottom: 20,
  },
});
