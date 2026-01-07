import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts } from "../../../services/utilities/fonts";
import { AppButton } from "../../../components";
import { useSelector } from "react-redux";
import useHsLogs from "../../../hooks/useHsLogs";
import {
  toastError,
  toastSuccess,
} from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { routes } from "../../../services/constant";

const HsLogDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);
  const { log } = route.params || {};
  const insets = useSafeAreaInsets();
  const {
    deleteHsLog,
    updateHsLog,
    loadingDelete,
    loadingUpdate,
    fetchHsLogs,
  } = useHsLogs();
  const [deleting, setDeleting] = useState(false);

  if (!log) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={appIcons.back} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>No log data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete H&S Log",
      "Are you sure you want to delete this H&S log? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const response = await deleteHsLog(log._id || log.id);
              if (response?.success) {
                toastSuccess({ text: "H&S Log deleted successfully" });
                fetchHsLogs(1, true); // Refresh the list
                navigation.goBack();
              } else {
                toastError({
                  text: response?.message || "Failed to delete H&S log",
                });
              }
            } catch (error) {
              const msg =
                error?.message ||
                error?.response?.data?.message ||
                "Failed to delete H&S log";
              toastError({ text: msg });
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // Navigate to edit screen (you can create an EditHsLog screen or reuse CreateHsLog with edit mode)
    navigation.navigate(routes.createHsLog, { log, isEdit: true });
  };

  const isSubConstructor = user?.role === "subConstructor";

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={appIcons.back} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: heightPixel(40) }}
        showsVerticalScrollIndicator={false}
      >
         
          {/* Warning Icon and Title */}
          <View style={styles.titleRow}>
          <Image
                    source={appIcons.warning}
                    style={{
                      width: widthPixel(20),
                      height: widthPixel(20),
                      resizeMode: "contain",
                    }}
                  />
            <View style={{ flex: 1, marginLeft: widthPixel(12) }}>
              <Text style={styles.title}>{log.title || "H&S Log"}</Text>
              {log.status === "active" && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              )}
            </View>
          </View>

          {/* Precaution Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precaution Details</Text>
            <Text style={styles.description}>
              {log.precaution || "No precaution details available."}
            </Text>
          </View>

          {/* Active Date Section */}
          <View style={styles.section}>
            <View style={styles.dateRow}>
              <Text style={styles.sectionTitle}>Active Date</Text>
              <View style={styles.dateContainer}>
                <Image
                  source={appIcons.calandar}
                  style={{
                    width: widthPixel(16),
                    height: widthPixel(16),
                    resizeMode: "contain",
                    marginRight: widthPixel(6),
                  }}
                />
                <Text style={styles.dateText}>
                  {formatDate(log.date || log.activeDate || log.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Additional fields if available */}
          {log.priority && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <Text style={styles.description}>{log.priority}</Text>
            </View>
          )}

          {log.category && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.description}>{log.category}</Text>
            </View>
          )}

          {log.severity && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Severity</Text>
              <Text style={styles.description}>{log.severity}</Text>
            </View>
          )}

          {log.resolution && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resolution</Text>
              <Text style={styles.description}>{log.resolution}</Text>
            </View>
          )}
        {/* Action Buttons - Only for subConstructor */}
        
      </ScrollView>
      {isSubConstructor && (
          <View style={styles.buttonContainer}>
            <AppButton
              title="EDIT"
              onPress={handleEdit}
              style={styles.editButton}
              textStyle={styles.editButtonText}
              disabled={loadingUpdate || loadingDelete}
            />
            <AppButton
              title="DELETE"
              onPress={handleDelete}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
              disabled={loadingUpdate || loadingDelete || deleting}
            />
          </View>
        )}
      <Loader isVisible={loadingDelete || loadingUpdate || deleting} />
    </SafeAreaView>
  );
};

export default HsLogDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(10),
    paddingBottom: heightPixel(10),
  },
  backIcon: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: "contain",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(10),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: heightPixel(20),
  },
  title: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.grey300,
    flex: 1,
    marginBottom: heightPixel(8),
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(8),
    backgroundColor: "#EDE2FF",
  },
  statusText: {
    color: colors.themeColor,
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoSemiBold,
    fontWeight: "600",
  },
  section: {
    marginBottom: heightPixel(20),
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
  description: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyBg,
    lineHeight: heightPixel(20),
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: fontPixel(12),
    color: colors.grey,
    fontFamily: fonts.NunitoRegular,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: widthPixel(12),
    marginTop: heightPixel(20),
    marginBottom: heightPixel(20),
    padding : widthPixel(16),
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.themeColor,
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(12),
  },
  editButtonText: {
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
    fontSize: fontPixel(14),
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.themeColor,
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(12),
  },
  deleteButtonText: {
    color: colors.white,
    fontFamily: fonts.NunitoSemiBold,
    fontSize: fontPixel(14),
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontPixel(14),
    color: colors.greyBg,
    fontFamily: fonts.NunitoRegular,
  },
});
