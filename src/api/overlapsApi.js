import axiosInstance from "./axiosConfig";

export const overlapsApi = {
  getTutorOfferOverlaps: async (params = {}) => {
    const response = await axiosInstance.get("/overlaps/tutor-offer-overlaps", { params });
    return response.data;
  },
};
