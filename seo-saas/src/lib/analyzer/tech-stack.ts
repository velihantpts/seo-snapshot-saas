import type { Issue } from './types';

export function detectTechStack(html: string, $: any, schemas: any[], issues: Issue[]) {
  const techStack: { name: string; confidence: string; icon: string }[] = [];
  const htmlLower = html.toLowerCase();
  const generators = $('meta[name="generator"]').attr('content') || '';

  if (generators.toLowerCase().includes('wordpress') || htmlLower.includes('wp-content/'))
    techStack.push({ name: 'WordPress', confidence: 'high', icon: 'WP' });
  if (htmlLower.includes('shopify') || htmlLower.includes('cdn.shopify.com'))
    techStack.push({ name: 'Shopify', confidence: 'high', icon: 'SH' });
  if (htmlLower.includes('__next') || htmlLower.includes('_next/static'))
    techStack.push({ name: 'Next.js', confidence: 'high', icon: 'NX' });
  if (htmlLower.includes('__nuxt'))
    techStack.push({ name: 'Nuxt.js', confidence: 'medium', icon: 'NU' });
  if (htmlLower.includes('data-reactroot') || htmlLower.includes('__react'))
    techStack.push({ name: 'React', confidence: 'medium', icon: 'RE' });
  if (htmlLower.includes('ng-version') || htmlLower.includes('ng-app'))
    techStack.push({ name: 'Angular', confidence: 'high', icon: 'NG' });
  if (htmlLower.includes('data-vue') || htmlLower.includes('__vue'))
    techStack.push({ name: 'Vue.js', confidence: 'medium', icon: 'VU' });
  if (generators.toLowerCase().includes('wix') || htmlLower.includes('wix.com'))
    techStack.push({ name: 'Wix', confidence: 'high', icon: 'WX' });
  if (htmlLower.includes('squarespace'))
    techStack.push({ name: 'Squarespace', confidence: 'high', icon: 'SQ' });
  if (htmlLower.includes('webflow'))
    techStack.push({ name: 'Webflow', confidence: 'high', icon: 'WF' });
  if (generators.toLowerCase().includes('drupal'))
    techStack.push({ name: 'Drupal', confidence: 'high', icon: 'DR' });
  if (htmlLower.includes('gtag') || htmlLower.includes('googletagmanager'))
    techStack.push({ name: 'Google Analytics', confidence: 'high', icon: 'GA' });
  if (htmlLower.includes('jquery'))
    techStack.push({ name: 'jQuery', confidence: 'medium', icon: 'JQ' });
  if (htmlLower.includes('tailwind'))
    techStack.push({ name: 'Tailwind CSS', confidence: 'medium', icon: 'TW' });
  if (htmlLower.includes('bootstrap'))
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
