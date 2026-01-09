import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sites: [],
  selectedSite: null,
};

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setSelectedSite: (state, action) => {
        console.log("paylaodsbkfnbfj",action.payload);
        
      state.selectedSite = action.payload;
    },
    setSites: (state, action) => {
      state.sites = action.payload;
    },
  },
});

export const { setSelectedSite, setSites } = siteSlice.actions;

export default siteSlice.reducer;
