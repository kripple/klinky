import { nanoid } from 'nanoid';
import * as validator from 'uuid';

import {
  createLink,
  deleteLink,
  getLinkByAlias,
  getLinkById,
  getLinks,
  maxLinksPerUser,
  updateLink,
} from '@/backend/models/link';
import { getUserByUuid } from '@/backend/models/user';
import { HttpStatus } from '@/utils/errors';
import {
  isObject,
  isPositiveInteger,
  isSafePublicUrl,
} from '@/utils/type-guards';

const minLength = 6 as const;
const maxLength = 30 as const;

function hasValidUserId<T extends object>(
  obj: T,
): obj is T & { user_id: number } {
  return 'user_id' in obj && isPositiveInteger(obj.user_id);
}

function hasValidUrl<T extends object>(obj: T): obj is T & { value: string } {
  return 'value' in obj && isSafePublicUrl(obj.value);
}

function hasValidAlias<T extends object>(obj: T): obj is T & { alias: string } {
  const reserved = [
    'admin',
    'login',
    'signup',
    'api',
    'dashboard',
    'favicon.ico',
  ];
  return (
    'alias' in obj &&
    typeof obj.alias === 'string' &&
    obj.alias.length < maxLength &&
    obj.alias.length > minLength &&
    /^[a-zA-Z0-9_-]+$/.test(obj.alias) &&
    !reserved.includes(obj.alias.toLowerCase())
  );
}

export const index = async (userUuid?: string) => {
  if (userUuid === undefined || !validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request']);

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(HttpStatus['404 Not Found']);

  return getLinks(user.id);
};

export const show = async ({
  userUuid,
  linkUuid,
}: {
  userUuid?: string;
  linkUuid?: string;
}) => {
  if (
    userUuid === undefined ||
    !validator.validate(userUuid) ||
    linkUuid === undefined
  )
    throw Error(HttpStatus['400 Bad Request']);

  // it's important we use the same error in case someone is trying to view another user's links
  const errorMessage = HttpStatus['500 Internal Server Error'];

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(errorMessage);

  const link = await getLinkById({ userId: user.id, linkUuid });
  if (!link) throw Error(errorMessage);

  return link;
};

export const create = async ({
  userUuid,
  data,
}: {
  userUuid?: string;
  data: unknown;
}) => {
  if (
    userUuid === undefined ||
    !validator.validate(userUuid) ||
    !isObject(data) ||
    !hasValidUserId(data) ||
    !hasValidUrl(data)
  )
    throw Error(HttpStatus['400 Bad Request']);

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(HttpStatus['404 Not Found']);

  const links = await getLinks(user.id);
  if (links.length === maxLinksPerUser)
    throw Error(HttpStatus['403 Forbidden']);

  const { user_id, value } = data;
  const alias =
    'alias' in data && hasValidAlias(data) ? data.alias : nanoid(minLength);

  return createLink({ user_id, value, alias });
};

export const update = async ({
  userUuid,
  linkUuid,
  data,
}: {
  userUuid?: string;
  linkUuid?: string;
  data: unknown;
}) => {
  if (
    userUuid === undefined ||
    !validator.validate(userUuid) ||
    linkUuid === undefined ||
    !isObject(data) ||
    !hasValidAlias(data)
  )
    throw Error(HttpStatus['400 Bad Request']);

  // it's important we use the same error in case someone is trying to modify another user's links
  const errorMessage = HttpStatus['500 Internal Server Error'];

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(errorMessage);

  const link = await updateLink({ userId: user.id, linkUuid, data });
  if (!link) throw Error(errorMessage);

  return link;
};

export const destroy = async ({
  userUuid,
  linkUuid,
}: {
  userUuid?: string;
  linkUuid?: string;
}) => {
  if (
    userUuid === undefined ||
    !validator.validate(userUuid) ||
    linkUuid === undefined
  )
    throw Error(HttpStatus['400 Bad Request']);

  // it's important we return the same response in case someone is trying to delete another user's links
  const emptyPromise = Promise.resolve();

  const user = await getUserByUuid(userUuid);
  if (!user) return emptyPromise;

  const link = await getLinkById({ userId: user.id, linkUuid });
  if (!link) return emptyPromise;

  await deleteLink({ userId: user.id, linkUuid });
};

export const unshorten = async (alias?: string) => {
  if (alias === undefined) throw Error(HttpStatus['400 Bad Request']);

  const link = await getLinkByAlias(alias);
  if (!link) throw Error(HttpStatus['404 Not Found']);

  return link.value;
};
