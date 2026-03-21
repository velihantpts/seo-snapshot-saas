import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://seosnapshot.dev';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/analyze/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
