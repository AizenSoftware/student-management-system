import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../../utils/constants';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Öğrenci işlemleri
    getStudents: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `${API_ENDPOINTS.ADMIN.STUDENTS}?page=${page}&limit=${limit}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    
    getStudent: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: API_ENDPOINTS.ADMIN.STUDENTS,
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    
    updateStudent: builder.mutation({
      query: ({ id, ...studentData }) => ({
        url: API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id),
        method: 'PUT',
        body: studentData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),
    
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Öğrencinin kayıtlı olduğu dersler
    getStudentLessons: builder.query({
      query: (studentId) => ({
        url: API_ENDPOINTS.ADMIN.STUDENT_LESSONS(studentId),
        method: 'GET',
      }),
      providesTags: (result, error, studentId) => [
        { type: 'Enrollment', id: studentId }
      ],
    }),

    // Ders işlemleri
    getLessons: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `${API_ENDPOINTS.ADMIN.LESSONS}?page=${page}&limit=${limit}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ['Lesson'],
    }),
    
    getLesson: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.LESSON_BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),
    
    createLesson: builder.mutation({
      query: (lessonData) => ({
        url: API_ENDPOINTS.ADMIN.LESSONS,
        method: 'POST',
        body: lessonData,
      }),
      invalidatesTags: ['Lesson'],
    }), 
    
    updateLesson: builder.mutation({
      query: ({ id, ...lessonData }) => ({
        url: API_ENDPOINTS.ADMIN.LESSON_BY_ID(id),
        method: 'PUT',
        body: lessonData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lesson', id }, 'Lesson'],
    }),
    
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.LESSON_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lesson', id }, 'Lesson'],
    }),
    
    getLessonStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.ADMIN.LESSON_STATS,
        method: 'GET',
      }),
      providesTags: ['Lesson'],
    }),

    // YENİ: Derse kayıtlı öğrencileri getir
    getLessonStudents: builder.query({
      query: (lessonId) => ({
        url: API_ENDPOINTS.ADMIN.LESSON_STUDENTS(lessonId),
        method: 'GET',
      }),
      providesTags: (result, error, lessonId) => [
        { type: 'Enrollment', id: lessonId }
      ],
    }),

    // Enrollment işlemleri
    getEnrollments: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `${API_ENDPOINTS.ADMIN.ENROLLMENTS}?page=${page}&limit=${limit}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ['Enrollment'],
    }),
    createEnrollment: builder.mutation({
      query: (enrollmentData) => ({
        url: API_ENDPOINTS.ADMIN.ENROLLMENTS,
        method: 'POST',
        body: enrollmentData,
      }),
      invalidatesTags: ['Enrollment'],
    }),
    deleteEnrollment: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.ENROLLMENT_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrollment'],
    }),
    // Dropdown için tüm öğrencileri getir
    getAllStudentsForSelect: builder.query({
      query: () => ({
        url: API_ENDPOINTS.ADMIN.STUDENTS,
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    // Dropdown için tüm dersleri getir
    getAllLessonsForSelect: builder.query({
      query: () => ({
        url: API_ENDPOINTS.ADMIN.LESSONS,
        method: 'GET',
      }),
      providesTags: ['Lesson'],
    }),
  }),
});

export const {
  // Öğrenci işlemleri
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentLessonsQuery,
  
  // Ders işlemleri
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetLessonStatsQuery,
  useGetLessonStudentsQuery,
  
  // Enrollment işlemleri
  useGetEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  
  // Dropdown için hook'lar
  useGetAllStudentsForSelectQuery,
  useGetAllLessonsForSelectQuery,
} = adminApi;