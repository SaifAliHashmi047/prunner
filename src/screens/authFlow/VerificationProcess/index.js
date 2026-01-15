import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { AppHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { appIcons } from "../../../services/utilities/assets";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { useAppSelector } from "../../../services/store/hooks";
import useUsers from "../../../hooks/useUsers";

const VerificationProcess = ({ navigation }) => {
  const { user } = useAppSelector((state) => state.user);
  const { getLoggedInUser } = useUsers();
  const intervalRef = useRef(null);
  const isNavigatingRef = useRef(false);

  // Watch for verification status changes and navigate when verified
  useEffect(() => {
    const verificationStatus = user?.verification?.status;
    
    // If status is not pending (verified), navigate to success screen
    if (verificationStatus && verificationStatus !== "pending" && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      
      // Clear interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      navigation.replace(routes.auth, {
        screen: routes.profileVerified,
      });
    }
  }, [user?.verification?.status, navigation]);

  // Set up polling if status is pending
  useEffect(() => {
    const verificationStatus = user?.verification?.status;
    
    // If status is not pending, don't set up polling
    if (verificationStatus && verificationStatus !== "pending") {
      return;
    }
    
    // Only set up polling if status is pending and user exists
    if (verificationStatus === "pending" && user?._id) {
      // Initial check - fetch user data immediately
      getLoggedInUser();

      // Set up polling interval (every 20 seconds)
      intervalRef.current = setInterval(async () => {
        try {
          // Fetch latest user data
          await getLoggedInUser();
        } catch (error) {
          console.log("Error checking verification status:", error);
        }
      }, 20000); // 20 seconds
    }

    // Cleanup interval on unmount or when status changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user?.verification?.status, user?._id, getLoggedInUser]);



  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <AppHeader
          title="Verification is in Process"
          subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
        />

        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Image
            // TODO: replace with your final illustration
            source={appIcons.verificationIllustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Hint / Footer text */}
        <View style={styles.infoWrap}>
          <Text style={styles.infoText}>It may take some Hours</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerificationProcess;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    backgroundColor: colors.white,
    paddingTop: heightPixel(20),
  },
  illustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightPixel(36),
  },
  illustration: {
    width: widthPixel(300),
    height: heightPixel(300),
  },
  infoWrap: {
    marginTop: heightPixel(24),
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: fontPixel(13),
    color: "#6b7280", // neutral gray, similar to your mock
  },
});
