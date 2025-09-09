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
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = adminApi;