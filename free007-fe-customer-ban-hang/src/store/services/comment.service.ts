import { CommentType, CreateCommentType } from '@/types/comment.type'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const commentApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ['comments'],
  endpoints: (builder) => ({
    createComment: builder.mutation<CommentType, CreateCommentType>({
      query: (comment) => ({
        url: '/comments',
        method: 'POST',
        body: comment
      }),
      invalidatesTags: [{ type: 'comments', id: 'LIST' }]
    }),
    getComments: builder.query<CommentType[], void>({
      query: () => '/comments',
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [...result.map(({ _id }) => ({ type: 'comments', id: _id }) as const), { type: 'comments', id: 'LIST' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'comments', id: 'LIST' }]
    }),
    deleteComment: builder.mutation<CommentType, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'comments', id }]
    }),
    updateComment: builder.mutation<CommentType, CommentType>({
      query: (comment) => ({
        url: `/comments/${comment._id}/${comment.userId}/${comment.productId}`,
        method: 'PUT',
        body: comment
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'comments', id: _id }]
    })
  })
})

export const { useCreateCommentMutation, useGetCommentsQuery, useDeleteCommentMutation, useUpdateCommentMutation } =
  commentApi

export const commentApiReducer = commentApi.reducer
export const commentApiMiddleware = commentApi.middleware
export default commentApi
