import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { appIcons } from "../services/utilities/assets";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import { routes } from "../services/constant";
import { fonts } from "../services/utilities/fonts";

// Menu items for the drawer
const MENU = [
  { key: "dashboard", label: "Dashboard", route: routes.home, icon: appIcons.home },
  { key: "workpack", label: "Work Pack", route: routes.workPack, icon: appIcons.workpack },
  { key: "siteMap", label: "Site Map", route: routes.siteMap, icon: appIcons.siteMap },
  { key: "siteFeedback", label: "Site Feedback", route: routes.siteFeedback, icon: appIcons.siteFeedback },
  { key: "hsLog", label: "H&S Log", route: routes.hsLog, icon: appIcons.hsLog },
  { key: "complaints", label: "Complaints", route: routes.myComplaint, icon: appIcons.complaints },
  { key: "soundChecker", label: "Sound Checker", route: routes.liveSound, icon: appIcons.soundChecker },
];

const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const activeRouteName = state.routeNames[state.index];

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scroll}
    >
      {/* Drawer Header */}
      <View style={styles.header}>
        <Image source={appIcons.drawerLogo} style={styles.logo} />
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU.map((item) => {
          const isActive = activeRouteName === item.route;
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              onPress={() => handleNavigate(item.route)}
              style={[styles.row, isActive && styles.rowActive]}
            >
              <Image
                source={item.icon}
                style={[
                  styles.icon,
                  { tintColor: isActive ? colors.themeColor : colors.grey200 },
                ]}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.themeColor : colors.grey200 },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logout}
          onPress={() => {
            // TODO: add your sign-out & navigation logic
            // navigation.reset({ index: 0, routes: [{ name: routes.auth }] });
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.label, { color: "#FF4D4F" }]}>Logout</Text>
        </TouchableOpacity>
      </View> */}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: heightPixel(50),
  },
  header: {
    alignItems: "center",
    paddingVertical: heightPixel(16),
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  logo: {
    width: widthPixel(180),
    height: widthPixel(70),
    resizeMode: "cover",
  },
  menu: {
    paddingTop: heightPixel(8),
    paddingHorizontal: widthPixel(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(10),
    borderRadius: widthPixel(10),
    marginVertical: heightPixel(4),
  },
  rowActive: {
    backgroundColor: '#F5EEFF', // highlight active
    ...Platform.select({
      ios: {
        shadowColor: '#F5EEFF',
      },
      android: { elevation: 2 },
    }),
  },
  icon: {
    width: widthPixel(22),
    height: widthPixel(22),
    marginRight: widthPixel(12),
    resizeMode: "contain",
  },
  label: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    // fontFamily : fonts.NunitoMedium,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(16),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ECECEC",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
  },
});