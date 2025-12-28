import { StyleSheet } from "react-native";
import { heightPixel , widthPixel } from "../../../services/constant";
import { colors } from "../../../services/utilities/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: heightPixel(221),
    height: heightPixel(70),
    marginRight: widthPixel(10),
  },
  textContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#fff",
    paddingLeft: 12,
  },
  projectText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  runnerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
