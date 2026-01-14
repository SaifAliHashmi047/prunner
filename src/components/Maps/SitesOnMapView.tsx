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

import MapView, { Marker, Region } from "react-native-maps";
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
const sites = [
  {
    _id: "6942fa370a09d320178f4308",
    name: "Coco Cubano Desserts",
    location: {
      address: "DHA Phase 8, Lahore",
      coordinates: {
        Latitude: 31.364,
        Longitude: 74.2497,
      },
    },
    status: "active",
    createdBy: {
      _id: "6929ee5dceeda4dad089c459",
      email: "admin@yopmail.com",
      name: "Admin",
    },
    createdAt: "2025-12-17T18:45:11.724Z",
    updatedAt: "2025-12-17T18:45:11.724Z",
    __v: 0,
    employeeCounts: { forklift: 0, subConstructor: 0 },
  },
];

const SitesOnMapView: React.FC<LocationOnMapProps> = ({ onSiteSelect }) => {
  const navigation = useNavigation();

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
  // Filter sites with valid coordinates - use static array
  const validSites = useMemo(() => {
    return (
      sites?.filter(
        (site: Site) =>
          site?.location?.coordinates?.latitude &&
          site?.location?.coordinates?.longitude &&
          site.location.coordinates.latitude !== 0 &&
          site.location.coordinates.longitude !== 0
      ) || []
    );
  }, []);

  // Default to Lahore, Pakistan coordinates
  const LAHORE_DEFAULT = {
    // latitude: 31.5204,
    // longitude: 74.3587,
    // latitudeDelta: 0.15,
    // longitudeDelta: 0.15,
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Calculate region to fit all sites (plots view)
  const mapRegion = useMemo((): Region => {
    if (validSites.length === 0) {
      // If no valid sites, use first site from static array or Lahore default
      // if (sites && sites.length > 0 && sites[0]?.location?.coordinates) {
      //   const firstSite = sites[0];
      //   return {
      //     latitude: firstSite.location.coordinates.latitude,
      //     longitude: firstSite.location.coordinates.longitude,
      //     latitudeDelta: 0.15,
      //     longitudeDelta: 0.15,
      //   };
      // }
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

  // Fit map to show all sites when sites are loaded
  useEffect(() => {
    if (mapRegion && mapRef.current) {
      // Small delay to ensure map is rendered
      setTimeout(() => {
        mapRef.current?.animateToRegion(mapRegion, 1000);
      }, 500);
    }
  }, [mapRegion]);

  const requestLocationPermission = async () => {
    // Don't request location at all - just use default region
    // This prevents timeout errors
    setLoading(false);

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

  const isFocused = useIsFocused();
  useEffect(() => {
    // Show map immediately with default region
    setLoading(false);

    // Optionally try to get location in background (non-blocking)
    if (isFocused) {
      // Use setTimeout to ensure map renders first
      setTimeout(() => {
        requestLocationPermission();
      }, 100);
    }
  }, [isFocused]);

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
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            // latitude: 31.5204,
            // longitude: 74.3587,
            // latitudeDelta: 0.15,
            // longitudeDelta: 0.15,
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          
        >
          <Marker
            coordinate={{
              latitude: 31.364,
              longitude: 74.2497,
            }}
            title="Coco Cubano Desserts"
            description="DHA Phase 8, Lahore"
          />
        </MapView>

        // <View style={styles.wrapper}>
        //   <MapView
        //     ref={mapRef}
        //     style={StyleSheet.absoluteFill}
        //     initialRegion={mapRegion}
        //     showsUserLocation={!!currentLocation}
        //     showsMyLocationButton={false}
        //     showsCompass={true}
        //     mapType="standard"
        //   >
        //       {/* Render markers for all sites */}
        //       {validSites.map((site: Site) => {
        //         const lat = site.location!.coordinates!.latitude;
        //         const lng = site.location!.coordinates!.longitude;
        //         const isActive = site.status === "active";

        //         return (
        //           <Marker
        //             key={site._id}
        //             coordinate={{
        //               latitude: lat,
        //               longitude: lng,
        //             }}
        //             title={site.name}
        //             description={site.location?.address || ""}
        //             onPress={() => handleMarkerPress(site)}
        //           >
        //             <View
        //               style={styles.markerContainer}
        //             >
        //               <View
        //                 style={[
        //                   styles.markerPin,
        //                   !isActive && styles.markerPinInactive,
        //                 ]}
        //               >
        //                 <Text style={styles.markerText}>
        //                   {site.name?.charAt(0)?.toUpperCase() || "S"}
        //                 </Text>
        //               </View>
        //               <View
        //                 style={[
        //                   styles.markerShadow,
        //                   !isActive && styles.markerShadowInactive,
        //                 ]}
        //               />
        //             </View>
        //           </Marker>
        //         );
        //       })}
        //     </MapView>

        //   {/* Show count of sites */}
        //   {validSites.length > 0 && (
        //     <View style={styles.infoContainer}>
        //       <Text style={styles.infoText}>
        //         {validSites.length} {validSites.length === 1 ? "Site" : "Sites"}
        //       </Text>
        //     </View>
        //   )}

        //   {/* Empty state */}
        //   {validSites.length === 0 && !sitesLoading && (
        //     <View style={styles.emptyContainer}>
        //       <Text style={styles.emptyText}>No sites with valid locations</Text>
        //   </View>
        //     )}
        //   </View>
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
