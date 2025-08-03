import * as validator from 'uuid';

import {
  createUser,
  deleteUserByUuid,
  getUserByUuid,
} from '@/backend/models/user';

export const create = async () => {
  const user = await createUser();
  return user;
};

export const show = async (uuid: string) => {
  if (!validator.validate(uuid)) throw Error('Bad Request');

  const user = await getUserByUuid(uuid);
  if (!user) throw Error('Not Found');

  return user;
};

export const destroy = async (uuid: string) => {
  await deleteUserByUuid(uuid);
};
