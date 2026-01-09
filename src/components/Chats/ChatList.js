import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useChat } from "../../hooks/useChat";
import { useNavigation } from "@react-navigation/native";
import {
  fontPixel,
  heightPixel,
  routes,
  widthPixel,
} from "../../services/constant";
import NoData from "../NoData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { colors } from "../../services/utilities/colors";
import { fonts } from "../../services/utilities/fonts";
import { appIcons } from "../../services/utilities/assets";
import UserSelectionModal from "./UserSelectionModal";
import SafeImageBackground from "../SafeImageBackground";
import { formateDate } from "../../services/utilities/helper";

export const ChatListScreen = () => {
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;
  const navigation = useNavigation();
  const [usersSelectionModalVisible, setUsersSelectionModalVisible] =
    useState(false);
  const {
    chats,
    loadingChats,
     
  } = useChat({ userId });
  const insets = useSafeAreaInsets();

  const handleSelectUser = (selectedUser) => {
    setUsersSelectionModalVisible(false);
    // Navigate to chat screen with receiverId, chatId will be null for new chat
    navigation.navigate(routes.chatDetail, {
      chatId: null, // null indicates new chat
      receiverId: selectedUser._id,
      receiverName: selectedUser.name || selectedUser.email,
    });
  };

  if (loadingChats) return <ActivityIndicator />;
  console.log("chats", chats);
  return   (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => {
          const participant = item.participants?.find((p) => p._id !== userId);
          const participantName =
            participant?.name || participant?.email || "Chat";
          const participantImage =
            participant?.profileImage || participant?.image || null;
          const lastMessage = item.lastMessage?.content || "";
          const lastMessageTime =
            item.lastMessage?.createdAt || item.updatedAt || item.createdAt;
          const unreadCount = item.unreadCount || 0;

          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => 
                navigation.navigate(routes.chatDetail, {
                  chatId: item._id,
                  receiverId: participant?._id,
                  receiverName: participantName,
                  receiverImage: participantImage,
                })
              }
            >
              <SafeImageBackground
                source={participantImage ? { uri: participantImage } : null}
                name={participantName}
                style={styles.avatar}
              />
              <View style={styles.chatDetails}>
                <Text style={styles.chatName}>{participantName}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {lastMessage}
                </Text>
              </View>
              <View style={styles.rightSection}>
                {lastMessageTime && (
                  <Text style={styles.chatTime}>
                    {formateDate(lastMessageTime, "hh:mm A")}
                  </Text>
                )}
                {unreadCount > 0 && (
                  <View style={styles.unreadCountContainer}>
                    <Text style={styles.unreadCount}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() =>
          !loadingChats && <NoData text="No chats found" />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setUsersSelectionModalVisible(true);
        }}
      >
        <Image
          source={appIcons.plus}
          style={{
            width: heightPixel(24),
            height: heightPixel(24),
            tintColor: colors.white,
          }}
        />
      </TouchableOpacity>
      <UserSelectionModal
        visible={usersSelectionModalVisible}
        onClose={() => setUsersSelectionModalVisible(false)}
        onSelectUser={handleSelectUser}
        currentUserId={userId}
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
    fontFamily: fonts.NunitoSemiBold,
  },
  chatMessage: {
    fontSize: fontPixel(14),
    color: colors.greyBg,
    marginTop: heightPixel(4),
    fontFamily: fonts.NunitoRegular,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  chatTime: {
    fontSize: widthPixel(12),
    color: colors.greyLight,
    fontFamily: fonts.NunitoRegular,
    marginBottom: heightPixel(4),
  },
  unreadCountContainer: {
    marginTop: heightPixel(4),
    minHeight: heightPixel(16),
    minWidth: widthPixel(16),
    paddingHorizontal: widthPixel(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPixel(8),
    backgroundColor: colors.blue,
  },
  unreadCount: {
    color: colors.white,
    fontSize: widthPixel(10),
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: widthPixel(24),
    bottom: heightPixel(24),
    width: widthPixel(46),
    height: widthPixel(46),
    borderRadius: widthPixel(18),
    backgroundColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
