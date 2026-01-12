import React, { useState } from "react";
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

const UploadLicense = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { uploadLicense, loading, uploading } = useForkliftDocs();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

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
  };

  const handleRemoveScannedImages = () => {
    setFrontImage(null);
    setIsScanning(false);
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
      const { scannedImages } = await DocumentScanner.scanDocument();
      
      if (scannedImages && scannedImages.length > 0) {
        const scannedImage = scannedImages[0];
        const customImageObject = {
          height: undefined,
          mime: "image/jpeg",
          modificationDate: new Date().getTime(),
          path: scannedImage,
          uri: scannedImage,
          size: undefined,
          width: undefined,
          type: "image/jpeg",
          name: `license_front_${Date.now()}.jpg`,
        };

        setFrontImage(customImageObject);
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

    // If scanning mode, check if front image is scanned
    if (isScanning) {
      if (!frontImage) {
        toastError({ text: "Please scan the front side of your license" });
        return;
      }

      // Upload scanned image
      try {
        const response = await uploadLicense(licenseNumber, expiryDate, frontImage);
        console.log("license upload success", response);
        
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
      return;
    }

    // Regular file upload
    if (!file && !frontImage) {
      toastError({ text: "Please upload or scan your driving license" });
      return;
    }

    try {
      const response = await uploadLicense(licenseNumber, expiryDate, frontImage, file);
      
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
              <Image
                source={
                  file.type?.includes("image")
                    ? appIcons.pdf
                    : appIcons.pdf
                }
                style={styles.fileIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>
                  {typeof file.size === "number"
                    ? formatFileSize(file.size)
                    : file.size || "Unknown size"}
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

        {/* Expiry Date Input */}
        <AppTextInput
          placeholder="Enter expiry date (YYYY-MM-DD)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          style={{ marginTop: heightPixel(15) }}
        />

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
            disabled={!file || loading || uploading}
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
});
