import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { AppHeader, TaskCard } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";

const Tasks = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Pending");

  const tabs = ["Pending", "Active", "Completed", "Canceled"];

  const tasks = [
    {
      id: "1",
      customerName: "Alex Johnson",
      customerImage: appIcons.dummyProfile,
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
      customerImage: appIcons.dummyProfile,
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
      customerImage: appIcons.dummyProfile,
      materials: [
        { name: "Cement", quantity: "500 kg", icon: appIcons.cement },
        { name: "Steel", quantity: "50 pieces", icon: appIcons.steel },
      ],
      date: "13-Dec-2023",
      time: "10:00 AM",
      status: "Pending",
    },
  ];

  const handleStartTask = (task) => {
    console.log("Starting task:", task.customerName);
    // TODO: Implement task start logic
  };

  const renderTask = ({ item }) => (
    <TaskCard task={item} onStartPress={() => handleStartTask(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Tasks" />
      
      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      </View>
    </SafeAreaView>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(10),
  },
  tab: {
    flex: 1,
    paddingVertical: heightPixel(15),
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.themeColor,
  },
  tabText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
  },
  activeTabText: {
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  taskList: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(20),
    paddingBottom: heightPixel(20),
  },
});
