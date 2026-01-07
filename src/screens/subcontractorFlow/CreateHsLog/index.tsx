import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import useHsLogs from "../../../hooks/useHsLogs";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

// Simple calendar util
const buildMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: Array<Array<number | null>> = [];
  let currentWeek: Array<number | null> = new Array(startWeekday).fill(null);

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

const CreateHsLog = ({ navigation }:any) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { selectedSite } = useSelector((state: any) => state.site || {});
  const params = route.params as any;
  const { log, isEdit } = params || {};

  const { createHsLog, updateHsLog, loadingCreate, loadingUpdate, fetchHsLogs } = useHsLogs();

  // Parse date from log if editing, otherwise use today
  const getInitialDate = () => {
    if (log && (log.date || log.activeDate)) {
      const dateStr = log.date || log.activeDate;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new Date();
  };

  const initialDate = getInitialDate();
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDate.getDate());

  const [title, setTitle] = useState(log?.title || "");
  const [precaution, setPrecaution] = useState(log?.precaution || "");
  const [submitting, setSubmitting] = useState(false);

  // Update form when log changes (if editing)
  useEffect(() => {
    if (log && isEdit) {
      setTitle(log.title || "");
      setPrecaution(log.precaution || "");
      const dateStr = log.date || log.activeDate;
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          setMonth(date.getMonth());
          setYear(date.getFullYear());
          setSelectedDay(date.getDate());
        }
      }
    }
  }, [log, isEdit]);

  const weeks = buildMonthDays(year, month);

  const getSelectedDateString = () => {
    if (!selectedDay) return "";
    const d = new Date(year, month, selectedDay);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toastError({ text: "Title is required" });
      return;
    }
    if (!precaution.trim()) {
      toastError({ text: "Precaution is required" });
      return;
    }
    if (!selectedDay) {
      toastError({ text: "Please select a date" });
      return;
    }
    if (!selectedSite?._id && !log?.siteId?._id) {
      toastError({ text: "Please select a site first" });
      return;
    }

    const dateStr = getSelectedDateString();
    const siteId = selectedSite?._id || log?.siteId?._id || log?.siteId;

    try {
      setSubmitting(true);

      if (isEdit && log) {
        // Update existing log
        const payload: any = {
          title: title.trim(),
          precaution: precaution.trim(),
          date: dateStr,
        };

        // Include optional fields if they exist in the log
        if (log.priority) payload.priority = log.priority;
        if (log.category) payload.category = log.category;
        if (log.severity) payload.severity = log.severity;
        if (log.assignedTo) payload.assignedTo = log.assignedTo;
        if (log.resolution) payload.resolution = log.resolution;

        const logId = log._id || log.id;
        const res = await updateHsLog(logId, payload);
        
        if (res?.success) {
          toastSuccess({ text: res?.message || "H&S Log updated successfully" });
          fetchHsLogs(1, true); // Refresh the list
          navigation.goBack();
        } else {
          toastError({ text: res?.message || "Failed to update log" });
        }
      } else {
        // Create new log
        const payload = {
          title: title.trim(),
          precaution: precaution.trim(),
          date: dateStr,
          status: "active",
          siteId: siteId,
        };
        const res = await createHsLog(payload);
        if (res?.success) {
          toastSuccess({ text: res?.message || "H&S Log added successfully" });
          navigation.goBack();
        } else {
          toastError({ text: res?.message || "Failed to create log" });
        }
      }
    } catch (error: any) {
      const msg =
        error?.message || error?.response?.data?.message || (isEdit ? "Failed to update log" : "Failed to create log");
      toastError({ text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top || heightPixel(10) }]}
    >
      <View style={styles.inner}>
        <SecondHeader
          onPress={() => navigation.goBack()}
          title={isEdit ? "Edit H&S Log" : "Create H&S Log"}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: heightPixel(30) }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            porttitor lectus augue
          </Text>

          <AppTextInput
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            keyboardType="default"
            style={{ marginTop: heightPixel(16) }}
          />

          <AppTextInput
            placeholder="Enter precaution details"
            value={precaution}
            onChangeText={setPrecaution}
            multiline
            keyboardType="default"
            style={{
              marginTop: heightPixel(12),
              height: heightPixel(110),
              textAlignVertical: "top",
            }}
          />

          {/* Calendar Card */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarMonth}>
                {monthNames[month]} {year}
              </Text>
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

            {/* Weeks */}
            {weeks.map((week, wi) => (
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
                      onPress={() => setSelectedDay(day)}
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
          </View>

          <AppButton
            title={
              submitting || loadingCreate || loadingUpdate
                ? isEdit
                  ? "UPDATING..."
                  : "ADDING..."
                : isEdit
                ? "UPDATE H&S LOG"
                : "ADD H&S LOG"
            }
            onPress={handleSubmit}
            style={{
              backgroundColor: colors.themeColor,
              marginTop: heightPixel(24),
            }}
            textStyle={{ color: colors.white }}
            disabled={submitting || loadingCreate || loadingUpdate}
          />
        </ScrollView>
      </View>
      <Loader isVisible={submitting || loadingCreate || loadingUpdate} />
    </SafeAreaView>
  );
};

export default CreateHsLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
    flex: 1,
    paddingHorizontal: widthPixel(16),
  },
  subtitle: {
    marginTop: heightPixel(8),
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyBg,
  },
  calendarCard: {
    marginTop: heightPixel(20),
    borderRadius: widthPixel(16),
    backgroundColor: colors.white,
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(14),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
});


