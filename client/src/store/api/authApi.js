import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../../utils/constants';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User',"Student"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['User',"Student"],
    }),
    getProfile: builder.query({
      query: () => API_ENDPOINTS.AUTH.PROFILE,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;