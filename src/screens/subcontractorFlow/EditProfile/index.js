import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SecondHeader,
  AppButton,
  AppTextInput,
  AppModal,
} from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel } from "../../../services/constant";
import { appIcons } from "../../../services/utilities/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCallApi from "../../../hooks/useCallApi";
import { useAppSelector } from "../../../services/store/hooks";
import {
  toastError,
  toastSuccess,
} from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import { AccountType } from "../../authFlow";
import { setUserData } from "../../../services/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { Image_Picker } from "../../../services/utilities/Image_Picker";

const EditProfile = ({ navigation }) => {
  const { user } = useAppSelector((state) => state.user);
  const { callApi, uploadFile } = useCallApi();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.image);
  const [originalImage, setOriginalImage] = useState(user?.image); // Track original image URL
  const [selectedImageFile, setSelectedImageFile] = useState(null); // Track newly selected image file
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?._id) {
          const response = await callApi(`user/${user._id}`);
          console.log("response", response);

          if (response?.data) {
            setName(response.data.name || "");
            const imageUrl = response.data.image || "";
            setProfileImage(imageUrl);
            setOriginalImage(imageUrl); // Store original image URL
            dispatch(setUserData(response.data));
          }
        }
      } catch (error) {
        console.log("Error fetching user data", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Check if name or image has changed from initial values
    const initialName = user?.name || "";
    const hasNameChanged = name !== initialName && name.trim().length > 0;
    const hasImageChanged = selectedImageFile !== null; // New image selected
    
    if (hasNameChanged || hasImageChanged) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, user, selectedImageFile]);

  const handleImagePick = async () => {
    try {
      const image = await Image_Picker("gallery");
      if (image && image.path) {
        // Create file object for upload
        const imageFile = {
          uri: image.path,
          type: image.mime || "image/jpeg",
          name: image.path.split("/").pop() || `profile_${Date.now()}.jpg`,
        };
        
        // Set the selected image file and update preview
        setSelectedImageFile(imageFile);
        setProfileImage(image.path); // Show preview immediately
      }
    } catch (error) {
      if (error !== "cancel") {
        toastError({ text: "Failed to pick image. Please try again." });
      }
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toastError({ text: "Name is required" });
      return;
    }

    try {
      setLoading(true);

      let imageUrl = originalImage; // Default to original image URL

      // If a new image was selected, upload it first
      if (selectedImageFile) {
        try {
          imageUrl = await uploadFile({
            uri: selectedImageFile.uri,
            type: selectedImageFile.type,
            name: selectedImageFile.name,
          });
          
          if (!imageUrl) {
            throw new Error("Failed to upload image");
          }
        } catch (uploadError) {
          console.log("Image upload error", uploadError);
          toastError({ text: "Failed to upload image. Please try again." });
          setLoading(false);
          return;
        }
      }

      // Payload with name and image URL
      const payload = {
        name: name,
        image: imageUrl, // Include image URL in the update
      };

      const response = await callApi("user/update-me", "PATCH", payload);

      if (response?.success) {
        // Update user data in Redux with new image URL
        if (response?.data?.user) {
          dispatch(setUserData(response.data.user));
        }
        
        // Show success modal
        setModalVisible(true);
        // toastSuccess({ text: "Profile updated successfully" });

        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 2000);
      } else {
        if (response?.message) {
          toastError({ text: response.message });
        }
      }
    } catch (error) {
      // Error handling is mostly done in useCallApi or here if needed
      console.log("Update profile error", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        "Failed to update profile";
      toastError({ text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: insets.top,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={20}
    >
      {/* Header */}
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          paddingHorizontal: widthPixel(20),
        }}
      >
        <SecondHeader
          onPress={() => navigation.goBack()}
          title="Edit Profile"
        />

        {/* Profile Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : appIcons.dummyProfile
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
            <Image source={appIcons.pcamera} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Input */}
        <AppTextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={{ marginTop: heightPixel(30) }}
        />
        {/* Update Button */}
        <View
          style={{
            marginTop: "auto",
            width: "100%",
            marginBottom: heightPixel(30),
          }}
        >
          <AppButton
            title={loading ? "UPDATING..." : "UPDATE"}
            style={[
              styles.updateButton,
              (isButtonDisabled || loading) && { opacity: 0.5 },
            ]}
            textStyle={{ color: colors.white }}
            onPress={handleUpdate}
            disabled={isButtonDisabled || loading}
          />
        </View>
      </View>

      <AppModal
        title="Profile Updated"
        subtitle="Your profile has been successfully updated."
        visible={modalVisible}
        // onClose={() => setModalVisible(false)}
      />
      <Loader isVisible={isFetching} />
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingHorizontal: widthPixel(20),
  },
  imageWrapper: {
    marginTop: heightPixel(30),
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: widthPixel(120),
    height: widthPixel(120),
    borderRadius: widthPixel(60),
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 1,
  },
  icon: {
    width: widthPixel(25),
    height: widthPixel(25),
    resizeMode: "contain",
  },
  updateButton: {
    backgroundColor: colors.themeColor,
    width: "100%",
  },
});
