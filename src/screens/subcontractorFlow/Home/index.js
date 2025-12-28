import React, { useState } from "react";
import { View, FlatList, StatusBar, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView, ScrollView } from "react-native";
import { routes } from "../../../services/constant";
import { AppTaskCard } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant"; // Using Pixel methods
import { appIcons } from "../../../services/utilities/assets";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { fonts } from "../../../services/utilities/fonts";

const taskData = [
  {
    id: "1",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Completed",
  },
  {
    id: "2",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Pending",
  },
  {
    id: "3",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Cancelled",
  },
  {
    id: "4",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Completed",
  },
  {
    id: "5",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Pending",
  },
  {
    id: "6",
    userName: "Dummy user name",
    material1: "Sand",
    material1Qty: "1 Ton",
    material2: "Bricks",
    material2Qty: "200 unit",
    date: "12-Dec-2023",
    time: "02:30 PM",
    status: "Cancelled",
  },
];

// Tab Screen Content


const Home = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Active"); // Active, Completed, Canceled

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const TabContent = ({ status }) => (
    <FlatList
      data={taskData.filter((task) => task.status === status)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AppTaskCard
          userName={item.userName}
          status={item.status}
          material1={item.material1}
          material1Qty={item.material1Qty}
          material2={item.material2}
          material2Qty={item.material2Qty}
          date={item.date}
          time={item.time}
          onPress={() => { navigation.navigate(routes.jobDetails) }}
        />
      )}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Drawer Toggle Button */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthPixel(16) }}>
        <TouchableOpacity onPress={openDrawer} style={{ padding: heightPixel(12) }}>
          <Image source={appIcons.drawer} style={{ width: widthPixel(24), height: widthPixel(24) }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(routes.homeDetail)} style={{ padding: heightPixel(12) }}>
          <Image source={appIcons.building} style={{ width: widthPixel(24), height: widthPixel(24) }} />
        </TouchableOpacity>
      </View>

      {/* Custom Tab Navigation */}
      <View style={styles.tabs}>
        {["Active", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTab,
            ]}
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
      <View style={{ flex: 1, paddingHorizontal: widthPixel(15), marginTop: heightPixel(10) }}>
        {activeTab === "Active" && <TabContent status="Pending" />}
        {activeTab === "Completed" && <TabContent status="Completed" />}
        {activeTab == "Cancelled" && <TabContent status="Cancelled" />}
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => {
        navigation.navigate(routes.createTask)
      }}>
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
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