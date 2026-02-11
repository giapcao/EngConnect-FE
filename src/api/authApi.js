import axiosInstance from "./axiosConfig";

export const authApi = {
  // Register - Đăng ký người dùng mới
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/v1/register", userData);
    return response.data;
  },

  // Verify Email - Xác thực email người dùng
  verifyEmail: async (token) => {
    const response = await axiosInstance.post("/auth/v1/verify-email", {
      token,
    });
    return response.data;
  },

  // Login - Đăng nhập người dùng
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/v1/login", credentials);
    return response.data;
  },

  // Logout - Đăng xuất người dùng
  logout: async () => {
    const response = await axiosInstance.post("/auth/v1/Logout");
    return response.data;
  },

  // Refresh Token - Làm mới access token bằng refresh token
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post("/auth/v1/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  // Forgot Password - Gửi email đặt lại mật khẩu
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/users/forgot-password", {
      email,
    });
    return response.data;
  },

  // Reset Password - Đặt lại mật khẩu mới
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post("/users/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
