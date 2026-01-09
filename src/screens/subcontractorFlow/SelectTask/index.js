import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { SecondHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";
import { Loader } from "../../../components/Loader";
import useCallApi from "../../../hooks/useCallApi";
import { useSelector } from "react-redux";
import { toastError } from "../../../services/utilities/toast/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SelectTask = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { materialLocation, dropOffLocation } = route.params || {};
  const { selectedSite } = useSelector((state) => state.site);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("instant");
  const [priority, setPriority] = useState("medium");
  const [time, setTime] = useState(""); // For scheduled date
  const [dropAddress, setDropAddress] = useState("");
  const [siteId, setSiteId] = useState("");
  const [duration, setDuration] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  console.log(selectedSite);

  // Pictures
  const [pictures, setPictures] = useState([]);

  const { uploadFile } = useCallApi();
  const [uploading, setUploading] = useState(false);

  const handleRemovePicture = (uri) => {
    setPictures(pictures.filter((pic) => pic.uri !== uri));
  };

  useEffect(() => {
    if (selectedSite?._id) {
      setSiteId(selectedSite?._id);
    }
  }, [selectedSite]);

  const handlePickImage = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: "photo",
        maxFiles: 5 - pictures.length,
      });
      const formattedImages = images.map((img) => ({
        uri: img.path,
        type: img.mime,
        name: img.filename || `image_${Date.now()}_${Math.random()}.jpg`,
      }));
      setPictures([...pictures, ...formattedImages]);
    } catch (error) {
      console.log("ImagePicker error", error);
    }
  };
  const handleNext = () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!siteId) {
      toastError({ text: "Site id is required!" });
      return;
    }

    const taskData = {
      materialLocation,
      dropOffLocation,

      title,
      description,
      taskType,
      priority,
      scheduledDate:
        taskType === "scheduled" ? new Date(scheduledDate).toISOString() : null, // Mocking date logic if 'time' not fully parsed
      estimatedDuration: parseInt(duration) || 60,
      siteId: siteId,
      pictures: pictures,
    };

    navigation.navigate(routes.selectInventoryForTask, {
      isSelection: true,
      previousData: taskData,
    });
  };

  const SelectionButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.optionBox,
        selected && {
          backgroundColor: colors.themeColor,
          borderColor: colors.themeColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && { color: colors.white }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: widthPixel(20),
          flexGrow: 1,
          paddingBottom: heightPixel(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        <SecondHeader
          onPress={() => navigation.goBack()}
          title="Task Details"
        />
        <Text
          style={{
            fontSize: fontPixel(14),
            fontFamily: fonts.NunitoRegular,
            color: colors.greyText,
            marginTop: heightPixel(10),
            marginBottom: heightPixel(10),
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          porttitor lectus augue
        </Text>

        <Text style={styles.sectionTitle}>Basic Info</Text>
        <AppTextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <AppTextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ height: heightPixel(80), textAlignVertical: "top" }}
        />

        <Text style={styles.sectionTitle}>Select Task Type</Text>
        <View
          style={[
            styles.row,
            {
              marginBottom:
                taskType === "scheduled" ? heightPixel(10) : heightPixel(0),
            },
          ]}
        >
          <SelectionButton
            label="Instant"
            selected={taskType === "instant"}
            onPress={() => setTaskType("instant")}
          />
          <SelectionButton
            label="Scheduled"
            selected={taskType === "scheduled"}
            onPress={() => setTaskType("scheduled")}
          />
        </View>

        {taskType === "scheduled" && (
          <AppTextInput
            placeholder="Scheduled Date/Time"
            value={scheduledDate}
            onChangeText={setScheduledDate}
          />
        )}

        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.row}>
          <SelectionButton
            label="Low"
            selected={priority === "low"}
            onPress={() => setPriority("low")}
          />
          <SelectionButton
            label="Medium"
            selected={priority === "medium"}
            onPress={() => setPriority("medium")}
          />
          <SelectionButton
            label="High"
            selected={priority === "high"}
            onPress={() => setPriority("high")}
          />
        </View>

        <Text style={styles.sectionTitle}>Estimateed Duration Time</Text>

        <AppTextInput
          placeholder="minutes"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Add Pictures</Text>
        <View style={styles.picturesRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
            <Image source={appIcons.gallery} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>Add Image</Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            data={pictures}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <View style={styles.pictureWrapper}>
                <Image source={{ uri: item.uri }} style={styles.picture} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePicture(item.uri)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: heightPixel(20),
          }}
        >
          <AppButton
            title="NEXT: SELECT INVENTORY"
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fonts.NunitoBold,
    color: colors.black,
    marginTop: heightPixel(20),
    marginBottom: heightPixel(10),
  },
  label: {
    fontSize: fontPixel(14),
    fontFamily: fonts.NunitoSemiBold,
    color: colors.greyText,
    marginTop: heightPixel(10),
    marginBottom: heightPixel(8),
  },
  row: {
    flexDirection: "row",
    gap: widthPixel(10),
    flexWrap: "wrap",
  },
  optionBox: {
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(20),
    borderWidth: 1,
    borderColor: colors.greyBg,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: fontPixel(14),
    color: colors.black,
    fontFamily: fonts.NunitoRegular,
  },
  picturesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightPixel(20),
  },
  uploadBox: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(8),
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: widthPixel(10),
  },
  uploadIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
    tintColor: colors.themeColor,
  },
  pictureWrapper: {
    position: "relative",
    marginRight: widthPixel(10),
  },
  picture: {
    width: widthPixel(90),
    height: widthPixel(90),
    borderRadius: widthPixel(8),
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: widthPixel(22),
    height: widthPixel(22),
    borderRadius: widthPixel(11),
    backgroundColor: colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: colors.white,
    fontSize: fontPixel(12),
    fontWeight: "700",
  },
});
