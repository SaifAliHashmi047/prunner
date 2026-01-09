import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image
} from "react-native";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LocationOnMap = ({ navigation }) => {
const {sites} = useSelector(state => state.site);
const insets = useSafeAreaInsets();
  return (
        <SafeAreaView style={[styles.container,{
          paddingTop: insets.top 
        }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: widthPixel(10), marginTop: heightPixel(10) }}>
          <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
          </Text>

        </View>
        <Image
          source={appImages.locationOnMap}
          style={{
            flex: 1,
            width: "100%",
            height: heightPixel(400),
            marginTop: heightPixel(20),
            paddingHorizontal: widthPixel(0),
          }}
          resizeMode="cover"
        />
        <View style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: heightPixel(20),
          paddingHorizontal: widthPixel(10)
        }}>
          <AppButton
            title="NEXT"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={() => {
              navigation.navigate(routes.selectTask, {
                "materialLocation":sites[0]?.location,
                "dropOffLocation":sites[1]?.location
              })
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationOnMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
});