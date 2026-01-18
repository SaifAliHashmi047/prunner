import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Image,
} from "react-native";
import { SecondHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets"; // assume you have mail, phone, web icons
import { fonts } from "../../../services/utilities/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ContactUs = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const contactOptions = [
    {
      id: 1,
      icon: appIcons.mail, // replace with your mail icon
      title: "Chat to us",
      value: "abc@gmail.com",
      action: () => Linking.openURL("mailto:abc@gmail.com"),
    },
    {
      id: 2,
      icon: appIcons.phone, // replace with your phone icon
      title: "Phone",
      value: "+13123232323",
      action: () => Linking.openURL("tel:+13123232323"),
    },
    {
      id: 3,
      icon: appIcons.web, // replace with your website icon
      title: "Website",
      value: "www.mowa.com",
      action: () => Linking.openURL("https://www.mowa.com"),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top
    }]}>
      {/* Header */}
      <View style={{
        flex: 1,
        paddingHorizontal: widthPixel(20),
        // paddingTop: heightPixel(20),
      }}>
        <SecondHeader onPress={() => navigation.goBack()} title="Contact Us" />

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Vestibulum sodales pulvinar accumsan. Praesent rhoncus neque
        </Text>

        {/* Contact List */}
        <View style={{ marginTop: heightPixel(20) }}>
          {contactOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.row}
              activeOpacity={0.7}
              onPress={item.action}
            >
              <View style={styles.iconWrapper}>
                <Image source={item.icon} style={styles.icon} />
              </View>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingHorizontal: widthPixel(20),
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: "#777",
    fontFamily: fonts.NunitoRegular,
    marginVertical: heightPixel(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPixel(20),
  },
  iconWrapper: {
    backgroundColor: "#E6DBFA",
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(10),
    alignItems: "center",
    justifyContent: "center",
    marginRight: widthPixel(12),
  },
  icon: {
    width: widthPixel(22),
    height: widthPixel(22),
    resizeMode: "contain",
    tintColor: colors.themeColor,
  },
  title: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  value: {
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    color: "#555",
    marginTop: 2,
  },
});
