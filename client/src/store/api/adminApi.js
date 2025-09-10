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
  }),
});

export const {
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
} = adminApi;