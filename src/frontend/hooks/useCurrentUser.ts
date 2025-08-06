import { useEffect } from 'react';
import * as validator from 'uuid';

import { api } from '@/frontend/api';

import 'urlpattern-polyfill';

const getPathUuid = () => {
  const pattern = new URLPattern({ pathname: '/links/:user_uuid' });
  const result = pattern.exec(window.location.href);
  const user_uuid = result?.pathname.groups?.user_uuid;
  const valid = typeof user_uuid === 'string' && validator.validate(user_uuid);
  return valid ? user_uuid : undefined;
};

export const useCurrentUser = () => {
  const pathUuid = getPathUuid();
  const response = pathUuid
    ? api.useGetUserQuery({ user_uuid: pathUuid })
    : api.useCreateUserQuery();

  const currentUserUuid = response.currentData?.uuid;

  // Set uuid in path (happy path)
  useEffect(() => {
    if (!currentUserUuid) return;

    // This parameter exists for historical reasons, and cannot be omitted; passing the empty string is traditional, and safe against future changes to the method.
    const unused = '' as const;

    history.replaceState(history.state, unused, `/links/${currentUserUuid}`);
  }, [currentUserUuid]);

  // pathUuid is not present or is invalid uuid format, create user query is not successful
  // const createUserError = !pathUuid && response.error;
  // useEffect(() => {
  //   if (!createUserError) return;
  //   console.log({ createUserError });
  // }, [createUserError]);

  // pathUuid is valid uuid format, but user does not exist
  const pathUserNotFound = pathUuid && response.error;
  useEffect(() => {
    if (!pathUserNotFound) return;
    console.log(pathUserNotFound);
  }, [pathUserNotFound]);

  // pathUuid is valid uuid format, server responds with unknown error, unable to check if user exists
  // const serverError = pathUuid && response.error;
  // useEffect(() => {
  //   if (!serverError) return;
  //   console.log(serverError);
  // }, [serverError]);

  return response;
};
