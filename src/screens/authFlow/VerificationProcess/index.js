import React , {useEffect} from "react";
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

const VerificationProcess = ({ navigation }) => {

  useEffect(() => {
    // Simulate a verification process with a timeout
    const timer = setTimeout(() => {
      navigation.replace(routes.auth , {
        screen: routes.profileVerified
      }); // Uncomment and implement navigation as needed
    }, 5000); // 5 seconds for demonstration

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);



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
