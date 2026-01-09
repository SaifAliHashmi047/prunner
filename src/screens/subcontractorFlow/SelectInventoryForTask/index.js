import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity, Image, Alert, RefreshControl } from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import useInventory from "../../../hooks/useInventory";
import { routes } from "../../../services/constant";
import { Loader } from "../../../components/Loader";
import { appIcons } from "../../../services/utilities/assets";
import { useFocusEffect } from "@react-navigation/native";

const SelectInventoryForTask = ({ navigation, route }) => {
  const { previousData } = route.params || {};
  console.log("previousData", previousData);

  const {
    inventory,
    loading,
    refreshing,
    loadMore,
    onRefresh,
    loadingMore,
    fetchInventory,
  } = useInventory();

  // Selection State: { [id]: { ...item, quantity: 1 } }
  const [selectedItems, setSelectedItems] = useState({});
  
  // Custom inventory state
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customQuantity, setCustomQuantity] = useState("");
  const [customUnit, setCustomUnit] = useState("");

  // Refresh inventory when screen comes into focus (after creating new inventory)
  useFocusEffect(
    React.useCallback(() => {
      fetchInventory(1);
    }, [ ])
  );

  const toggleSelection = (item) => {
    setSelectedItems(prev => {
      const newState = { ...prev };
      if (newState[item._id]) {
        delete newState[item._id];
      } else {
        newState[item._id] = { ...item, quantity: 1 };
      }
      return newState;
    });
  };

  const toggleCustom = () => {
    setIsCustomSelected(prev => !prev);
    if (!isCustomSelected) {
      // Clear custom inputs when deselecting
      setCustomName("");
      setCustomQuantity("");
      setCustomUnit("");
    }
  };

  const handleNext = () => {
    let finalInventory = Object.values(selectedItems).map(i => ({
      item: i.name,
      quantity: i.quantity || 1,
      unit: i.itemUnit || "",
      notes: ""
    }));

    // Add custom inventory if selected and filled
    if (isCustomSelected && customName.trim() && customQuantity.trim()) {
      finalInventory.push({
        item: customName.trim(),
        quantity: parseInt(customQuantity, 10) || 1,
        unit: customUnit.trim() || "",
        notes: ""
      });
    }

    if (finalInventory.length === 0) {
      Alert.alert("Notice", "No items selected. Proceeding without inventory.");
    }

    navigation.navigate(routes.taskUser, {
      previousData,
      selectedInventory: finalInventory
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = !!selectedItems[item._id];
    const qtyString = `${item.quantity || 0} ${item.itemUnit || ""}`;
    const iconSource = item.image ? { uri: item.image } : appIcons.inventory || appIcons.sand;

    return (
      <View style={styles.itemRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Image source={iconSource} style={styles.itemIcon} resizeMode="contain" />
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <Text style={styles.itemQty}>{qtyString}</Text>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleSelection(item)}
        >
          <View style={[styles.radioOuter, isSelected && { borderColor: colors.themeColor }]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SecondHeader onPress={() => navigation.goBack()} title="Inventory" />

      <View style={{ flex: 1, paddingHorizontal: widthPixel(20) }}>

        {/* Custom Section */}
        <TouchableOpacity
          style={[styles.card, isCustomSelected && styles.activeCard]}
          onPress={toggleCustom}
        >
          <View style={styles.customHeaderRow}>
            <Text style={styles.cardTitle}>Custom</Text>
            <View style={[styles.radioOuter, isCustomSelected && styles.radioOuterActive]}>
              {isCustomSelected && <View style={styles.radioInner} />}
            </View>
          </View>
          
          {isCustomSelected && (
            <View style={styles.customInputsContainer}>
              <AppTextInput
                placeholder="Enter custom inventory name"
                value={customName}
                onChangeText={setCustomName}
                keyboardType="default"
                style={styles.customInput}
              />
              <AppTextInput
                placeholder="Enter quantity"
                value={customQuantity}
                onChangeText={setCustomQuantity}
                keyboardType="numeric"
                style={styles.customInput}
              />
              <AppTextInput
                placeholder="Enter unit (e.g., Bags, Kg)"
                value={customUnit}
                onChangeText={setCustomUnit}
                keyboardType="default"
                style={styles.customInput}
              />
            </View>
          )}
        </TouchableOpacity>

        <FlatList
          data={inventory}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: heightPixel(100) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>No inventory found</Text>}
        />
      </View>

      <View style={styles.footer}>
        <AppButton
          title="NEXT"
          style={{ backgroundColor: colors.themeColor }}
          textStyle={{ color: colors.white }}
          onPress={handleNext}
        />
      </View>

      <Loader isVisible={loading || loadingMore} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg || "#F8F8F8",
  },
  card: {
    backgroundColor: colors.white,
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  activeCard: {
    borderWidth: 1,
    borderColor: colors.themeColor,
    backgroundColor: "#F7F1FF",
  },
  customHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(10)
  },
  cardTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black
  },
  customInputsContainer: {
    marginTop: heightPixel(12),
  },
  customInput: {
    marginBottom: heightPixel(10),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(12),
    justifyContent: 'space-between'
  },
  itemIcon: {
    width: widthPixel(30),
    height: widthPixel(30),
    marginRight: widthPixel(12)
  },
  itemName: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black
  },
  itemQty: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
    marginRight: widthPixel(16)
  },
  checkboxContainer: {
    padding: 4
  },
  radioOuter: {
    width: widthPixel(22),
    height: widthPixel(22),
    borderRadius: widthPixel(11),
    borderWidth: 1.5,
    borderColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioInner: {
    width: widthPixel(12),
    height: widthPixel(12),
    borderRadius: widthPixel(6),
    backgroundColor: colors.themeColor
  },
  footer: {
    position: 'absolute',
    bottom: heightPixel(30),
    left: widthPixel(20),
    right: widthPixel(20),
  }
});

export default SelectInventoryForTask;
