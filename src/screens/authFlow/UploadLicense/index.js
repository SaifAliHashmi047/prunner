import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  Linking,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { SecondHeader, AppButton, ForkLiftHeader, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import useForkliftDocs from "../../../hooks/useForkliftDocs";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../services/store/slices/userSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UploadButton from "../../../components/UploadButton";
import { useAppSelector } from "../../../services/store/hooks";

// Optional DocumentPicker - will use image picker as fallback
let DocumentPicker = null;
try {
  DocumentPicker = require("react-native-document-picker").default;
} catch (e) {
  console.log("DocumentPicker not available, using image picker only");
}

// Optional DocumentScanner - will show error if not available
let DocumentScanner = null;
try {
  DocumentScanner = require("react-native-document-scanner-plugin").default;
} catch (e) {
  console.log("DocumentScanner not available");
}

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

const UploadLicense = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { uploadLicense, loading, uploading } = useForkliftDocs();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  // Calendar state
  const getInitialDate = () => {
    if (expiryDate) {
      const date = new Date(expiryDate);
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

  // Prefill fields from existing driverInfo if available (edit mode)
  useEffect(() => {
    if (user?.driverInfo) {
      setLicenseNumber(user.driverInfo.drivingLicenseNumber || "");
      // driverInfo stores ISO date – convert to YYYY-MM-DD for input
      if (user.driverInfo.drivingLicenseExpiryDate) {
        try {
          const d = new Date(user.driverInfo.drivingLicenseExpiryDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;
            setExpiryDate(dateStr);
            setMonth(d.getMonth());
            setYear(d.getFullYear());
            setSelectedDay(d.getDate());
          }
        } catch (e) {
          // ignore parse errors, keep default empty
        }
      }
      // Do NOT set file/frontImage from existing URL so we only send image if user changes it
    }
  }, [user]);

  // Update calendar when expiryDate changes externally
  useEffect(() => {
    if (expiryDate) {
      const d = new Date(expiryDate);
      if (!isNaN(d.getTime())) {
        setMonth(d.getMonth());
        setYear(d.getFullYear());
        setSelectedDay(d.getDate());
      }
    }
  }, [expiryDate]);
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handlePickDocument = async () => {
    if (!DocumentPicker) {
      // Fallback to image picker if DocumentPicker is not available
      toastError({ text: "Document picker not available. Please use image upload." });
      return;
    }

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        copyTo: "cachesDirectory",
      });

      if (result && result[0]) {
        const selectedFile = result[0];
        setFile({
          name: selectedFile.name || "Driving License",
          size: selectedFile.size || 0,
          type: selectedFile.type || "application/pdf",
          uri: selectedFile.uri,
          path: selectedFile.uri,
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return;
      } else {
        console.log("Document picker error", err);
        toastError({ text: "Failed to pick document" });
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await Image_Picker("gallerynocrop");
      if (image && image.path) {
        const fileName = image.path.split("/").pop() || `license_${Date.now()}.jpg`;
        setFile({
          name: fileName,
          size: image.size || 0,
          type: image.mime || "image/jpeg",
          uri: image.path,
          path: image.path,
        });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.log("Image picker error", error);
        toastError({ text: "Failed to pick image" });
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFrontImage(null);
  };

  const handleRemoveScannedImages = () => {
    setFrontImage(null);
    setIsScanning(false);
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
    setExpiryDate(`${yyyy}-${mm}-${dd}`);
    setShowCalendar(false);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select expiry date";
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

  const scanDocument = async () => {
    if (!DocumentScanner) {
      toastError({ text: "Document scanner not available. Please install react-native-document-scanner-plugin" });
      return;
    }

    if (Platform.OS === "android") {
      try {
        const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
        const hasPermission = await PermissionsAndroid.check(cameraPermission);
        
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            cameraPermission,
            {
              title: "Camera Permission",
              message: "ProjectRunner needs access to your camera to scan documents",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Camera permission is required to scan documents. Please grant permission in app settings.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Open Settings", 
                  onPress: () => {
                    Linking.openSettings();
                  }
                }
              ]
            );
            return;
          }
        }
      } catch (error) {
        console.log("Permission error", error);
        toastError({ text: "Failed to request camera permission" });
        return;
      }
    }

    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        croppedImageQuality: 30,
      });
      
      if (scannedImages && scannedImages.length > 0) {
        const scannedImage = scannedImages[0];
        const fileName = `license_front_${Date.now()}.jpg`;
        const fileObject = {
          name: fileName,
          size: undefined,
          type: "image/jpeg",
          uri: scannedImage,
          path: scannedImage,
        };

        // Set both file (for display) and frontImage (for upload)
        setFile(fileObject);
        setFrontImage({
          height: undefined,
          mime: "image/jpeg",
          modificationDate: new Date().getTime(),
          path: scannedImage,
          uri: scannedImage,
          size: undefined,
          width: undefined,
          type: "image/jpeg",
          name: fileName,
        });

        // Return to main view after scanning
        setIsScanning(false);
        toastSuccess({ text: "Document scanned successfully" });
      }
    } catch (error) {
      console.log("Scan document error", error);
      if (error?.message && !error.message.includes("User cancelled")) {
        toastError({ text: "Failed to scan document" });
      }
    }
  };

  const handleScan = () => {
    if (!DocumentScanner) {
      toastError({ text: "Document scanner not available. Please use upload options." });
      return;
    }
    setIsScanning(true);
    setFrontImage(null);
  };

  const handleNext = async () => {
    // Validate license number and expiry date
    if (!licenseNumber.trim()) {
      toastError({ text: "Please enter your license number" });
      return;
    }

    if (!expiryDate.trim()) {
      toastError({ text: "Please enter your license expiry date" });
      return;
    }

    // Check if file or scanned image exists
    if (!file && !frontImage) {
      toastError({ text: "Please upload or scan your driving license" });
      return;
    }

    try {
      // Use frontImage if available (from scanning), otherwise use file
      const imageToUpload = frontImage || file;
      const response = await uploadLicense(licenseNumber, expiryDate, imageToUpload, file);
      
      if (response?.success) {
        if (response?.data?.user) {
          dispatch(setUserData(response.data.user));
        }
        toastSuccess({ text: response?.message || "License uploaded successfully" });
        navigation.navigate(routes.tellAboutVehicle);
      } else {
        toastError({ text: response?.message || "Failed to upload license" });
      }
    } catch (error) {
      const msg =
        error?.message || error?.response?.data?.message || "Failed to upload license";
      toastError({ text: msg });
    }
  };

  // Scanning UI
  if (isScanning) {
    const scanningText = "Please tap on the blue box to start scanning your document front side";

    const imageSource = frontImage?.path || frontImage?.uri || appImages.lic;

    return (
      <ImageBackground
        source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
        style={styles.scanContainer}
      >
        <View style={styles.scanOverlay}>
          <TouchableOpacity
            onPress={() => {
              setIsScanning(false);
              setFrontImage(null);
            }}
            style={styles.backButton}
          >
            <Image source={appIcons.backArrow} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.scanContent}>
            <Text style={styles.scanHeaderText}>
              Scan Your Driving License or ID card
            </Text>
            <Text style={styles.scanText}>{scanningText}</Text>
          </View>

          <TouchableOpacity
            onPress={scanDocument}
            style={styles.scanBoxContainer}
          >
            <Image
              style={styles.scanBox}
              source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
            />
          </TouchableOpacity>

          <View style={styles.scanBottom}>
            {frontImage && (
              <View style={styles.scannedImagePreview}>
                <Text style={styles.previewLabel}>Front</Text>
                <Image
                  source={{ uri: frontImage.path || frontImage.uri }}
                  style={styles.previewImage}
                />
              </View>
            )}
          </View>

          <View style={styles.scanButtonContainer}>
            <AppButton
              title={loading || uploading ? "UPLOADING..." : "NEXT"}
              style={styles.scanNextBtn}
              textStyle={{ color: colors.white }}
              onPress={handleNext}
              disabled={!frontImage || loading || uploading}
            />
          </View>
        </View>
        <Loader isVisible={loading || uploading} />
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop:insets.top
    }]}>
      {/* Header */}
      <View style={{
        flex: 1,
        paddingHorizontal: widthPixel(20),
      }}>
        {/* Title & Subtitle */}
        <ForkLiftHeader 
          title="Upload your Driving License"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onPress={() => navigation.goBack()}
        />

        {/* Upload Options */}
        {!file && (
          <View style={styles.uploadOptions}>
            {DocumentPicker && (
              <UploadButton
                title="UPLOAD DOCUMENT"
                style={styles.uploadBtn}
                onPress={handlePickDocument}
              />
            )}
            <UploadButton
              title="UPLOAD IMAGE"
              style={styles.uploadBtn}
              textStyle={{ color: colors.themeColor }}
              onPress={handlePickImage}
            />
          </View>
        )}

        {/* File Card */}
        {file && (
          <View style={styles.fileCard}>
            <View style={styles.fileRow}>
              {file.type?.includes("image") && file.uri ? (
                <Image
                  source={{ uri: file.uri }}
                  style={styles.fileImagePreview}
                />
              ) : (
                <Image
                  source={appIcons.pdf}
                  style={styles.fileIcon}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>
                  {typeof file.size === "number"
                    ? formatFileSize(file.size)
                    : file.size || "Scanned image"}
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemoveFile}>
                <Image source={appIcons.cross} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* License Number Input */}
        <AppTextInput
          placeholder="Enter license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          style={{ marginTop: heightPixel(20) }}
        />

        {/* Expiry Date Calendar */}
        <View style={{  }}>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            // style={styles.dateButton}
          >
             <View style={{ backgroundColor: "#f5f5f5",borderRadius:widthPixel(10),padding:widthPixel(10),
              height:heightPixel(50),
             }}>
              <Text>
                {formatDisplayDate(expiryDate)}
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
                  <Text style={styles.modalTitle}>Select Expiry Date</Text>
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

        {/* Bottom Buttons */}
        <View style={styles.bottom}>
          <AppButton
            title="SCAN"
            style={styles.scanBtn}
            textStyle={{ color: colors.themeColor }}
            onPress={handleScan}
            disabled={loading || uploading}
          />
          <AppButton
            title={loading || uploading ? "UPLOADING..." : "NEXT"}
            style={styles.nextBtn}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
            disabled={(!file && !frontImage) || loading || uploading}
          />
        </View>
      </View>
      <Loader isVisible={loading || uploading} />
    </SafeAreaView>
  );
};

