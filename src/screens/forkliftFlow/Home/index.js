import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { routes } from "../../../services/constant";
import { AppHeader, AppButton, TaskCard } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";

const Home = () => {

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Pending");

  const PendingTasks = [
    {
      id: "1",
      customerName: "Alex Johnson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Pending",
    },
    {
      id: "2",
      customerName: "Jordan Smith",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Pending",
    },
    {
      id: "3",
      customerName: "Taylor Wilson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Cement", quantity: "500 kg", icon: appIcons.cement },
        { name: "Steel", quantity: "50 pieces", icon: appIcons.steel },
      ],
      date: "13-Dec-2023",
      time: "10:00 AM",
      status: "Pending",
    },
  ];

  const ActiveTasks = [
    {
      id: "1",
      customerName: "Alex Johnson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Active",
    },
    {
      id: "2",
      customerName: "Jordan Smith",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Active",
    },
    {
      id: "3",
      customerName: "Taylor Wilson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Cement", quantity: "500 kg", icon: appIcons.cement },
        { name: "Steel", quantity: "50 pieces", icon: appIcons.steel },
      ],
      date: "13-Dec-2023",
      time: "10:00 AM",
      status: "Active",
    },
  ];


  const CompleteTasks = [
    {
      id: "1",
      customerName: "Alex Johnson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Completed",
    },
    {
      id: "2",
      customerName: "Jordan Smith",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Completed",
    },
    {
      id: "3",
      customerName: "Taylor Wilson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Cement", quantity: "500 kg", icon: appIcons.cement },
        { name: "Steel", quantity: "50 pieces", icon: appIcons.steel },
      ],
      date: "13-Dec-2023",
      time: "10:00 AM",
      status: "Completed",
    },
  ];

  const CancelledTasks = [
    {
      id: "1",
      customerName: "Alex Johnson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Cancelled",
    },
    {
      id: "2",
      customerName: "Jordan Smith",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Sand", quantity: "1 Ton", icon: appIcons.sand },
        { name: "Bricks", quantity: "200 unit", icon: appIcons.bricks },
      ],
      date: "12-Dec-2023",
      time: "02:30 PM",
      status: "Cancelled",
    },
    {
      id: "3",
      customerName: "Taylor Wilson",
      customerImage: appIcons.dummyPic,
      materials: [
        { name: "Cement", quantity: "500 kg", icon: appIcons.cement },
        { name: "Steel", quantity: "50 pieces", icon: appIcons.steel },
      ],
      date: "13-Dec-2023",
      time: "10:00 AM",
      status: "Cancelled",
    },
  ];

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };


  const handleStartTask = (task) => {
    console.log("Starting task:", task);
    if (task?.status === "Pending") {
      navigation.navigate(routes.forkJobDetail)
    } else if (task?.status === "Active") {
      navigation.navigate(routes.materialPicked)
    }

    // TODO: Implement task start logic
  };

  const renderTask = ({ item }) => (
    <TaskCard task={item} 
    onStartPress={() => handleStartTask(item)} 
    onCompletePress={() => handleStartTask(item)} 
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthPixel(16) }}>
        <TouchableOpacity onPress={openDrawer} style={{ padding: heightPixel(12) }}>
          <Image source={appIcons.drawer} style={{ width: widthPixel(24), height: widthPixel(24) }} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.navigate(routes.forkHomeDetail)} style={{ padding: heightPixel(12) }}>
            <Image source={appIcons.building} style={{ width: widthPixel(24), height: widthPixel(24) }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(routes.chat)} style={{ padding: heightPixel(12) }}>
            <Image source={appIcons.blackChat} style={{ width: widthPixel(24), height: widthPixel(24) }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        {["Pending", "Active", "Completed", "Cancelled"].map((tab) => (
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
      {activeTab === "Pending" && (
        <FlatList
          data={PendingTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      )}
      {activeTab === "Active" && (
        <FlatList
          data={ActiveTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      )}
      {activeTab === "Completed" && (
        <FlatList
          data={CompleteTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      )}

      {activeTab === "Cancelled" && (
        <FlatList
          data={CancelledTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      )}


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
