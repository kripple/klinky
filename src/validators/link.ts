import * as z from 'zod';

import { aliasMinLength } from '@/validators/string';

export const max = 2000 as const;
export const maxLinksPerUser = 10 as const;
export const linkPrefix = 'https://' as const;
export const min = aliasMinLength + linkPrefix.length;

const isUrl = (value: string): URL | false => {
  try {
    const url = new URL(value);
    return url;
  } catch {
    return false;
  }
};

const isHttps = (url: URL) => url.protocol === 'https:';

const isLocal = (url: URL) =>
  url.hostname === 'localhost' || url.hostname.endsWith('.local');

const looksLikeIpAddress = (url: URL) => /^[\d.:]+$/.test(url.hostname);

// Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.

const Link = z
  .string()
  .min(min, {
    error: `Your link should be at least ${min} characters long.`,
    abort: true,
  })
  .max(max, {
    error: `Your link can’t be more than ${max} characters long.`,
    abort: true,
  })
  .refine((link) => isUrl(link), {
    error: 'Please enter a valid URL.',
    abort: true,
  })
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && isHttps(url);
    },
    { error: 'Links must use HTTPS for security.' },
  )
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && !isLocal(url);
    },
    {
      error:
        'Links to local or private addresses (like localhost) aren’t allowed.',
    },
  )
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && !looksLikeIpAddress(url);
    },
    { error: 'Links pointing directly to IP addresses aren’t allowed.' },
  );

type Link = z.infer<typeof Link>;

export const validateLink = (link: unknown) => {
  const result = Link.safeParse(link);

  if (result.error) {
    return {
      ...result,
      errors: result.error.issues.map((issue) => issue.message),
    };
  } else {
    return result;
  }
};
