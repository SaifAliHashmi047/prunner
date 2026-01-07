import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";

const useForkliftDocs = () => {
  const { callApi, uploadFile } = useCallApi();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const callApiRef = useRef(callApi);
  callApiRef.current = callApi;

  const uploadLicense = useCallback(
    async (fileUrl, fileData = null, frontImage = null, backImage = null) => {
      try {
        setLoading(true);
        
        let licenseUrl = fileUrl;
        let frontLicenseUrl = null;
        let backLicenseUrl = null;

        // If scanning mode (front and back images)
        if (frontImage && backImage) {
          setUploading(true);
          try {
            // Upload front image
            frontLicenseUrl = await uploadFile({
              uri: frontImage.uri || frontImage.path,
              type: frontImage.type || "image/jpeg",
              name: frontImage.name || `license_front_${Date.now()}.jpg`,
            });
            if (!frontLicenseUrl) {
              throw new Error("Failed to upload front license image");
            }

            // Upload back image
            backLicenseUrl = await uploadFile({
              uri: backImage.uri || backImage.path,
              type: backImage.type || "image/jpeg",
              name: backImage.name || `license_back_${Date.now()}.jpg`,
            });
            if (!backLicenseUrl) {
              throw new Error("Failed to upload back license image");
            }
          } catch (uploadError) {
            console.log("License images upload error", uploadError);
            throw new Error("Failed to upload license images");
          } finally {
            setUploading(false);
          }

          // Submit both front and back images to API
          const response = await callApiRef.current("forklift-docs/upload-license", "POST", {
            driverLicenseFront: frontLicenseUrl,
            driverLicenseBack: backLicenseUrl,
          });

          return response;
        }
        
        // If fileData is provided, upload the file first to get URL
        if (fileData && !fileUrl) {
          setUploading(true);
          try {
            licenseUrl = await uploadFile({
              uri: fileData.uri || fileData.path,
              type: fileData.type || "application/pdf",
              name: fileData.name || `license_${Date.now()}.${fileData.type?.includes('image') ? 'jpg' : 'pdf'}`,
            });
            if (!licenseUrl) {
              throw new Error("Failed to upload license file");
            }
          } catch (uploadError) {
            console.log("License upload error", uploadError);
            throw new Error("Failed to upload license file");
          } finally {
            setUploading(false);
          }
        }

        if (!licenseUrl) {
          throw new Error("No license file or URL provided");
        }

        // Submit license URL to API
        const response = await callApiRef.current("forklift-docs/upload-license", "POST", {
          licenseUrl: licenseUrl,
        });

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
    async (vehicleNumber, registrationNumber, vehicleImages = []) => {
      try {
        setLoading(true);
        
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

        // Submit vehicle information to API
        const payload = {
          vehicleNumber: vehicleNumber.trim(),
          registrationNumber: registrationNumber.trim(),
          images: imageUrls,
        };

        const response = await callApiRef.current("forklift-docs/register-vehicle", "POST", payload);

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

  return {
    loading,
    uploading,
    uploadLicense,
    registerVehicle,
  };
};

export default useForkliftDocs;

