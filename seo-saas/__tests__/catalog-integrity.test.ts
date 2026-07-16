// Integrity guards for the data catalogs that power the site's main programmatic
// SEO surface: /glossary/[slug], /checks/[slug] and /tools/[slug]. A duplicate
// slug, a broken cross-reference, or a tool with no matching page directory would
// silently ship dead or colliding pages — these tests fail the build instead.

import fs from 'node:fs';
import path from 'node:path';
import { GLOSSARY, glossaryBySlug } from '../src/lib/glossary';
import { CHECKS, checkBySlug, CHECK_CATEGORIES } from '../src/lib/checks-catalog';
import { TOOLS, toolBySlug, relatedTools } from '../src/lib/tools-catalog';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

describe('GLOSSARY', () => {
  test('every slug is unique and well-formed', () => {
    const slugs = GLOSSARY.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(SLUG_RE));
  });

  test('required text fields are present', () => {
    GLOSSARY.forEach((t) => {
      expect(nonEmpty(t.term)).toBe(true);
      expect(nonEmpty(t.short)).toBe(true);
      expect(nonEmpty(t.long)).toBe(true);
      expect(nonEmpty(t.link?.href)).toBe(true);
      expect(nonEmpty(t.link?.label)).toBe(true);
      expect(t.link.href.startsWith('/')).toBe(true);
    });
  });

  test('related[] references only existing terms and never itself', () => {
    GLOSSARY.forEach((t) => {
      t.related.forEach((rel) => {
        expect(glossaryBySlug.has(rel)).toBe(true);
        expect(rel).not.toBe(t.slug);
      });
    });
  });
});

describe('CHECKS', () => {
  test('every slug is unique and well-formed', () => {
    const slugs = CHECKS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(SLUG_RE));
  });

  test('required fields present and category is known', () => {
    CHECKS.forEach((c) => {
      expect(nonEmpty(c.title)).toBe(true);
      expect(nonEmpty(c.severity)).toBe(true);
      expect(nonEmpty(c.what)).toBe(true);
      expect(nonEmpty(c.why)).toBe(true);
      expect(nonEmpty(c.fixCode)).toBe(true);
      expect(CHECK_CATEGORIES[c.category]).toBeDefined();
    });
  });

  test('related links are internal and labelled', () => {
    CHECKS.forEach((c) => {
      c.related.forEach((r) => {
        expect(r.href.startsWith('/')).toBe(true);
        expect(nonEmpty(r.label)).toBe(true);
      });
    });
  });

  test('checkBySlug maps back to the same object', () => {
    CHECKS.forEach((c) => expect(checkBySlug.get(c.slug)).toBe(c));
  });
});

describe('TOOLS', () => {
  const VALID_CATEGORIES = new Set(['analyze', 'generate', 'schema']);

  test('every slug is unique and well-formed', () => {
    const slugs = TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(SLUG_RE));
  });

  test('required fields present with a valid category', () => {
    TOOLS.forEach((t) => {
      expect(nonEmpty(t.title)).toBe(true);
      expect(nonEmpty(t.short)).toBe(true);
      expect(nonEmpty(t.keywords)).toBe(true);
      expect(VALID_CATEGORIES.has(t.category)).toBe(true);
      expect(t.icon).toBeTruthy();
    });
  });

  test('each tool has a matching page directory under src/app/tools', () => {
    TOOLS.forEach((t) => {
      const page = path.join(__dirname, '..', 'src', 'app', 'tools', t.slug, 'page.tsx');
      expect(fs.existsSync(page)).toBe(true);
    });
  });

  test('relatedTools excludes self, respects the limit, and returns real tools', () => {
    TOOLS.forEach((t) => {
      const related = relatedTools(t.slug, 4);
      expect(related.length).toBeLessThanOrEqual(4);
      related.forEach((r) => {
        expect(r.slug).not.toBe(t.slug);
        expect(toolBySlug.has(r.slug)).toBe(true);
      });
    });
  });
});
