import axiosInstance from "./axiosConfig";

export const meetingApi = {
  getMeeting: async (lessonId) => {
    const response = await axiosInstance.get(`/meetings/${lessonId}`);
    return response.data;
  },

  endMeeting: async (lessonId, totalChunks) => {
    const params = totalChunks != null ? { totalChunks } : {};
    const response = await axiosInstance.post(
      `/meetings/${lessonId}/end`,
      null,
      { params },
    );
    return response.data;
  },

  uploadRecordingChunk: async (lessonId, chunkTimestamp, chunkBlob) => {
    const formData = new FormData();
    formData.append("chunkTimestamp", chunkTimestamp);
    formData.append("chunk", chunkBlob, `chunk-${chunkTimestamp}.webm`);
    const response = await axiosInstance.post(
      `/meetings/${lessonId}/recordings/chunks`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 },
    );
    return response.data;
  },
};
