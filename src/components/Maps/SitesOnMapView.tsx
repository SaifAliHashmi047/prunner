import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
} from "react-native";

import MapView, {   Marker, MarkerAnimated, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { colors } from "../../services/utilities/colors";
import { fonts } from "../../services/utilities/fonts";
import {
  widthPixel,
  heightPixel,
  fontPixel,
  wp,
} from "../../services/constant";
import { Loader } from "../Loader";
import useSite from "../../hooks/useSite";
import { appIcons } from "../../services/utilities/assets";

interface Site {
  _id: string;
  name: string;
  location?: {
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status?: string;
}

interface LocationOnMapProps {
  onSiteSelect?: (site: Site) => void;
}
// Hardcoded sites for testing - 3 distinct markers in Lahore area
const sites = [
  {
    _id: "1",
    name: "Site 1",
    location: {
      address: "Lahore Site 1",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587,
      },
    },
  },
  {
    _id: "2",
    name: "Site 2",
    location: {
      address: "Lahore Site 2",
      coordinates: {
        latitude: 31.5304,
        longitude: 74.3687,
      },
    },
  },
  {
    _id: "3",
    name: "Site 3",
    location: {
      address: "Lahore Site 3",
      coordinates: {
        latitude: 31.5104,
        longitude: 74.3487,
      },
    },
  },
];
const SitesOnMapView: React.FC<LocationOnMapProps> = ({ onSiteSelect }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const {
    // sites,
    loading: sitesLoading,
    fetchSites,
  } = useSite();

  useEffect(() => {
    fetchSites(1);
  }, []);

  // Update loading state when sites are available
  useEffect(() => {
    // Since we're using hardcoded sites, we can show the map immediately
    // But still wait a bit for any async operations
    if (!sitesLoading) {
      setLoading(false);
      // Try to get location in background (non-blocking)
      if (isFocused) {
        setTimeout(() => {
          requestLocationPermission();
        }, 100);
      }
    }
  }, [sitesLoading, isFocused]);

  // Filter sites with valid coordinates
  const validSites = useMemo(() => {
    if (!sites || sites.length === 0) {
      console.log("[SitesOnMapView] No sites available");
      return [];
    }
    const filtered = sites.filter(
      (site: Site) => {
        const lat = site?.location?.coordinates?.latitude;
        const lng = site?.location?.coordinates?.longitude;
        const isValid =
          lat !== undefined &&
          lng !== undefined &&
          lat !== null &&
          lng !== null &&
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat !== 0 &&
          lng !== 0;
        if (!isValid) {
          console.warn(`[SitesOnMapView] Invalid site coordinates:`, site);
        }
        return isValid;
      }
    );
    console.log("[SitesOnMapView] Valid sites count:", filtered.length, "out of", sites.length);
    console.log("[SitesOnMapView] Valid sites:", filtered.map(s => ({ id: s._id, name: s.name, lat: s.location?.coordinates?.latitude, lng: s.location?.coordinates?.longitude })));
    return filtered;
  }, [sites]);

  // Default to Lahore, Pakistan coordinates
  const LAHORE_DEFAULT = {
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // Calculate region to fit all sites (plots view)
  const mapRegion = useMemo((): Region => {
    if (validSites.length === 0) {
      // If no valid sites, use first site from sites array or Lahore default
      if (sites && Array.isArray(sites) && sites.length > 0) {
        const firstSite = sites[0] as Site;
        if (firstSite?.location?.coordinates) {
          return {
            latitude: firstSite.location.coordinates.latitude,
            longitude: firstSite.location.coordinates.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          };
        }
      }
      // Default to Lahore, Pakistan
      return LAHORE_DEFAULT;
    }

    // Calculate bounds to fit all sites
    const latitudes = validSites.map(
      (site: Site) => site.location!.coordinates!.latitude
    );
    const longitudes = validSites.map(
      (site: Site) => site.location!.coordinates!.longitude
    );

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = maxLat - minLat;
    const lngDelta = maxLng - minLng;

    // Add padding (20% on each side)
    const padding = 0.2;
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta * (1 + padding * 2), 0.01),
      longitudeDelta: Math.max(lngDelta * (1 + padding * 2), 0.01),
    };
  }, [validSites, currentLocation]);

  const requestLocationPermission = async () => {
    // Optionally try to get location in background (non-blocking)
    // But don't wait for it or show errors
    try {
      if (Platform.OS === "ios") {
        await Geolocation.requestAuthorization();
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
      // Try to get location in background, but don't wait or block
      getCurrentLocation();
    } catch {
      // Silently ignore all permission errors - we don't need location
      // Map will use default region
    }
  };

  const getCurrentLocation = () => {
    // Try to get location silently in background
    // Don't show errors or block anything
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      () => {
        // Silently ignore all location errors (timeout, permission denied, etc.)
        // Map will use default region which is already set
      },
      {
        enableHighAccuracy: false,
        timeout: 5000, // Short timeout
        maximumAge: 300000,
      }
    );
  };

  const handleMarkerPress = (site: Site) => {
    if (onSiteSelect) {
      onSiteSelect(site);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle={"dark-content"} />
      {isLoading || sitesLoading ? (
        <Loader isVisible={isLoading || sitesLoading} />
      ) : (
  

 
        <View style={styles.wrapper}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={mapRegion}
            loadingEnabled={true}
            loadingIndicatorColor="#666666"
            loadingBackgroundColor="#eeeeee"
            moveOnMarkerPress={false}
            showsUserLocation={!!currentLocation}
            showsMyLocationButton={false}
            showsCompass={true}
            mapType="standard"
            onLayout={() => {
              console.log("[SitesOnMapView] Map layout, validSites:", validSites.length);
              if (validSites.length > 0 && mapRef.current) {
                const coordinates = validSites
                  .map((site: Site) => {
                    const lat = site.location?.coordinates?.latitude;
                    const lng = site.location?.coordinates?.longitude;
                    if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
                      return { latitude: lat, longitude: lng };
                    }
                    return null;
                  })
                  .filter((coord): coord is { latitude: number; longitude: number } => coord !== null);
                
                if (coordinates.length > 0) {
                  setTimeout(() => {
                    mapRef.current?.fitToCoordinates(coordinates, {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                      animated: true,
                    });
                  }, 500);
                }
              }
            }}
          >
            {validSites.map((site: Site) => {
              const lat = Number(site.location?.coordinates?.latitude);
              const lng = Number(site.location?.coordinates?.longitude);
              
              // Validate coordinates are valid numbers
              if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                console.warn(`[SitesOnMapView] Invalid coordinates for site ${site._id}:`, { lat, lng });
                return null;
              }

              return (
                <Marker
                  key={site._id}
                  identifier={site._id}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={site.name}
                  description={site.location?.address || ""}
                  onPress={() => handleMarkerPress(site)}
                  image={appIcons.markerIcon}
                  anchor={{ x: 0.5, y: 1 }}
                />
              );
            })}
          </MapView>
        </View>
 

      )}
    </View>
  );
};

export default SitesOnMapView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: widthPixel(40),
    height: widthPixel(50),
  },
  markerPin: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    backgroundColor: colors.themeColor || "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 1,
  },
  markerPinInactive: {
    backgroundColor: colors.greyText || "#999",
    opacity: 0.6,
  },
  markerText: {
    color: colors.white,
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoBold,
    fontWeight: "bold",
  },
  markerShadow: {
    width: widthPixel(20),
    height: widthPixel(10),
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: widthPixel(10),
    marginTop: -widthPixel(5),
    zIndex: 0,
  },
  markerShadowInactive: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  infoContainer: {
    position: "absolute",
    top: heightPixel(20),
    right: widthPixel(16),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText || "#666",
  },
});
