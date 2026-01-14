import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../services/constant";
import { fonts } from "../../services/utilities/fonts";

interface SearchBarFilterProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const SearchBarFilter: React.FC<SearchBarFilterProps> = ({
  value,
  onChangeText,
  placeholder = "Search",
  leftIcon,
  icon,
  onRightIconClick,
}) => {
  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
      />
      {icon && (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={onRightIconClick}
          activeOpacity={0.7}
        >
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBF0",
    borderRadius: heightPixel(30),
    height: heightPixel(40),
    paddingHorizontal: widthPixel(12),
  },
  leftIconContainer: {
    marginRight: widthPixel(8),
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: fontPixel(13),
    fontFamily: fonts.NunitoRegular,
    paddingVertical: 0,
  },
  rightIconContainer: {
    marginLeft: widthPixel(8),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchBarFilter;
