import axiosInstance from "./axiosConfig";

export const rescheduleApi = {
  // Tutor offer flow
  createOffer: async (data) => {
    const response = await axiosInstance.post("/tutor-lesson-reschedule-offers", data);
    return response.data;
  },
  getOffers: async (params = {}) => {
    const response = await axiosInstance.get("/tutor-lesson-reschedule-offers", { params });
    return response.data;
  },
  getOfferById: async (id) => {
    const response = await axiosInstance.get(`/tutor-lesson-reschedule-offers/${id}`);
    return response.data;
  },
  selectOption: async (id, data) => {
    const response = await axiosInstance.patch(
      `/tutor-lesson-reschedule-offers/${id}/select-option`,
      data,
    );
    return response.data;
  },

  // Student request flow
  createRequest: async (data) => {
    const response = await axiosInstance.post("/lesson-reschedule-requests", data);
    return response.data;
  },
  getRequests: async (params = {}) => {
    const response = await axiosInstance.get("/lesson-reschedule-requests", { params });
    return response.data;
  },
  getRequestById: async (id) => {
    const response = await axiosInstance.get(`/lesson-reschedule-requests/${id}`);
    return response.data;
  },
  updateRequest: async (id, data) => {
    const response = await axiosInstance.patch(`/lesson-reschedule-requests/${id}`, data);
    return response.data;
  },
};
