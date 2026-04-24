import axiosInstance from "./axiosConfig";

export const lessonHomeworkApi = {
  // List homework with pagination/filter
  // params: { LessonId, Status, TutorId, StudentId, page, "page-size", "search-term", "sort-params" }
  getHomeworks: async (params = {}) => {
    const response = await axiosInstance.get("/lesson-homeworks", { params });
    return response.data;
  },

  getHomeworkById: async (id) => {
    const response = await axiosInstance.get(`/lesson-homeworks/${id}`);
    return response.data;
  },

  // Tutor creates homework (status = NotStarted after this)
  // body: { courseResourceId, lessonId, description, maxScore, dueAt }
  createHomework: async (body) => {
    const response = await axiosInstance.post("/lesson-homeworks", body);
    return response.data;
  },

  // Tutor edits homework
  // body: { id, title, description, submissionUrl, score, maxScore }
  updateHomework: async (id, body) => {
    const response = await axiosInstance.put(`/lesson-homeworks/${id}`, body);
    return response.data;
  },

  deleteHomework: async (id) => {
    const response = await axiosInstance.delete(`/lesson-homeworks/${id}`);
    return response.data;
  },

  // Tutor assigns homework to student (status: NotStarted -> Assigned)
  assignHomework: async (id) => {
    const response = await axiosInstance.patch(
      `/lesson-homeworks/${id}/assign`,
    );
    return response.data;
  },

  // Student submits a file (status: Assigned -> Submitted)
  // multipart/form-data with field "File"
  submitHomework: async (id, file) => {
    const formData = new FormData();
    formData.append("File", file, file.name);
    const response = await axiosInstance.post(
      `/lesson-homeworks/${id}/submit`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      },
    );
    return response.data;
  },

  // Tutor grades (status: Submitted -> Scored)
  // body: { id, score, tutorFeedback }
  gradeHomework: async (id, score, tutorFeedback) => {
    const response = await axiosInstance.post(
      `/lesson-homeworks/${id}/grade`,
      { id, score, tutorFeedback },
    );
    return response.data;
  },
};
