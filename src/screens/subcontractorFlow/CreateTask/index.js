import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreateTask = ({ navigation }) => {
  const [showPlotInput, setShowPlotInput] = useState(false);
  const [plotNumber, setPlotNumber] = useState("");
  const insets = useSafeAreaInsets();
  const handleNext = () => {
    if (showPlotInput) {
      if (!plotNumber.trim()) {
        Alert.alert("Error", "Please enter the plot number");
        return;
      }
      navigation.navigate(routes.selectTask, {
        materialLocation: {
          address: plotNumber,
          coordinates: { latitude: 40.7128, longitude: -74.006 } // Dummy
        }
      });
    } else {
      // If they didn't select plot input, maybe they want map?
      // But the UI has two distinct buttons.
      // If they click "Next" without doing anything?
      Alert.alert("Error", "Please select a location method");
    }
  };

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop: insets.top 
    }]}>
      <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Select how you want to provide the pickup location.
        </Text>

        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => navigation.navigate(routes.locationOnMap)}
        >
          <Text style={styles.optionText}>Point out Location on Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionBox, showPlotInput && styles.inputHighlight]}
          onPress={() => setShowPlotInput(!showPlotInput)}
        >
          <Text style={styles.optionText}>Enter the plot number</Text>
        </TouchableOpacity>

        {showPlotInput && (
          <View style={{ marginTop: heightPixel(10) }}>
            <AppTextInput
              label="Pickup Plot Number"
              placeholder="Enter the pickup plot number"
              value={plotNumber}
              onChangeText={setPlotNumber}
            />
          </View>
        )}

        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20) }}>
          <AppButton
            title="NEXT"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateTask;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: "#777",
    fontFamily: fonts.NunitoRegular,
    marginVertical: heightPixel(20),
  },
  optionBox: {
    backgroundColor: colors.white,
    paddingVertical: heightPixel(14),
    paddingHorizontal: widthPixel(14),
    borderRadius: widthPixel(8),
    marginBottom: heightPixel(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: '#eee'
  },
  optionText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  inputHighlight: {
    borderRadius: widthPixel(8),
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.black,
    marginBottom: heightPixel(12),
  },
});