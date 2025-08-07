import * as z from 'zod';

import { aliasMinLength } from '@/validators/string';

export const max = 2000 as const;
export const maxLinksPerUser = 10 as const;

const isUrl = (value: string): URL | false => {
  try {
    const url = new URL(value);
    return url;
  } catch {
    return false;
  }
};

const isHttps = (url: URL) => url.protocol !== 'https:';

const isLocal = (url: URL) =>
  url.hostname === 'localhost' || url.hostname.endsWith('.local');

const looksLikeIpAddress = (url: URL) => /^[\d.:]+$/.test(url.hostname);

// Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.

const Link = z
  .string()
  .min(aliasMinLength)
  .max(max)
  .refine((link) => isUrl(link), { error: 'invalid URL', abort: true })
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && isHttps(url);
    },
    { error: 'invalid protocol, please use https' },
  )
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && !isLocal(url);
    },
    { error: 'local URLs are not allowed' },
  )
  .refine(
    (link) => {
      const url = isUrl(link);
      return url && !looksLikeIpAddress(url);
    },
    { error: 'IP addresses are not allowed' },
  );

type Link = z.infer<typeof Link>;

export const validateLink = (link: unknown) => Link.safeParse(link);
