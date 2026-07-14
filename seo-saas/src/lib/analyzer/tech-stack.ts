import type { Issue } from './types';

export function detectTechStack(html: string, $: any, schemas: any[], issues: Issue[]) {
  const techStack: { name: string; confidence: string; icon: string }[] = [];
  const htmlLower = html.toLowerCase();
  const generator = ($('meta[name="generator"]').attr('content') || '').toLowerCase();

  // Fingerprints for real infrastructure (CDN hosts, framework bundles, generator
  // meta) live in resource URLs — NOT in page copy. Matching the whole HTML for a
  // bare word like "shopify" or "bootstrap" gives false positives whenever a page
  // merely mentions the product (e.g. a member/partner logo list, a blog post).
  const resourceUrls = [
    ...$('script[src]').map((_: number, el: any) => $(el).attr('src')).get(),
    ...$('link[href]').map((_: number, el: any) => $(el).attr('href')).get(),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const res = (needle: string) => resourceUrls.includes(needle);
  const gen = (needle: string) => generator.includes(needle);

  // WordPress — generator or its unmistakable asset paths
  if (gen('wordpress') || htmlLower.includes('/wp-content/') || htmlLower.includes('/wp-includes/'))
    techStack.push({ name: 'WordPress', confidence: 'high', icon: 'WP' });
  // Shopify — require store infrastructure, not the word "shopify" in content
  if (res('cdn.shopify.com') || res('myshopify.com') || htmlLower.includes('window.shopify') || htmlLower.includes('shopify.theme') || htmlLower.includes('shopify.shop'))
    techStack.push({ name: 'Shopify', confidence: 'high', icon: 'SH' });
  // Next.js
  if (res('/_next/static') || htmlLower.includes('__next_data__') || htmlLower.includes('id="__next"'))
    techStack.push({ name: 'Next.js', confidence: 'high', icon: 'NX' });
  // Nuxt.js
  if (res('/_nuxt/') || htmlLower.includes('window.__nuxt') || htmlLower.includes('id="__nuxt"'))
    techStack.push({ name: 'Nuxt.js', confidence: 'medium', icon: 'NU' });
  // React (only surfaced when a more specific SSR framework above didn't match)
  if (htmlLower.includes('data-reactroot') || htmlLower.includes('_reactrootcontainer'))
    techStack.push({ name: 'React', confidence: 'medium', icon: 'RE' });
  // Angular
  if (htmlLower.includes('ng-version=') || $('[ng-app]').length > 0 || $('[ng-version]').length > 0)
    techStack.push({ name: 'Angular', confidence: 'high', icon: 'NG' });
  // Vue.js
  if (htmlLower.includes('data-v-app') || htmlLower.includes('window.__vue__') || $('[data-server-rendered]').length > 0)
    techStack.push({ name: 'Vue.js', confidence: 'medium', icon: 'VU' });
  // Wix
  if (gen('wix') || res('wixstatic.com') || res('.wixsite.com'))
    techStack.push({ name: 'Wix', confidence: 'high', icon: 'WX' });
  // Squarespace
  if (gen('squarespace') || res('squarespace-cdn.com') || res('static1.squarespace.com'))
    techStack.push({ name: 'Squarespace', confidence: 'high', icon: 'SQ' });
  // Webflow
  if (gen('webflow') || res('assets.website-files.com') || res('.webflow.io') || $('[data-wf-page]').length > 0 || $('[data-wf-site]').length > 0)
    techStack.push({ name: 'Webflow', confidence: 'high', icon: 'WF' });
  // Drupal
  if (gen('drupal') || htmlLower.includes('drupal-settings-json') || res('/sites/default/files'))
    techStack.push({ name: 'Drupal', confidence: 'high', icon: 'DR' });
  // Google Analytics / Tag Manager
  if (res('googletagmanager.com') || res('google-analytics.com') || /gtag\s*\(/.test(htmlLower))
    techStack.push({ name: 'Google Analytics', confidence: 'high', icon: 'GA' });
  // jQuery — require an actual script reference, not the word in copy
  if (/jquery[.\-][\w.]*\.js/.test(resourceUrls) || resourceUrls.includes('/jquery/'))
    techStack.push({ name: 'jQuery', confidence: 'medium', icon: 'JQ' });
  // Tailwind CSS — only detectable via the CDN build or a named stylesheet
  // (production builds are purged and leave no reliable fingerprint)
  if (res('cdn.tailwindcss.com') || /tailwind[\w.\-]*\.css/.test(resourceUrls))
    techStack.push({ name: 'Tailwind CSS', confidence: 'medium', icon: 'TW' });
  // Bootstrap — require the actual asset, not the word "bootstrap"
  if (/bootstrap[\w.\-]*\.(css|js)/.test(resourceUrls) || res('bootstrapcdn.com'))
    techStack.push({ name: 'Bootstrap', confidence: 'medium', icon: 'BS' });

  // Platform-specific tips
  if (techStack.some(t => t.name === 'WordPress') && schemas.length === 0)
    issues.push({ severity: 'warning', problem: 'WordPress site without structured data', fix: 'Install Yoast SEO or Rank Math plugin.', category: 'Technical' });
  if (techStack.some(t => t.name === 'Wix'))
    issues.push({ severity: 'warning', problem: 'Wix detected — limited SEO control', fix: 'Use Wix SEO tools under Marketing > SEO.', category: 'Technical' });
  if (techStack.some(t => t.name === 'React') && !techStack.some(t => t.name === 'Next.js'))
    issues.push({ severity: 'warning', problem: 'Client-side React without SSR framework', fix: 'Use Next.js or Gatsby for server-side rendering.', category: 'Technical' });

  return techStack;
}
