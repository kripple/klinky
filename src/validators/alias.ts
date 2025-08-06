import { nanoid } from 'nanoid';
import * as z from 'zod';

import { aliasMinLength } from '@/validators/string';

const max = 30 as const;
const regex = /^[a-zA-Z0-9_-]+$/;

const isReserved = (alias: string) =>
  [
    'account',
    'accounts',
    'admin',
    'android-chrome-192x192',
    'android-chrome-512x512',
    'apple-touch-icon',
    'auth',
    'blog',
    'bots',
    'browserconfig',
    'dashboard',
    'favicon-16x16',
    'favicon-32x32',
    'favicon',
    'guest',
    'humans',
    'link',
    'links',
    'login',
    'logoff',
    'logout',
    'manifest',
    'register',
    'robots',
    'service-worker',
    'signin',
    'signout',
    'signup',
    'site',
    'sw',
    'user',
    'users',
    'webmanifest',
  ].includes(alias.toLowerCase());

// Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.

const Alias = z
  .string()
  .min(aliasMinLength)
  .max(max)
  .regex(regex)
  .refine((alias) => !isReserved(alias), { error: 'reserved keyword' })
  .refine((alias) => alias.startsWith('index'), {
    error: `custom link may not begin with 'index'`,
  })
  .refine((alias) => alias.startsWith('assets'), {
    error: `custom link may not begin with 'assets'`,
  });

type Alias = z.infer<typeof Alias>;

export const validateAlias = (alias?: unknown) => Alias.safeParse(alias);

export const validateOptionalAlias = (alias?: unknown) => {
  const defaultResult = Alias.safeParse(nanoid(aliasMinLength));
  const result = Alias.safeParse(alias);

  // sanity check
  if (!defaultResult.success) {
    throw Error(
      `We've done something terribly wrong, this error should not be possible.`,
    );
  }

  return result.success ? result.data : defaultResult.data;
};
