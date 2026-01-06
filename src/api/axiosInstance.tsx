import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let isRefreshing = false;
let failedQueue: any[] = [];

const axiosInstance = axios.create({
  baseURL: 'http://ec2-52-91-126-131.compute-1.amazonaws.com/api/v1/',
});

// 🔹 Process queue (used when refreshing token)
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔹 Format error object
const handleRequestError = (e: any) => {
  if (e.response?.data?.message) {
    return {
      error: e.response.data.message,
      status: e.response.status,
      ...e.response.data,
    };
  }

  if (e.response?.data?.errors) {
    return {
      error: e.response.data.errors,
      status: e.response.status,
      ...e.response.data,
    };
  }

  if (e.response) {
    return {
      error: 'Something went wrong!',
      status: e.response.status,
      ...e.response.data,
    };
  }

  return { error: 'Something went wrong!', status: 503 };
};

// 🔹 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem('token');

    // 🚀 Skip adding Authorization if skipAuth flag is set
    if (!config.skipAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 👇 Handle multipart/form-data flag
    if (config.isFormData) {
      config.headers['Content-Type'] = 'multipart/form-data';

      if (!(config.data instanceof FormData)) {
        const formData = new FormData();
        Object.entries(config.data || {}).forEach(([key, value]) => {
          formData.append(key, value);
        });
        config.data = formData;
      }
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('📤 Request:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers,
      token
    });

    return config;
  },
  (error) => Promise.reject(handleRequestError(error))
);


axiosInstance.interceptors.response.use(
  // ✅ SUCCESS HANDLER
  //@ts-ignore
  (response) => {
    console.log(
      '📥 Response:',
      JSON.stringify(
        {
          baseURL: response.config.baseURL,
          url: response.config.url,
          method: response.config.method,
          status: response.status,
          data: response.data,
        },
        null,
        2
      )
    );
    return {
      data: response.data,
      status: response.status,
    };
  },

  // ❌ ERROR HANDLER
  async (error) => {
    // Extract safe error info
    const errInfo = {
      message: error.message,
      status: error.response?.status,
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      data: error.config?.data,
      responseData: error.response?.data,
    };

    console.log('❌ API Error:', JSON.stringify(errInfo, null, 2));

    // 🔹 Optional: log a short one-liner for quick debugging
    console.log(
      `❗ [${error.config?.method?.toUpperCase()}] ${error.config?.url} → ${error.response?.status || 'NO_STATUS'} (${error.message})`
    );

    const originalRequest = error.config;

    // 🔄 Token refresh logic (unchanged)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(handleRequestError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');
        console.log('🔄 Refreshing token with:', refreshToken);

        const res = await axiosInstance.post(
          'auth/refresh-token',
          { refreshToken },
          //@ts-ignore
          { skipAuth: true }
        );

        const newToken = res?.data?.accessToken;
        if (newToken) {
          await AsyncStorage.setItem('Token', newToken);
        }

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        const formattedError = handleRequestError(err);
        processQueue(formattedError, null);
        isRefreshing = false;
        return Promise.reject(formattedError);
      }
    }

    // 🧹 Return clean error object
    const formattedError = handleRequestError(error);
    return Promise.reject(formattedError);
  }
);


export default axiosInstance;
