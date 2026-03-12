import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TermsOfUse = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <SecondHeader onPress={() => navigation.goBack()} title="Terms of Use" />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.text}>
            1. Acceptance. By using Project Runner you agree to these terms. Use the app only for lawful purposes and in line with your role (subcontractor or forklift operator).{"\n\n"}

            2. Accounts. You are responsible for keeping your login details secure. Do not share your account. You must provide accurate information when signing up and updating your profile.{"\n\n"}

            3. Use of the service. Project Runner is for managing tasks, sites, deliveries, and team communication. Do not use it for spam, harassment, or to share content that is illegal or harmful. We may suspend or remove accounts that break these rules.{"\n\n"}

            4. Data and privacy. We collect and use data as described in our privacy policy to run the app, improve it, and support you. By using the app you consent to this use. You can request deletion of your account and data from the app settings.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermsOfUse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingHorizontal: widthPixel(20),
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
