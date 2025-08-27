import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/user',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),

    endpoints: (builder) => ({

        signup: builder.mutation({
            query: (userData) => ({
                url: '/signup',
                method: 'POST',
                body: userData
            }),
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            }),
        }),

        getCurrentUser: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
        }),

        //recent attrempted quizzes
        getRecentAttemptedQuizzes: builder.query({
            query: () => ({
                url: '/student/recent-attempts',
                method: 'GET',
            }),
        }),

        // take quize
        takeQuiz: builder.mutation({
            query: ({ id, qid, answers ,timeTaken}) => ({
                url: `/student/${id}/take-quize/${qid}`,
                method: 'POST',
                body: { answers,timeTaken }
            }),
        }),
        //get publish quizes
        getPublishedQuizzes: builder.query({
            query: () => ({
                url: '/publish-quize',
                method: 'GET',
            }),
        }),

        //get user submissions
        getUserSubmissions: builder.query({
            query: (id) => ({
                url: `/student/${id}/submissions`,
                method: 'GET',
            }),
        }),
    })
})


export const {
    useSignupMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useGetRecentAttemptedQuizzesQuery,
    useTakeQuizMutation,
    useGetPublishedQuizzesQuery,
    useGetUserSubmissionsQuery
} = authApi