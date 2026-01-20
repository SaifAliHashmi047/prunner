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
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { useRoute } from "@react-navigation/native";
import axiosInstance from "../../../api/axiosInstance";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const VerifyEmail = ({ navigation }) => {
  const route = useRoute();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  // Get email from route params
  const email = route?.params?.email || "";

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      toastError({ text: "Please enter a valid OTP" });
      return;
    }

    try {
      setLoading(true);

      // Call verify OTP API for reset password
      const response = await axiosInstance.post(
        "auth/verifyOTPResetPassword",
        {
          email: email.trim(),
          otp: otp,
        },
        { skipAuth: true }
      );

      // Check success and navigate
      if (response?.data?.success) {
        const resetToken = response?.data?.data?.resetToken;
        toastSuccess({ text: "OTP Verified Successfully" });

        navigation.navigate(routes.auth, {
          screen: routes.changePassword,
          params: {
            email: email,
            resetToken: resetToken
          },
        });
      } else {
        throw new Error(response?.data?.message || "Verification failed");
      }

    } catch (error) {
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

  const handleResend = () => {
    console.log("Resend OTP");
    setTimer(60); // reset timer
    // TODO: Implement Resend API if needed
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
          subtitle="Enter the 6-digit code sent to your email address."
          onBack={() => navigation.goBack()}
        />

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <AppOtp value={otp} onChange={setOtp} />

          {/* Timer / Resend */}

        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.timerContainer}>

            <Text style={styles.timerCount}> 00:{timer}</Text>


            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend Code</Text>
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
      <Loader isVisible={loading} />
    </SafeAreaView>
  );
};

export default VerifyEmail;

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
    color: '#008C0E',
    fontSize: fontPixel(24),
  },
  resendText: {
    fontSize: fontPixel(14),
    color: colors.darkGray,
    fontWeight: "600",
    marginTop: 10,
  },
  footer: {
    paddingBottom: 20,
  },
});
