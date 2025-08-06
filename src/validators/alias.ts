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
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'auth',
    'blog',
    'bots.txt',
    'browserconfig.xml',
    'dashboard',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon.ico',
    'guest',
    'humans.txt',
    'link',
    'links',
    'login',
    'logoff',
    'logout',
    'manifest.json',
    'register',
    'robots.txt',
    'service-worker.js',
    'signin',
    'signout',
    'signup',
    'site.manifest',
    'site.webmanifest',
    'sw.js',
    'user',
    'users',
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
