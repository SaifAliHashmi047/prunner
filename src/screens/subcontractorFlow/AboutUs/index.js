import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AboutUs = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top
    }]}>
      {/* Header */}
      <View style={styles.header}>
      <SecondHeader onPress={() => navigation.goBack()} title="About Us" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          Project Runner helps construction and logistics teams manage tasks, sites, and deliveries in one place.{"\n\n"}
          Subcontractors can create and assign tasks, track materials, and communicate with forklift operators. Forklift operators receive jobs, update status, and complete deliveries.{"\n\n"}
          We focus on clear communication, on-time delivery, and simple tools so your team can get work done efficiently.
        </Text>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(20),
  },
  header: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    // paddingTop: heightPixel(20),
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
