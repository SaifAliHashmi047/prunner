import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    Modal,
} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ForkLiftHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import useForkliftDocs from "../../../hooks/useForkliftDocs";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../services/store/slices/userSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../../../services/store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const TellAboutVehicle = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { registerVehicle, loading, uploading } = useForkliftDocs();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.user);
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [vehicleImages, setVehicleImages] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);

    // Calendar state
    const getInitialDate = () => {
        if (registrationNumber) {
            const date = new Date(registrationNumber);
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

    // Prefill fields from existing vehicleInfo if available (edit mode)
    useEffect(() => {
        if (user?.vehicleInfo) {
            setVehiclePlateNumber(user.vehicleInfo.vehiclePlateNumber || "");
            // vehicleInfo stores ISO date – convert to YYYY-MM-DD for input
            if (user.vehicleInfo.registrationNumber) {
                try {
                    const d = new Date(user.vehicleInfo.registrationNumber);
                    if (!isNaN(d.getTime())) {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        const dateStr = `${yyyy}-${mm}-${dd}`;
                        setRegistrationNumber(dateStr);
                        setMonth(d.getMonth());
                        setYear(d.getFullYear());
                        setSelectedDay(d.getDate());
                    }
                } catch (e) {
                    // ignore parse errors, keep default empty
                }
            }
            if (user.vehicleInfo.images && user.vehicleInfo.images.length > 0) {
                const images = user.vehicleInfo.images.map((img, idx) => ({
                    id: String(idx + 1),
                    uri: typeof img === 'string' ? img : img?.file_url || img?.url || img,
                    type: "image/jpeg",
                    name: `vehicle_${idx + 1}.jpg`,
                }));
                setVehicleImages(images);
            }
        }
    }, [user]);

    // Update calendar when registrationNumber changes externally
    useEffect(() => {
        if (registrationNumber) {
            const d = new Date(registrationNumber);
            if (!isNaN(d.getTime())) {
                setMonth(d.getMonth());
                setYear(d.getFullYear());
                setSelectedDay(d.getDate());
            }
        }
    }, [registrationNumber]);

    const handleUploadPicture = () => {
        Alert.alert(
            "Add Vehicle Pictures",
            "Choose an option to add vehicle pictures",
            [
                {
                    text: "Take Photo",
                    onPress: () => launchCamera({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
                        if (response.assets && response.assets.length > 0) {
                            const asset = response.assets[0];
                            const newPic = {
                                id: String(vehicleImages.length + 1),
                                uri: asset.uri,
                                type: asset.type || "image/jpeg",
                                name: asset.fileName || `vehicle_${Date.now()}.jpg`,
                                size: asset.fileSize || 0,
                            };
                            setVehicleImages([...vehicleImages, newPic]);
                        }
                    }),
                },
                {
                    text: "Choose from Gallery",
                    onPress: () => launchImageLibrary({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
                        if (response.assets && response.assets.length > 0) {
                            const asset = response.assets[0];
                            const newPic = {
                                id: String(vehicleImages.length + 1),
                                uri: asset.uri,
                                type: asset.type || "image/jpeg",
                                name: asset.fileName || `vehicle_${Date.now()}.jpg`,
                                size: asset.fileSize || 0,
                            };
                            setVehicleImages([...vehicleImages, newPic]);
                        }
                    }),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const handleRemovePicture = (id) => {
        setVehicleImages(vehicleImages.filter((pic) => pic.id !== id));
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
        setRegistrationNumber(`${yyyy}-${mm}-${dd}`);
        setShowCalendar(false);
    };

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return "Select registration expiry date";
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

    const handleNext = async () => {
        if (!vehiclePlateNumber.trim()) {
            toastError({ text: "Please enter vehicle plate number" });
            return;
        }
        if (!registrationNumber.trim()) {
            toastError({ text: "Please enter vehicle registration expiry date" });
            return;
        }

        try {
            const response = await registerVehicle(
                vehiclePlateNumber,
                 registrationNumber,
                vehicleImages,
                null // registrationCardImage - can be added later if needed
            );

            if (response?.success) {
                if (response?.data?.user) {
                    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
                    dispatch(setUserData(response.data.user));
                }
                toastSuccess({ text: response?.message || "Vehicle information saved successfully" });
                // Navigate to next screen or back
                navigation.navigate(routes.uploadVehicleRegistration);
            } else {
                toastError({ text: response?.message || "Failed to save vehicle information" });
            }
        } catch (error) {
            const msg =
                error?.message || error?.response?.data?.message || "Failed to save vehicle information";
            toastError({ text: msg });
        }
    };

    return (
        <SafeAreaView style={[styles.container,{
            paddingTop:insets.top   
        }]}>
            <View style={styles.content}>
                <ForkLiftHeader
                    title="Tell About your Vehicle"
                    subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
                    onPress={() => navigation.goBack()}
                />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <AppTextInput
                            placeholder="Enter vehicle plate number"
                            value={vehiclePlateNumber}
                            onChangeText={setVehiclePlateNumber}
                        />

                        {/* Registration Expiry Date Calendar */}
                        <TouchableOpacity
                            onPress={() => setShowCalendar(true)}
                            style={styles.dateButton}
                        >
                            <Text style={[
                                styles.dateButtonText,
                                !registrationNumber && styles.dateButtonPlaceholder
                            ]}>
                                {formatDisplayDate(registrationNumber)}
                            </Text>
                            <Image source={appIcons.calandar || appIcons.date} style={styles.calendarIcon} />
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
                                        <Text style={styles.modalTitle}>Select Registration Expiry Date</Text>
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

                    {/* Image Upload Section */}
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Add Vehicle Pictures</Text>

                        <View style={styles.picturesRow}>
                            {/* Upload Button */}
                            <TouchableOpacity
                                style={styles.uploadBox}
                                onPress={handleUploadPicture}
                            >
                                <Image source={appIcons.gallery} style={styles.uploadIcon} />
                                <Text style={styles.uploadText}>Upload Picture</Text>
                            </TouchableOpacity>

                            {/* Render Uploaded Pictures */}
                            <FlatList
                                horizontal
                                data={vehicleImages}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ padding: widthPixel(10) }}
                                renderItem={({ item }) => (
                                    <View style={styles.pictureWrapper}>
                                        <Image source={{ uri: item.uri }} style={styles.picture} />
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => handleRemovePicture(item.id)}
                                        >
                                            <Text style={styles.removeText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Next Button */}
                <View style={styles.buttonContainer}>
                    <AppButton
                        title={loading || uploading ? "SUBMITTING..." : "NEXT"}
                        onPress={handleNext}
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        disabled={loading || uploading}
                    />
                </View>
            </View>
            <Loader isVisible={loading || uploading} />
        </SafeAreaView>
    );
};

export default TellAboutVehicle;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: widthPixel(20),
    },
    scrollView: {
        flex: 1,
    },
    inputContainer: {
        marginTop: heightPixel(30),
    },
    imageSection: {
        marginTop: heightPixel(20),
    },
    sectionTitle: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
        marginBottom: heightPixel(10),
    },
    picturesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: heightPixel(20),
    },
    uploadBox: {
        width: widthPixel(100),
        height: widthPixel(100),
        borderRadius: widthPixel(8),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.themeColor,
        justifyContent: "center",
        alignItems: "center",
        marginRight: widthPixel(10),
    },
    uploadIcon: {
        width: widthPixel(24),
        height: widthPixel(24),
        tintColor: colors.themeColor,
        marginBottom: heightPixel(6),
    },
    uploadText: {
        fontSize: fontPixel(12),
        color: colors.themeColor,
        textAlign: "center",
    },
    pictureWrapper: {
        position: "relative",
        marginRight: widthPixel(10),
        overflow: "visible",
    },
    picture: {
        width: widthPixel(100),
        height: widthPixel(100),
        borderRadius: widthPixel(8),
    },
    removeBtn: {
        position: "absolute",
        top: -6,
        right: -6,
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
    buttonContainer: {
        paddingVertical: heightPixel(20),
    },
    nextButton: {
        backgroundColor: colors.greyText,
        borderRadius: widthPixel(10),
        paddingVertical: heightPixel(15),
    },
    nextButtonText: {
        color: colors.white,
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoSemiBold,
        textAlign: "center",
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        borderRadius: widthPixel(10),
        paddingHorizontal: widthPixel(15),
        paddingVertical: heightPixel(15),
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginTop: heightPixel(12),
    },
    dateButtonText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.black,
        flex: 1,
    },
    dateButtonPlaceholder: {
        color: "#999",
    },
    calendarIcon: {
        width: widthPixel(20),
        height: widthPixel(20),
        resizeMode: "contain",
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