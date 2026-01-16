import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { routes, emailFormat, widthPixel, heightPixel } from "../../../services/constant";
import { useAppDispatch, useAppSelector } from "../../../services/store/hooks";
import {
  setUserData,
  setAuthenticated,
  setUserRole,
} from "../../../services/store/slices/userSlice";
import axiosInstance from "../../../api/axiosInstance";
import styles from "./styles";
import { toastError } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import useNavigateUser from "../../../hooks/useNavigateUser";

const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [role, setRole] = useState("subConstructor");
  const navigateUser = useNavigateUser();
  // Validation function
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailFormat.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    // Clear previous errors
    setErrors({ email: "", password: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Call login API
      const response = await axiosInstance.post(
        "auth/login",
        {
          email: email.trim(),
          password: password,
          role: role,
          device: {
            id: "1234567890",
            deviceToken: "1234567890",
          },
        },
        { skipAuth: true }
      );
      console.log("response login", response);

      // Extract token and user data from response
      const token = response?.data?.data?.token;
      const refreshToken = response?.data?.data?.refreshToken;
      const user = response?.data?.data?.user;
      console.log("user", user);

      if (token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem("token", token);

        // Store refresh token if available
        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
        }

        // Store user in AsyncStorage for persistence
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        }

        // Store user data in Redux
        dispatch(setUserData(user));
        dispatch(setAuthenticated(true));

        if (user?.role) {
          dispatch(setUserRole(user.role));
        }

        // Use navigateUser hook for consistent navigation logic
        // This will check profile completion, induction number, and verification status
        await navigateUser();
      } else {
        throw new Error("Token not received from server");
      }
    } catch (error: any) {
      // Show error message
      const errorMessage =
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      toastError({ text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back to Project Runner</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
        </Text>
        <View style={{flexDirection:"row",gap:widthPixel(10),marginVertical:heightPixel(10)}}>
          <AppButton
            title={"Subconstructor"}
            onPress={()=>setRole("subConstructor")}
            style={{ backgroundColor: role === "subConstructor" ? colors.themeColor : colors.gray }}
            textStyle={{ color: colors.white }}
            disabled={false}
          />
          <AppButton
            title={"Forklift"}
            onPress={()=>setRole("forklift")}
            style={{ backgroundColor: role === "forklift" ? colors.themeColor : colors.gray }}
            textStyle={{ color: colors.white }}
            disabled={false}

          />
        </View>
        {/* Email Input */}
        <AppTextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors({ ...errors, email: "" });
            }
          }}
          keyboardType="email-address"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        {/* Password Input */}
        <AppTextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors({ ...errors, password: "" });
            }
          }}
          secureTextEntry={true}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() =>
            navigation.navigate(routes.auth, { screen: routes.forgot })
          }
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <AppButton
            title={"LOGIN"}
            onPress={handleLogin}
            style={{ backgroundColor: colors.themeColor }}
            textStyle={{ color: colors.white }}
            disabled={loading}
          />
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.auth, { screen: routes.signUp })
              }
            >
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Loader isVisible={loading} />
    </KeyboardAwareScrollView>
  );
};

export default Login;
