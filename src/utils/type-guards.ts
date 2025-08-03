export function isObject<T extends object>(value: unknown): value is T {
  return (
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

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
