import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../../utils/constants';

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Profil işlemleri
    getMyProfile: builder.query({
      query: () => ({
        url: API_ENDPOINTS.STUDENT.PROFILE,
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    
    updateMyProfile: builder.mutation({
      query: (profileData) => ({
        url: API_ENDPOINTS.STUDENT.PROFILE,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Ders işlemleri
    getMyLessons: builder.query({
      query: () => ({
        url: API_ENDPOINTS.STUDENT.MY_LESSONS,
        method: 'GET',
      }),
      providesTags: ['Enrollment'],
    }),
    
    getAvailableLessons: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `${API_ENDPOINTS.STUDENT.AVAILABLE_LESSONS}?page=${page}&limit=${limit}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ['Lesson'],
    }),
    
    // Kayıt işlemleri
    enrollInLesson: builder.mutation({
      query: (lessonData) => ({
        url: API_ENDPOINTS.STUDENT.ENROLL,
        method: 'POST',
        body: lessonData,
      }),
      invalidatesTags: ['Enrollment', 'Lesson'],
    }),
    
    dropFromLesson: builder.mutation({
      query: (lessonId) => ({
        url: API_ENDPOINTS.STUDENT.DROP(lessonId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrollment', 'Lesson'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyLessonsQuery,
  useGetAvailableLessonsQuery,
  useEnrollInLessonMutation,
  useDropFromLessonMutation,
} = studentApi;