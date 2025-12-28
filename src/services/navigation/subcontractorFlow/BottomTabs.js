import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { routes } from "../../constant";
import * as Subcontractor from "../../../screens/subcontractorFlow";
import { appIcons } from "../../utilities/assets";
import { colors } from "../../utilities/colors";

const Tab = createBottomTabNavigator();

const TabIcon = ({ source, color }) => (
  <Image source={source} style={[styles.icon, { tintColor: color }]} />
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={routes.home}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.themeColor,
        tabBarInactiveTintColor: '#AEAEB2',
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 7,
        },
      }}
    >
      <Tab.Screen
        name={routes.home}
        component={Subcontractor.Home}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon source={appIcons.home} color={color} />,
        }}
      />

      <Tab.Screen
        name={routes.inventory}
        component={Subcontractor.Inventory}
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => <TabIcon source={appIcons.inventory} color={color} />,
        }}
      />

      <Tab.Screen
        name={routes.chat}
        component={Subcontractor.Chat}
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <TabIcon source={appIcons.chat} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
});
