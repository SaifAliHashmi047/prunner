import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

const messagesData = [
  { id: "1", text: "I’m waiting for you", time: "11:15", type: "received" },
  { id: "2", text: "??", time: "11:15", type: "received" },
  { id: "3", text: "?", time: "11:15", type: "received" },
];

const ChatDetail = ({ navigation }) => {
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={appIcons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={appIcons.dummyPic} style={styles.avatar} />
        <Text style={styles.headerTitle}>Taylor Sofia</Text>
      </View>

      {/* TIMESTAMP DIVIDER */}
      <View style={styles.timeDivider}>
        <View style={styles.line} />
        <Text style={styles.now}>Now</Text>
        <View style={styles.line} />
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: widthPixel(16) }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.type === "sent" ? styles.sent : styles.received,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
      />

      {/* MESSAGE INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={heightPixel(10)}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity>
            <Image source={appIcons.camera} style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={colors.grey300}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Image source={appIcons.mic} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={appIcons.gallery} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: widthPixel(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.greyLight,

  },
  backBtn: {
    paddingRight: widthPixel(8),
  },
  backIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    resizeMode: "contain",
  },
  avatar: {
    width: widthPixel(28),
    height: widthPixel(28),
    borderRadius: widthPixel(14),
    marginHorizontal: widthPixel(8),
  },
  headerTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  timeDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: heightPixel(8),
    paddingHorizontal: widthPixel(16),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.greyLight,
  },
  now: {
    marginHorizontal: widthPixel(10),
    fontSize: fontPixel(12),
    color: colors.grey300,
  },
  messageContainer: {
    maxWidth: "70%",
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(12),
    borderRadius: widthPixel(10),
    marginBottom: heightPixel(8),
  },
  received: {
    backgroundColor: "#F1F1F1",
    alignSelf: "flex-start",
  },
  sent: {
    backgroundColor: colors.themeColor,
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
    lineHeight: fontPixel(18),
    letterSpacing: 0.2,
  },
  messageTime: {
    fontSize: fontPixel(10),
    color: colors.grey300,
    marginTop: heightPixel(4),
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(8),
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: colors.greyLight,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    margin: widthPixel(10),
    borderRadius: widthPixel(30),
  },
  input: {
    flex: 1,
    marginHorizontal: widthPixel(10),
    fontSize: fontPixel(14),
    color: colors.black,
  },
  icon: {
    width: widthPixel(22),
    height: widthPixel(22),
    resizeMode: "contain",
    tintColor: colors.greyDark,
  },
});
