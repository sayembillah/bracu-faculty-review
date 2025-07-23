import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.0.200:4000/api",
  prepareHeaders: (headers) => {
    const authData = localStorage.getItem("authData");
    let token;
    if (authData) {
      try {
        token = JSON.parse(authData).token;
      } catch (e) {
        token = null;
      }
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signUpUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: "/user/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    getFaculties: builder.query({
      query: () => ({
        url: "/faculties",
        method: "GET",
      }),
    }),
    addFaculty: builder.mutation({
      query: (facultyData) => ({
        url: "/faculties",
        method: "POST",
        body: facultyData,
      }),
      invalidatesTags: [{ type: "Faculty", id: "LIST" }],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...facultyData }) => ({
        url: `/faculties/${id}`,
        method: "PUT",
        body: facultyData,
      }),
      invalidatesTags: [{ type: "Faculty", id: "LIST" }],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `/faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Faculty", id: "LIST" }],
    }),
    getMyReviews: builder.query({
      query: () => ({
        url: "/user/reviews/my",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((review) => ({
                type: "Review",
                id: review._id,
              })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/user/reviews/${id}`,
        method: "DELETE",
      }),
    }),
    getMyNotifications: builder.query({
      query: () => ({
        url: "/user/notifications/my",
        method: "GET",
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    getFacultyReviews: builder.query({
      query: (facultyId) => ({
        url: `/faculties/${facultyId}/reviews`,
        method: "GET",
      }),
    }),
    likeReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/like`,
        method: "POST",
      }),
    }),
    dislikeReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/dislike`,
        method: "POST",
      }),
    }),
    // === Favorite Faculties ===
    getFavoriteFaculties: builder.query({
      query: () => ({
        url: "/auth/favorites",
        method: "GET",
      }),
    }),
    addFavoriteFaculty: builder.mutation({
      query: (facultyId) => ({
        url: `/auth/favorites/${facultyId}`,
        method: "POST",
      }),
    }),
    removeFavoriteFaculty: builder.mutation({
      query: (facultyId) => ({
        url: `/auth/favorites/${facultyId}`,
        method: "DELETE",
      }),
    }),
    // === Admin Activities ===
    getRecentActivities: builder.query({
      query: (limit = 20) => ({
        url: `/admin/activities?limit=${limit}`,
        method: "GET",
      }),
    }),
    // === Admin Metrics ===
    getAdminMetrics: builder.query({
      query: () => ({
        url: "/admin/metrics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useLoginUserMutation,
  useSignUpUserMutation,
  useAddReviewMutation,
  useGetFacultiesQuery,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetMyNotificationsQuery,
  useGetMeQuery,
  useGetFacultyReviewsQuery,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useGetFavoriteFacultiesQuery,
  useAddFavoriteFacultyMutation,
  useRemoveFavoriteFacultyMutation,
  useGetRecentActivitiesQuery,
  useGetAdminMetricsQuery,
} = apiSlice;
