import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import useCallApi from "../../../hooks/useCallApi";
import { routes } from "../../../services/constant";
import { Loader } from "../../../components/Loader";
import { appIcons } from "../../../services/utilities/assets";

const SelectInventoryForTask = ({ navigation, route }) => {
  const { previousData } = route.params || {};
  const { callApi } = useCallApi();
  console.log("previousData", previousData);

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection State: { [id]: { ...item, quantity: 1 } }
  const [selectedItems, setSelectedItems] = useState({});

  // Custom Logic
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await callApi("inventory", "GET", null, { page: 1, limit: 100 }); // Fetch all or implement paging
      if (response?.success && response?.data) {
        setInventory(response.data.inventory || []);
      }
    } catch (error) {
      console.log("Fetch inventory error", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item) => {
    // If custom is selected, we might want to deselect it? 
    // User requirement says "custom use the logic of createInventory".
    // Image shows Custom as a radio button option at the top. 
    // But text says "multiple select".
    // If multiple select, Custom can be one of the selected items.

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

  const handleNext = () => {
    let finalInventory = Object.values(selectedItems).map(i => ({
      item: i.name,
      quantity: i.quantity,
      notes: ""
    }));

    if (isCustomSelected) {
      if (!customName.trim()) {
        Alert.alert("Error", "Please enter a name for the custom item");
        return;
      }
      finalInventory.push({
        item: customName,
        quantity: 1, // Default or add input? Image showing only name.
        notes: "Custom Item"
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
        <View style={styles.card}>
          <View style={styles.customHeaderRow}>
            <Text style={styles.cardTitle}>Custom</Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsCustomSelected(!isCustomSelected)}
            >
              <View style={[styles.radioOuter, isCustomSelected && { borderColor: colors.themeColor }]}>
                {isCustomSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.customInput}
            placeholder="Enter name"
            placeholderTextColor={colors.grey}
            value={customName}
            onChangeText={setCustomName}
            editable={isCustomSelected} // Only editable if checked? Or auto-check if typing?
            // Let's make it auto-check if typing
            onFocus={() => setIsCustomSelected(true)}
          />
        </View>

        <FlatList
          data={inventory}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: heightPixel(100) }}
          showsVerticalScrollIndicator={false}
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

      <Loader isVisible={loading} />
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
  customInput: {
    backgroundColor: '#EAEAEA',
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.black
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
