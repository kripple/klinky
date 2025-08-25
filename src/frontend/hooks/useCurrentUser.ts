import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';
import * as validator from 'uuid';

import { api } from '@/frontend/api';

import 'urlpattern-polyfill';

const getPathUuid = () => {
  const pattern = new URLPattern({
    pathname: '/links/:user_uuid',
  });
  const result = pattern.exec(window.location.href);
  const user_uuid = result?.pathname.groups?.user_uuid;
  const valid = typeof user_uuid === 'string' && validator.validate(user_uuid);
  return valid ? user_uuid : undefined;
};

function isQueryError(
  error?: FetchBaseQueryError | SerializedError,
): error is FetchBaseQueryError {
  return error !== undefined && 'status' in error;
}

export const useCurrentUser = () => {
  const [pathUuid, setPathUuid] = useState<string | undefined>(getPathUuid());
  const userResponse = api.useGetUserQuery(
    { user_uuid: pathUuid as string },
    { skip: !pathUuid },
  );
  const [createUser, createUserResponse] = api.useCreateUserMutation();
  const currentUserUuid =
    userResponse.currentData?.uuid || createUserResponse.data?.uuid;

  useEffect(() => {
    if (pathUuid) return;
    createUser();
  }, [pathUuid, createUser]);

  // Set uuid in path (happy path)
  useEffect(() => {
    if (!currentUserUuid) return;

    // This parameter exists for historical reasons, and cannot be omitted; passing the empty string is traditional, and safe against future changes to the method.
    const unused = '' as const;

    history.replaceState(history.state, unused, `/links/${currentUserUuid}`);

    setPathUuid((current) => {
      if (current === currentUserUuid) return current;
      return currentUserUuid;
    });
  }, [currentUserUuid]);

  // pathUuid is not present or is invalid uuid format, create user query is not successful
  // --> retry / show generic error
  const createUserError = !pathUuid && createUserResponse.error;
  useEffect(() => {
    if (!createUserError) return;
    console.log('TODO: retry / show generic error');
  }, [createUserError]);

  // pathUuid is valid uuid format, but user does not exist
  // --> create new user
  const pathUserNotFound =
    pathUuid &&
    isQueryError(userResponse.error) &&
    userResponse.error.status === 404;
  useEffect(() => {
    if (!pathUserNotFound) return;
    setPathUuid(undefined);
  }, [pathUserNotFound]);

  // pathUuid is valid uuid format, server responds with unknown error, unable to check if user exists
  // --> retry / show generic error
  const serverError = pathUuid && userResponse.error && !pathUserNotFound;
  useEffect(() => {
    if (!serverError) return;
    console.log('TODO: retry / show generic error');
  }, [serverError]);

  return userResponse;
};
