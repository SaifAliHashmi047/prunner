import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { routes } from "../../../services/constant";
import { AppHeader, AppButton, TaskCard } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { Loader } from "../../../components/Loader";
import useTasks from "../../../hooks/useTasks";
import { formateDate } from "../../../services/utilities/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Pending");
  const insets = useSafeAreaInsets();
  const {
    tasks,
    loading,
    refreshing,
    loadMore,
    onRefresh,
    loadingMore,
    fetchTasks,
    updateTaskStatus
  } = useTasks();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Fetch tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks(1);
    }, [fetchTasks])
  );

  const handleStartTask = async(task) => {
    await updateTaskStatus(task._id, "started");
    // Navigate based on status or ID
    // navigation.navigate(routes.forkJobDetail, { task })
    // For now logging
    console.log("Start task", task);
  };

  const getFilteredTasks = () => {
    // Filter logic
    return tasks.filter((task) => {
      const status = task.status?.toLowerCase(); // pending, active, completed, cancelled, in_progress
      if (activeTab === "Pending") return status === "pending";
      if (activeTab === "Active")
        return status === "active" || status === "in_progress";
      if (activeTab === "Completed") return status === "completed";
      if (activeTab === "Cancelled") return status === "cancelled";
      return false;
    });
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size="small"
        color={colors.themeColor}
      />
    );
  };

  const renderTask = ({ item }) => {
    // Adapter for TaskCard
    const materials =
      item.inventory?.map((i) => ({
        name: i.item,
        quantity: `${i.quantity} ${i.unit || ""}`,
        icon: appIcons.sand, // Default icon?
      })) || [];

    return (
      <TaskCard
        task={{
          ...item,
          title: item.title,
          customerName: item.assignedTo?.name  ,
          customerImage: item.assignedTo?.image , 
          materials: materials,
          date: formateDate(item.createdAt || item.date, "DD-MMM-YYYY"),
          time: formateDate(item.createdAt || item.date, "hh:mm A"),
          status: item.status, // Or map specific string if needed
        }}
        onStartPress={() => handleStartTask(item)}
        onCompletePress={() => handleStartTask(item)}
      />
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
          marginTop: heightPixel(50),
        }}
      >
        <Text
          style={{
            fontSize: fontPixel(16),
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
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
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.forkHomeDetail)}
            style={{ padding: heightPixel(12) }}
          >
            <Image
              source={appIcons.building}
              style={{ width: widthPixel(24), height: widthPixel(24) }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.chat)}
            style={{ padding: heightPixel(12) }}
          >
            <Image
              source={appIcons.blackChat}
              style={{ width: widthPixel(24), height: widthPixel(24) }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        {["Pending", "Active", "Completed", "Cancelled"].map((tab) => (
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

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item?._id || item?.id || `task-${Math.random()}`}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskList}
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
      />

      <Loader isVisible={loading} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
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
    borderBottomWidth: 2,
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

  taskList: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(20),
    paddingBottom: heightPixel(20),
  },
});
