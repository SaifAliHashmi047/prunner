import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  setUserData,
  setAuthenticated,
  setUserRole,
} from "../services/store/slices/userSlice";
import { routes } from "../services/constant";

/**
 * Hook to handle user navigation based on authentication and user state
 * Can be used after login, on app reload, or from splash screen
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.withDelay - Whether to add a delay (for splash screen)
 * @param {number} options.delayMs - Delay in milliseconds (default: 2000, only used if withDelay is true)
 * @returns {Function} navigateUser - Function to check auth and navigate
 */
const useNavigateUser = (options = {}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { withDelay = false, delayMs = 2000 } = options || {};

  const navigateUser = useCallback(async () => {
    try {
      // Check if token exists in AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      // Optional delay (for splash screen)
      if (withDelay) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      if (token) {
        let userData = null;

        if (userStr) {
          userData = JSON.parse(userStr);
          dispatch(setUserData(userData));
          dispatch(setAuthenticated(true));
          if (userData?.role) {
            dispatch(setUserRole(userData?.role));
          }
        }

        console.log("user", {
          userStr,
          userData,
        });

        // Navigate based on role and user state
        const role = userData?.role;
        const image = userData?.image;
        const name = userData?.name;
        const inductionNumber = userData?.inductionNumber;
        const verificationStatus = userData?.verification?.status;

        if (role === "subConstructor" || role === "forklift") {
          // Check if profile is complete
          if (!image || !name) {
            navigation.navigate(routes.auth, {
              screen: routes.createProfile,
            });
            return;
          }

          // Check if induction number is provided
          if (!inductionNumber) {
            navigation.navigate(routes.auth, {
              screen: routes.scanQr,
            });
            return;
          }

          // Check if verification is pending
        //   if (verificationStatus === "pending") {
        //     navigation.navigate(routes.auth, {
        //       screen: routes.verificationProcess,
        //     });
        //     return;
        //   }

          // Navigate to appropriate flow based on role
          if (role === "forklift") {
        
            // Check for missing license details
            const isLicenseIncomplete =
              !userData?.driverInfo?.drivingLicenseNumber ||
              !userData?.driverInfo?.drivingLicenseExpiryDate ||
              !userData?.driverInfo?.drivingLicenseImage;
            const isVehicleIncomplete =
              !userData?.vehicleInfo?.vehiclePlateNumber ||
              !userData?.vehicleInfo?.registrationNumber;

            // Check for missing registration card
            const isRegistrationCardMissing =
              !userData?.vehicleInfo?.registrationCardImage;

            if (isLicenseIncomplete) {
              navigation.navigate(routes.auth, {
                screen: routes.uploadLicense,
              });
              return;
            }
            if (isVehicleIncomplete) {
              navigation.navigate(routes.auth, {
                screen: routes.tellAboutVehicle,
              });
              return;
            }
            if (isRegistrationCardMissing) {
              navigation.navigate(routes.auth, {
                screen: routes.uploadVehicleRegistration,
              });
              return;
            }
            navigation.replace(routes.forkliftFlow);
            return;
          } else {
            navigation.replace(routes.subcontractorFlow);
            return;
          }
        } else {
          // No role or invalid role, navigate to account type selection
          navigation.navigate(routes.auth, {
            screen: routes.accountType,
          });
        }
      } else {
        // No token, navigate to onboarding
        navigation.navigate(routes.auth, {
          screen: routes.onBoard,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Fallback to onboarding on error
      navigation.navigate(routes.auth, {
        screen: routes.onBoard,
      });
    }
  }, [dispatch, navigation, withDelay, delayMs]);

  return navigateUser;
};

export default useNavigateUser;
