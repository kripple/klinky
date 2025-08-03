import {
  createLink,
  deleteLink,
  getLinkById,
  getLinks,
  updateLink,
} from '@/backend/models/link';
import { getUserByUuid } from '@/backend/models/user';

export const index = async (uuid: string) => {
  const user = await getUserByUuid(uuid);
  if (!user) throw new Error('Not Found');

  return getLinks(user.id);
};

export const show = async (uuid: string, linkId: number) => {
  // it's important we use the same error in case someone is trying to view another user's links
  const errorMessage = 'Internal Server Error';

  const user = await getUserByUuid(uuid);
  if (!user) throw new Error(errorMessage);

  const link = await getLinkById(user.id, linkId);
  if (!link) throw new Error(errorMessage);

  return link;
};

export const create = async (uuid: string, data: any) => {
  const user = await getUserByUuid(uuid);
  if (!user) throw new Error('Not Found');

  return createLink(user.id, data);
};

export const update = async (uuid: string, linkId: number, data: any) => {
  // it's important we use the same error in case someone is trying to modify another user's links
  const errorMessage = 'Internal Server Error';

  const user = await getUserByUuid(uuid);
  if (!user) throw new Error(errorMessage);

  const link = await updateLink(user.id, linkId, data);
  if (!link) throw new Error(errorMessage);

  return link;
};

export const destroy = async (uuid: string, linkId: number) => {
  // it's important we return the same response in case someone is trying to delete another user's links
  const emptyPromise = Promise.resolve();

  const user = await getUserByUuid(uuid);
  if (!user) return emptyPromise;

  const link = await getLinkById(user.id, linkId);
  if (!link) return emptyPromise;

  await deleteLink(user.id, linkId);
};
