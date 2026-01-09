import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel, routes } from "../services/constant";
import { fonts } from "../services/utilities/fonts";
import { appIcons } from "../services/utilities/assets";
import { AppButton } from "./index";
import SafeImageBackground from "./SafeImageBackground";
import { useNavigation } from "@react-navigation/native";

const TaskCard = ({ task, onStartPress , onCompletePress }) => {
  const {title, customerName, customerImage, materials, date, time , status } = task;

const navigation = useNavigation();
  const renderButton = () => {
    if (status === "pending") {
      return (
        <AppButton
          title="START NOW"
          onPress={onStartPress}
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />
      );
    }
    if (status === "active"||status === "in_progress"||status === "started") {
      return (
        <AppButton
          title="Mark as Complete"
          onPress={onCompletePress}
          style={{
            // backgroundColor: colors.themeColor,
            borderTopLeftRadius: widthPixel(0),
            borderTopRightRadius: widthPixel(0),
            paddingVertical: heightPixel(8),
            borderWidth : 1,
            borderColor : colors.themeColor
          }}
          textStyle={styles.activeButtonText}
        />
      );
    }
    // Completed / Cancelled → no button
    return null;
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={()=>{
      navigation.navigate(routes.forkJobDetail, { task: task });
    }} style={styles.card}>
      {/* Customer Info */}
      <View style={{ padding: widthPixel(15) }}>
        <View style={styles.customerSection}>
          <SafeImageBackground
          source={{uri:customerImage}}
          style={styles.customerImage}
          name={customerName}
            />
          <Text style={styles.customerName}>{title}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Materials Section */}
        <View style={styles.materialsSection}>
          <Text style={styles.sectionTitle}>Material</Text>
          {materials.map((material, index) => (
            <View key={index} style={styles.materialRow}>
              <View style={styles.materialLeft}>
                <Image source={material.icon} style={styles.materialIcon} />
                <Text style={styles.materialName}>{material.name}</Text>
              </View>
              <Text style={styles.materialQty}>{material.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Date & Time Section */}
        <View style={styles.dateTimeSection}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Image source={appIcons.calandar} style={styles.dateTimeIcon} />
              <Text style={styles.dateTimeText}>{date}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Image source={appIcons.time} style={styles.dateTimeIcon} />
              <Text style={styles.dateTimeText}>{time}</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}

      </View>
      {renderButton()}
    </TouchableOpacity>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(12),
    // padding: widthPixel(15),
    marginBottom: heightPixel(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPixel(10),
  },
  customerImage: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    marginRight: widthPixel(12),
  },
  customerName: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: heightPixel(10),
  },
  materialsSection: {
    marginBottom: heightPixel(15),
  },
  sectionTitle: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
  materialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(6),
  },
  materialLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginRight: widthPixel(6),
  },
  materialName: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.black,
  },
  materialQty: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
  },
  dateTimeSection: {
    marginBottom: heightPixel(15),
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
    marginRight: widthPixel(6),
  },
  dateTimeText: {
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText,
  },
  startButton: {
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: widthPixel(0),
    borderTopRightRadius: widthPixel(0),
    paddingVertical: heightPixel(8),
  },
  startButtonText: {
    color: colors.white,
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    textAlign: "center",
  },
});