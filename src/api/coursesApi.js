import axiosInstance from "./axiosConfig";

export const coursesApi = {
  // ==================== COURSE CATEGORY ====================
  // Get all course categories
  getAllCourseCategories: async (params = {}) => {
    const response = await axiosInstance.get("/course-categories", { params });
    return response.data;
  },

  // Get course category by ID
  getCourseCategoryById: async (categoryId) => {
    const response = await axiosInstance.get(`/course-categories/${categoryId}`);
    return response.data;
  },

  // Create new course category
  createCourseCategory: async (categoryData) => {
    const response = await axiosInstance.post("/course-categories", categoryData);
    return response.data;
  },

  // Update course category
  updateCourseCategory: async (categoryId, categoryData) => {
    const response = await axiosInstance.patch(`/course-categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete course category
  deleteCourseCategory: async (categoryId) => {
    const response = await axiosInstance.delete(`/course-categories/${categoryId}`);
    return response.data;
  },


  // ==================== COURSE ====================
  // Get all courses
  getAllCourses: async (params = {}) => {
    const response = await axiosInstance.get("/courses", { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await axiosInstance.post("/courses", courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await axiosInstance.patch(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await axiosInstance.delete(`/courses/${courseId}`);
    return response.data;
  },


  // ==================== COURSE ENROLLMENT ====================
  // Get all course enrollments (with pagination)
  getAllCourseEnrollments: async (params = {}) => {
    const response = await axiosInstance.get("/course-enrollments", { params });
    return response.data;
  },

  // Get course enrollment by ID
  getCourseEnrollmentById: async (enrollmentId) => {
    const response = await axiosInstance.get(`/course-enrollments/${enrollmentId}`);
    return response.data;
  },

  // Create course enrollment
  createCourseEnrollment: async (enrollmentData) => {
    const response = await axiosInstance.post("/course-enrollments", enrollmentData);
    return response.data;
  },

  // Update course enrollment
  updateCourseEnrollment: async (enrollmentId, enrollmentData) => {
    const response = await axiosInstance.put(`/course-enrollments/${enrollmentId}`, enrollmentData);
    return response.data;
  },

  // Update course enrollment status
  updateCourseEnrollmentStatus: async (enrollmentId, statusData) => {
    const response = await axiosInstance.put(`/course-enrollments/${enrollmentId}/status`, statusData);
    return response.data;
  },

  // Delete course enrollment
  deleteCourseEnrollment: async (enrollmentId) => {
    const response = await axiosInstance.delete(`/course-enrollments/${enrollmentId}`);
    return response.data;
  },


  // ==================== COURSE MODULE ====================
  // Get all course modules
  getAllCourseModules: async (params = {}) => {
    const response = await axiosInstance.get("/course-modules", { params });
    return response.data;
  },

  // Get course module by ID
  getCourseModuleById: async (moduleId) => {
    const response = await axiosInstance.get(`/course-modules/${moduleId}`);
    return response.data;
  },

  // Create new course module
  createCourseModule: async (moduleData) => {
    const response = await axiosInstance.post("/course-modules", moduleData);
    return response.data;
  },

  // Update course module
  updateCourseModule: async (moduleId, moduleData) => {
    const response = await axiosInstance.patch(`/course-modules/${moduleId}`, moduleData);
    return response.data;
  },

  // Delete course module
  deleteCourseModule: async (moduleId) => {
    const response = await axiosInstance.delete(`/course-modules/${moduleId}`);
    return response.data;
  },


  // ==================== COURSE RESOURCE ====================
  // Get all course resources
  getAllCourseResources: async (params = {}) => {
    const response = await axiosInstance.get("/course-resources", { params });
    return response.data;
  },

  // Get course resource by ID
  getCourseResourceById: async (resourceId) => {
    const response = await axiosInstance.get(`/course-resources/${resourceId}`);
    return response.data;
  },

  // Create new course resource
  createCourseResource: async (resourceData) => {
    const response = await axiosInstance.post("/course-resources", resourceData);
    return response.data;
  },

  // Update course resource
  updateCourseResource: async (resourceId, resourceData) => {
    const response = await axiosInstance.patch(`/course-resources/${resourceId}`, resourceData);
    return response.data;
  },

  // Delete course resource
  deleteCourseResource: async (resourceId) => {
    const response = await axiosInstance.delete(`/course-resources/${resourceId}`);
    return response.data;
  },

  
  // ==================== COURSE SESSION ====================
  // Get all course sessions
  getAllCourseSessions: async (params = {}) => {
    const response = await axiosInstance.get("/course-sessions", { params });
    return response.data;
  },

  // Get course session by ID
  getCourseSessionById: async (sessionId) => {
    const response = await axiosInstance.get(`/course-sessions/${sessionId}`);
    return response.data;
  },

  // Create new course session
  createCourseSession: async (sessionData) => {
    const response = await axiosInstance.post("/course-sessions", sessionData);
    return response.data;
  },

  // Update course session
  updateCourseSession: async (sessionId, sessionData) => {
    const response = await axiosInstance.patch(`/course-sessions/${sessionId}`, sessionData);
    return response.data;
  },

  // Delete course session
  deleteCourseSession: async (sessionId) => {
    const response = await axiosInstance.delete(`/course-sessions/${sessionId}`);
    return response.data;
  },
};
