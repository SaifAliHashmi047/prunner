import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { routes } from "../../../services/constant";
import { AppTaskCard } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from "@react-navigation/native";
import { fonts } from "../../../services/utilities/fonts";
import { Loader } from "../../../components/Loader";
import { formateDate } from "../../../services/utilities/helper";
import useTasks from "../../../hooks/useTasks";
import {
  setSelectedSite,
  setSites,
} from "../../../services/store/slices/siteSlice";
import { useDispatch, useSelector } from "react-redux";
import useSite from "../../../hooks/useSite";
import useUsers from "../../../hooks/useUsers";

const Home = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Active"); // Active, Completed, Cancelled

  // Use useTasks hook
  const {
    tasks,
    loading,
    refreshing,
    loadMore,
    onRefresh,
    loadingMore,
    fetchTasks,
  } = useTasks();
  const { selectedSite } = useSelector((state) => state.site || {});
  console.log("selectedSite", selectedSite);
    const { getSites } = useSite();
    const { getLoggedInUser } = useUsers();
    useEffect(()=>{
      getLoggedInUser();
    },[])
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };



  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchTasks(1),
        getSites()
      ])
    }, [])
  );

  // loadMore and onRefresh are now handled by the hook and passed directly

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const status = task.status?.toLowerCase();
      if (activeTab === "Active") {
        return (
          status === "pending" ||
          status === "in_progress" ||
          status === "active"
        );
      } else if (activeTab === "Completed") {
        return status === "completed";
      } else if (activeTab === "Cancelled") {
        return status === "cancelled";
      }
      return false;
    });
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.themeColor} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.greyText,
            fontFamily: fonts.NunitoRegular,
          }}
        >
          No tasks found
        </Text>
      </View>
    );
  };

  const filteredData = getFilteredTasks();

  const TabContent = () => (
    <FlatList
      data={filteredData}
      keyExtractor={(item) =>   item?._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: heightPixel(3),
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.themeColor]}
        />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      renderItem={({ item }) => {
        const item1 = item.inventory?.[0];
        const item2 = item.inventory?.[1];
        console.log("item", item);
        return (
          <AppTaskCard
          key={item?._id}
            userName={item?.assignedTo?.name} // Using title as header
            taskTitle={item.title}
            status={item.status}
            userImage={item.assignedTo?.image}
            inventory={item?.inventory}
            material1={item1?.item}
            material1Qty={
              item1 ? `${item1.quantity} ${item1.unit || ""}` : undefined
            }
            material2={item2?.item}
            material2Qty={
              item2 ? `${item2.quantity} ${item2.unit || ""}` : undefined
            }
            date={formateDate(item?.scheduledDate, "DD-MMM-YYYY")}
            taskType={item?.taskType}
            time={formateDate(item?.scheduledDate, "hh:mm A")}
            onPress={() => {
              navigation.navigate(routes.jobDetails, { task: item });
            }}
          />
        );
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Drawer Toggle Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: widthPixel(16),
        }}
      >
        <TouchableOpacity
          onPress={openDrawer}
          style={{ padding: heightPixel(12) }}
        >
          <Image
            source={appIcons.drawer}
            style={{ width: widthPixel(24), height: widthPixel(24) }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.homeDetail)}
          style={{ padding: heightPixel(12) }}
        >
          <Image
            source={appIcons.building}
            style={{ width: widthPixel(24), height: widthPixel(24) }}
          />
        </TouchableOpacity>
      </View>

      {/* Custom Tab Navigation */}
      <View style={styles.tabs}>
        {["Active", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.activeTabLabel,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: widthPixel(15),
          marginTop: heightPixel(10),
        }}
      >
        <TabContent />
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate(routes.createTask);
        }}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
      <Loader isVisible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // ✅ Fix
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: heightPixel(10),
  },
  tabButton: {
    flex: 1,
    paddingVertical: heightPixel(12),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.themeColor,
  },
  tabLabel: {
    fontSize: widthPixel(14),
    color: colors.greyText,
    fontFamily: fonts.NunitoRegular,
  },
  activeTabLabel: {
    color: colors.themeColor,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: widthPixel(24),
    bottom: heightPixel(24),
    width: widthPixel(46),
    height: widthPixel(46),
    borderRadius: widthPixel(18),
    backgroundColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabPlus: {
    color: colors.white,
    fontSize: widthPixel(30),
    fontWeight: "800",
    marginTop: -2,
  },
});

export default Home;
