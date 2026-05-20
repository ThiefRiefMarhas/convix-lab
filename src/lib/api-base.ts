/**
 * Resolve API URLs against the current page origin.
 * Critical for mobile/LAN access — relative `/api` only works when
 * frontend and backend share the same host:port (our unified server).
 */
export function getApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${normalized}`;
  }
  return normalized;
}
