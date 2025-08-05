import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  tagTypes: ['User', 'Link'],
  endpoints: (build) => ({
    getUser: build.query<UserDto, string>({
      query: (uuid: string) => `/users/${uuid}`,
      providesTags: ['User'],
    }),

    createUser: build.query<UserDto, void>({
      query: () => ({
        url: '/users',
        method: 'POST',
      }),
      providesTags: ['User'],
    }),

    deleteUser: build.mutation<UserDto, string>({
      query: (uuid: string) => ({
        url: `/users/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // getLinks: build.query<UserDto, string>({
    //   query: (uuid: string) => `/users/${uuid}`,
    //   providesTags: ['User'],
    // }),
  }),
});
