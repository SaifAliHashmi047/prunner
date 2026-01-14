import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";
import { useAppSelector } from "../services/store/hooks";

const useForkliftDocs = () => {
  const { callApi, uploadFile } = useCallApi();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const callApiRef = useRef(callApi);
  callApiRef.current = callApi;

  // Helper function to safely convert date string to ISO string
  const formatDateToISO = (dateString) => {
    if (!dateString || !dateString.trim()) {
      return "";
    }

    try {
      // Try parsing the date string
      // Support formats: YYYY-MM-DD, YYYY/MM/DD, etc.
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log("Invalid date string:", dateString);
        return "";
      }

      // Check if date is within valid range (not too far in past/future)
      const minDate = new Date("1900-01-01");
      const maxDate = new Date("2100-12-31");
      
      if (date < minDate || date > maxDate) {
        console.log("Date out of valid range:", dateString);
        return "";
      }

      return date.toISOString();
    } catch (error) {
      console.log("Error formatting date:", error, dateString);
      return "";
    }
  };

  const uploadLicense = useCallback(
    async (licenseNumber, expiryDate, frontImage = null, fileData = null) => {
      try {
        setLoading(true);
        
        let licenseImageUrl = null;

        // If front image is provided (scanning mode)
        if (frontImage) {
          setUploading(true);
          try {
            licenseImageUrl = await uploadFile({
              uri: frontImage.uri || frontImage.path,
              type: frontImage.type || "image/jpeg",
              name: frontImage.name || `license_front_${Date.now()}.jpg`,
            });
            if (!licenseImageUrl) {
              throw new Error("Failed to upload license image");
            }
          } catch (uploadError) {
            console.log("License image upload error", uploadError);
            throw new Error("Failed to upload license image");
          } finally {
            setUploading(false);
          }
        }
        
        // If fileData is provided, upload the file first to get URL
        if (fileData && !licenseImageUrl) {
          setUploading(true);
          try {
            licenseImageUrl = await uploadFile({
              uri: fileData.uri || fileData.path,
              type: fileData.type || "application/pdf",
              name: fileData.name || `license_${Date.now()}.${fileData.type?.includes('image') ? 'jpg' : 'pdf'}`,
            });
            if (!licenseImageUrl) {
              throw new Error("Failed to upload license file");
            }
          } catch (uploadError) {
            console.log("License upload error", uploadError);
            throw new Error("Failed to upload license file");
          } finally {
            setUploading(false);
          }
        }

        // Build payload for PATCH user/update-me - only send changed values
        const payload = {
          driverInfo: {},
        };

        // Only include fields that are being updated
        if (licenseNumber?.trim()) {
          payload.driverInfo.drivingLicenseNumber = licenseNumber.trim();
        }
        
        const formattedExpiryDate = formatDateToISO(expiryDate);
        if (formattedExpiryDate) {
          payload.driverInfo.drivingLicenseExpiryDate = formattedExpiryDate;
        }
        
        if (licenseImageUrl) {
          payload.driverInfo.drivingLicenseImage = licenseImageUrl;
        }

        // If nothing actually changed, avoid calling API
        if (Object.keys(payload.driverInfo).length === 0) {
          console.log("uploadLicense: no changed fields to update, skipping PATCH");
          return null;
        }

        // Submit to PATCH API - only send driverInfo with changed values
        const response = await callApiRef.current("user/update-me", "PATCH", payload);

        return response;
      } catch (error) {
        console.log("Upload license error", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  const registerVehicle = useCallback(
    async (vehiclePlateNumber, registrationExpiryDate, vehicleImages = [], registrationCardImage = null) => {
      try {
        setLoading(true);
        
        // Upload registration card image if provided
        let registrationCardUrl = null;
        if (registrationCardImage) {
          setUploading(true);
          try {
            registrationCardUrl = await uploadFile({
              uri: registrationCardImage.uri || registrationCardImage.path,
              type: registrationCardImage.type || "image/jpeg",
              name: registrationCardImage.name || `registration_card_${Date.now()}.jpg`,
            });
            if (!registrationCardUrl) {
              throw new Error("Failed to upload registration card image");
            }
          } catch (uploadError) {
            console.log("Registration card upload error", uploadError);
            throw new Error("Failed to upload registration card image");
          } finally {
            setUploading(false);
          }
        }
        
        // Upload vehicle images first to get URLs
        const imageUrls = [];
        if (vehicleImages && vehicleImages.length > 0) {
          setUploading(true);
          try {
            for (const image of vehicleImages) {
              const imageUrl = await uploadFile({
                uri: image.uri || image.path,
                type: image.type || "image/jpeg",
                name: image.name || `vehicle_${Date.now()}_${Math.random()}.jpg`,
              });
              if (imageUrl) {
                imageUrls.push(imageUrl);
              }
            }
          } catch (uploadError) {
            console.log("Vehicle images upload error", uploadError);
            throw new Error("Failed to upload vehicle images");
          } finally {
            setUploading(false);
          }
        }

        // Build payload for PATCH user/update-me - only send changed values
        const payload = {
          vehicleInfo: {},
        };

        // Only include fields that are being updated
        if (vehiclePlateNumber?.trim()) {
          payload.vehicleInfo.vehiclePlateNumber = vehiclePlateNumber.trim();
        }
        
        const formattedRegistrationDate = formatDateToISO(registrationExpiryDate);
        if (formattedRegistrationDate) {
          payload.vehicleInfo.registrationNumber = formattedRegistrationDate;
        }
        
        if (registrationCardUrl) {
          payload.vehicleInfo.registrationCardImage = registrationCardUrl;
        }
        
        if (imageUrls && imageUrls.length > 0) {
          payload.vehicleInfo.images = imageUrls;
        }

        // Submit to PATCH API - only send vehicleInfo with changed values
        const response = await callApiRef.current("user/update-me", "PATCH", payload);

        return response;
      } catch (error) {
        console.log("Register vehicle error", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  const uploadRegistrationCard = useCallback(
    async (registrationCardImage) => {
      try {
        setLoading(true);
        
        if (!registrationCardImage) {
          throw new Error("No registration card image provided");
        }

        // Upload registration card image
        setUploading(true);
        let registrationCardUrl = null;
        try {
          registrationCardUrl = await uploadFile({
            uri: registrationCardImage.uri || registrationCardImage.path,
            type: registrationCardImage.type || "image/jpeg",
            name: registrationCardImage.name || `registration_card_${Date.now()}.jpg`,
          });
          if (!registrationCardUrl) {
            throw new Error("Failed to upload registration card image");
          }
        } catch (uploadError) {
          console.log("Registration card upload error", uploadError);
          throw new Error("Failed to upload registration card image");
        } finally {
          setUploading(false);
        }

        // Build payload for PATCH user/update-me - only send registrationCardImage
        const payload = {
          vehicleInfo: {
            registrationCardImage: registrationCardUrl,
          },
        };

        // Submit to PATCH API - only send vehicleInfo with registrationCardImage
        const response = await callApiRef.current("user/update-me", "PATCH", payload);

        return response;
      } catch (error) {
        console.log("Upload registration card error", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  return {
    loading,
    uploading,
    uploadLicense,
    registerVehicle,
    uploadRegistrationCard,
  };
};

export default useForkliftDocs;

