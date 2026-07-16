// Guards the sitemap contract, in particular that thin, noindex /report/[id]
// pages never re-enter the sitemap (see src/app/report/[id]/layout.tsx).

// Blog list hits the DB; stub it so the sitemap builds deterministically offline.
jest.mock('@/lib/blog', () => ({
  getBlogList: jest.fn().mockResolvedValue([
    { slug: 'core-web-vitals', date: '2026-01-02', updated: '2026-02-01' },
    { slug: 'meta-tags-guide', date: '2026-01-05' },
  ]),
}));

import sitemap from '../src/app/sitemap';
import { GLOSSARY } from '../src/lib/glossary';
import { CHECKS } from '../src/lib/checks-catalog';

const BASE = 'https://seosnapshot.dev';

describe('sitemap()', () => {
  test('never includes noindex /report/ pages', async () => {
    const routes = await sitemap();
    expect(routes.some((r) => r.url.includes('/report/'))).toBe(false);
  });

  test('all URLs are absolute on the canonical host and unique', async () => {
    const routes = await sitemap();
    const urls = routes.map((r) => r.url);
    urls.forEach((u) => expect(u.startsWith(BASE)).toBe(true));
    expect(new Set(urls).size).toBe(urls.length);
  });

  test('includes the homepage and the mocked blog posts', async () => {
    const urls = (await sitemap()).map((r) => r.url);
    expect(urls).toContain(BASE);
    expect(urls).toContain(`${BASE}/blog/core-web-vitals`);
    expect(urls).toContain(`${BASE}/blog/meta-tags-guide`);
  });

  test('includes every glossary term and check page', async () => {
    const urls = new Set((await sitemap()).map((r) => r.url));
    GLOSSARY.forEach((t) => expect(urls.has(`${BASE}/glossary/${t.slug}`)).toBe(true));
    CHECKS.forEach((c) => expect(urls.has(`${BASE}/checks/${c.slug}`)).toBe(true));
  });
});
