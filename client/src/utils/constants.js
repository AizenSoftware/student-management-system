// API Base URL
export const API_BASE_URL = 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REGISTER: '/auth/register',
  },
  
  // Admin - Students
  ADMIN: {
    STUDENTS: '/admin/students',
    STUDENT_BY_ID: (id) => `/admin/students/${id}`,
    
    // Admin - Lessons
    LESSONS: '/admin/lessons',
    LESSON_BY_ID: (id) => `/admin/lessons/${id}`,
    LESSON_STATS: '/admin/lessons/stats',
    
    // Admin - Enrollments
    ENROLLMENTS: '/admin/enrollments',
    ENROLLMENT_BY_ID: (id) => `/admin/enrollments/${id}`,
    STUDENT_LESSONS: (studentId) => `/admin/enrollments/student/${studentId}`,
    LESSON_STUDENTS: (lessonId) => `/admin/enrollments/lesson/${lessonId}`,
  },
  
  // Student
  STUDENT: {
    PROFILE: '/student/profile',
    MY_LESSONS: '/student/lessons/my',
    AVAILABLE_LESSONS: '/student/lessons/available',
    ENROLL: '/student/enroll',
    DROP: (lessonId) => `/student/drop/${lessonId}`,
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  
  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin',
    STUDENTS: '/admin/students',
    LESSONS: '/admin/lessons',
    ENROLLMENTS: '/admin/enrollments',
  },
  
  // Student Routes
  STUDENT: {
    DASHBOARD: '/student',
    PROFILE: '/student/profile',
    LESSONS: '/student/lessons',
    MY_LESSONS: '/student/my-lessons',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 20, 50],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  PREFERENCES: 'preferences',
};