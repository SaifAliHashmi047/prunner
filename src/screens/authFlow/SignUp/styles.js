import { StyleSheet } from "react-native";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(80),
  },
  title: {
    fontSize: fontPixel(28),
    fontWeight: "bold",
    marginBottom: heightPixel(10),
    // textAlign: "center",
  },
  subtitle: {
    fontSize: fontPixel(16),
    color: "#888",
    marginBottom: heightPixel(30),
    // textAlign: "center",
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
    color: colors.black,
    fontSize: fontPixel(14),
  },
  registerLink: {
    color: colors.themeColor,
    fontWeight: "bold",
    marginLeft: widthPixel(5),
    fontSize: fontPixel(14),
  },
  errorText: {
    color: "#FF3B30",
    fontSize: fontPixel(12),
    marginTop: heightPixel(-15),
    marginBottom: heightPixel(10),
    marginLeft: widthPixel(5),
  },
});
