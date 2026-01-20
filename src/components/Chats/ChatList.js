import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import { useChat } from "../../hooks/useChat";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
import { Loader } from "../Loader";

export const ChatListScreen = () => {
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;
  const navigation = useNavigation();
  const [usersSelectionModalVisible, setUsersSelectionModalVisible] =
    useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const {
    chats,
    loadingChats,
    fetchChats,
  } = useChat({ userId });
  const insets = useSafeAreaInsets();

  // Clear error when chats successfully load
  React.useEffect(() => {
    if (chats.length > 0 && errorLoading) {
      setErrorLoading(false);
     
    }
    if(chats?.length > 0){
      setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 5000);
   
  }, [chats.length, errorLoading]);

  // Refresh chats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        setErrorLoading(false);
        fetchChats();
      }
    }, [userId, fetchChats])
  );

  // Detect when loading completes but no chats received (potential error)
  React.useEffect(() => {
    if (!loadingChats && !refreshing && userId && chats.length === 0) {
      // If we're not loading, not refreshing, have a userId, but no chats,
      // it might indicate a failed load (though empty chats could also be valid)
      // We'll set error only if we've been waiting for a while
      const timeoutId = setTimeout(() => {
        setErrorLoading(true);
      }, 3000); // 3 second delay to allow for initial load
      
      return () => clearTimeout(timeoutId);
    } else {
      setErrorLoading(false);
    }
  }, [loadingChats, refreshing, userId, chats.length]);

  const handleSelectUser = (selectedUser) => {
    setUsersSelectionModalVisible(false);
    // Navigate to chat screen with receiverId, chatId will be null for new chat
    navigation.navigate(routes.chatDetail, {
      chatId: null, // null indicates new chat
      receiverId: selectedUser._id,
      receiverName: selectedUser.name || selectedUser.email,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setErrorLoading(false);
    fetchChats();
    // Reset refreshing after a delay (fetchChats doesn't return a promise)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.themeColor]}
            tintColor={colors.themeColor}
          />
        }
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
    {user?.role !== "forklift" && <TouchableOpacity
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
      </TouchableOpacity>}
      <UserSelectionModal
        visible={usersSelectionModalVisible}
        onClose={() => setUsersSelectionModalVisible(false)}
        onSelectUser={handleSelectUser}
        currentUserId={userId}
      />
      <Loader isVisible={(loadingChats || errorLoading) && !refreshing} />
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
