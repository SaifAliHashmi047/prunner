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
import { AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import useForkliftDocs from "../../../hooks/useForkliftDocs";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../services/store/slices/userSlice";

// Optional DocumentScanner - will show error if not available
let DocumentScanner = null;
try {
  DocumentScanner = require("react-native-document-scanner-plugin").default;
} catch (e) {
  console.log("DocumentScanner not available");
}

const ScanVehicleRegistration = ({ navigation }) => {
  const { uploadRegistrationCard, loading, uploading } = useForkliftDocs();
  const dispatch = useDispatch();
  const [registrationCardImage, setRegistrationCardImage] = useState(null);

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
          name: `registration_card_${Date.now()}.jpg`,
        };

        setRegistrationCardImage(customImageObject);
      }
    } catch (error) {
      console.log("Scan document error", error);
      if (error?.message && !error.message.includes("User cancelled")) {
        toastError({ text: "Failed to scan document" });
      }
    }
  };

  const handleNext = async () => {
    if (!registrationCardImage) {
      toastError({ text: "Please scan the vehicle registration card" });
      return;
    }

    try {
      const response = await uploadRegistrationCard(registrationCardImage);
      
      if (response?.success) {
        if (response?.data?.user) {
          dispatch(setUserData(response.data.user));
        }
        toastSuccess({ text: response?.message || "Registration card uploaded successfully" });
        navigation.navigate(routes.forkliftFlow );
      } else {
        toastError({ text: response?.message || "Failed to upload registration card" });
      }
    } catch (error) {
      const msg =
        error?.message || error?.response?.data?.message || "Failed to upload registration card";
      toastError({ text: msg });
    }
  };

  const scanningText = "Please tap on the blue box to start scanning your vehicle registration card";
  const imageSource = registrationCardImage?.path || registrationCardImage?.uri || appImages.lic;

  return (
    <ImageBackground
      source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
      style={styles.scanContainer}
    >
      <View style={styles.scanOverlay}>
        <TouchableOpacity
          onPress={() => {
            setRegistrationCardImage(null);
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Image source={appIcons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.scanContent}>
          <Text style={styles.scanHeaderText}>
            Scan Your Vehicle Registration Card
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
          {registrationCardImage && (
            <View style={styles.scannedImagePreview}>
              <Text style={styles.previewLabel}>Registration Card</Text>
              <Image
                source={{ uri: registrationCardImage.path || registrationCardImage.uri }}
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
            disabled={!registrationCardImage || loading || uploading}
          />
        </View>
      </View>
      <Loader isVisible={loading || uploading} />
    </ImageBackground>
  );
};

export default ScanVehicleRegistration;

const styles = StyleSheet.create({
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
