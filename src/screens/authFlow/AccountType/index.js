import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch } from 'react-redux';
import { setUserRole, setSelectedAccountType } from '../../../services/store/slices/userSlice';
import { AppHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { appIcons } from "../../../services/utilities/assets";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";

const accountTypes = [
  {
    id: 1,
    title: "Join as Subcontractor",
    description: "Vestibulum sodales pulvinar accumsan. Praese rhoncus neque",
    icon: appIcons.contractor,
    role: "subcontractor",
  },
  {
    id: 2,
    title: "Join as Forklift",
    description: "Vestibulum sodales pulvinar accumsan. Praese rhoncus neque",
    icon: appIcons.forkLift,
    role: "forklift",
  },
];

const AccountType = ({ navigation }) => {
  const [selected, setSelected] = useState(1);
  const dispatch = useDispatch();

  const handleConfirm = () => {
    // Find the selected account type
    const selectedAccountType = accountTypes.find(type => type.id === selected);

    if (selectedAccountType) {
      // Save the selected role to Redux store
      dispatch(setUserRole(selectedAccountType.role));
      dispatch(setSelectedAccountType(selectedAccountType));

      console.log("Selected Account Type:", selectedAccountType.role);

      // Navigate based on selected role
      if (selectedAccountType.role === 'subcontractor') {
        // Navigate to subcontractor flow
        navigation.navigate(routes.auth, { screen: routes.createProfile });
      } else if (selectedAccountType.role === 'forklift') {
        // Navigate to forklift flow (you can create this later)
        navigation.navigate(routes.auth, { screen: routes.createProfile });
        // TODO: Create forklift-specific flow if needed
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.container}>
        <AppHeader
          title="Select Your Account Type"
          subtitle="Please select one of the following account types to proceed."
        // onBack={() => navigation.goBack()}
        />

        {/* Account Cards */}
        <View style={styles.cardList}>
          {accountTypes.map((item) => {
            const isSelected = selected === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelected(item.id)}
                activeOpacity={0.8}
              >
                <Image source={item.icon} style={styles.icon} />
                <View style={styles.cardText}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isSelected && { color: colors.white },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      isSelected && { color: colors.white },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer Button */}


      </View>
      <View style={styles.footer}>
        <AppButton
          title="CONFIRM"
          onPress={handleConfirm}
          style={{ backgroundColor: colors.themeColor }}
          textStyle={{ color: colors.white }}
        />
      </View>

    </SafeAreaView>
  );
};

export default AccountType;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: heightPixel(20),
    paddingTop: heightPixel(20),
  },
  cardList: {
    flex: 1,
    marginTop: widthPixel(20),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: heightPixel(15),
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: colors.themeColor,
  },
  icon: {
    width: heightPixel(40),
    height: heightPixel(40),
    marginRight: 12,
    resizeMode: "contain",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontPixel(16),
    fontWeight: "600",
    color: colors.black,
  },
  cardDescription: {
    fontSize: fontPixel(14),
    color: "#666",
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: heightPixel(20),
    paddingBottom: heightPixel(20)
  },
});
