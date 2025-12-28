import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import { colors } from "../services/utilities/colors";



const AppInventoryRow = ({ icon, name, qty, onPress, style }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, style]}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Image source={icon} style={styles.icon} />
        </View>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>

      <Text style={styles.qty} numberOfLines={1}>{qty}</Text>
    </TouchableOpacity>
  );
};

export default AppInventoryRow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(12),
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(12),
    marginVertical: heightPixel(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // subtle shadow like the mock
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  iconWrap: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(8),
    // backgroundColor: "#F6F6F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: widthPixel(10),
  },
  icon: {
    width: widthPixel(22),
    height: widthPixel(22),
    resizeMode: "contain",
  },
  name: {
    fontSize: fontPixel(15),
    color: colors.black,
    fontWeight: "500",
    maxWidth: "70%",
  },
  qty: {
    fontSize: fontPixel(14),
    color: colors.textGray || "#555",
    fontWeight: "400",
  },
});
