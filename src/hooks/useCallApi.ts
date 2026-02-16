import { useCallback } from "react";
import axios, { AxiosError, Method } from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { routes } from "../services/constant";
import { toastError } from "../services/utilities/toast/toast";
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
export const BASE_URL = "http://ec2-52-91-126-131.compute-1.amazonaws.com/api/v1/";
// export const BASE_URL = 'https://ighly-dialyzable-amie.ngrok-free.dev/api/v1/'
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
        const methodLower = method?.toLowerCase();

        // Only set Content-Type for non-GET requests (GET requests shouldn't have Content-Type header)
        if (methodLower !== "get") {
          if (isFormData) {
            headers["Content-Type"] = "multipart/form-data";
          } else {
            headers["Content-Type"] = "application/json";
          }
        }

        const response = await api.request({
          url: endpoint,
          method,
          data: methodLower === "get" ? null : isFormData ? body : body ? { ...body } : undefined,
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
        // Only toast once here
        toastError({ text: errorData.message });
        throw errorData;
      }
    },
    []
  );

  const uploadFile = useCallback(async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      const response = await callApi("auth/upload", "POST", formData, {}, true);
      console.log("upload response", response);

      if (response && response.url) {
        return response.url;
      } else {
        throw new Error(response?.message || "Upload failed");
      }
    } catch (error: any) {
      if (!error.status) {
        toastError({ text: error.message || "Upload failed" });
      }
      throw error;
    }
  }, [callApi]);

  return {
    callApi,
    uploadFile
  };
};

export default useCallApi;
