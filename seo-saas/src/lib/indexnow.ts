// IndexNow — instantly notify Bing/Yandex (and other participating engines) of
// new or updated URLs. No account needed: we host a key file at
// https://seosnapshot.dev/<KEY>.txt and POST changed URLs to the IndexNow API.
// (Google does not use IndexNow — submit the sitemap in Search Console for Google.)

export const INDEXNOW_KEY = '7f2a9c14e0b84d6fa3175e9c2b608d4f';
const SITE = 'https://seosnapshot.dev';
const HOST = 'seosnapshot.dev';

// Fire-and-forget ping. Never throws — indexing is best-effort.
export async function pingIndexNow(urls: string[]): Promise<void> {
  const urlList = urls.filter(Boolean);
  if (urlList.length === 0) return;

  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // best-effort — ignore failures
  }
}
