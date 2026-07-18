/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  async redirects() {
    // 301 orphaned Turkish blog posts -> their English equivalents.
    // Keep in sync with src/lib/retired-posts.ts (which filters them from
    // listings + sitemap and blocks their render).
    const retired = [
      ['canonical-url-nedir', 'canonical-url-explained'],
      ['core-web-vitals-nedir', 'how-to-improve-core-web-vitals'],
      ['meta-aciklama-nasil-yazilir', 'how-to-fix-missing-meta-description'],
      ['robots-txt-nedir-nasil-olusturulur', 'robots-txt-guide'],
      ['seo-skoru-nedir-nasil-yukseltilir', 'what-is-a-good-seo-score'],
      ['sitemap-nedir-google-nasil-gonderilir', 'sitemap-xml-guide'],
    ];
    return retired.map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src https://*.paddle.com; frame-ancestors 'none'" },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    }];
  },
};
module.exports = nextConfig;
