import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel, GOOGLE_PLACES_API_KEY } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateTask = ({ navigation }) => {
  const [showPlotInput, setShowPlotInput] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (showPlotInput) {
      if (!pickupLocation || !dropoffLocation) {
        Alert.alert("Error", "Please enter both pickup and dropoff locations");
        return;
      }
      navigation.navigate(routes.selectTask, {
        materialLocation: {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates,
        },
        dropOffLocation: {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates,
        },
      });
    } else {
      Alert.alert("Error", "Please select a location method");
    }
  };

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop: insets.top 
    }]}>
      <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: widthPixel(20), paddingBottom: heightPixel(20) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        nestedScrollEnabled={true}
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
            <Text style={styles.label}>Pickup Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Enter pickup location"
              fetchDetails={true}
              listViewDisplayed="auto"
              onPress={(data, details = null) => {
                if (details) {
                  setPickupLocation({
                    address: data.description,
                    coordinates: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                  });
                }
              }}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: "en",
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.autocompleteInput,
                listView: styles.autocompleteList,
                row: styles.autocompleteRow,
                description: styles.autocompleteDescription,
              }}
              enablePoweredByContainer={false}
              textInputProps={{
                placeholderTextColor: colors.grey300,
              }}
              keyboardShouldPersistTaps="handled"
            />

            <Text style={[styles.label, { marginTop: heightPixel(20) }]}>
              Dropoff Location
            </Text>
            <GooglePlacesAutocomplete
              placeholder="Enter dropoff location"
              fetchDetails={true}
              listViewDisplayed="auto"
              onPress={(data, details = null) => {
                if (details) {
                  setDropoffLocation({
                    address: data.description,
                    coordinates: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                  });
                }
              }}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: "en",
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.autocompleteInput,
                listView: styles.autocompleteList,
                row: styles.autocompleteRow,
                description: styles.autocompleteDescription,
              }}
              enablePoweredByContainer={false}
              textInputProps={{
                placeholderTextColor: colors.grey300,
              }}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        <View style={{ marginTop: heightPixel(30) }}>
          <AppButton
            title="NEXT"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
          />
        </View>
      </KeyboardAwareScrollView>
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
  label: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
  autocompleteContainer: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(8),
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: widthPixel(10),
    marginBottom: heightPixel(12),
  },
  autocompleteInput: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.black,
    height: heightPixel(45),
  },
  autocompleteList: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(8),
    marginTop: heightPixel(4),
    maxHeight: heightPixel(150),
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  autocompleteRow: {
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  autocompleteDescription: {
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    color: colors.black,
  },
});