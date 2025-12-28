import React , {useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const AccountDeleted = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: routes.auth, params: { screen: routes.login } }],
      });
    }, 3000);

    return () => clearTimeout(timer); 
  }
  , [navigation]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Central Icon */}
        <View style={styles.iconContainer}>
          <Image source={appIcons.trash} style={styles.deleteIcon} />
        </View>

        {/* Main Title */}
        <Text style={styles.title}>Account Deleted</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac eleifend purus.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AccountDeleted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themeColor,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: widthPixel(40),
  },
  iconContainer: {
    position: "relative",
    marginBottom: heightPixel(30),
  },
  deleteIcon: {
    width: widthPixel(100),
    height: widthPixel(100),
    resizeMode: "contain",
  },
  title: {
    fontSize: fontPixel(24),
    fontWeight: "bold",
    color: colors.white,
    fontFamily: fonts.NunitoBold,
    textAlign: "center",
    marginBottom: heightPixel(20),
  },
  description: {
    fontSize: fontPixel(16),
    color: colors.white,
    fontFamily: fonts.NunitoRegular,
    textAlign: "center",
    lineHeight: heightPixel(24),
  },
});
