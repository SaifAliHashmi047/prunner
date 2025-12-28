import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

const AboutUs = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <SecondHeader onPress={() => navigation.goBack()} title="About Us" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          elementum dictum augue et iaculis. Ut id ullamcorper sapien. In neque
          neque, lobortis rhoncus ligula id, vestibulum laoreet eros. Cras quis
          vestibulum dui. Etiam feugiat ligula quis vehicula tincidunt. Ut ut
          consectetur ex. Fusce ut aliquet leo. Nunc massa lectus, semper
          fermentum dui eu, dapibus suscipit metus. Sed tempus consequat ante,
          sit amet rhoncus turpis tincidunt varius.{"\n\n"}
          Praesent egestas risus eu aliquam euismod. Cras nibh erat, iaculis sed
          vestibulum quis, hendrerit non dui. Etiam bibendum, erat ac ullamcorper
          rutrum, leo lorem ullamcorper purus, sit amet turpis mauris a massa.
          Sed a vulputate quam. Suspendisse cursus sit amet nulla a sagittis.
          Aenean pharetra tempus quam, facilisis venenatis elit pulvinar eu.
          Vivamus tempus arcu elit, eu elementum quam vestibulum at. Vivamus ac
          lobortis felis. Nam fermentum tortor quis leo maximus venenatis. Donec
          ut leo in diam hendrerit fringilla. Fusce non metus ultrices nunc
          porttitor finibus quis id lorem.{"\n\n"}
          Vestibulum sodales pulvinar accumsan. Praesent rhoncus neque in tempor
          bibendum. Cras nec feugiat orci. Vestibulum at ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Proin id leo
          eros. Suspendisse vulputate leo justo eu porta. Nulla facilisi.{"\n\n"}
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
