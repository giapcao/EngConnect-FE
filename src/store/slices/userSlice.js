import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  profile: JSON.parse(localStorage.getItem("user")) || null,
  preferences: {
    theme: localStorage.getItem("theme") || "light",
    language: localStorage.getItem("language") || "en",
  },
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.profile));
    },
    clearUserProfile: (state) => {
      state.profile = null;
      localStorage.removeItem("user");
    },
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  setTheme,
  setLanguage,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectTheme = (state) => state.user.preferences.theme;
export const selectLanguage = (state) => state.user.preferences.language;
