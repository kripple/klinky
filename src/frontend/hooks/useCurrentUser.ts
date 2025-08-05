import { useEffect, useState } from 'react';
import * as uuid from 'uuid';

import { api } from '@/frontend/api';

export const useCurrentUser = () => {
  const key = 'user_uuid' as const;
  const [user_uuid, setUser] = useState<string | null>(
    (() => {
      const savedValue = window.localStorage.getItem(key);
      return uuid.validate(savedValue) ? savedValue : null;
    })(),
  );

  const response = user_uuid
    ? api.useGetUserQuery(user_uuid)
    : api.useCreateUserQuery();
  const currentId = response.currentData?.uuid;

  useEffect(() => {
    setUser((current) => {
      if (!currentId || currentId === current || !uuid.validate(currentId))
        return current;
      window.localStorage.setItem(key, currentId);
      return currentId;
    });
  }, [currentId]);

  return response;
};
