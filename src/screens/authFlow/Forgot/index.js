import React, { useState } from "react";
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { AppHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    console.log("Email entered:", email);
    navigation.navigate(routes.auth, {
      screen: routes.verifyEmail
    }); // Navigate to VerifyEmail screen
    // navigation.navigate("VerifyCode"); // Example next step
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
          <AppButton title="NEXT" onPress={handleNext} style={{
            backgroundColor: colors.themeColor,
          }} textStyle={{
            color: colors.white,
          }} 
          />
        </View>

      </KeyboardAvoidingView>
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
