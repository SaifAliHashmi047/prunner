import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AppHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

const Inventory = ({ navigation }) => {
  const inventory = [
    {
      id: "1",
      name: "Steel Beams",
      quantity: "50",
      unit: "pieces",
      location: "Warehouse A",
      status: "Available",
    },
    {
      id: "2",
      name: "Concrete Blocks",
      quantity: "200",
      unit: "blocks",
      location: "Site 1",
      status: "In Use",
    },
    {
      id: "3",
      name: "Cement Bags",
      quantity: "75",
      unit: "bags",
      location: "Storage B",
      status: "Available",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Available' ? colors.green : colors.orange }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
        <Text style={styles.itemLocation}>📍 {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Inventory" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Material Inventory</Text>
          <AppButton
            title="+ Add Item"
            style={styles.addButton}
            textStyle={styles.addButtonText}
          />
        </View>

        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.inventoryList}
        />
      </View>
    </SafeAreaView>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: heightPixel(20),
  },
  sectionTitle: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  addButton: {
    backgroundColor: colors.themeColor,
    paddingHorizontal: widthPixel(15),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(20),
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoSemiBold,
  },
  inventoryList: {
    paddingBottom: heightPixel(20),
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(12),
    padding: widthPixel(15),
    marginBottom: heightPixel(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(8),
  },
  itemName: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(12),
  },
  statusText: {
    fontSize: fontPixel(10),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.white,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemQuantity: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
  },
  itemLocation: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
  },
});
