import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SecondHeader, AppButton , ForkLiftHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const UploadLicense = ({ navigation }) => {
  const [file, setFile] = useState({
    name: "User Name Driving License",
    size: "867 Kb",
    type: "pdf",
  });

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleScan = () => {
    // TODO: open document picker / scanner
    console.log("Scan button pressed");
    navigation.navigate(routes.scanLicense);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={{
        flex: 1,
        paddingHorizontal: widthPixel(20)
      }}>
        {/* Title & Subtitle */}
        <ForkLiftHeader 
          title="Upload your Driving License"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onPress={() => navigation.goBack()}
        />
        {/* <Text style={styles.title}></Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text> */}

        {/* File Card */}
        {file && (
          <View style={styles.fileCard}>
            <View style={styles.fileRow}>
              <Image source={appIcons.pdf} style={styles.fileIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileSize}>{file.size}</Text>
              </View>
              <TouchableOpacity onPress={handleRemoveFile}>
                <Image source={appIcons.cross} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Buttons */}
        <View style={styles.bottom}>
          <AppButton
            title="SCAN"
            style={styles.scanBtn}
            textStyle={{ color: colors.themeColor }}
            onPress={handleScan}
          />
          <AppButton
            title="NEXT"
            style={styles.nextBtn}
            textStyle={{ color: colors.white }}
            onPress={() => navigation.navigate(routes.scanLicense)}
          />
        </View>
      </View>


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
});
