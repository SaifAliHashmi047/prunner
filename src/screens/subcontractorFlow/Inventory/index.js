import React from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView } from "react-native";
import { AppInventoryRow } from "../../../components";  // Custom component
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";

// Sample data for Inventory
const DATA = [
  { id: "1", name: "Sand", qty: "2 Cubic m", icon: appIcons.sand },
  { id: "2", name: "Cement Bags", qty: "500 Bags", icon: appIcons.cement || appIcons.cementBags },
  { id: "3", name: "Steel Rods", qty: "10 Tons", icon: appIcons.steel || appIcons.steelRods },
  { id: "4", name: "Bricks", qty: "10,000 Units", icon: appIcons.bricks },
  { id: "5", name: "Gravel", qty: "150 Cubic m", icon: appIcons.gravel },
  { id: "6", name: "Paint Buckets (20L)", qty: "293 Buckets", icon: appIcons.paint || appIcons.paintBucket },
];

const Inventory = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.headerSpacer} />

        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: heightPixel(24) }}
          renderItem={({ item }) => (
            <AppInventoryRow icon={item.icon} name={item.name} qty={item.qty} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screenBg || "#F3F3F4", // Screen background color
    paddingHorizontal: widthPixel(14),
    paddingTop: heightPixel(10),
  },
  headerSpacer: {
    height: heightPixel(6), // Space above the header
  },
  title: {
    textAlign: "center",
    fontSize: fontPixel(18),
    fontWeight: "600",
    color: colors.black,
    marginBottom: heightPixel(10),
  },
});