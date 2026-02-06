import axiosInstance from "./axiosConfig";

export const studentApi = {
  // Get student profile
  getStudentProfile: async () => {
    const response = await axiosInstance.get("/students/profile");
    return response.data;
  },

  // Update student profile
  updateStudentProfile: async (profileData) => {
    const response = await axiosInstance.put("/students/profile", profileData);
    return response.data;
  },

  // Get student enrolled courses
  getEnrolledCourses: async () => {
    const response = await axiosInstance.get("/students/courses");
    return response.data;
  },

  // Get student schedule
  getStudentSchedule: async (params = {}) => {
    const response = await axiosInstance.get("/students/schedule", { params });
    return response.data;
  },

  // Get student homework
  getStudentHomework: async (params = {}) => {
    const response = await axiosInstance.get("/students/homework", { params });
    return response.data;
  },

  // Submit homework
  submitHomework: async (homeworkId, submissionData) => {
    const response = await axiosInstance.post(
      `/students/homework/${homeworkId}/submit`,
      submissionData
    );
    return response.data;
  },

  // Get student progress
  getStudentProgress: async (courseId) => {
    const response = await axiosInstance.get(
      `/students/courses/${courseId}/progress`
    );
    return response.data;
  },

  // Get student notifications
  getStudentNotifications: async (params = {}) => {
    const response = await axiosInstance.get("/students/notifications", {
      params,
    });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await axiosInstance.put(
      `/students/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Get student dashboard stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/students/dashboard/stats");
    return response.data;
  },

  // Book session with tutor
  bookSession: async (sessionData) => {
    const response = await axiosInstance.post("/students/sessions", sessionData);
    return response.data;
  },

  // Get student sessions
  getStudentSessions: async (params = {}) => {
    const response = await axiosInstance.get("/students/sessions", { params });
    return response.data;
  },

  // Cancel session
  cancelSession: async (sessionId) => {
    const response = await axiosInstance.delete(
      `/students/sessions/${sessionId}`
    );
    return response.data;
  },
};
