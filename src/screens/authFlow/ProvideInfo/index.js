import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { routes } from "../../../services/constant";
import styles from "./styles";
import {
  toastError,
  toastSuccess,
} from "../../../services/utilities/toast/toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../services/store/slices/userSlice";
import { Loader } from "../../../components/Loader";
import useCallApi from "../../../hooks/useCallApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProvideInfo = ({ navigation, route }) => {
  const scannedCode = route?.params?.inductionNumber || "";
  const goBack = route?.params?.goBack || false;
  const [inductionNumber, setInductionNumber] = useState(scannedCode);
  const [loading, setLoading] = useState(false);
  const { callApi } = useCallApi();
  const dispatch = useDispatch();
  // Update state when route params change
  useEffect(() => {
    if (scannedCode) {
      setInductionNumber(scannedCode);
    }
  }, [scannedCode]);
  const handleNext = async () => {
    try {
      setLoading(true);
      const response = await callApi("user/update-me", "PATCH", {
        inductionNumber,
      });
      if (response?.success) {
        toastSuccess({
          text: response?.message || "Induction number provided successfully",
        });
        dispatch(setUserData(response?.data?.user));
        await AsyncStorage.setItem("user", JSON.stringify(response?.data?.user));
        if (goBack) {
           const  route = response?.data?.user?.role === "subConstructor" ? routes.subcontractorFlow : routes.forkliftFlow;
            navigation.navigate(route);
        } else {
          navigation.navigate(routes.auth, {
            screen: routes.verificationProcess,
          });
        }
      } else {
        toastError({
          text: response?.message || "Failed to provide induction number",
        });
      }
    } catch (error) {
      toastError({
        text: error?.message || "Failed to provide induction number",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <Loader loading={loading} />
      <View style={styles.container}>
        <Text style={styles.title}>Please Provide Info</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
        </Text>
        <AppTextInput
          placeholder="Enter your induction number"
          value={inductionNumber}
          onChangeText={setInductionNumber}
          keyboardType="default"
        />

        <View style={styles.footer}>
          <AppButton
            title="NEXT"
            onPress={handleNext}
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ProvideInfo;