export default UploadLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingHorizontal: widthPixel(20),
  },
  title: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginTop: heightPixel(20),
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: "#777",
    fontFamily: fonts.NunitoRegular,
    marginVertical: heightPixel(10),
  },
  fileCard: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(10),
    padding: widthPixel(14),
    marginVertical: heightPixel(20),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    width: widthPixel(35),
    height: widthPixel(35),
    marginRight: widthPixel(10),
    resizeMode: "contain",
  },
  fileImagePreview: {
    width: widthPixel(50),
    height: widthPixel(50),
    marginRight: widthPixel(10),
    borderRadius: widthPixel(8),
    resizeMode: "cover",
  },
  fileName: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  fileSize: {
    fontSize: fontPixel(12),
    color: "#888",
    fontFamily: fonts.NunitoRegular,
  },
  deleteIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    resizeMode: "contain",
    // tintColor: "#999",
  },
  bottom: {
    marginTop: "auto",
    marginBottom: heightPixel(20),
  },
  scanBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginBottom: heightPixel(12),
  },
  nextBtn: {
    backgroundColor: colors.themeColor,
  },
  uploadOptions: {
    marginTop: heightPixel(20),
    gap: heightPixel(12),
  },
  uploadBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginBottom: heightPixel(12),
  },
  scanContainer: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(20),
  },
  backButton: {
    marginTop: heightPixel(10),
    width: widthPixel(40),
    height: widthPixel(40),
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    resizeMode: "contain",
    tintColor: colors.white,
  },
  scanContent: {
    width: "90%",
    paddingStart: "5%",
    marginTop: heightPixel(20),
  },
  scanHeaderText: {
    color: colors.white,
    fontFamily: fonts.NunitoSemiBold,
    fontSize: fontPixel(22),
    marginTop: heightPixel(10),
  },
  scanText: {
    color: colors.white,
    fontFamily: fonts.NunitoRegular,
    fontSize: fontPixel(14),
    marginVertical: heightPixel(5),
  },
  scanBoxContainer: {
    alignSelf: "center",
    marginTop: heightPixel(20),
  },
  scanBox: {
    width: widthPixel(320),
    height: heightPixel(200),
    borderWidth: 4,
    borderRadius: widthPixel(16),
    borderColor: colors.themeColor,
    overflow: "hidden",
  },
  scanBottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: heightPixel(20),
    gap: widthPixel(10),
  },
  scannedImagePreview: {
    alignItems: "center",
  },
  previewLabel: {
    color: colors.white,
    fontFamily: fonts.NunitoSemiBold,
    fontSize: fontPixel(12),
    marginBottom: heightPixel(5),
  },
  previewImage: {
    width: widthPixel(80),
    height: heightPixel(60),
    borderRadius: widthPixel(8),
    borderWidth: 2,
    borderColor: colors.themeColor,
  },
  scanButtonContainer: {
    position: "absolute",
    bottom: heightPixel(30),
    left: widthPixel(20),
    right: widthPixel(20),
  },
  scanNextBtn: {
    backgroundColor: colors.themeColor,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: widthPixel(10),
    paddingHorizontal: widthPixel(15),
    paddingVertical: heightPixel(15),
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    // tintColor: colors.themeColor,
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
