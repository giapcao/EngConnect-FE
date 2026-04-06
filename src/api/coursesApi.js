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


  // ==================== CATEGORY ====================
  // Get all categories
  getCategories: async (params = {}) => {
    const response = await axiosInstance.get("/categories", { params });
    return response.data;
  },

  // ==================== COURSE ====================
  // Get all courses
  getAllCourses: async (params = {}) => {
    const response = await axiosInstance.get("/courses", { params });
    return response.data;
  },

  // Get my courses (tutor)
  getMyCourses: async (params = {}) => {
    const response = await axiosInstance.get("/courses/my-course", { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create new course (multipart/form-data for file uploads)
  createCourse: async (courseData) => {
    const formData = new FormData();
    Object.entries(courseData).forEach(([key, value]) => {
      if (value != null && value !== "") {
        if (key === "CategoryIds" && Array.isArray(value)) {
          value.forEach((id) => formData.append("CategoryIds", id));
        } else {
          formData.append(key, value);
        }
      }
    });
    const response = await axiosInstance.post("/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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

  // Update course thumbnail
  updateCourseThumbnail: async (courseId, file, fileName) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("FileName", fileName);
    const response = await axiosInstance.put(`/courses/${courseId}/thumbnail`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update course demo video
  updateCourseDemoVideo: async (courseId, file, fileName) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("FileName", fileName);
    const response = await axiosInstance.put(`/courses/${courseId}/demo-video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
  // Get course modules by CourseId
  getAllCourseModules: async (params = {}) => {
    const response = await axiosInstance.get("/course-modules", { params });
    return response.data;
  },

  // Get tutor's course modules not yet belonging to the given course
  // Pass CourseId to exclude modules already in that course
  getCourseModulesByTutor: async (params = {}) => {
    const response = await axiosInstance.get("/course-modules/by-tutor", { params });
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

  // Remove a module from a course (using the join-table id from courseCourseModules)
  removeCourseModule: async (courseCourseModuleId) => {
    const response = await axiosInstance.delete(`/courses-modules/${courseCourseModuleId}`);
    return response.data;
  },

  // Get course module version tree (parentChain history)
  getCourseModuleTree: async (courseModuleId) => {
    const response = await axiosInstance.get(`/course-modules/${courseModuleId}/tree`);
    return response.data;
  },


  // ==================== COURSE RESOURCE ====================
  // Get course resources by CourseSessionId
  getAllCourseResources: async (params = {}) => {
    const response = await axiosInstance.get("/course-resources", { params });
    return response.data;
  },

  // Get tutor's course resources not yet belonging to the given session
  // Pass CourseSessionId to exclude resources already in that session
  getCourseResourcesByTutor: async (params = {}) => {
    const response = await axiosInstance.get("/course-resources/by-tutor", { params });
    return response.data;
  },

  // Get course resource by ID
  getCourseResourceById: async (resourceId) => {
    const response = await axiosInstance.get(`/course-resources/${resourceId}`);
    return response.data;
  },

  // Create new course resource (multipart/form-data for file uploads)
  createCourseResource: async (resourceData) => {
    const formData = new FormData();
    Object.entries(resourceData).forEach(([key, value]) => {
      if (value != null && value !== "") {
        formData.append(key, value);
      }
    });
    const response = await axiosInstance.post("/course-resources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
  // Get course sessions by CourseModuleId
  getAllCourseSessions: async (params = {}) => {
    const response = await axiosInstance.get("/course-sessions", { params });
    return response.data;
  },

  // Get tutor's course sessions not yet belonging to the given module
  // Pass CourseModuleId to exclude sessions already in that module
  getCourseSessionsByTutor: async (params = {}) => {
    const response = await axiosInstance.get("/course-sessions/by-tutor", { params });
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

  // Remove a session from a module (using the join-table id from courseModuleCourseSessions)
  removeModuleSession: async (moduleSessionId) => {
    const response = await axiosInstance.delete(`/modules-sessions/${moduleSessionId}`);
    return response.data;
  },

  // Get course session version tree (parentChain history)
  getCourseSessionTree: async (courseSessionId) => {
    const response = await axiosInstance.get(`/course-sessions/${courseSessionId}/tree`);
    return response.data;
  },


  // ==================== COURSE VERIFICATION ====================
  // Submit course verification request
  createCourseVerificationRequest: async (courseId) => {
    const response = await axiosInstance.post("/course-verification-requests", { courseId });
    return response.data;
  },

  // Get all course verification requests (admin)
  getCourseVerificationRequests: async (params = {}) => {
    const response = await axiosInstance.get("/course-verification-requests", { params });
    return response.data;
  },

  // Delete course verification request
  deleteCourseVerificationRequest: async (id) => {
    const response = await axiosInstance.delete(`/course-verification-requests/${id}`);
    return response.data;
  },

  // Review course verification request (approve/reject)
  reviewCourseVerificationRequest: async (requestId, data) => {
    const response = await axiosInstance.post(
      `/courses/verification-requests/${requestId}/review`,
      data
    );
    return response.data;
  },


  // ==================== CATEGORY CRUD ====================
  // Create category
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    const response = await axiosInstance.patch(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  },
};
