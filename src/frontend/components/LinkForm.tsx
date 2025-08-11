import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/frontend/api';
import { CreateLinkForm } from '@/frontend/components/CreateLinkForm';
import { useSortedLinks } from '@/frontend/hooks/useSortedLinks';
import { maxLinksPerUser } from '@/validators/link';

export function LinkForm({ user_uuid }: { user_uuid?: string }) {
  const linksResponse = useSortedLinks({ user_uuid });
  const maxLinks =
    linksResponse.currentData &&
    linksResponse.currentData.length >= maxLinksPerUser;

  const [aliasErrors, setAliasErrors] = useState<string[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [requestKey, setRequestKey] = useState<number>(0);

  const delayMs = 800 as const;
  const timeoutHandler = useRef<NodeJS.Timeout | null>(null);

  const [createLink, response] = api.useCreateLinkMutation({
    fixedCacheKey: requestKey.toString(),
  });

  const handleCreateLink = useCallback(
    (params: CreateLinkParams) => {
      createLink(params)
        .unwrap()
        .then(() => {
          timeoutHandler.current = setTimeout(() => {
            setRequestKey((current) => current + 1);
          }, delayMs);
        })
        .catch((error) => {
          // set errors
          console.error('create link error', error);
        });
    },
    [createLink],
  );

  useEffect(
    () => () => {
      timeoutHandler.current && clearTimeout(timeoutHandler.current);
    },
    [],
  );

  return (
    <CreateLinkForm
      aliasErrors={aliasErrors}
      createLink={handleCreateLink}
      error={
        maxLinks ? `There is a maximum of ${maxLinksPerUser} links.` : undefined
      }
      key={requestKey}
      linkErrors={linkErrors}
      loading={response.isLoading}
      setAliasErrors={setAliasErrors}
      setLinkErrors={setLinkErrors}
      success={response.isSuccess}
      user_uuid={user_uuid}
    />
  );
}
