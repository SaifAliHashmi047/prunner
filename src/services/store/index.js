import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

import userSlice from "./slices/userSlice";
import siteSlice from "./slices/siteSlice";

const rootReducer = combineReducers({
  user: userSlice,
  site: siteSlice,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user", "site"], // 👈 only these slices will persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 important for redux-persist
    }),
});

export const persistor = persistStore(store);
