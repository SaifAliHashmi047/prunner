import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivacyPolicy = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
      <SafeAreaView style={[styles.container, {
      paddingTop: insets.top
    }]}>
      {/* Header */}
      <View style={styles.header}>
      <SecondHeader onPress={() => navigation.goBack()} title="Privacy Policy" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          ProjectRunner is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our mobile application and related services.{"\n\n"}
          
          We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, contact information, and work-related details necessary for project management and team collaboration.{"\n\n"}
          
          We also automatically collect certain information about your use of our Service, including device information, log data, and usage patterns. This helps us improve our app performance and provide you with a better user experience.{"\n\n"}
          
          Your information is used to provide, maintain, and improve our Service, facilitate communication between team members, track project progress, and ensure the security of our platform. We do not sell, trade, or rent your personal information to third parties.{"\n\n"}
          
          We implement appropriate security measures to protect your information against unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.{"\n\n"}
          
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. You have the right to access, correct, or delete your personal information at any time.{"\n\n"}
          
          Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties and encourage you to review their privacy policies.{"\n\n"}
          
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of our Service after any modifications constitutes acceptance of the updated Privacy Policy.{"\n\n"}
          
          If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@projectrunner.com. By using ProjectRunner, you acknowledge that you have read and understood this Privacy Policy.
        </Text>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

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
    marginTop: heightPixel(10),
  },
  text: {
    fontSize: fontPixel(14),
    lineHeight: heightPixel(22),
    color: "#444",
    fontFamily: fonts.NunitoRegular,
    textAlign: "justify",
  },
});
