import { api } from '@/frontend/api';

export const useSortedLinks = ({ user_uuid }: { user_uuid?: string }) => {
  return api.useGetLinksQuery(
    { user_uuid: user_uuid as string },
    {
      skip: !user_uuid,
      selectFromResult: ({ currentData, ...result }) => ({
        ...result,
        currentData: currentData
          ? [...currentData].sort((a, b) =>
              a.created_at < b.created_at ? 1 : -1,
            )
          : [],
      }),
    },
  );
};
