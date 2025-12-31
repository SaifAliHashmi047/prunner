import { useCallback } from "react";
import axios, { AxiosError, Method } from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { routes } from "../services/constant";
export const handleApiError = (error: any) => {
  // Network error
  if (error.message === 'Network Error') {
    return {
      status: 'error',
      errorCode: 503,
      message: 'Network Error',
    };
  }

  // Server responded with error
  if (error.response) {
    const { status, data } = error.response;
    console.log("data", data, status);
    return {
      status: 'error',
      errorCode: status,
      message: data?.message || data?.error || 'Request failed',
    };
  }

  // Request made but no response received
  if (error.request) {
    return {
      status: 'error',
      errorCode: 504,
      message: 'No response received',
    };
  }

  // Request setup error
  return {
    status: 'error',
    errorCode: 500,
    message: 'Request setup failed',
  };
};
const BASE_URL = "http://ec2-52-91-126-131.compute-1.amazonaws.com/api/v1/";
const REFRESH_ENDPOINT = "auth/refresh-token";
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    console.log("request intercepter config", config);
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("No token found in storage");
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response interceptor success:", response.status);
    return response;
  },
  async (error: AxiosError) => {

    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("refreshToken 1", refreshToken);

    if (!refreshToken) return null;

    const response = await axios.post(
      `${BASE_URL}${REFRESH_ENDPOINT}`, // full URL
      {}, // empty body (if your API expects POST with no data)
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json", // optional, but safe to include
        },
      }
    );
    console.log("response refresh token 2", response);

    const newToken = response?.data?.data?.accessToken;

    if (newToken) {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response?.data?.data?.refreshToken
      );
      return newToken;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error refresh token 2", error);
    throw error;
  }
};
//helper function to clear all tokens (for logout)

const useCallApi = () => {
  const navigation = useNavigation();
  const callApi = useCallback(
    async (
      endpoint: string,
      method: Method = "GET",
      body: any = null,
      params: any = {},
      isFormData: boolean = false
    ) => {
      console.log("callApi endpoint", {
        endpoint,
        method,
        body,
        params,
        isFormData,
      });
      try {
        // Prepare headers without overriding Authorization
        const headers: any = {};

        if (isFormData) {
          headers["Content-Type"] = "multipart/form-data";
        } else {
          headers["Content-Type"] = "application/json";
        }

        const response = await api.request({
          url: endpoint,
          method,
          data: isFormData ? body : body ? { ...body } : undefined,
          params,
          headers,
        });

        console.log("API response:", response.status, response.data);
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return callApi(endpoint, method, body, params, isFormData);
          } else {
            await AsyncStorage.clear();
            // @ts-ignore
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: routes.auth as never,
                  params: { screen: routes.login as never },
                },
              ],
            });
            return null;
          }
        }
        const errorData = handleApiError(err);
        console.log("API error:", errorData);
        throw errorData;
      }
    },
    []
  );

  const uploadFile = useCallback(async (file: any) => {
    try {
      const extension = file.type.split('/')[1];
      // 1. Get Signed URL
      const signedUrlResponse = await callApi("s3/signed-upload-url", "GET", null, {
        fileType: extension
      });

      if (signedUrlResponse && signedUrlResponse.uploadUrl) {
        // 2. Upload to S3
        // Note: file.uri might need processing if it's not directly fetchable in React Native sometimes,
        // but usually fetch(uri) works or creating a Blob.
        // However, for RN, typical approach for Binary upload is fetch(url, {method: 'PUT', body: blob})
        // We need to fetch the file to blob first.

        const response = await fetch(file.uri);
        const blob = await response.blob();

        await fetch(signedUrlResponse.uploadUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": file.type
          }
        });

        return signedUrlResponse.fileUrl;
      } else {
        throw new Error("Failed to get signed URL");
      }
    } catch (error) {
      console.log("Upload file error", error);
      throw error;
    }
  }, [callApi]);

  return {
    callApi,
    uploadFile
  };
};

export default useCallApi;
