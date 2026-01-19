import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { AppInventoryRow, AppButton, SecondHeader } from "../../../components";  // Custom component
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import useInventory from "../../../hooks/useInventory";
import { routes } from "../../../services/constant";

import { Loader } from "../../../components/Loader";
import { ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Inventory = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { isSelection, previousData } = route.params || {};
  const {
    inventory,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchInventory,
    loadMore,
    onRefresh,
  } = useInventory();

  // Selection State: stored as object { [id]: { ...item, quantity: 1 } }
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    fetchInventory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    onRefresh();
  };

  const handleLoadMore = () => {
    loadMore();
  };

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

  const handleNext = () => {
    const inventoryList = Object.values(selectedItems).map(i => ({
      item: i.name, // API expects 'item' string? "item": "string" from user prompt.
      // Wait, user backend might expect ID or Name? Usually ID. 
      // But prompt payload example says "item": "string". 
      // I will send Name for now as per prompt example, OR ID if I can confirm.
      // I'll send Name as it's standard label.
      quantity: i.quantity,
      notes: "" // Default empty notes
    }));

    //   if (inventoryList.length === 0) {
    //       Alert.alert("Notice", "No items selected. Proceeding without inventory.");
    //   }

    navigation.navigate(routes.taskUser, {
      previousData,
      selectedInventory: inventoryList
    });
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="small" color={colors.themeColor} />;
  };

  const renderItem = ({ item }) => {
    const isSelected = !!selectedItems[item._id];

    // Map API data to component props
    const qtyString = `${item.quantity || 0} ${item.itemUnit || ""}`;
    const iconSource = item.image ? { uri: item.image } : appIcons.inventory || appIcons.sand; // Default icon if needed

    return (
      <TouchableOpacity
        onPress={() => isSelection ? toggleSelection(item) : null}
        disabled={!isSelection}
        style={[
          isSelected && styles.selectedItem
        ]}
      >
        <AppInventoryRow
          name={item.name}
          qty={qtyString}
          icon={iconSource}
        />
        {isSelected && (
          <View style={styles.checkMark}>
            <Text style={{ color: 'white' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={ {
      flex: 1,  
      paddingTop: insets.top 
    }}>
      <View style={styles.screen}>
        {isSelection ? (
          <SecondHeader onPress={() => navigation.goBack()} title="Select Inventory" />
        ) : (
          <Text style={styles.title}>Inventory</Text>
        )}

        <View style={styles.headerSpacer} />

        <FlatList
          data={inventory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{padding:heightPixel(3), paddingBottom: heightPixel(80) }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && <Text style={{ textAlign: 'center', marginTop: 20, color: colors.grey }}>No inventory found</Text>
          }
          renderItem={renderItem}
        />

        {isSelection && (
          <View style={styles.footerBtn}>
            <AppButton
              title={`NEXT (${Object.keys(selectedItems).length})`}
              style={{ backgroundColor: colors.themeColor }}
              textStyle={{ color: colors.white }}
              onPress={handleNext}
            />
          </View>
        )}

        <Loader isVisible={loading} />
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
  selectedItem: {
    backgroundColor: '#E6F0FF',
    borderRadius: widthPixel(8),
    borderWidth: 1,
    borderColor: colors.themeColor
  },
  checkMark: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: colors.themeColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  footerBtn: {
    position: 'absolute',
    bottom: heightPixel(20),
    left: widthPixel(20),
    right: widthPixel(20),
  }
});