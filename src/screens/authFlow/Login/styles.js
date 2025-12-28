import { StyleSheet } from "react-native";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(80),
  },
  title: {
    fontSize: fontPixel(24),
    fontFamily: fonts.NunitoBold,
    fontWeight: "600",
    color: colors.black,
    marginBottom: heightPixel(10),
    // textAlign: "center",
  },
  subtitle: {
    fontSize: fontPixel(16),
    color: colors.darkGray,
    marginBottom: heightPixel(30),
    lineHeight: fontPixel(22),
    fontFamily: fonts.NunitoRegular,
    fontWeight: "400",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: heightPixel(30),
    marginRight: widthPixel(10),
  },
  forgotPasswordText: {
    color: colors.darkGray,
    // textDecorationLine: "underline",
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    fontWeight: "300",
  },
  footer: {
    marginTop: "auto", // pushes login button to bottom
    marginBottom: heightPixel(40),
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: heightPixel(15),
  },
  registerText: {
    color: colors.greyText,
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    fontWeight: "400",
  },
  registerLink: {
    color: colors.themeColor,
    fontWeight: "bold",
    fontFamily: fonts.NunitoBold,
    marginLeft: widthPixel(5),
    fontSize: fontPixel(14),
  },
  errorText: {
    color: "#FF3B30",
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    marginTop: heightPixel(-15),
    marginBottom: heightPixel(10),
    marginLeft: widthPixel(5),
  },
});
