import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { AppHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { appIcons } from "../../../services/utilities/assets";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { selectUserRole } from '../../../services/store/selectors';
import { useSelector } from 'react-redux';

const ProfileVerified = ({ navigation }) => {
  const userRole = useSelector(selectUserRole);


  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate based on user role
      if (userRole === 'forklift') {
        // Navigate to forklift flow
        navigation.replace(routes.forkliftFlow);
      } else {
        // Navigate to subcontractor flow
        navigation.replace(routes.subcontractorFlow);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [userRole, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <AppHeader
          title="Congratulations your profile is Verified"
          subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
        />

        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Image
            // Replace with your final asset for the “verified” illustration
            source={appIcons.profileVerifiedIllustration || appIcons.dummyProfile}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Spacer to keep bottom breathing room like the mock */}
        <View style={styles.bottomSpace} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileVerified;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    backgroundColor: colors.white,
    paddingTop: heightPixel(20),
  },
  illustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightPixel(28),
  },
  illustration: {
    width: widthPixel(300),
    height: heightPixel(340),
  },
  bottomSpace: {
    height: heightPixel(20),
  },
});
