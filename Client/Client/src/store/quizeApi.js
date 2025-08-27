import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizeApi = createApi({
    reducerPath: "quizeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/quize',
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
        createQuiz: builder.mutation({
            query: (quizData) => ({
                url: "/teacher/create-quize",
                method: "POST",
                body: quizData,
            }),
        }),

        //get all created quizes
        getQuizzesByTeacher: builder.query({
            query: () => ({
                url: "/teacher/quizes",
                method: "GET",
            }),
        }),
        
        //get quize by id
         getQuizById: builder.query({
                query: (id) => ({
                    url: `/getQuize/${id}`,
                    method: "GET",
                }),
         }),
        // update quize
        updateQuiz: builder.mutation({
            query: ({ id, quizData }) => ({
                url: `/teacher/editQuize/${id}`,
                method: "PUT",
                body: quizData,
            }),
        }),

        // delete quize
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `/teacher/deleteQuize/${id}`,
                method: "DELETE",
            }),
        }),

        //delete question from quize
        deleteQuestionFromQuiz: builder.mutation({
            query: (id) => ({
                url: `/teacher/deleteQuize/${id}/:${qid}`,
                method: "DELETE",
            }),
        }),

        ///student side
        getRecentPublishedQuizzes: builder.query({
            query: () => ({
                url: `/student/quizzes/recent`,
                method: "GET",
            }),
        }),

    }),
});


export const { useCreateQuizMutation,
    useGetQuizzesByTeacherQuery,
    useGetQuizByIdQuery,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
    useDeleteQuestionFromQuizMutation,
    useGetRecentPublishedQuizzesQuery
 } = quizeApi;
