import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { Loader } from "../../../components/Loader";
import useCallApi from "../../../hooks/useCallApi";
import { useSelector } from "react-redux";
import { toastError } from "../../../services/utilities/toast/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Calendar utility functions
const buildMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentWeek = new Array(startWeekday).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }
  return weeks;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayShort = ["S", "M", "T", "W", "T", "F", "S"];

const SelectTask = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { materialLocation, dropOffLocation, markedImageUrl } = route.params || {};
  const { selectedSite } = useSelector((state) => state.site);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("instant");
  const [priority, setPriority] = useState("medium");
  const [time, setTime] = useState(""); // For scheduled date
  const [dropAddress, setDropAddress] = useState("");
  const [siteId, setSiteId] = useState("");
  const [duration, setDuration] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  console.log(selectedSite);

  // Calendar state
  const getInitialDate = () => {
    if (scheduledDate) {
      const date = new Date(scheduledDate);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new Date();
  };

  const initialDate = getInitialDate();
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [viewMode, setViewMode] = useState("calendar"); // "calendar", "month", "year"

  // Pictures
  const [pictures, setPictures] = useState([]);

  const { uploadFile } = useCallApi();
  const [uploading, setUploading] = useState(false);

  const handleRemovePicture = (uri) => {
    setPictures(pictures.filter((pic) => pic.uri !== uri));
  };

  useEffect(() => {
    if (selectedSite) {
      setSiteId(selectedSite);
    }
  }, [selectedSite]);

  // Update calendar when scheduledDate changes externally
  useEffect(() => {
    if (scheduledDate) {
      const d = new Date(scheduledDate);
      if (!isNaN(d.getTime())) {
        setMonth(d.getMonth());
        setYear(d.getFullYear());
        setSelectedDay(d.getDate());
      }
    }
  }, [scheduledDate]);

  const handlePickImage = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: "photo",
        maxFiles: 5 - pictures.length,
        compressImageQuality: 0.8,

      });
      const formattedImages = images.map((img) => ({
        uri: img.path,
        type: img.mime,
        name: img.filename || `image_${Date.now()}_${Math.random()}.jpg`,
      }));
      setPictures([...pictures, ...formattedImages]);
    } catch (error) {
      console.log("ImagePicker error", error);
    }
  };

  // Calendar handlers
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  const handlePrevYear = () => {
    setYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setYear((prev) => prev + 1);
  };

  const handleMonthSelect = (selectedMonth) => {
    setMonth(selectedMonth);
    setViewMode("calendar");
  };

  const handleYearSelect = (selectedYear) => {
    setYear(selectedYear);
    setViewMode("calendar");
  };

  // Generate years list (current year ± 50 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 22; i++) {
      years.push(i);
    }
    return years;
  };

  const handleDateSelect = (day) => {
    setSelectedDay(day);
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setScheduledDate(`${yyyy}-${mm}-${dd}`);
    setShowCalendar(false);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select scheduled date";
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
    } catch (e) {
      // ignore
    }
    return dateStr;
  };
  const handleNext = () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!siteId) {
      toastError({ text: "Site id is required!" });
      return;
    }

    try {
      const taskData = {
        materialLocation,
        dropOffLocation,

        title,
        description,
        taskType,
        priority,
        scheduledDate:
          taskType === "scheduled" ? new Date(scheduledDate).toISOString() : null, // Mocking date logic if 'time' not fully parsed
        estimatedDuration: parseInt(duration) || 60,
        siteId: siteId,
        pictures: pictures,
        siteMap: markedImageUrl
      };
      console?.log('--->>>>>>', taskData)

      navigation.navigate(routes.selectInventoryForTask, {
        isSelection: true,
        previousData: taskData,
      });
    } catch (err) {
      console?.log('----->>>Error', err)
    }
  };

  const SelectionButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.optionBox,
        selected && {
          backgroundColor: colors.themeColor,
          borderColor: colors.themeColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && { color: colors.white }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: widthPixel(20),
          flexGrow: 1,
          paddingBottom: heightPixel(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        <SecondHeader
          onPress={() => navigation.goBack()}
          title="Task Details"
        />
        <Text
          style={{
            fontSize: fontPixel(14),
            fontFamily: fonts.NunitoRegular,
            color: colors.greyText,
            marginTop: heightPixel(10),
            marginBottom: heightPixel(10),
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          porttitor lectus augue
        </Text>

        <Text style={styles.sectionTitle}>Basic Info</Text>
        <AppTextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <AppTextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ height: heightPixel(80), textAlignVertical: "top" }}
        />

        <Text style={styles.sectionTitle}>Select Task Type</Text>
        <View
          style={[
            styles.row,
            {
              marginBottom:
                taskType === "scheduled" ? heightPixel(10) : heightPixel(0),
            },
          ]}
        >
          <SelectionButton
            label="Instant"
            selected={taskType === "instant"}
            onPress={() => setTaskType("instant")}
          />
          <SelectionButton
            label="Scheduled"
            selected={taskType === "scheduled"}
            onPress={() => setTaskType("scheduled")}
          />
        </View>

        {taskType === "scheduled" && (
          <View>
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
            >
              <View style={{
                backgroundColor: "#f5f5f5", borderRadius: widthPixel(10), padding: widthPixel(10),
                height: heightPixel(50),

              }}>
                <Text>
                  {formatDisplayDate(scheduledDate)}
                </Text>
              </View>

            </TouchableOpacity>

            <Modal
              visible={showCalendar}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCalendar(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Scheduled Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowCalendar(false)}
                      style={styles.closeButton}
                    >
                      <Image
                        source={appIcons.cross}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.calendarCard}>
                    {viewMode === "calendar" && (
                      <>
                        <View style={styles.calendarHeader}>
                          <TouchableOpacity
                            onPress={() => setViewMode("month")}
                            style={styles.monthYearButton}
                          >
                            <Text style={styles.calendarMonth}>
                              {monthNames[month]}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setViewMode("year")}
                            style={styles.monthYearButton}
                          >
                            <Text style={styles.calendarYear}>{year}</Text>
                          </TouchableOpacity>
                          <View style={styles.calendarNav}>
                            <TouchableOpacity
                              style={styles.navBtn}
                              onPress={handlePrevMonth}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Text style={styles.navText}>{"<"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.navBtn}
                              onPress={handleNextMonth}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Text style={styles.navText}>{">"}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Weekday row */}
                        <View style={styles.weekRow}>
                          {weekdayShort.map((d, idx) => (
                            <Text key={`${d}-${idx}`} style={styles.weekLabel}>
                              {d}
                            </Text>
                          ))}
                        </View>

                        {/* Calendar days */}
                        {buildMonthDays(year, month).map((week, wi) => (
                          <View key={`week-${wi}`} style={styles.weekRow}>
                            {week.map((day, di) => {
                              if (!day) {
                                return (
                                  <View
                                    key={`empty-${wi}-${di}`}
                                    style={styles.dayCell}
                                  />
                                );
                              }
                              const isSelected = day === selectedDay;
                              return (
                                <TouchableOpacity
                                  key={`day-${wi}-${day}-${di}`}
                                  style={[
                                    styles.dayCell,
                                    isSelected && styles.daySelected,
                                  ]}
                                  onPress={() => handleDateSelect(day)}
                                >
                                  <Text
                                    style={[
                                      styles.dayText,
                                      isSelected && styles.dayTextSelected,
                                    ]}
                                  >
                                    {day}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ))}
                      </>
                    )}

                    {viewMode === "month" && (
                      <>
                        <View style={styles.pickerHeader}>
                          <TouchableOpacity
                            onPress={() => setViewMode("calendar")}
                            style={styles.backButton}
                          >
                            <Text style={styles.backButtonText}>{"< Back"}</Text>
                          </TouchableOpacity>
                          <Text style={styles.pickerTitle}>Select Month</Text>
                          <View style={{ width: widthPixel(60) }} />
                        </View>
                        <ScrollView
                          contentContainerStyle={styles.monthGrid}
                          showsVerticalScrollIndicator={false}
                        >
                          {monthNames.map((monthName, idx) => (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                styles.monthItem,
                                month === idx && styles.monthItemSelected,
                              ]}
                              onPress={() => handleMonthSelect(idx)}
                            >
                              <Text
                                style={[
                                  styles.monthItemText,
                                  month === idx && styles.monthItemTextSelected,
                                ]}
                              >
                                {monthName}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </>
                    )}

                    {viewMode === "year" && (
                      <>
                        <View style={styles.pickerHeader}>
                          <TouchableOpacity
                            onPress={() => setViewMode("calendar")}
                            style={styles.backButton}
                          >
                            <Text style={styles.backButtonText}>{"< Back"}</Text>
                          </TouchableOpacity>
                          <Text style={styles.pickerTitle}>Select Year</Text>
                          <View style={styles.yearNav}>
                            <TouchableOpacity
                              style={styles.navBtn}
                              onPress={handlePrevYear}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Text style={styles.navText}>{"<"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.navBtn}
                              onPress={handleNextYear}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Text style={styles.navText}>{">"}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ScrollView
                          style={styles.yearScrollView}
                          contentContainerStyle={styles.yearGrid}
                          showsVerticalScrollIndicator={true}
                          nestedScrollEnabled={true}
                        >
                          {generateYears().map((y) => (
                            <TouchableOpacity
                              key={y}
                              style={[
                                styles.yearItem,
                                year === y && styles.yearItemSelected,
                              ]}
                              onPress={() => handleYearSelect(y)}
                            >
                              <Text
                                style={[
                                  styles.yearItemText,
                                  year === y && styles.yearItemTextSelected,
                                ]}
                              >
                                {y}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.row}>
          <SelectionButton
            label="Low"
            selected={priority === "low"}
            onPress={() => setPriority("low")}
          />
          <SelectionButton
            label="Medium"
            selected={priority === "medium"}
            onPress={() => setPriority("medium")}
          />
          <SelectionButton
            label="High"
            selected={priority === "high"}
            onPress={() => setPriority("high")}
          />
        </View>

        <Text style={styles.sectionTitle}>Estimateed Duration Time</Text>

        <AppTextInput
          placeholder="minutes"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Add Pictures</Text>
        <View style={styles.picturesRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
            <Image source={appIcons.gallery} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>Add Image</Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            data={pictures}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <View style={styles.pictureWrapper}>
                <Image source={{ uri: item.uri }} style={styles.picture} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePicture(item.uri)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: heightPixel(20),
          }}
        >
          <AppButton
            title="NEXT: SELECT INVENTORY"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoBold,
    color: colors.black,
    marginTop: heightPixel(20),
    marginBottom: heightPixel(10),
  },
  label: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.greyText,
    marginTop: heightPixel(10),
    marginBottom: heightPixel(8),
  },
  row: {
    flexDirection: "row",
    gap: widthPixel(10),
    flexWrap: "wrap",
  },
  optionBox: {
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(20),
    borderWidth: 1,
    borderColor: colors.greyBg,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  picturesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPixel(20),
  },
  uploadBox: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(8),
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: widthPixel(10),
  },
  uploadIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
    tintColor: colors.themeColor,
  },
  pictureWrapper: {
    position: "relative",
    marginRight: widthPixel(10),
  },
  picture: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(8),
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: widthPixel(22),
    height: widthPixel(22),
    borderRadius: widthPixel(11),
    backgroundColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: colors.white,
    fontSize: fontPixel(12),
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(20),
    width: "90%",
    maxWidth: widthPixel(400),
    padding: widthPixel(20),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(15),
  },
  modalTitle: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  closeButton: {
    width: widthPixel(30),
    height: widthPixel(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    resizeMode: "contain",
  },
  calendarCard: {
    borderRadius: widthPixel(16),
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(14),
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(10),
  },
  calendarMonth: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.grey300,
  },
  calendarNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthPixel(8),
  },
  navBtn: {
    width: heightPixel(20),
    height: heightPixel(20),
    borderRadius: heightPixel(12),
    backgroundColor: "#F2E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: fontPixel(14),
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: heightPixel(6),
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: fontPixel(11),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.greyBg,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(12),
  },
  daySelected: {
    backgroundColor: "#E1D4FF",
  },
  dayText: {
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
  },
  dayTextSelected: {
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  monthYearButton: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
  },
  calendarYear: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
    marginLeft: widthPixel(5),
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightPixel(15),
  },
  pickerTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  backButton: {
    paddingVertical: heightPixel(5),
    paddingHorizontal: widthPixel(5),
  },
  backButtonText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.themeColor,
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: heightPixel(10),
  },
  monthItem: {
    width: "30%",
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(10),
    marginBottom: heightPixel(10),
    borderRadius: widthPixel(8),
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  monthItemSelected: {
    backgroundColor: "#E1D4FF",
  },
  monthItemText: {
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
  },
  monthItemTextSelected: {
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  yearScrollView: {
    maxHeight: heightPixel(350),
    flexGrow: 0,
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: heightPixel(10),
    paddingBottom: heightPixel(20),
  },
  yearItem: {
    width: "22%",
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(8),
    marginBottom: heightPixel(8),
    borderRadius: widthPixel(8),
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  yearItemSelected: {
    backgroundColor: "#E1D4FF",
  },
  yearItemText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
  },
  yearItemTextSelected: {
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
  yearNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthPixel(8),
  },
});
