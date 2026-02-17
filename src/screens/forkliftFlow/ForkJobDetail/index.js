import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { formateDate } from "../../../services/utilities/helper";
import SafeImageBackground from "../../../components/SafeImageBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTasks from "../../../hooks/useTasks";
const ForkJobDetail = ({ navigation, route }) => {
  const { task } = route.params || {};
  const { updateTaskStatus } = useTasks();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <SecondHeader onPress={() => navigation.goBack()} title="Job Detail" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: fontPixel(16), color: colors.greyBg }}>
            No task data available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCompleteJob = async () => {
    await updateTaskStatus(task._id, "completed");
    navigation.goBack()
  }

  const taskTitle = task.title || "Task";
  const customerName =
    task.assignedTo?.name || task.createdBy?.name || "Unknown User";
  const customerImage =
    task.assignedTo?.profileImage ||
    task.assignedTo?.image ||
    task.createdBy?.profileImage ||
    task.createdBy?.image ||
    null;
  const status = task.status || "pending";
  const taskDate = task.createdAt || task.date || task.scheduledDate;
  const siteMapUrl = task.siteId?.siteMap || task.siteMap || null;
  const pickUpLocation = task?.siteId?.location;
  const dropOffLocation = task?.dropOffLocation?.coordinates;

  // Helper function to generate two random UK coordinates 5km apart
  const generateUKCoordinates = () => {
    // UK approximate bounds: lat 50-60, lng -8 to 2
    const baseLat = 50 + Math.random() * 10; // Random latitude in UK
    const baseLng = -8 + Math.random() * 10; // Random longitude in UK

    // 5km ≈ 0.045 degrees (1 degree ≈ 111km)
    const distanceInDegrees = 0.045;
    const angle = Math.random() * 2 * Math.PI; // Random direction

    const pickup = {
      latitude: baseLat,
      longitude: baseLng,
    };

    const dropoff = {
      latitude: baseLat + distanceInDegrees * Math.cos(angle),
      longitude: baseLng + distanceInDegrees * Math.sin(angle) / Math.cos(baseLat * Math.PI / 180),
    };

    return { pickup, dropoff };
  };

  // Validate coordinates
  const isValidCoordinate = (coord) => {
    if (!coord) return false;
    const lat = coord.latitude;
    const lng = coord.longitude;
    return (
      lat !== undefined &&
      lng !== undefined &&
      lat !== null &&
      lng !== null &&
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !(lat === 0 && lng === 0) &&
      !(lat === 90 && lng === 180)
    );
  };

  // Get coordinates for map
  const mapCoordinates = useMemo(() => {
    const pickupCoord = pickUpLocation?.coordinates;
    const dropoffCoord = dropOffLocation;
    console.log("pickupCoord====>>", pickupCoord);
    console.log("dropoffCoord====>>", dropoffCoord);

    const pickupValid = isValidCoordinate(pickupCoord);
    const dropoffValid = isValidCoordinate(dropoffCoord);

    if (!pickupValid || !dropoffValid) {
      // Generate UK coordinates if invalid
      const ukCoords = generateUKCoordinates();
      return {
        pickup: pickupValid ? pickupCoord : ukCoords.pickup,
        dropoff: dropoffValid ? dropoffCoord : ukCoords.dropoff,
      };
    }

    return {
      pickup: pickupCoord,
      dropoff: dropoffCoord,
    };
  }, [pickUpLocation, dropOffLocation]);

  // Calculate map region to fit both markers
  const mapRegion = useMemo(() => {
    const { pickup, dropoff } = mapCoordinates;
    const latitudes = [pickup.latitude, dropoff.latitude];
    const longitudes = [pickup.longitude, dropoff.longitude];

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
  }, [mapCoordinates]);

  // Fit map to show both markers after layout
  useEffect(() => {
    if (mapRef.current && mapCoordinates.pickup && mapCoordinates.dropoff) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [mapCoordinates.pickup, mapCoordinates.dropoff],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }, 500);
    }
  }, [mapCoordinates]);

  return (
    <SafeAreaView style={styles.container}>
      <SecondHeader onPress={() => navigation.goBack()} title="Job Detail" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: widthPixel(20),
          paddingBottom: heightPixel(100),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userRow}>
          <SafeImageBackground
            source={customerImage ? { uri: customerImage } : null}
            name={customerName}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{taskTitle}</Text>
          <Text style={[styles.status, { textTransform: "capitalize" }]}>
            {status}
          </Text>
        </View>

        {/* Site Map */}
        <Text style={styles.sectionTitle}>Site Map</Text>
        <View style={styles.mapContainer}>
          <Image source={{ uri: task?.siteMap }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
          {/* <MapView
            ref={mapRef}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={styles.siteMap}
            initialRegion={mapRegion}
            mapType="standard"
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={true}
            onLayout={() => {
              if (mapRef.current && mapCoordinates.pickup && mapCoordinates.dropoff) {
                setTimeout(() => {
                  mapRef.current?.fitToCoordinates(
                    [mapCoordinates.pickup, mapCoordinates.dropoff],
                    {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                      animated: true,
                    }
                  );
                }, 500);
              }
            }}
          >
            {mapCoordinates.pickup && (
              <Marker
                coordinate={mapCoordinates.pickup}
                title="Pickup Location"
                description={pickUpLocation?.address || "Pickup Location"}
                pinColor="green"
              />
            )}
            {mapCoordinates.dropoff && (
              <Marker
                coordinate={mapCoordinates.dropoff}
                title="Dropoff Location"
                description={task?.dropOffLocation?.address || "Dropoff Location"}
                pinColor="red"
              />
            )}
          </MapView> */}
        </View>

        {/* Date & Time */}
        <Text style={styles.sectionTitle}>Date & Time</Text>
        {taskDate ? (
          <View style={styles.rowBox}>
            <View style={styles.iconText}>
              <Image source={appIcons.calandar} style={styles.icon} />
              <Text style={styles.rowText}>
                {formateDate(taskDate, "DD-MMM-YYYY")}
              </Text>
            </View>
            <View style={styles.iconText}>
              <Image source={appIcons.time} style={styles.icon} />
              <Text style={styles.rowText}>
                {formateDate(taskDate, "hh:mm A")}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ ...styles.rowText, color: colors.greyText }}>
            No date available
          </Text>
        )}

        {/* Items */}
        <Text style={styles.sectionTitle}>Item to Deliver</Text>
        {task?.inventory?.length > 0 ? (
          task.inventory.map((item, index) => (
            <View key={index} style={styles.rowBox}>
              <View style={styles.iconText}>
                <Image source={appIcons.steel} style={styles.itemIcon} />
                <Text style={styles.rowText}>{item?.item || "Item"}</Text>
              </View>
              <Text style={styles.rowText}>
                {item?.quantity} {item?.unit || "Units"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ ...styles.rowText, color: colors.greyText }}>
            No items listed
          </Text>
        )}

        {/* Pictures */}
        <Text style={styles.sectionTitle}>Pictures</Text>
        <View
          style={{
            flexDirection: "row",
            gap: widthPixel(12),
            flexWrap: "wrap",
          }}
        >
          {task?.pictures?.length > 0 ? (
            task.pictures.map((pic, index) => (
              <Image
                key={index}
                source={{
                  uri: pic.url || pic || "https://picsum.photos/200/300",
                }}
                style={styles.picture}
              />
            ))
          ) : (
            <Text style={{ ...styles.rowText, color: colors.greyText }}>
              No pictures available
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Button pinned at bottom */}
      {status !== "completed" && (
        <View
          style={{
            paddingHorizontal: heightPixel(16),
            paddingBottom: insets.bottom,
          }}
        >
          <AppButton
            title={status === "started" || status === "in_progress" ? "Complete Job" : "Start Now"}
            onPress={() => {
              if (status === "pending") {
                navigation.navigate(routes.materialPicked, {
                  task
                })
              }
              else if (status === "started" || status === "in_progress") {
                handleCompleteJob()
              }

            }}
            style={{
              marginTop: heightPixel(20),
              borderWidth: 1,
              borderColor: colors.themeColor,
            }}
            textStyle={{
              color: colors.themeColor,
              fontFamily: fonts.NunitoSemiBold,
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ForkJobDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: heightPixel(10),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPixel(16),
    marginBottom: heightPixel(12),
  },
  avatar: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    marginRight: widthPixel(10),
  },
  userName: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    flex: 1,
  },
  status: {
    fontSize: fontPixel(14),
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  sectionTitle: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginVertical: heightPixel(10),
  },
  mapContainer: {
    width: "100%",
    height: heightPixel(500),
    borderRadius: widthPixel(8),
    marginBottom: heightPixel(16),
    overflow: "hidden",
  },
  siteMap: {
    width: "100%",
    height: "100%",
  },
  rowBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: heightPixel(10),
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginRight: widthPixel(8),
    resizeMode: "contain",
  },
  itemIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
    marginRight: widthPixel(8),
    resizeMode: "contain",
  },
  rowText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  picture: {
    width: widthPixel(100),
    height: widthPixel(80),
    borderRadius: widthPixel(6),
  },
  footer: {
    // paddingHorizontal: widthPixel(20),
    // paddingVertical: heightPixel(12),
    // borderTopWidth: 1,
    // borderTopColor: colors.greyLight,
    // backgroundColor: colors.white,
  },
});
