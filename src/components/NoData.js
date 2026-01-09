import { Image, Text, View } from "react-native";
import { appIcons,   } from "../services/utilities/assets";
import { fontPixel, heightPixel } from "../services/constant";
import { colors } from "../services/utilities/colors";
import { fonts } from "../services/utilities/fonts";

const NoData = ({text="No data found"}) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{   }}>
        <Image source={appIcons.workPackIcon} style={{ width: heightPixel(100), height: heightPixel(100),resizeMode: "contain" }} />
        <Text style={{ fontSize: fontPixel(16), color: colors.greyText, fontFamily: fonts.NunitoRegular }}>{text}</Text>
        </View>
       
    </View>
  );
};

export default NoData;