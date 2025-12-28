import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";

const CreateTask = ({ navigation }) => {
  const [showPlotInput, setShowPlotInput] = useState(false);
  const [plotNumber, setPlotNumber] = useState("");
  const [pickupPlot, setPickupPlot] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
        </Text>

        {/* Task Type */}
        <Text style={styles.label}>Select Task Type</Text>

        {/* Option 1 - Navigate */}
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => navigation.navigate(routes.locationOnMap)}
        >
          <Text style={styles.optionText}>Point out Location on Map</Text>
        </TouchableOpacity>

        {/* Option 2 - Toggle Input */}
        <TouchableOpacity
          style={[styles.optionBox, styles.inputHighlight]}
          onPress={() => setShowPlotInput(!showPlotInput)}
        >
          <Text style={styles.optionText}>Enter the plot number</Text>
        </TouchableOpacity>

        {/* Input field only if selected */}
        {showPlotInput && (
          <><Text style={[styles.label, { marginTop: heightPixel(20) }]}>
            Pickup Plot Number
          </Text><AppTextInput
              label="Pickup Plot Number"
              placeholder="Enter the pickup plot number"
              value={pickupPlot}
              onChangeText={setPickupPlot}
              containerStyle={{ marginTop: heightPixel(10) }} /></>
        )}

        {/* Pickup Plot Number */}


        {/* Bottom Button */}
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20) }}>
          <AppButton
            title="NEXT"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={() => {
              if (showPlotInput && !plotNumber) {
                alert("Please enter the plot number!");
                return;
              }
              navigation.navigate("NextScreen");
            }}
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
    marginVertical: heightPixel(10),
  },
  label: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
  optionBox: {
    backgroundColor: colors.white,
    paddingVertical: heightPixel(14),
    paddingHorizontal: widthPixel(14),
    borderRadius: widthPixel(8),
    marginBottom: heightPixel(12),
    // borderWidth: 1,
    // borderColor: "#DDD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  optionText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  inputHighlight: {
    backgroundColor: "#EAE2F8", // light purple background
  },
  inputBox: {
    backgroundColor: "#F2F2F4",
    paddingVertical: heightPixel(14),
    paddingHorizontal: widthPixel(14),
    borderRadius: widthPixel(8),
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.black,
    marginBottom: heightPixel(12),
  },
});