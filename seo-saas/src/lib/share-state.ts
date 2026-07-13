// Tiny helpers to make tool results shareable via the URL query string —
// a differentiator most free tools lack ("send someone this exact result").

export function readShareParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => { out[k] = v; });
  return out;
}

export function buildShareUrl(params: Record<string, string | undefined>): string {
  if (typeof window === 'undefined') return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && String(v).trim()) sp.set(k, String(v));
  }
  const qs = sp.toString();
  const { origin, pathname } = window.location;
  return origin + pathname + (qs ? `?${qs}` : '');
}
