import * as validator from 'uuid';

import {
  createUser,
  deleteUserByUuid,
  getUserByUuid,
} from '@/backend/models/user';
import { HttpStatus } from '@/utils/errors';

export const create = async () => {
  const user = await createUser();
  return user;
};

export const show = async (userUuid?: string) => {
  if (userUuid === undefined || !validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request']);

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error('Not Found');

  return user;
};

export const destroy = async (userUuid?: string) => {
  if (userUuid === undefined || !validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request']);

  await deleteUserByUuid(userUuid);
};
