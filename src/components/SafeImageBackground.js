import React, { useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { colors } from "../services/utilities/colors";

const RenderIntial = ({ style, intials } ) => {
  return (
    <View style={style}>
      <Text style={{color: colors.white}}>{intials}</Text>
    </View>
  );
};

const SafeImageBackground = ({
  source,
  fallbackSource,
  name,
  style,
  resizeMode = "cover",
  children,
}) => {
  const [finalSource, setFinalSource] = useState(source);
  const uri = source ? source?.uri : null;

  const handleLoad = (event) => {
    const isValidImage =
      event?.nativeEvent?.source?.width !== 1 &&
      event?.nativeEvent?.source?.height !== 1;
    setFinalSource(isValidImage ? source : fallbackSource);
  };

  return (
    <>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: 1, height: 1, position: "absolute", opacity: 0 }}
          onLoad={handleLoad}
        />
      ) : null}

      {uri ? (
        <ImageBackground
          source={uri ? finalSource : fallbackSource}
          style={[
            {
              backgroundColor: colors.gray,
        overflow: "hidden",

            },
            style,
          ]}
          resizeMode={resizeMode}
        >
          {children}
        </ImageBackground>
      ) : (
        <RenderIntial
          style={[
            {
              backgroundColor: colors.gray,
              justifyContent: "center",
              alignItems: "center",
            },
            style,

          ]}
          intials={  name?.split(" ").slice(0, 2).map((item) => item[0])?.join("")?.toUpperCase()|| "MA"}
        />
      )}
    </>
  );
};

export default SafeImageBackground;
