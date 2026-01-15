import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import styles from "./styles";
import useNavigateUser from "../../../hooks/useNavigateUser";

const Splash = ({ navigation }) => {
  const navigateUser = useNavigateUser({ withDelay: true, delayMs: 2000 });

  useEffect(() => {
    navigateUser();
  }, [navigateUser]);

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
