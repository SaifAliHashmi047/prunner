import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userRole: null,
  selectedAccountType: null,
  isAuthenticated: false,
  userProfile: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setSelectedAccountType: (state, action) => {
      state.selectedAccountType = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    clearUserData: (state) => {

      state.userRole = null;
      state.selectedAccountType = null;
      state.isAuthenticated = false;
      state.userProfile = null;
    },
  },
});

export const {
  setUserRole,
  setSelectedAccountType,
  setAuthenticated,
  setUserProfile,
  clearUserData,
  setUserData,
} = userSlice.actions;

export default userSlice.reducer;
