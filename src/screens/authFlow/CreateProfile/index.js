import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { AppHeader, AppButton } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { appIcons } from "../../../services/utilities/assets";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { Image_Picker } from "../../../services/utilities/Image_Picker";
import axiosInstance from "../../../api/axiosInstance";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";

const CreateProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", image: "" });

  // Handle image picker
  const handlePickImage = async () => {
    try {
      const image = await Image_Picker("gallery");
      if (image && image.path) {
        setProfileImage({
          uri: image.path,
          type: image.mime || "image/jpeg",
          name: image.path.split("/").pop() || "profile.jpg",
        });
        setImageUri(image.path);
        if (errors.image) {
          setErrors({ ...errors, image: "" });
        }
      }
    } catch (error) {
      if (error !== "cancel") {
        toastError({ text: "Failed to pick image. Please try again." });
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = { name: "", image: "" };
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Image validation
    if (!profileImage) {
      newErrors.image = "Profile image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  // Handle create profile
  const handleNext = async () => {
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show first validation error
      if (validation.errors.name) {
        toastError({ text: validation.errors.name });
      } else if (validation.errors.image) {
        toastError({ text: validation.errors.image });
      }
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("profileImage", {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.name,
      });

      // Call create profile API
      const response = await axiosInstance.post(
        "profile/create",
        formData,
        {
          isFormData: true,
        }
      );

      // Show success message
      toastSuccess({ text: "Profile created successfully!" });

      // Navigate to profile created screen
      navigation.navigate(routes.auth, { screen: routes.profileCreated });
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create profile. Please try again.";

      toastError({ text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <AppHeader
          title="Tell About yourself"
          subtitle="Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit."
        />

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <Image
                source={imageUri ? { uri: imageUri } : appIcons.dummyProfile}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Image
                source={appIcons.camera || appIcons.gallery}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {errors.image ? (
          <Text style={styles.errorText}>{errors.image}</Text>
        ) : null}

        {/* Input */}
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) {
              setErrors({ ...errors, name: "" });
            }
          }}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        {/* Footer Button */}
        <View style={styles.footer}>
          <AppButton
            title={loading ? "CREATING..." : "NEXT"}
            onPress={handleNext}
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
      <Loader isVisible={loading} />
    </SafeAreaView>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    backgroundColor: colors.white,
    paddingTop: heightPixel(20),
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: heightPixel(30),
    marginBottom: heightPixel(30),
  },
  avatarWrapper: {
    width: widthPixel(120),
    height: widthPixel(120),
    position: "relative",
  },
  avatar: {
    width: widthPixel(120),
    height: widthPixel(120),
    borderRadius: widthPixel(60),
    backgroundColor: "#eee",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.themeColor,
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(18),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  cameraIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: widthPixel(10),
    paddingHorizontal: widthPixel(15),
    height: heightPixel(50),
    backgroundColor: "#f7f7f7",
    fontSize: fontPixel(14),
    color: colors.black,
    marginTop: heightPixel(20),
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: fontPixel(12),
    marginTop: heightPixel(5),
    marginLeft: widthPixel(5),
  },
  footer: {
    marginTop: "auto",
    paddingBottom: heightPixel(20),
  },
});
