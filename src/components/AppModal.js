import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../services/constant";
import { fonts } from "../services/utilities/fonts";
import { appIcons } from "../services/utilities/assets";

const AppModal = ({ visible, onClose, title, subtitle }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Big Circle with Icon */}
          <View style={styles.circleWrapper}>
            <View style={styles.circle}>
              <Image
                source={appIcons.modal} // replace with your check icon
                style={styles.icon}
              />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {title}
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>

          {/* Close Button */}
          {/* <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>OK</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    alignItems: "center",
  },
  circleWrapper: {
    marginBottom: heightPixel(12),
  },
  circle: {
    width: widthPixel(180),
    height: widthPixel(180),
    // borderRadius: widthPixel(50),
    // backgroundColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: widthPixel(140),
    height: widthPixel(140),
    // tintColor: colors.white,
    resizeMode: "contain",
  },
  title: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
    marginTop: heightPixel(10),
  },
  subtitle: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
    textAlign: "center",
    marginVertical: heightPixel(10),
  },
  closeBtn: {
    marginTop: heightPixel(14),
    backgroundColor: colors.themeColor,
    paddingHorizontal: widthPixel(30),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(10),
  },
  closeText: {
    color: colors.white,
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
  },
});
