export function isSafePublicUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;

    const hostname = url.hostname;
    const looksLikeIpAddress = /^[\d.:]+$/.test(hostname);

    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      looksLikeIpAddress
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const aliasMinLength = 6 as const;
export const aliasMaxLength = 30 as const;
export function isValidUrlAlias(alias: unknown): alias is string {
  const reserved = [
    'signup',
    'dashboard',
    'favicon.ico',
    'site.manifest',
    'assets',
  ];

  const valid =
    typeof alias === 'string' &&
    alias.length >= aliasMinLength &&
    alias.length <= aliasMaxLength &&
    /^[a-zA-Z0-9_-]+$/.test(alias) &&
    !reserved.includes(alias.toLowerCase());

  return valid;
}
