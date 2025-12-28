import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView } from "react-native";
import { AppInventoryRow } from "../../../components";  // Custom component
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import useCallApi from "../../../hooks/useCallApi";

import { Loader } from "../../../components/Loader";
import { ActivityIndicator, RefreshControl } from "react-native";

const Inventory = () => {
  const { callApi } = useCallApi();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchInventory(1);
  }, []);

  const fetchInventory = async (pageNum, isRefresh = false) => {
    if (loadingMore) return;

    try {
      if (pageNum === 1 && !isRefresh) setLoading(true);
      if (pageNum > 1) setLoadingMore(true);

      const response = await callApi("inventory", "GET", null, {
        page: pageNum,
        limit: 10
      });

      if (response?.success && response?.data) {
        const list = response.data.inventory || [];
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setInventory(list);
        } else {
          setInventory(prev => [...prev, ...list]);
        }

        if (pagination && pagination.currentPage >= pagination.totalPages) {
          setHasMore(false);
        } else if (list.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch inventory error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchInventory(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchInventory(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="small" color={colors.themeColor} />;
  };

  const renderItem = ({ item }) => {
    // Map API data to component props
    // API: name, quantity, itemUnit, image
    // Component: name, qty, icon

    const qtyString = `${item.quantity || 0} ${item.itemUnit || ""}`;
    const iconSource = item.image ? { uri: item.image } : appIcons.inventory || appIcons.sand; // Default icon if needed

    return (
      <AppInventoryRow
        name={item.name}
        qty={qtyString}
        icon={iconSource}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.headerSpacer} />

        <FlatList
          data={inventory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: heightPixel(24) }}
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
});