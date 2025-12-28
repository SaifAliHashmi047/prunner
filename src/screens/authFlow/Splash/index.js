import React, { useEffect } from "react";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appIcons } from "../../../services/utilities/assets";
import styles from "./styles";
import { routes } from "../../../services/constant";

const Splash = ({ navigation }) => {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Check if token exists in AsyncStorage
        const token = await AsyncStorage.getItem("Token");
        
        // Wait for splash screen to show (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (token) {
          // Token exists, navigate to main flow (subcontractor flow)
          // You can also verify token validity here if needed
          navigation.replace(routes.subcontractorFlow);
        } else {
          // No token, navigate to onboarding
          navigation.navigate(routes.auth, {
            screen: routes.onBoard,
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // On error, navigate to onboarding
        navigation.navigate(routes.auth, {
          screen: routes.onBoard,
        });
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={appIcons.logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default Splash;