// Reverse index of the curated cross-links that already live in the checks
// catalog and glossary: both point OUT to blog articles via `related`/`link`.
// Here we invert that mapping so each article can link BACK to the /checks and
// /glossary leaf pages that reference it. This gives the new programmatic pages
// contextual, keyword-anchored inbound links from crawled article bodies —
// the internal-link signal they need to get discovered and indexed.
import { CHECKS } from './checks-catalog';
import { GLOSSARY } from './glossary';

const BLOG_PREFIX = '/blog/';

const checksByArticle = new Map<string, { slug: string; title: string }[]>();
for (const c of CHECKS) {
  for (const r of c.related) {
    if (!r.href.startsWith(BLOG_PREFIX)) continue;
    const slug = r.href.slice(BLOG_PREFIX.length);
    const arr = checksByArticle.get(slug) ?? [];
    if (!arr.some((x) => x.slug === c.slug)) arr.push({ slug: c.slug, title: c.title });
    checksByArticle.set(slug, arr);
  }
}

const termsByArticle = new Map<string, { slug: string; term: string }[]>();
for (const t of GLOSSARY) {
  if (!t.link.href.startsWith(BLOG_PREFIX)) continue;
  const slug = t.link.href.slice(BLOG_PREFIX.length);
  const arr = termsByArticle.get(slug) ?? [];
  arr.push({ slug: t.slug, term: t.term });
  termsByArticle.set(slug, arr);
}

export interface RelatedRefs {
  checks: { slug: string; title: string }[];
  terms: { slug: string; term: string }[];
}

export function relatedRefsForArticle(slug: string): RelatedRefs {
  return {
    checks: (checksByArticle.get(slug) ?? []).slice(0, 4),
    terms: (termsByArticle.get(slug) ?? []).slice(0, 5),
  };
}
