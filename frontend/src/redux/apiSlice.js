import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
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
  }),
});

export const {
  useLoginUserMutation,
  useSignUpUserMutation,
  useAddReviewMutation,
  useGetFacultiesQuery,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetMyNotificationsQuery,
  useGetMeQuery,
} = apiSlice;
