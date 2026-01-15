import React, { useState, useCallback, useEffect } from "react";
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
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from "@react-navigation/native";
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
import { useAppSelector } from "../../../services/store/hooks";
import useUsers from "../../../hooks/useUsers";

const Home = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Pending");
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.user);
  const {
    tasks,
    loading,
    refreshing,
    loadMore,
    onRefresh,
    loadingMore,
    fetchTasks,
    updateTaskStatus,
  } = useTasks();
  const { getLoggedInUser } = useUsers();
  useEffect(() => {
    getLoggedInUser();
  }, []);
  // Check for missing license details
  const isLicenseIncomplete =
    !user?.driverInfo?.drivingLicenseNumber ||
    !user?.driverInfo?.drivingLicenseExpiryDate ||
    !user?.driverInfo?.drivingLicenseImage;

  // Check for missing vehicle details
  const isVehicleIncomplete =
    !user?.vehicleInfo?.vehiclePlateNumber ||
    !user?.vehicleInfo?.registrationNumber;

  // Check for missing registration card
  const isRegistrationCardMissing = !user?.vehicleInfo?.registrationCardImage;

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Fetch tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks(1);
    }, [])
  );

  const handleStartTask = async (task) => {
    await updateTaskStatus(task._id, "started");
    await fetchTasks(1);

    // Navigate based on status or ID
    // navigation.navigate(routes.forkJobDetail, { task })
    // For now logging
    console.log("Start task", task);
  };

  const handleCompleteTask = async (task) => {
    await updateTaskStatus(task._id, "completed");
    await fetchTasks(1);

    // Navigate based on status or ID
    // navigation.navigate(routes.forkJobDetail, { task })
    // For now logging
    console.log("Complete task", task);
  };

  const getFilteredTasks = () => {
    // Filter logic
    return tasks.filter((task) => {
      const status = task.status?.toLowerCase(); // pending, active, completed, cancelled, in_progress
      if (activeTab === "Pending") return status === "pending";
      if (activeTab === "Active")
        return (
          status === "active" ||
          status === "in_progress" ||
          status === "started"
        );
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
        icon: i?.icon || i?.image, // Default icon?
      })) || [];

    return (
      <TaskCard
        key={item?._id}
        task={{
          ...item,
          title: item.title,
          customerName: item.assignedTo?.name,
          customerImage: item.assignedTo?.image,
          materials: materials,
          date: formateDate(item.createdAt || item.date, "DD-MMM-YYYY"),
          time: formateDate(item.createdAt || item.date, "hh:mm A"),
          status: item.status, // Or map specific string if needed
        }}
        onStartPress={() => handleStartTask(item)}
        onCompletePress={() => handleCompleteTask(item)}
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

      {/* Missing License Details Ribbon */}
      {isLicenseIncomplete && (
        <TouchableOpacity
          style={styles.ribbon}
          onPress={() => {
            navigation.navigate(routes.auth, { screen: routes.uploadLicense });
          }}
        >
          <View style={styles.ribbonContent}>
            <Text style={styles.ribbonText}>
              ⚠️ Please complete your driving license details
            </Text>
            <Text style={styles.ribbonAction}>Tap to complete →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Missing Vehicle Details Ribbon */}
      {!isLicenseIncomplete && isVehicleIncomplete && (
        <TouchableOpacity
          style={styles.ribbon}
          onPress={() => {
            navigation.navigate(routes.auth, {
              screen: routes.tellAboutVehicle,
            });
          }}
        >
          <View style={styles.ribbonContent}>
            <Text style={styles.ribbonText}>
              ⚠️ Please complete your vehicle information
            </Text>
            <Text style={styles.ribbonAction}>Tap to complete →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Missing Registration Card Ribbon */}
      {!isLicenseIncomplete &&
        !isVehicleIncomplete &&
        isRegistrationCardMissing && (
          <TouchableOpacity
            style={styles.ribbon}
            onPress={() => {
              navigation.navigate(routes.auth, {
                screen: routes.scanVehicleRegistration,
              });
            }}
          >
            <View style={styles.ribbonContent}>
              <Text style={styles.ribbonText}>
                ⚠️ Please upload your vehicle registration card
              </Text>
              <Text style={styles.ribbonAction}>Tap to complete →</Text>
            </View>
          </TouchableOpacity>
        )}

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
        keyExtractor={(item) =>
          item?._id || item?.id || `task-${Math.random()}`
        }
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
  ribbon: {
    backgroundColor: "#FFF3CD",
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
    marginHorizontal: widthPixel(16),
    marginTop: heightPixel(10),
    marginBottom: heightPixel(5),
    borderRadius: widthPixel(8),
    padding: widthPixel(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ribbonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ribbonText: {
    flex: 1,
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoSemiBold,
    color: "#856404",
  },
  ribbonAction: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
    marginLeft: widthPixel(8),
  },
});
