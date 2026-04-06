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

  // Register Tutor - Đăng ký làm gia sư
  registerTutor: async (tutorData) => {
    const formData = new FormData();
    formData.append("Headline", tutorData.headline);
    formData.append("Bio", tutorData.bio);
    formData.append("MonthExperience", tutorData.MonthExperience);
    if (tutorData.cvFile) {
      formData.append("CvFile", tutorData.cvFile);
      formData.append("CvFileName", tutorData.cvFile.name);
    }
    if (tutorData.introVideoFile) {
      formData.append("IntroVideoFile", tutorData.introVideoFile);
      formData.append("IntroVideoFileName", tutorData.introVideoFile.name);
    }
    const response = await axiosInstance.post("/auth/v1/register-tutor", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Google Login - URL đăng nhập bằng Google
  getGoogleLoginUrl: () => {
    return `${axiosInstance.defaults.baseURL}auth/v1/google-login`;
  },

  // Google Login Verify - Xác thực token sau khi đăng nhập Google
  googleLoginVerify: async (token) => {
    const response = await axiosInstance.post("/auth/v1/google-login/verify", {
      token,
    });
    return response.data;
  },

  // Update user basic info (firstName, lastName, phone)
  updateUser: async (userId, data) => {
    const response = await axiosInstance.patch(`/users/${userId}`, data);
    return response.data;
  },
};
