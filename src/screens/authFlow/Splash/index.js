import React , {useEffect} from "react";
import { View, Image, Text } from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import styles from "./styles";
import { routes } from "../../../services/constant";

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(routes.auth, {
        screen: routes.onBoard,
      });
      // navigation.navigate(routes.restaurantHome, {
      //   screen: routes.RestaurantHomePage,
      // });
    }, 2000);
  }, []);
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

  )
}

export default Splash