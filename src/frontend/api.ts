import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  tagTypes: ['User', 'Link', 'Links'],
  endpoints: (build) => ({
    getUser: build.query<UserDto, string>({
      query: (uuid) => `/users/${uuid}`,
      providesTags: ['User'],
    }),

    createUser: build.query<UserDto, void>({
      query: () => ({
        url: '/users',
        method: 'POST',
      }),
      providesTags: ['User'],
    }),

    deleteUser: build.mutation<void, string>({
      query: (uuid) => ({
        url: `/users/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Link', 'Links'],
    }),

    getLinks: build.query<LinkDto[], string>({
      query: (uuid) => `/users/${uuid}/links`,
      providesTags: ['Links'],
    }),

    // FIXME: param types are defined in the controllers. extract and share.
    createLink: build.query<LinkDto, { user_uuid: string; alias?: string }>({
      query: ({ user_uuid, alias }) => ({
        url: `/users/${user_uuid}/links`,
        method: 'POST',
        body: { alias },
      }),
      providesTags: ['Link'], // FIXME: doesn't this technically invalidate 'Links'? maybe don't use a query for this
    }),

    getLink: build.query<LinkDto, { user_uuid: string; link_uuid: string }>({
      query: ({ user_uuid, link_uuid }) =>
        `/users/${user_uuid}/links/${link_uuid}`,
      providesTags: ['Link'],
    }),

    updateLink: build.mutation<
      UserDto,
      { user_uuid: string; link_uuid: string; alias: string }
    >({
      query: ({ user_uuid, link_uuid, alias }) => ({
        url: `/users/${user_uuid}/links/${link_uuid}`,
        method: 'PATCH',
        body: { alias },
      }),
      invalidatesTags: ['Link', 'Links'], // TODO: soft update on client instead of invalidating 'Links'
    }),

    // deleteLink
    deleteLink: build.mutation<void, { user_uuid: string; link_uuid: string }>({
      query: ({ user_uuid, link_uuid }) => ({
        url: `/users/${user_uuid}/links/${link_uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Link', 'Links'], // TODO: soft delete on client instead of invalidating 'Links'
    }),
  }),
});
