import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import siteSlice from './slices/siteSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    site: siteSlice,
  },
});
