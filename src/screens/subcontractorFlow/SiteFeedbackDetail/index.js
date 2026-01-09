import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts } from "../../../services/utilities/fonts";

const SiteFeedbackDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { feedback } = route.params || {};
  const insets = useSafeAreaInsets();

  if (!feedback) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={appIcons.back} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>No feedback data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(feedback.createdAt || feedback.created_at || Date.now());
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={appIcons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: heightPixel(40) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>
          {feedback.title || "Feedback"}
        </Text>

        {/* Optional subtitle: site name */}
        {feedback.siteId?.name ? (
          <Text style={styles.subtitle}>
            {feedback.siteId.name}
          </Text>
        ) : null}

        {/* Description */}
        {feedback.description ? (
          <Text style={styles.description}>{feedback.description}</Text>
        ) : null}

        {/* Media row */}
        {feedback.media && feedback.media.length > 0 && (
          <View style={styles.mediaRow}>
            {feedback.media.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SiteFeedbackDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(10),
  },
  backIcon: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: "contain",
  },
  dateText: {
    fontSize: fontPixel(12),
    color: colors.themeColor,
    fontFamily: fonts.NunitoRegular,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(10),
  },
  title: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
    marginBottom: heightPixel(8),
  },
  subtitle: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyBg,
    marginBottom: heightPixel(12),
  },
  description: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.greyBg,
    lineHeight: heightPixel(20),
    marginBottom: heightPixel(16),
  },
  mediaRow: {
    flexDirection: "row",
    marginTop: heightPixel(12),
    gap: widthPixel(12),
  },
  mediaImage: {
    width: widthPixel(120),
    height: widthPixel(120),
    borderRadius: widthPixel(12),
    backgroundColor: colors.greyBg,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontPixel(14),
    color: colors.greyBg,
    fontFamily: fonts.NunitoRegular,
  },
});


