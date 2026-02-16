import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Pressable,
  StatusBar,
} from "react-native";

import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../../../components/Loader";

import { useSelector } from "react-redux";
import ViewShot from "react-native-view-shot";

const LocationOnMap = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { selectedSite } = useSelector((state) => state.site);

  const [pickupLocation, setPickupLocation] = useState(null); // { x, y }
  const [dropoffLocation, setDropoffLocation] = useState(null); // { x, y }
  const [selectingLocation, setSelectingLocation] = useState("pickup");
  const [isLoading, setLoading] = useState(false);

  const viewShotRef = useRef(null);

  const isPickupStep = selectingLocation === "pickup";

  // ✅ Tap on image
  const handleTapOnImage = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    if (isPickupStep) {
      setPickupLocation({ x: locationX, y: locationY });
      setSelectingLocation("dropoff");
    } else {
      setDropoffLocation({ x: locationX, y: locationY });
    }
  };

  const handleResetAll = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectingLocation("pickup");
  };

  const handleResetDropoff = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectingLocation("pickup");
  };

  const captureMarkedImage = async () => {
    if (!viewShotRef.current) return null;

    const uri = await viewShotRef.current.capture?.({
      format: "png",
      quality: 1,
    });

    return uri;
  };

  const handleNext = async () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert("Error", "Please select both pickup and dropoff locations");
      return;
    }

    try {
      setLoading(true);

      const markedImageUri = await captureMarkedImage();

      if (!markedImageUri) {
        Alert.alert("Error", "Failed to generate marked image");
        return;
      }

      const file = {
        uri: markedImageUri,
        type: "image/png",
        name: "marked-map.png",
      };

      navigation.navigate(routes.selectTask, {
        pickupLocation,
        dropoffLocation,
        markedImageUri,
        markedImageUrl: file,
      });
    } catch (err) {
      console.log("NEXT error", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={[{ paddingTop: insets.top, flex: 1 }]}>
        {/* Header */}
        <View style={styles.header}>
          <SecondHeader
            onPress={() => navigation.goBack()}
            title="Select Locations"
          />
        </View>

        {/* Step Card */}
        <View style={styles.stepCard}>
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, isPickupStep && styles.stepDotActive]} />
            <Text style={[styles.stepText, isPickupStep && styles.stepTextActive]}>
              Pickup
            </Text>

            <View style={styles.stepLine} />

            <View style={[styles.stepDot, !isPickupStep && styles.stepDotActive]} />
            <Text style={[styles.stepText, !isPickupStep && styles.stepTextActive]}>
              Dropoff
            </Text>
          </View>

          <Text style={styles.stepHint}>
            {isPickupStep
              ? "Tap on site map to select Pickup point"
              : "Tap on site map to select Dropoff point"}
          </Text>
        </View>

        {/* Map Image */}
        <ViewShot ref={viewShotRef} style={styles.mapContainer}>
          <Pressable style={styles.imageWrapper} onPress={handleTapOnImage}>
            <Image
              source={{ uri: selectedSite?.siteMap }}
              style={styles.mapImage}
            />

            {/* Pickup Marker */}
            {pickupLocation ? (
              <View
                style={[
                  styles.pin,
                  { left: pickupLocation.x - 16, top: pickupLocation.y - 38 },
                ]}
              >
                <View style={[styles.pinCircle, { backgroundColor: "#22c55e" }]}>
                  <Text style={styles.pinText}>P</Text>
                </View>
                <View style={[styles.pinTail, { backgroundColor: "#22c55e" }]} />
              </View>
            ) : null}

            {/* Dropoff Marker */}
            {dropoffLocation ? (
              <View
                style={[
                  styles.pin,
                  { left: dropoffLocation.x - 16, top: dropoffLocation.y - 38 },
                ]}
              >
                <View style={[styles.pinCircle, { backgroundColor: "#ef4444" }]}>
                  <Text style={styles.pinText}>D</Text>
                </View>
                <View style={[styles.pinTail, { backgroundColor: "#ef4444" }]} />
              </View>
            ) : null}
          </Pressable>
        </ViewShot>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleResetAll}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>

            {pickupLocation && !dropoffLocation ? (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetDropoff}
              >
                <Text style={styles.resetText}>Reset PickUp</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>

          <AppButton
            title="NEXT"
            style={[
              styles.nextBtn,
              { backgroundColor: colors.themeColor },
            ]}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
            disabled={!pickupLocation || !dropoffLocation}
          />
        </View>

        <Loader isVisible={isLoading} />
      </SafeAreaView>
    </View>
  );
};

export default LocationOnMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // ✅ Fix
    // backgroundColor: "#F7F7F7",
  },

  header: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(10),
    backgroundColor: colors.white,
  },

  stepCard: {
    marginHorizontal: widthPixel(16),
    marginTop: heightPixel(12),
    padding: widthPixel(14),
    borderRadius: widthPixel(14),
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d1d5db",
  },

  stepDotActive: {
    backgroundColor: colors.themeColor,
  },

  stepText: {
    marginLeft: 8,
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoSemiBold,
    color: "#9ca3af",
  },

  stepTextActive: {
    color: colors.black,
  },

  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
  },

  stepHint: {
    marginTop: heightPixel(10),
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: "#6b7280",
  },

  mapContainer: {
    // flex: 1,

    height: heightPixel(500),
    width: '93%',
    marginTop: heightPixel(10),
    marginHorizontal: widthPixel(16),
    borderRadius: widthPixel(16),
    overflow: "hidden",
    backgroundColor: "#fff",
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    backgroundColor: 'pink',
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  imageWrapper: {
    flex: 1,
    position: "relative",
  },

  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    backgroundColor: "#fff",
  },

  // Pin Marker
  pin: {
    position: "absolute",
    width: 32,
    alignItems: "center",
  },

  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },

  pinText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  pinTail: {
    width: 10,
    height: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -2,
  },

  bottomSheet: {
    backgroundColor: '#fff',
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(14),
    paddingBottom: heightPixel(18),
    borderTopLeftRadius: widthPixel(18),
    borderTopRightRadius: widthPixel(18),
    // shadowColor: "#000",

    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: -4 },
    // elevation: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: heightPixel(12),
  },

  resetBtn: {
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(12),
    borderRadius: widthPixel(10),
    backgroundColor: "#f3f4f6",
  },

  resetText: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
  },

  nextBtn: {
    borderRadius: widthPixel(14),
  },
});
