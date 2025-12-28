import React , {useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { selectUserRole } from '../../../services/store/selectors';
import { useSelector } from 'react-redux';

const ProfileCreated = ({ navigation }) => {
    const userRole = useSelector(selectUserRole);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace(routes.auth , { screen: routes.scanQr });
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [])
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Profile Created</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          elementum dictum augue.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileCreated;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.themeColor, 
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: widthPixel(20),
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "bold",
    color: colors.white,
    marginBottom: heightPixel(10),
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: colors.white,
    textAlign: "center",
    lineHeight: heightPixel(20),
  },
});
