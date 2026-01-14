import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  StatusBar,
  FlatList,
  Text,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker } from "react-native-maps";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { colors } from "../../services/utilities/colors";
import { fonts } from "../../services/utilities/fonts";
import { widthPixel, heightPixel, fontPixel, wp } from "../../services/constant";
import { SecondHeader } from "../index";
import { Loader } from "../Loader";
import SearchBarFilter from "./SearchBarFilter";
import VenueCard from "./VenueCard";
import useCallApi from "../../hooks/useCallApi";
import { appIcons } from "../../services/utilities/assets";

interface Venue {
  id: string | number;
  name: string;
  location?: string;
  latitude?: string | number;
  longitude?: string | number;
  image?: string;
  is_favourite?: number;
}

interface MapVenueProps {
  onVenueSelect?: (venue: Venue) => void;
  filters?: {
    categories?: any[];
    price?: number;
  };
}

const MapVenue: React.FC<MapVenueProps> = ({ onVenueSelect, filters }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { callApi } = useCallApi();

  const [pickLocation, setPickLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState("");
  const [venueData, setVenues] = useState<Venue[]>([]);

  // Local state for filters instead of Redux
  const [localFilters, setLocalFilters] = useState(filters || {});

  useEffect(() => {
    if (isFocused) {
      requestLocationPermission();
    }
  }, [isFocused]);

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleNavigation = () => {
    // Navigate to filter screen if needed
    // navigation.navigate("Filter");
  };

  const getQueryParams = () => {
    let payload: any = {};

    if (localFilters?.categories && localFilters.categories.length > 0) {
      payload = {
        workout_types:
          localFilters.categories
            .map((item: any, index: number) => (index === 1 ? 102 : item))
            .join(", ") || null,
        max_price: localFilters.price,
        search: search,
        lat: currentLocation?.latitude || null,
        lng: currentLocation?.longitude || null,
        page: 1,
        limit: 100,
      };
    } else {
      payload = {
        max_price: localFilters?.price,
        search: search,
        lat: currentLocation?.latitude || null,
        lng: currentLocation?.longitude || null,
        page: 1,
        limit: 100,
      };
    }

    // Remove null/undefined/empty values
    for (let key in payload) {
      if (
        payload[key] === null ||
        payload[key] === undefined ||
        payload[key] === "" ||
        (Array.isArray(payload[key]) && payload[key].length === 0)
      ) {
        delete payload[key];
      }
    }

    return payload;
  };

  const fetchVenues = useCallback(async () => {
    try {
      setVenues([]);
      const response = await callApi("venuesList", "GET", {}, getQueryParams());

      if (response?.success && response?.data?.records) {
        setVenues(response.data.records);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  }, [search, currentLocation, localFilters, callApi]);

  useEffect(() => {
    if (currentLocation) {
      fetchVenues();
    }
  }, [search, currentLocation, fetchVenues]);

  const requestLocationPermission = async () => {
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
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setPickLocation({ latitude, longitude });
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleMarkerDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPickLocation({ latitude, longitude });
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleVenuePress = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      {isLoading ? (
        <Loader isVisible={isLoading} />
      ) : (
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={{ width: "95%", alignSelf: "center", backgroundColor: "white" }}>
            <SecondHeader title={"Explore    "} onPress={() => navigation.goBack()} />
            {/* Search Bar */}
            <View style={styles.searchCon}>
              <SearchBarFilter
                value={search}
                leftIcon={
                  <Image
                    source={appIcons.gallery}
                    style={{
                      width: heightPixel(15),
                      height: heightPixel(15),
                      tintColor: "#A0A0A0",
                    }}
                  />
                }
                icon={
                  <Image
                    source={appIcons.settings}
                    style={{
                      width: heightPixel(20),
                      height: heightPixel(20),
                      resizeMode: "contain",
                    }}
                  />
                }
                onRightIconClick={handleNavigation}
                onChangeText={setSearch}
              />
            </View>
          </View>

          {/* Map */}
          <View style={styles.wrapper}>
            {currentLocation && (
              <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                {venueData
                  ?.filter(
                    (venue) => venue.latitude && venue.longitude // only valid coords
                  )
                  .map((venue) => (
                    <Marker
                      key={venue.id}
                      coordinate={{
                        latitude: parseFloat(String(venue.latitude)),
                        longitude: parseFloat(String(venue.longitude)),
                      }}
                      title={venue.name}
                      description={venue.location}
                      onPress={() => handleVenuePress(venue)}
                    >
                      {venue.image ? (
                        <Image
                          source={{ uri: venue.image }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.themeColor,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: colors.white, fontSize: 12 }}>
                            {venue.name?.charAt(0) || "V"}
                          </Text>
                        </View>
                      )}
                    </Marker>
                  ))}
              </MapView>
            )}
          </View>

          {/* Bottom Sheet - Simple ScrollView implementation */}
          <View style={styles.bottomSheet}>
            <View style={styles.dragThumbContainer}>
              <View style={styles.dragThumb} />
            </View>
            <Text style={styles.resultsText}>
              {search?.length < 1 ? "Total " : null}
              {venueData?.length} {venueData?.length !== 1 ? "Results" : "Result"}
              {search && ` for "${search}"`}
            </Text>
            <FlatList
              data={venueData}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: widthPixel(12),
                marginTop: heightPixel(10),
              }}
              renderItem={({ item }) => (
                <VenueCard
                  item={item}
                  imageUrl={item.image}
                  name={item.name}
                  id={item.id}
                  initialIsFavourite={item?.is_favourite === 1}
                  onPress={() => handleVenuePress(item)}
                />
              )}
            />
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {
    flex: 1,
  },
  searchCon: {
    marginVertical: heightPixel(15),
    width: wp(95),
    alignSelf: "center",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "38%",
    backgroundColor: "#fff",
    borderTopLeftRadius: widthPixel(20),
    borderTopRightRadius: widthPixel(20),
    paddingTop: heightPixel(10),
  },
  dragThumbContainer: {
    alignItems: "center",
    paddingBottom: heightPixel(10),
    paddingTop: heightPixel(5),
  },
  dragThumb: {
    width: widthPixel(120),
    height: heightPixel(5),
    borderRadius: heightPixel(2),
    backgroundColor: "#DADADA",
  },
  resultsText: {
    textAlign: "center",
    fontFamily: fonts.NunitoMedium,
    fontSize: fontPixel(16),
    color: "#15161E",
    marginBottom: heightPixel(10),
  },
});

export default MapVenue;
