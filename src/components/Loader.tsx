import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { colors } from "../services/utilities/colors";


interface LoaderProps {
  isVisible?: boolean;
  fullBlank?: boolean;
}

export function Loader(props: LoaderProps) {
  const { isVisible, fullBlank } = props;
  return isVisible ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        zIndex: 9999,
      }}
    >
      <ActivityIndicator size={"large"} color={colors?.themeColor} />
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
});
