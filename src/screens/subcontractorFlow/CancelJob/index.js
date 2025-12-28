import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { SecondHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";

const CancelJob = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    "Aliquam ultricies fermentum elit,",
    "Phasellus accumsan nulla ac velit",
    "Mauris augue nisi",
    "Lorem ipsum dolor sit amet",
    "Other",
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={{
        flex: 1,
        paddingHorizontal: widthPixel(20),

      }}>
        <SecondHeader onPress={() => navigation.goBack()} title="Cancel Job" />

        {/* Description */}
        <Text style={styles.description}>
          Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
        </Text>

        {/* Options */}
        <View style={{ marginTop: heightPixel(10) }}>
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, isSelected && styles.optionSelected]}
                onPress={() => setSelectedOption(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <AppButton
            title="CANCEL JOB"
            disabled={!selectedOption}
            style={{
              backgroundColor: selectedOption ? colors.themeColor : '#8D8D8D',
            }}
            textStyle={{
              color: colors.white,
            }}
            onPress={() => {
              navigation.navigate(routes.cancelJobOther);
            }}
          />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default CancelJob;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: heightPixel(10),
  },
  description: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
    marginTop: heightPixel(14),
    marginBottom: heightPixel(10),
  },
  optionButton: {
    backgroundColor: "#F3F3F3",
    borderRadius: widthPixel(20),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(16),
    marginVertical: heightPixel(6),
  },
  optionSelected: {
    backgroundColor: colors.themeColor , // light tint of theme
    // borderWidth: 1,
    // borderColor: colors.themeColor,
  },
  optionText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: '#666666',
    textAlign: "center",
  },
  optionTextSelected: {
    fontFamily: fonts.NunitoSemiBold,
    color: colors.white,
  },
  footer: {
    marginTop: "auto",
    marginBottom: heightPixel(20),
  },
});