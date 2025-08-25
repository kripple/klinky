import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import * as z from 'zod';

import { aliasMinLength } from '@/validators/string';

export const max = 30 as const;
export const aliasDisplayPrefix = 'klinky.link/' as const;
export const aliasPrefix = `https://${aliasDisplayPrefix}` as const;
const regex = /^[a-zA-Z0-9_-]+$/;

const isReserved = (alias: string) =>
  [
    'about',
    'account',
    'accounts',
    'admin',
    'android',
    'androidchrome192x192',
    'androidchrome512x512',
    'api',
    'app',
    'apple',
    'appletouchicon',
    'assets',
    'backend',
    'beta',
    'blog',
    'bots',
    'build',
    'browserconfig',
    'cdn',
    'class',
    'chrome',
    'config',
    'contact',
    'dashboard',
    'database',
    'debug',
    'default',
    'delete',
    'desktop',
    'dev',
    'dist',
    'docs',
    'document',
    'documentation',
    'download',
    'edit',
    'env',
    'error',
    'external',
    'faq',
    'false',
    'favicon',
    'favicon16x16',
    'favicon32x32',
    'forbidden',
    'frontend',
    'guest',
    'help',
    'home',
    'humans',
    'internal',
    'legal',
    'link',
    'links',
    'login',
    'logoff',
    'logout',
    'maintenance',
    'manifest',
    'mobile',
    'new',
    'no',
    'notfound',
    'null',
    'preview',
    'private',
    'profile',
    'public',
    'register',
    'robots',
    'root',
    'search',
    'server',
    'service',
    'serviceworker',
    'settings',
    'setup',
    'signin',
    'signout',
    'signup',
    'site',
    'static',
    'support',
    'sw',
    'sysadmin',
    'system',
    'test',
    'terms',
    'true',
    'unauthorized',
    'undefined',
    'update',
    'upload',
    'user',
    'users',
    'web',
    'webadmin',
    'webmanifest',
    'website',
    'window',
    'yes',
  ].includes(alias.toLowerCase());

// Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.

const Alias = z
  .string()
  .min(aliasMinLength, {
    error: `Your custom link should be at least ${aliasMinLength} characters long.`,
    abort: true,
  })
  .max(max, {
    error: `Your custom link can’t be more than ${max} characters long.`,
    abort: true,
  })
  .regex(regex, {
    error:
      'Custom links can only have letters, numbers, dashes, and underscores.',
    abort: true,
  })
  .refine((alias) => !isReserved(alias), {
    error: 'This link is unavailable. Please choose a different one.',
  })
  .refine((alias) => !alias.startsWith('index'), {
    error: `Custom links can't start with 'index'.`,
  })
  .refine((alias) => !alias.startsWith('assets'), {
    error: `Custom links can't start with 'assets'.`,
  })
  .refine((alias) => !alias.startsWith('links'), {
    error: `Custom links can't start with 'links'.`,
  });

type Alias = z.infer<typeof Alias>;

export const validateAlias = (alias?: unknown) => {
  const result = Alias.safeParse(alias);

  if (result.error) {
    return {
      ...result,
      errors: result.error.issues.map((issue) => issue.message),
    };
  } else {
    return result;
  }
};

export const validateOptionalAlias = (alias?: unknown) => {
  return typeof alias !== 'string' || alias === ''
    ? validateAlias(generate())
    : validateAlias(alias);
};

export const generate = () => {
  const nanoid = customAlphabet(nolookalikesSafe, aliasMinLength);
  return nanoid();
};
