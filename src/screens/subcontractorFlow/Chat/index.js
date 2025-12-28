import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { appIcons } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";

// Sample data for chat messages
const chatData = [
  {
    id: "1",
    name: "Side Name",
    message: "Thanks everyone",
    time: "8:25 PM",
    unreadCount: 4,
    avatar: appIcons.dummyPic,
  },
  {
    id: "2",
    name: "Jasmine Holloway",
    message: "Thanks everyone",
    time: "8:25 PM",
    unreadCount: 0,
    avatar: appIcons.dummyPic,
  },
  {
    id: "3",
    name: "Sophie Langley",
    message: "Thanks everyone",
    time: "8:25 PM",
    unreadCount: 4,
    avatar: appIcons.dummyPic,
  },
  {
    id: "4",
    name: "Chloe Prescott",
    message: "Thanks everyone",
    time: "8:25 PM",
    unreadCount: 4,
    avatar: appIcons.dummyPic,
  },
  {
    id: "5",
    name: "Meysam Jarahkar",
    message: "Thanks everyone",
    time: "8:25 PM",
    unreadCount: 4,
    avatar: appIcons.dummyPic,
  },
];

const Chat = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate(routes.chatDetail)}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.chatMessage}>{item.message}</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.chatTime}>{item.time}</Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadCountContainer}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    // borderBottomWidth: 1,
    // borderBottomColor: colors.greyLight,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: fontPixel(18),
    fontWeight: "600",
    color: colors.black,
    marginBottom: heightPixel(10),
  },
  chatList: {
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(16),
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: heightPixel(12),
    // borderBottomWidth: 1,
    // borderBottomColor: colors.greyLight,
    alignItems: "center",
  },
  avatar: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    marginRight: widthPixel(12),
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: fontPixel(16),
    fontWeight: "600",
    color: colors.greyBg,
    fontFamily : fonts.NunitoSemiBold,
  },
  chatMessage: {
    fontSize: fontPixel(14),
    color: colors.greyBg,
    marginTop: heightPixel(4),
    fontFamily : fonts.NunitoRegular,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  chatTime: {
    fontSize: widthPixel(12),
    color: colors.greyLight,
    fontFamily : fonts.NunitoRegular,
    marginBottom: heightPixel(4),
  },
  unreadCountContainer: {
    marginTop: heightPixel(4),
    height: heightPixel(16),
    width: widthPixel(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPixel(8),
    backgroundColor: colors.blue,
  },
  unreadCount: {
    color: colors.white,
    fontSize: widthPixel(12),
    fontWeight: "600",
  },
});

export default Chat;