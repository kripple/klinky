import * as validator from 'uuid';

import { createUser, deleteUserById, getUserById } from '@/backend/models/user';

export const create = async () => {
  const user = await createUser();
  return user;
};

export const show = async (uuid: string) => {
  if (!validator.validate(uuid)) throw Error('Bad Request');

  const user = await getUserById(uuid);
  if (!user) throw Error('Not Found');

  return user;
};

export const destroy = async (uuid: string) => {
  await deleteUserById(uuid);
};
