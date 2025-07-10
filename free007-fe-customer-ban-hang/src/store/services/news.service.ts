import { INews } from '@/types/news.type'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ['news'],
  endpoints: (builder) => ({
    getNews: builder.query<INews[], void>({
      query: () => `/tintuc`,
      providesTags: ['news']
    })
  })
})

const newsApiReducer = newsApi.reducer
export const { useGetNewsQuery } = newsApi
export default newsApiReducer
