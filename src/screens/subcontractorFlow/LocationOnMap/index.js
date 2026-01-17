import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../../../components/Loader";
import useCallApi from "../../../hooks/useCallApi";
import useSite from "../../../hooks/useSite";
import { setSelectedSite } from "../../../services/store/slices/siteSlice";
import { useDispatch } from "react-redux";

const LocationOnMap = ({ navigation }) => { 
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const { callApi } = useCallApi();
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [selectingLocation, setSelectingLocation] = useState("pickup"); // "pickup" or "dropoff"
  const { getSites } = useSite();
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const dispatch = useDispatch();



  useEffect(() => {
    fetchSites();
}, []);

const fetchSites = async () => {
    try {
        setLoading(true);
        const sitesList = await getSites();
        if (sitesList && sitesList.length > 0) {
          console.log("sitesList====>>", JSON.stringify(sitesList , null , 2));
            setSites(sitesList);
        }
    } catch (error) {
        console.log("Error fetching sites", error);
    } finally {
        setLoading(false);
    }
};

  // Default region (Lahore, Pakistan)
  const defaultRegion = {
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLoading(false);
    try {
      if (Platform.OS === "ios") {
        await Geolocation.requestAuthorization();
        getCurrentLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      }
    } catch (err) {
      console.log("Location permission error", err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      },
      (error) => {
        console.log("Location error", error);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using reverse geocoding API (you might need to use Google Geocoding API)
      // For now, we'll use a simple format
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBTfmafw67mrYUhReeF6NURJ0QIta0nNaA`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    } catch (error) {
      console.log("Geocoding error", error);
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }
  };

  const handleMapPress = async (e) => {
    // Only allow map press for dropoff location selection
    // Pickup location must be selected from site markers
    if (selectingLocation === "pickup") {
      return;
    }

    const { latitude, longitude } = e.nativeEvent.coordinate;
    const address = await getAddressFromCoordinates(latitude, longitude);

    const locationData = {
      address: address,
      coordinates: {
        latitude,
        longitude,
      },
    };

    setDropoffLocation(locationData);
  };

  const handleSiteMarkerPress = async (site) => {
    // Only allow site marker selection for pickup location
    if (selectingLocation !== "pickup") {
      return;
    }

    const { latitude, longitude } = site.location.coordinates;
    const address = site.location.address || `Site: ${site.name}`;

    const locationData = {
      address: address,
      coordinates: {
        latitude,
        longitude,
      },
    };
    setSelectedSiteId(site._id);

    setPickupLocation(locationData);
    setSelectingLocation("dropoff");
  };

  // Filter and normalize sites with valid coordinates
  // Sites with invalid coordinates (0,0 or 90,180) will be marked in Lahore
  const validSites = sites
    .filter((site) => {
      const lat = site?.location?.coordinates?.latitude;
      const lng = site?.location?.coordinates?.longitude;
      
      // Basic validation - must have coordinates
      return (
        lat !== undefined &&
        lng !== undefined &&
        lat !== null &&
        lng !== null &&
        typeof lat === "number" &&
        typeof lng === "number" &&
        !isNaN(lat) &&
        !isNaN(lng)
      );
    })
    .map((site) => {
      const lat = site?.location?.coordinates?.latitude;
      const lng = site?.location?.coordinates?.longitude;
      
      // Normalize invalid coordinates to Lahore
      const isInvalid = 
        (lat === 0 && lng === 0) || // Null island
        (lat === 90 && lng === 180); // Invalid coordinates
      
      if (isInvalid) {
        return {
          ...site,
          location: {
            ...site.location,
            coordinates: {
              latitude: defaultRegion.latitude,
              longitude: defaultRegion.longitude,
            },
            address: site.location?.address || `${site.name}, Lahore, Pakistan`,
          },
        };
      }
      
      return site;
    });

  const handleNext = () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert("Error", "Please select both pickup and dropoff locations on the map");
      return;
    }
    console.log("pickupLocation====>>", selectedSiteId);
    dispatch(setSelectedSite(selectedSiteId))

    navigation.navigate(routes.selectTask, {
      materialLocation: pickupLocation,
      dropOffLocation: dropoffLocation,
    });
  };

  const handleResetPickup = () => {
    setPickupLocation(null);
    setSelectingLocation("pickup");
  };

  const handleResetDropoff = () => {
    setDropoffLocation(null);
    if (pickupLocation) {
      setSelectingLocation("dropoff");
    } else {
      setSelectingLocation("pickup");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <SecondHeader onPress={() => navigation.goBack()} title="Select Locations" />
        <Text style={styles.subtitle}>
          {selectingLocation === "pickup" 
            ? "Tap on a site marker to select pickup location" 
            : "Tap on the map to select dropoff location"}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={ Platform.OS === "android" ? PROVIDER_GOOGLE : null}
          style={{ flex: 1 }}
          initialRegion={defaultRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          mapType="standard"
          onPress={handleMapPress}
        >
          {/* Site markers - only for pickup selection */}
          {validSites.map((site) => {
            const lat = site?.location?.coordinates?.latitude;
            const lng = site?.location?.coordinates?.longitude;
            
            if (!lat || !lng) return null;

            return (
              <Marker
                key={site._id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={site.name}
                description={site.location?.address || ""}
                pinColor="blue"
                onPress={() => handleSiteMarkerPress(site)}
              />
            );
          })}
          
          {pickupLocation && (
            <Marker
              coordinate={pickupLocation.coordinates}
              title="Pickup Location"
              description={pickupLocation.address}
              pinColor="green"
            />
          )}
          {dropoffLocation && (
            <Marker
              coordinate={dropoffLocation.coordinates}
              title="Dropoff Location"
              description={dropoffLocation.address}
              pinColor="red"
            />
          )}
        </MapView>

        {/* Location selection indicator */}
        <View style={styles.selectionIndicator}>
          <Text style={styles.selectionText}>
            {selectingLocation === "pickup"
              ? "Tap on a site marker to select Pickup Location"
              : "Tap on the map to select Dropoff Location"}
          </Text>
        </View>

        {/* Selected locations info */}
        {(pickupLocation || dropoffLocation) && (
          <View style={styles.locationsInfo}>
            {pickupLocation && (
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <TouchableOpacity onPress={handleResetPickup}>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {pickupLocation.address}
                </Text>
              </View>
            )}
            {dropoffLocation && (
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Text style={styles.locationLabel}>Dropoff</Text>
                  <TouchableOpacity onPress={handleResetDropoff}>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {dropoffLocation.address}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <AppButton
          title="NEXT"
          style={{ backgroundColor: colors.themeColor }}
          textStyle={{ color: colors.white }}
          onPress={handleNext}
          disabled={!pickupLocation || !dropoffLocation}
        />
      </View>
      <Loader isVisible={isLoading} />
    </SafeAreaView>
  );
};

export default LocationOnMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(10),
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: "#777",
    fontFamily: fonts.NunitoRegular,
    marginTop: heightPixel(10),
    marginBottom: heightPixel(10),
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  selectionIndicator: {
    position: "absolute",
    top: heightPixel(20),
    left: widthPixel(20),
    right: widthPixel(20),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
    textAlign: "center",
  },
  locationsInfo: {
    position: "absolute",
    bottom: heightPixel(100),
    left: widthPixel(20),
    right: widthPixel(20),
    gap: heightPixel(10),
  },
  locationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: widthPixel(12),
    borderRadius: widthPixel(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(6),
  },
  locationLabel: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  resetText: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: colors.themeColor,
  },
  locationAddress: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
  },
  bottom: {
    paddingHorizontal: widthPixel(20),
    paddingBottom: heightPixel(20),
  },
});