import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../services/utilities/colors";

const AppTextInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry = false,
  multiline = false,
  style, // allow custom styling from parent
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        multiline && styles.multilineContainer,
        style,
      ]}
    >
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize="none"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"} // keep text aligned properly
      />

      {/* Eye icon only for password inputs */}
      {secureTextEntry && !multiline && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Image
            source={{
              uri: isPasswordVisible
                ? "https://img.icons8.com/material-outlined/24/000000/visible--v1.png"
                : "https://img.icons8.com/material-outlined/24/000000/invisible.png",
            }}
            style={{ width: 24, height: 24, tintColor: "#888" }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  multilineContainer: {
    height: 100, // bigger box for multiline
    alignItems: "flex-start", // top align
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.black,
  },
  multilineInput: {
    textAlignVertical: "top", // ensures text starts from top
    paddingTop: 0,
  },
});
