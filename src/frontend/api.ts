import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  tagTypes: ['User', 'Link', 'Links'],
  endpoints: (build) => ({
    getUser: build.query<UserDto, UserParams>({
      query: ({ user_uuid }) => `/users/${user_uuid}`,
      providesTags: ['User'],
    }),

    createUser: build.query<UserDto, void>({
      query: () => ({
        url: '/users',
        method: 'POST',
      }),
      providesTags: ['User'],
    }),

    deleteUser: build.mutation<void, UserParams>({
      query: ({ user_uuid }) => ({
        url: `/users/${user_uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Link', 'Links'],
    }),

    getLinks: build.query<LinkDto[], UserParams>({
      query: ({ user_uuid }) => `/users/${user_uuid}/links`,
      providesTags: ['Links'],
    }),

    createLink: build.query<LinkDto, CreateLinkParams>({
      query: ({ user_uuid, alias, value }) => ({
        url: `/users/${user_uuid}/links`,
        method: 'POST',
        body: { alias, value },
      }),
      providesTags: ['Link'],
      async onQueryStarted(_, { dispatch }) {
        dispatch(api.util.invalidateTags([{ type: 'Links' }]));
      },
    }),

    getLink: build.query<LinkDto, UserParams & LinkParams>({
      query: ({ user_uuid, link_uuid }) =>
        `/users/${user_uuid}/links/${link_uuid}`,
      providesTags: ['Link'],
    }),

    updateLink: build.query<LinkDto, UpdateLinkParams>({
      query: ({ user_uuid, link_uuid, alias }) => ({
        url: `/users/${user_uuid}/links/${link_uuid}`,
        method: 'PATCH',
        body: { alias },
      }),
      providesTags: ['Link'],
      async onQueryStarted(_, { dispatch }) {
        dispatch(
          api.util.invalidateTags([{ type: 'Links' }, { type: 'Link' }]),
        );
      },
    }),

    deleteLink: build.mutation<void, UserParams & LinkParams>({
      query: ({ user_uuid, link_uuid }) => ({
        url: `/users/${user_uuid}/links/${link_uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Link', 'Links'],
    }),
  }),
});
