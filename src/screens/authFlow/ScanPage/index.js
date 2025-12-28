import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../services/store/selectors';
import { AppHeader } from "../../../components";
import { appImages } from "../../../services/utilities/assets";
import { heightPixel, widthPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";

// Get device screen dimensions

const ScanPage = ({ navigation }) => {
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    // Simulate a loading process or any startup logic
    const timer = setTimeout(() => {
      // Navigate based on user role
      if (userRole === 'forklift') {
        // Navigate to upload license for forklift users
        navigation.replace(routes.auth, {
          screen: routes.uploadLicense,
        });
      } else {
        // Navigate to provide info for subcontractor users (previous flow)
        navigation.replace(routes.auth, {
          screen: routes.provideInfo,
        });
      }
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [userRole, navigation]);

  return (
    <ImageBackground
      source={appImages.scan}
      style={styles.cameraView}
    >
      <View style={styles.safeArea}>
        <AppHeader
          onBack={() => navigation.goBack()}
        />

      </View>

    </ImageBackground>
  );
};

export default ScanPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(60),
  },
  container: {

  },
  cameraView: {
    flex: 1,
  },

});