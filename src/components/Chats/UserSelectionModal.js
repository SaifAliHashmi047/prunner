import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { colors } from "../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../services/constant";
import { fonts } from "../../services/utilities/fonts";
import { appIcons } from "../../services/utilities/assets";
import useUsers from "../../hooks/useUsers";
import { Loader } from "../Loader";
import SafeImageBackground from "../SafeImageBackground";

const UserSelectionModal = ({ visible, onClose, onSelectUser, currentUserId }) => {
  const {
    users,
    loading,
    refreshing,
    loadMore,
    onRefresh,
    loadingMore,
    fetchUsers,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const onEndReachedCalledDuringMomentum = useRef(true);

  useEffect(() => {
    if (visible) {
      fetchUsers(1);
      setSelectedUser(null);
    }
  }, [visible]);

  const handleSelectUser = (user) => {
    setSelectedUser(user._id);
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        style={{ marginVertical: heightPixel(20) }}
        size="small"
        color={colors.themeColor}
      />
    );
  };

  const renderUser = ({ item }) => {
    // Don't show current user in the list
    if (item._id === currentUserId) return null;

    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          selectedUser === item._id && styles.activeCard,
        ]}
        onPress={() => handleSelectUser(item)}
      >
        <SafeImageBackground
          source={item?.profileImage || item?.image ? { uri: item.profileImage || item.image } : null}
          name={item?.name || item?.email || "User"}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item?.name || item?.email}</Text>
          {item?.email && item?.name && (
            <Text style={styles.userEmail}>{item.email}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create New Chat</Text>
            <Text style={styles.subtitle}>Select a user to chat with</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image source={appIcons.cross} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Users List */}
          <FlatList
            data={users}
            keyExtractor={(item) => item._id || item.id}
            renderItem={renderUser}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No users found</Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current) {
                loadMore();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={renderFooter}
          />
        </View>
      </View>
      <Loader isVisible={loading && !refreshing} />
    </Modal>
  );
};

export default UserSelectionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.white,
    borderRadius: widthPixel(20),
    overflow: "hidden",
  },
  header: {
    padding: widthPixel(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    position: "relative",
  },
  title: {
    fontSize: fontPixel(18),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.themeColor,
    marginBottom: heightPixel(4),
  },
  subtitle: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoRegular,
    color: colors.grey300,
  },
  closeButton: {
    position: "absolute",
    right: widthPixel(20),
    top: widthPixel(20),
    padding: widthPixel(4),
  },
  closeIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    resizeMode: "contain",
    // tintColor: colors.black,
  },
  listContent: {
    padding: widthPixel(20),
    paddingBottom: heightPixel(20),
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(14),
    paddingHorizontal: widthPixel(14),
    marginBottom: heightPixel(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeCard: {
    borderColor: colors.themeColor,
    backgroundColor: "#F7F1FF",
  },
  avatar: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    marginRight: widthPixel(12),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  userEmail: {
    fontSize: fontPixel(12),
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
});

