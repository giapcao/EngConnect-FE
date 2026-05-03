import axiosInstance from "./axiosConfig";

export const rescheduleApi = {
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
};
