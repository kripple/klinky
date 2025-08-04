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
  // isPositiveInteger,
  isSafePublicUrl,
} from '@/utils/type-guards';

const minLength = 6 as const;
const maxLength = 30 as const;

// function hasValidUserId<T extends object>(
//   obj: T,
// ): obj is T & { user_id: number } {
//   return 'user_id' in obj && isPositiveInteger(obj.user_id);
// }

function hasValidUrl<T extends object>(obj: T): obj is T & { value: string } {
  return 'value' in obj && isSafePublicUrl(obj.value);
}

function hasValidAlias<T extends object>(obj: T): obj is T & { alias: string } {
  const reserved = [
    'signup',
    'dashboard',
    'favicon.ico',
    'site.manifest',
    'assets',
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
  if (userUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing user id' });
  if (!validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid user id '${userUuid}'`,
    });

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
  if (userUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing user id' });
  if (!validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid user id '${userUuid}'`,
    });
  if (linkUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing link id' });

  // it's important we use the same error in case someone is trying to view another user's links
  const errorMessage = HttpStatus['500 Internal Server Error'];

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(errorMessage, { cause: 'missing user' });

  const link = await getLinkById({ userId: user.id, linkUuid });
  if (!link) throw Error(errorMessage, { cause: 'missing link' });

  return link;
};

export const create = async ({
  userUuid,
  data,
}: {
  userUuid?: string;
  data: unknown;
}) => {
  if (userUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing user id' });
  if (!validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid uuid '${userUuid}'`,
    });
  if (!isObject(data))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: 'expected data to be an object',
    });
  // if (!hasValidUserId(data))
  //   throw Error(HttpStatus['400 Bad Request'], {
  //     cause: `invalid user id '${(data as any).user_id}'`,
  //   });
  if (!hasValidUrl(data))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid url '${(data as any).value}'`,
    });

  const user = await getUserByUuid(userUuid);
  if (!user)
    throw Error(HttpStatus['404 Not Found'], { cause: 'missing user' });

  const links = await getLinks(user.id);
  if (links.length === maxLinksPerUser)
    throw Error(HttpStatus['403 Forbidden'], {
      cause: 'exceeds max links per user',
    });

  const { value } = data;
  const alias =
    'alias' in data && hasValidAlias(data) ? data.alias : nanoid(minLength);

  return createLink({ user_id: user.id, value, alias });
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
  if (userUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing user id' });
  if (!validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid user id '${userUuid}'`,
    });
  if (linkUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing link id' });
  if (!isObject(data))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: 'expected data to be an object',
    });
  if (!hasValidAlias(data))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: 'invalid alias',
    });

  // it's important we use the same error in case someone is trying to modify another user's links
  const errorMessage = HttpStatus['500 Internal Server Error'];

  const user = await getUserByUuid(userUuid);
  if (!user) throw Error(errorMessage, { cause: 'missing user' });

  const link = await updateLink({ userId: user.id, linkUuid, data });
  if (!link) throw Error(errorMessage, { cause: 'missing link' });

  return link;
};

export const destroy = async ({
  userUuid,
  linkUuid,
}: {
  userUuid?: string;
  linkUuid?: string;
}) => {
  if (userUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing user id' });
  if (!validator.validate(userUuid))
    throw Error(HttpStatus['400 Bad Request'], {
      cause: `invalid user id '${userUuid}'`,
    });
  if (linkUuid === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing link id' });

  // it's important we return the same response in case someone is trying to delete another user's links
  const emptyPromise = Promise.resolve();

  const user = await getUserByUuid(userUuid);
  if (!user) return emptyPromise;

  const link = await getLinkById({ userId: user.id, linkUuid });
  if (!link) return emptyPromise;

  await deleteLink({ userId: user.id, linkUuid });
};

export const unshorten = async (alias?: string) => {
  if (alias === undefined)
    throw Error(HttpStatus['400 Bad Request'], { cause: 'missing alias' });

  const link = await getLinkByAlias(alias);

  return link?.value;
};
