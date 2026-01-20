import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useChat } from "../../hooks/useChat";
import { colors } from "../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../services/constant";
import { fonts } from "../../services/utilities/fonts";
import { appIcons } from "../../services/utilities/assets";
import SafeImageBackground from "../SafeImageBackground";
import { formateDate } from "../../services/utilities/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ChatScreen = ({
  chatId,
  receiverId,
  receiverName,
  receiverImage,
}) => {
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;
  const navigation = useNavigation();

  const {
    messages,
    loadingMessages,
    typingUser,
    openChat,
    fetchOrCreateChat,
    loadMoreMessages,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChat({ userId });

  const [text, setText] = useState("");
  const [isNewChat, setIsNewChat] = useState(!chatId);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
//     fetchOrCreateChat(receiverId);
// return
    if (chatId) {
      // Existing chat - open it
      console.log("[ChatScreen] Existing chat with receiver, opening chat:", chatId, receiverId);
      openChat(chatId, receiverId);
      setIsNewChat(false);
    } else if (receiverId) {
      // New chat - fetch or create chat between users
      setIsNewChat(true);
      console.log("[ChatScreen] New chat with receiver, fetching or creating chat:", receiverId);
      fetchOrCreateChat(receiverId);
    }
  }, [chatId, receiverId]);

  const isSentMessage = (message) => {
    return message.sender?._id === userId || message.senderId === userId;
  };

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop:insets.top
    }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Image source={appIcons.backArrow} style={styles.backIcon} />
          </TouchableOpacity>
          <SafeImageBackground
            source={receiverImage ? { uri: receiverImage } : null}
            name={receiverName || "User"}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{receiverName || "Chat"}</Text>

            {typingUser && (
              <Text style={styles.typingIndicator}> Typing... </Text>
            )}
          </View>
        </View>

        {/* MESSAGES */}
        <FlatList
          data={[...messages].sort((a, b) => {
            // Sort messages by time (oldest first)
            const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
            const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
            return timeA - timeB;
          })}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={{ padding: widthPixel(16), flexGrow: 1 }}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMessages && messages?.length<0 && <ActivityIndicator color={colors.themeColor} />
          }
          renderItem={({ item }) => {
            const isSent = isSentMessage(item);
            const messageTime = item.createdAt || item.timestamp || new Date();

            return (
              <View
                style={[
                  styles.messageContainer,
                  isSent ? styles.sent : styles.received,
                ]}
              >
                <Text
                  style={[styles.messageText, isSent && styles.sentMessageText]}
                >
                  {item.content}
                </Text>
                <Text
                  style={[styles.messageTime, isSent && styles.sentMessageTime]}
                >
                  {formateDate(messageTime, "hh:mm A")}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            !loadingMessages && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {isNewChat ? "Start a conversation..." : "No messages yet"}
                </Text>
              </View>
            )
          }
        />

        {/* MESSAGE INPUT */}
        <View style={styles.inputBar}>
          {/* <TouchableOpacity>
            <Image source={appIcons.camera} style={styles.icon} />
          </TouchableOpacity> */}
          <TextInput
            style={styles.input}
            placeholder={isNewChat ? "Start a conversation..." : "Message..."}
            placeholderTextColor={colors.grey300}
            value={text}
            onChangeText={(val) => {
              setText(val);
              if (receiverId) {
                startTyping(receiverId);
              }
            }}
            onEndEditing={() => {
              if (receiverId) {
                stopTyping(receiverId);
              }
            }}
            onSubmitEditing={() => {
              if (text.trim() && receiverId) {
                sendMessage(receiverId, text.trim(), isNewChat);
                setText("");
              }
            }}
          />
          <TouchableOpacity onPress={() => {
            if (text.trim() && receiverId) {
              sendMessage(receiverId, text.trim(), isNewChat);
              setText("");
            }
          }} disabled={!text.trim() || !receiverId}>
            <Text style={[styles.sendButtonText, (!text.trim() || !receiverId) && styles.sendButtonDisabled]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: heightPixel(60),
    flexDirection: "row",
    alignItems: "center",
    padding: widthPixel(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray,
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
    width: heightPixel(35),
    height: heightPixel(35),
    borderRadius: heightPixel(100),
    marginHorizontal: widthPixel(8),
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  typingIndicator: {
    fontSize: fontPixel(10),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
    marginTop: heightPixel(2),
  },
  emptyContainer: {
    paddingVertical: heightPixel(40),
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
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
  sentMessageText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: fontPixel(10),
    color: colors.grey300,
    marginTop: heightPixel(4),
    alignSelf: "flex-end",
  },
  sentMessageTime: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(8),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray || colors.greyLight,
    marginHorizontal: widthPixel(10),
    borderRadius: widthPixel(30),
  },
  input: {
    flex: 1,
    marginHorizontal: widthPixel(10),
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  icon: {
    width: heightPixel(22),
    height: heightPixel(22),
    resizeMode: "contain",
  },
  sendButtonText: {
    fontSize: fontPixel(14),
    color: colors.themeColor,
    fontFamily: fonts.NunitoRegular,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
