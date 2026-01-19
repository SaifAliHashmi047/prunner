import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SecondHeader, AppButton, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import useCallApi from "../../../hooks/useCallApi";
import useUsers from "../../../hooks/useUsers";
import { Loader } from "../../../components/Loader";
import {
  toastSuccess,
  toastError,
} from "../../../services/utilities/toast/toast";
import useTasks from "../../../hooks/useTasks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TaskUser = ({ navigation, route }) => {
  const { previousData, selectedInventory } = route.params || {};
  const insets = useSafeAreaInsets();
  // User Hook
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
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { callApi, uploadFile } = useCallApi();
  const { createTask } = useTasks();
  const onEndReachedCalledDuringMomentum = useRef(true);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleCreateTask = async () => {
    if (!selectedUser) return;
    setSubmitting(true);

    try {
      let uploadedPictures = [];

      if (previousData.pictures && previousData.pictures.length > 0) {
        const uploadPromises = previousData.pictures.map((file) =>
          uploadFile(file)
        );
        const urls = await Promise.all(uploadPromises);
        uploadedPictures = urls.map((url) => ({ url }));
      }

      const payload = {
        ...previousData,
        pictures: uploadedPictures,
        assignedTo: selectedUser,
        inventory: selectedInventory,
        // dropOffLocation and materialLocation should already be in previousData
      };

      const response = await createTask(payload);

      if (response?.success) {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.popToTop();
        }, 2000);
      } else {
        toastError({ text: "Failed to create task" });
      }
    } catch (error) {
      console.log("Create task error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size="small"
        color={colors.themeColor}
      />
    );
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[styles.userCard, selectedUser === item._id && styles.activeCard]}
      onPress={() => setSelectedUser(item._id)}
    >
      <Image
        source={item?.image ? { uri: item.image } : null}
        style={styles.avatar}
      />
      <Text style={styles.userName}>{item?.name || item?.email}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop: insets.top
    }]}>
      <SecondHeader onPress={() => navigation.goBack()} title="Select User" />
      <View style={{ flex: 1, paddingHorizontal: widthPixel(20) }}>
        <Text style={styles.subtitle}>Assign this task to a user.</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: heightPixel(100) }}
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No users found
              </Text>
            )
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </View>

      <View style={styles.footer}>
        <AppButton
          title="CREATE TASK"
          style={{ backgroundColor: colors.themeColor }}
          textStyle={{ color: colors.white }}
          disabled={!selectedUser || submitting}
          onPress={handleCreateTask}
        />
      </View>

      <AppModal
        title="Task Created"
        subtitle="Your task has been successfully created and assigned."
        visible={modalVisible}
      />
      <Loader isVisible={loading || submitting} />
    </SafeAreaView>
  );
};

export default TaskUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subtitle: {
    fontSize: fontPixel(14),
    color: "#777",
    fontFamily: fonts.NunitoRegular,
    marginVertical: heightPixel(10),
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
  userName: {
    fontSize: fontPixel(15),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.black,
  },
  footer: {
    position: "absolute",
    bottom: heightPixel(20),
    left: widthPixel(20),
    right: widthPixel(20),
  },
});
