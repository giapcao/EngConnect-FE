import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api";

// Async thunks
// Map API error codes to i18n keys
const loginErrorCodeMap = {
  "User.NotFound": "auth.login.errors.userNotFound",
  "User.InvalidPassword": "auth.login.errors.invalidPassword",
  "User.EmailNotVerified": "auth.login.errors.emailNotVerified",
  "User.Locked": "auth.login.errors.accountLocked",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);

      if (data.isSuccess) {
        const { accessToken, refreshToken, firstName, lastName, username, roles, avatarUrl } = data.data;
        // Save tokens to localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Decode JWT to get userId, email, tutorId, studentId
        let userId = null, email = null, tutorId = null, studentId = null;
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          userId = payload.sub;
          email = payload.email ?? null;
          tutorId = payload.tutorId ?? null;
          studentId = payload.studentId ?? null;
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }

        const user = { firstName, lastName, username, roles, avatarUrl, userId, email, tutorId, studentId };
        // Persist user info for page reload
        localStorage.setItem("user", JSON.stringify(user));

        return {
          user,
          accessToken,
          refreshToken,
        };
      } else {
        const errorCode = data.error?.code;
        const i18nKey = loginErrorCodeMap[errorCode];
        return rejectWithValue(
          i18nKey ? { code: errorCode, i18nKey } : (data.error?.message || "Login failed")
        );
      }
    } catch (error) {
      const errData = error.response?.data;
      const errorCode = errData?.error?.code;
      const i18nKey = loginErrorCodeMap[errorCode];
      return rejectWithValue(
        i18nKey ? { code: errorCode, i18nKey } : (errData?.error?.message || errData?.message || "Login failed")
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.register(userData);
      
      if (data.isSuccess) {
        return data.data;
      } else {
        return rejectWithValue(
          data.error?.message || "Registration failed"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        "Registration failed"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const data = await authApi.verifyEmail(token);
      
      if (data.isSuccess) {
        return data.data;
      } else {
        return rejectWithValue(
          data.error?.message || "Email verification failed"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        "Email verification failed"
      );
    }
  }
);

export const registerTutor = createAsyncThunk(
  "auth/registerTutor",
  async (tutorData, { rejectWithValue }) => {
    try {
      const data = await authApi.registerTutor(tutorData);

      if (data.isSuccess) {
        const { accessToken, refreshToken } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Decode JWT to get updated user info (roles now include "Tutor")
        let userId = null, email = null, tutorId = null, studentId = null;
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          userId = payload.sub;
          email = payload.email ?? null;
          tutorId = payload.tutorId ?? null;
          studentId = payload.studentId ?? null;
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }

        // Update stored user with new roles
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
        const user = { ...existingUser, userId, email, tutorId, studentId, roles: [...(existingUser.roles || []), "Tutor"] };
        localStorage.setItem("user", JSON.stringify(user));

        return { user, accessToken, refreshToken };
      } else {
        return rejectWithValue(
          data.error?.message || "Tutor registration failed"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Tutor registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        "Logout failed"
      );
    }
  }
);

export const googleLoginVerify = createAsyncThunk(
  "auth/googleLoginVerify",
  async (token, { rejectWithValue }) => {
    try {
      const data = await authApi.googleLoginVerify(token);

      if (data.isSuccess) {
        const { accessToken, refreshToken, firstName, lastName, username, roles, avatarUrl } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        let userId = null, email = null, tutorId = null, studentId = null;
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          userId = payload.sub;
          email = payload.email ?? null;
          tutorId = payload.tutorId ?? null;
          studentId = payload.studentId ?? null;
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }

        const user = { firstName, lastName, username, roles, avatarUrl, userId, email, tutorId, studentId };
        localStorage.setItem("user", JSON.stringify(user));

        return { user, accessToken, refreshToken };
      } else {
        return rejectWithValue(data.error?.message || "Google login verification failed");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Google login verification failed"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      const data = await authApi.refreshToken(refreshToken);
      
      if (data.isSuccess && data.data) {
        // Update tokens in localStorage
        localStorage.setItem("accessToken", data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        return data.data;
      } else {
        // Clear tokens if refresh fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return rejectWithValue(
          data.error?.message || "Token refresh failed"
        );
      }
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        "Token refresh failed"
      );
    }
  }
);

// Restore user from localStorage
const storedUser = (() => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

// Initial state
const initialState = {
  user: storedUser,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  tutorAvatarUrl: sessionStorage.getItem("tutorAvatarUrl") || null,
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    updateUserAvatar: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, avatarUrl: action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateUserInfo: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateTutorAvatar: (state, action) => {
      state.tutorAvatarUrl = action.payload;
      if (action.payload) {
        sessionStorage.setItem("tutorAvatarUrl", action.payload);
      } else {
        sessionStorage.removeItem("tutorAvatarUrl");
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.tutorAvatarUrl = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("tutorAvatarUrl");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Tutor
      .addCase(registerTutor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.tutorAvatarUrl = null;
        sessionStorage.removeItem("tutorAvatarUrl");
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.tutorAvatarUrl = null;
        sessionStorage.removeItem("tutorAvatarUrl");
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Google Login Verify
      .addCase(googleLoginVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(googleLoginVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, clearCredentials, clearError, updateUserAvatar, updateUserInfo, updateTutorAvatar } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectTutorAvatarUrl = (state) => state.auth.tutorAvatarUrl;
