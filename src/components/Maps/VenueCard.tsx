import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { fontPixel, heightPixel, widthPixel } from "../../services/constant";
import { colors } from "../../services/utilities/colors";
import { fonts } from "../../services/utilities/fonts";
import { appIcons } from "../../services/utilities/assets";

interface VenueCardProps {
  item?: any;
  imageUrl?: string;
  name?: string;
  id?: string | number;
  initialIsFavourite?: boolean;
  onPress?: () => void;
  style?: any;
}

const VenueCard: React.FC<VenueCardProps> = ({
  item,
  imageUrl,
  name,
  id,
  initialIsFavourite = false,
  onPress,
  style,
}) => {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const displayName = name || item?.name || "";
  const displayImage = imageUrl || item?.image || "";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, style]}
    >
      {displayImage ? (
        <Image source={{ uri: displayImage }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {displayName}
        </Text>
        {item?.location && (
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default VenueCard
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: widthPixel(12),
    marginRight: widthPixel(12),
    width: widthPixel(200),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: heightPixel(120),
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: heightPixel(120),
    backgroundColor: colors.grey300 || "#E0E0E0",
  },
  content: {
    padding: widthPixel(12),
  },
  name: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(4),
  },
  location: {
    fontSize: fontPixel(12),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyText || "#666",
  },
});