import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton, AppTextInput } from "../../../components";
import styles from "./styles";
import { colors } from "../../../services/utilities/colors";
import { routes, emailFormat } from "../../../services/constant";
import { useAppDispatch, useAppSelector } from "../../../services/store/hooks";
import { setLoading, setUserData } from "../../../services/store/slices/userSlice";
import axiosInstance from "../../../api/axiosInstance";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { Loader } from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    // const loading = useAppSelector((state) => state.user.loading);

    // Validation function
    const validateForm = () => {
        const newErrors = { email: "", password: "", confirmPassword: "" };
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

        // Confirm Password validation
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return { isValid, errors: newErrors };
    };

    // Handle signup
    const handleSignUp = async () => {
        // Clear previous errors
        setErrors({ email: "", password: "", confirmPassword: "" });

        // Validate form
        const validation = validateForm();
        if (!validation.isValid) {
            // Show first validation error
            if (validation.errors.email) {
                toastError({ text: validation.errors.email });
            } else if (validation.errors.password) {
                toastError({ text: validation.errors.password });
            } else if (validation.errors.confirmPassword) {
                toastError({ text: validation.errors.confirmPassword });
            }
            return;
        }

        try {
            setLoading(true);
            // dispatch(setLoading(true));

            // Call signup API
            const response = await axiosInstance.post(
                "auth/signup",
                {
                    email: email.trim(),
                    password: password,
                    device: {
                        id: "1234567890",
                        deviceToken: "1234567890",
                    },
                },
                { skipAuth: true }
            );

            // Show success message
            toastSuccess({ text: "Registration successful! Please verify your email." });
            console.log("response===>>>", JSON.stringify(response , null, 2));
            if(response.data.success){
              navigation.navigate(routes.auth, { screen: routes.verifyOtp  , params: { email: email } });
            }

         
        } catch (error) {
            // Show error message
            const errorMessage =
                error?.error ||
                error?.message ||
                error?.response?.data?.message ||
                "Registration failed. Please try again.";

            toastError({ text: errorMessage });
        } finally {
            // dispatch(setLoading(false));
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
                <Text style={styles.title}>Register yourself</Text>
                <Text style={styles.subtitle}>
                    Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
                </Text>

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
                {/* {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null} */}

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
                {/* {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null} */}

                {/* Confirm Password Input */}
                <AppTextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: "" });
                        }
                    }}
                    secureTextEntry={true}
                />
                {/* {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null} */}

                <View style={styles.footer}>
                    <AppButton
                        title="Register"
                        onPress={handleSignUp}
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        disabled={loading}
                    />
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate(routes.auth, { screen: routes.login })}>
                            <Text style={styles.registerLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Loader isVisible={loading} />
        </KeyboardAwareScrollView>
    );
};

export default SignUp;