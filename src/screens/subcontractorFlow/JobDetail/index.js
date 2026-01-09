import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { formateDate } from "../../../services/utilities/helper";
import SafeImageBackground from "../../../components/SafeImageBackground";

const JobDetail = ({ navigation, route }) => {
  const { task } = route.params || {};

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <SecondHeader onPress={() => navigation.goBack()} title="Job Detail" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: fontPixel(16), color: colors.greyBg }}>No task data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const taskTitle = task.title || "Task";
  const customerName = task.assignedTo?.name || task.createdBy?.name || "Unknown User";
  const customerImage = task.assignedTo?.profileImage || task.assignedTo?.image || task.createdBy?.profileImage || task.createdBy?.image || null;
  const status = task.status || "pending";
  const taskDate = task.createdAt || task.date || task.scheduledDate;
  const siteMapUrl = task.siteId?.siteMap || task.siteMap || null;

  return (
    <SafeAreaView style={styles.container}>
      <SecondHeader onPress={() => navigation.goBack()} title="Job Detail" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: widthPixel(20), paddingBottom: heightPixel(100) }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info / Task Title */}
        <View style={styles.userRow}>
          <SafeImageBackground 
            source={customerImage ? { uri: customerImage } : null}
            name={customerName}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{taskTitle}</Text>
          <Text style={[styles.status, { textTransform: "capitalize" }]}>{status}</Text>
        </View>

        {/* Site Map */}
        <Text style={styles.sectionTitle}>Site Map</Text>
        {siteMapUrl ? (
          <Image
            source={{ uri: siteMapUrl }}
            style={styles.siteMap}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={appImages.jobMap}
            style={styles.siteMap}
            resizeMode="cover"
          />
        )}

        {/* Date & Time */}
        <Text style={styles.sectionTitle}>Date & Time</Text>
        {taskDate ? (
          <View style={styles.rowBox}>
            <View style={styles.iconText}>
              <Image source={appIcons.calandar} style={styles.icon} />
              <Text style={styles.rowText}>{formateDate(taskDate, "DD-MMM-YYYY")}</Text>
            </View>
            <View style={styles.iconText}>
              <Image source={appIcons.time} style={styles.icon} />
              <Text style={styles.rowText}>{formateDate(taskDate, "hh:mm A")}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ ...styles.rowText, color: colors.greyText }}>No date available</Text>
        )}

        {/* Items */}
        <Text style={styles.sectionTitle}>Item to Deliver</Text>
        {task?.inventory?.length > 0 ? (
          task.inventory.map((item, index) => (
            <View key={index} style={styles.rowBox}>
              <View style={styles.iconText}>
                <SafeImageBackground source={{uri:item?.icon||item?.image}} name={item.item} style={styles.itemIcon} />
                <Text style={styles.rowText}>{item?.item || "Item"}</Text>
              </View>
              <Text style={styles.rowText}>{item?.quantity} {item?.unit || "Units"}</Text>
            </View>
          ))
        ) : (
          <Text style={{ ...styles.rowText, color: colors.greyText }}>No items listed</Text>
        )}

        {/* Pictures */}
        <Text style={styles.sectionTitle}>Pictures</Text>
        <View style={{ flexDirection: "row", gap: widthPixel(12), flexWrap: 'wrap' }}>
          {task?.pictures?.length > 0 ? (
            task.pictures.map((pic, index) => (
              <Image
                key={index}
                source={{ uri: pic.url || "https://picsum.photos/200/300" }}
                style={styles.picture}
              />
            ))
          ) : (
            <Text style={{ ...styles.rowText, color: colors.greyText }}>No pictures available</Text>
          )}
        </View>

        <View style={styles.footer}>
          {task?.status !== 'cancelled' && (
            <AppButton
              title="Cancel"
              onPress={() => navigation.navigate(routes.cancelJob, { taskId: task?._id })}
              style={{
                marginTop: heightPixel(20),
                borderWidth: 1,
                borderColor: 'red',
              }}
              textStyle={{
                color: 'red',
                fontFamily: fonts.NunitoSemiBold,
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDetail;

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
  siteMap: {
    width: "100%",
    height: heightPixel(160),
    borderRadius: widthPixel(8),
    marginBottom: heightPixel(16),
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