import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ForkLiftHeader, AppButton } from "../../../components";
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
import { useAppSelector } from "../../../services/store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UploadButton from "../../../components/UploadButton";

const UploadVehicleRegistration = ({ navigation, route }) => {
    const { uploadRegistrationCard, loading, uploading } = useForkliftDocs();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.user);
    const [registrationCardImage, setRegistrationCardImage] = useState(null);
    const insets = useSafeAreaInsets();

    // Check for scanned image from route params
    useFocusEffect(
      useCallback(() => {
        const scannedImage = route?.params?.scannedImage;
        if (scannedImage) {
          setRegistrationCardImage(scannedImage);
          // Clear params to avoid re-setting on subsequent focuses
          navigation.setParams({ scannedImage: undefined });
        }
      }, [route?.params?.scannedImage, navigation])
    );
  
    const handlePickImage = () => {
      Alert.alert(
        "Add Registration Card",
        "Choose an option",
        [
          {
            text: "Take Photo",
            onPress: () => launchCamera({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
              if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setRegistrationCardImage({
                  uri: asset.uri,
                  type: asset.type || "image/jpeg",
                  name: asset.fileName || `registration_card_${Date.now()}.jpg`,
                });
              }
            }),
          },
          {
            text: "Choose from Gallery",
            onPress: () => launchImageLibrary({ mediaType: 'photo' , maxHeight: 1000 , maxWidth: 1000 }, (response) => {
              if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setRegistrationCardImage({
                  uri: asset.uri,
                  type: asset.type || "image/jpeg",
                  name: asset.fileName || `registration_card_${Date.now()}.jpg`,
                });
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
  
    const handleRemoveFile = () => {
      setRegistrationCardImage(null);
    };

    const handleNext = async () => {
      if (!registrationCardImage) {
        toastError({ text: "Please upload registration card image" });
        return;
      }

      try {
        const response = await uploadRegistrationCard(registrationCardImage);

        if (response?.success) {
          if (response?.data?.user) {
            dispatch(setUserData(response.data.user));
          }
          toastSuccess({ text: response?.message || "Registration card uploaded successfully" });
          navigation.navigate(routes.verificationProcess);
        } else {
          toastError({ text: response?.message || "Failed to upload registration card" });
        }
      } catch (error) {
        const msg =
          error?.message || error?.response?.data?.message || "Failed to upload registration card";
        toastError({ text: msg });
      }
    };

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop:insets.top   
    }]}>
         {/* Header */}
         <View style={{
           flex: 1,
           paddingHorizontal: widthPixel(20)
         }}>
           {/* Title & Subtitle */}
           <ForkLiftHeader 
             title="Upload Vehicle Registration Card"
             subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
             onPress={() => navigation.goBack()}
           />
           {/* <Text style={styles.title}></Text>
           <Text style={styles.subtitle}>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
           </Text> */}
   
           {/* File Card */}
           {registrationCardImage ? (
             <View style={styles.fileCard}>
               <View style={styles.fileRow}>
                 {registrationCardImage.type?.includes("image") && registrationCardImage.uri ? (
                   <Image
                     source={{ uri: registrationCardImage.uri }}
                     style={styles.fileImagePreview}
                   />
                 ) : (
                   <Image source={appIcons.pdf} style={styles.fileIcon} />
                 )}
                 <View style={{ flex: 1 }}>
                   <Text style={styles.fileName} numberOfLines={1}>
                     {registrationCardImage.name || "Registration Card"}
                   </Text>
                   <Text style={styles.fileSize}>
                     {registrationCardImage.size
                       ? typeof registrationCardImage.size === "number"
                         ? `${Math.round(registrationCardImage.size / 1024)} KB`
                         : registrationCardImage.size
                       : "Scanned image"}
                   </Text>
                 </View>
                 <TouchableOpacity onPress={handleRemoveFile}>
                   <Image source={appIcons.cross} style={styles.deleteIcon} />
                 </TouchableOpacity>
               </View>
             </View>
           ) : (
             <UploadButton
              title="Upload Registration Card"
              onPress={handlePickImage}
              style={styles.uploadBox}
              disabled={loading || uploading}
             />
           )}
   
           {/* Bottom Buttons */}
           <View style={styles.bottom}>
             <AppButton
               title="SCAN"
               style={styles.scanBtn}
               textStyle={{ color: colors.themeColor }}
               onPress={() => navigation.navigate(routes.auth, { screen: routes.scanVehicleRegistration })}
               disabled={loading || uploading}
             />
             <AppButton
               title={loading || uploading ? "UPLOADING..." : "NEXT"}
               style={styles.nextBtn}
               textStyle={{ color: colors.white }}
               onPress={handleNext}
               disabled={!registrationCardImage || loading || uploading}
             />
           </View>
           <Loader isVisible={loading || uploading} />
         </View>
   
   
       </SafeAreaView>
  );
};

export default UploadVehicleRegistration;

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
  uploadBox: {
    width: "100%",
    height: heightPixel(150),
    borderRadius: widthPixel(10),
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginTop: heightPixel(20),
  },
  uploadIcon: {
    width: widthPixel(40),
    height: widthPixel(40),
    tintColor: colors.themeColor,
    marginBottom: heightPixel(10),
  },
  uploadText: {
    fontSize: fontPixel(14),
    color: colors.themeColor,
    fontFamily: fonts.NunitoSemiBold,
  },
});
