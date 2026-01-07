import React, { useEffect } from "react";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appIcons } from "../../../services/utilities/assets";
import styles from "./styles";
import { routes } from "../../../services/constant";
import { useSelector, useDispatch } from "react-redux";
import { setUserData, setAuthenticated, setUserRole } from "../../../services/store/slices/userSlice";

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {

    const checkAuthAndNavigate = async () => {
      try {
        // Check if token exists in AsyncStorage
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");

        // Wait for splash screen to show (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (token) {
          // let userData = null;
          if (userStr) {
            userData = JSON.parse(userStr);
            dispatch(setUserData(userData));
            dispatch(setAuthenticated(true));
            if (userData?.role) {
              dispatch(setUserRole(userData?.role));
            }
          }
console.log("user", {
  userStr,
  user
});

          // // Navigate based on role (prefer userData from storage, fall back to Redux user if any)
          const role =  userData?.role;

          if (role === 'forklift') {
            navigation.replace(routes.forkliftFlow);
          } else {
            navigation.replace(routes.subcontractorFlow);
          }
        } else {
          // No token, navigate to onboarding
          navigation.navigate(routes.auth, {
            screen: routes.onBoard,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Fallback to onboarding on error
        navigation.navigate(routes.auth, {
          screen: routes.onBoard,
        });
      }
    };

    checkAuthAndNavigate();
  }, [navigation, dispatch]);

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