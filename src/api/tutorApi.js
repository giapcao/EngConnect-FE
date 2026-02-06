import axiosInstance from "./axiosConfig";

export const tutorApi = {
  // Get all tutors
  getAllTutors: async (params = {}) => {
    const response = await axiosInstance.get("/tutors", { params });
    return response.data;
  },

  // Get tutor by ID
  getTutorById: async (tutorId) => {
    const response = await axiosInstance.get(`/tutors/${tutorId}`);
    return response.data;
  },

  // Apply to become tutor
  applyToBeTutor: async (applicationData) => {
    const response = await axiosInstance.post(
      "/tutors/apply",
      applicationData
    );
    return response.data;
  },

  // Get tutor profile (current user)
  getTutorProfile: async () => {
    const response = await axiosInstance.get("/tutors/profile");
    return response.data;
  },

  // Update tutor profile
  updateTutorProfile: async (profileData) => {
    const response = await axiosInstance.put("/tutors/profile", profileData);
    return response.data;
  },

  // Get tutor courses
  getTutorCourses: async (tutorId) => {
    const response = await axiosInstance.get(`/tutors/${tutorId}/courses`);
    return response.data;
  },

  // Get tutor students
  getTutorStudents: async () => {
    const response = await axiosInstance.get("/tutors/students");
    return response.data;
  },

  // Get tutor earnings
  getTutorEarnings: async (params = {}) => {
    const response = await axiosInstance.get("/tutors/earnings", { params });
    return response.data;
  },

  // Get tutor schedule
  getTutorSchedule: async (params = {}) => {
    const response = await axiosInstance.get("/tutors/schedule", { params });
    return response.data;
  },

  // Update tutor availability
  updateAvailability: async (availabilityData) => {
    const response = await axiosInstance.put(
      "/tutors/availability",
      availabilityData
    );
    return response.data;
  },

  // Search tutors
  searchTutors: async (query, params = {}) => {
    const response = await axiosInstance.get("/tutors/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get featured tutors
  getFeaturedTutors: async (params = {}) => {
    const response = await axiosInstance.get("/tutors/featured", { params });
    return response.data;
  },

  // Rate tutor
  rateTutor: async (tutorId, rating, review) => {
    const response = await axiosInstance.post(`/tutors/${tutorId}/rate`, {
      rating,
      review,
    });
    return response.data;
  },

  // Get tutor reviews
  getTutorReviews: async (tutorId, params = {}) => {
    const response = await axiosInstance.get(`/tutors/${tutorId}/reviews`, {
      params,
    });
    return response.data;
  },
};
