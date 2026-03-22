import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'SEO Snapshot API',
    version: '1.0.0',
    description: 'Analyze any webpage\'s SEO with 110+ checks. Get actionable fix recommendations with copy-paste code snippets.',
    contact: { email: 'support@seosnapshot.dev', url: 'https://seosnapshot.dev' },
  },
  servers: [{ url: 'https://seosnapshot.dev', description: 'Production' }],
  paths: {
    '/api/v1/analyze': {
      post: {
        summary: 'Analyze a URL',
        description: 'Run 110+ SEO checks on any URL. Returns score, issues, fix recommendations, and detailed data.',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['url'], properties: { url: { type: 'string', example: 'https://example.com' } } } } } },
        responses: {
          '200': { description: 'Analysis result', content: { 'application/json': { schema: { type: 'object', properties: {
            id: { type: 'string' }, url: { type: 'string' }, score: { type: 'integer', minimum: 0, maximum: 100 },
            issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['critical', 'warning'] }, problem: { type: 'string' }, fix: { type: 'string' }, category: { type: 'string' }, impact: { type: 'integer' } } } },
            meta: { type: 'object' }, headings: { type: 'object' }, images: { type: 'object' }, links: { type: 'object' },
            performance: { type: 'object' }, security: { type: 'object' }, mobile: { type: 'object' },
            accessibility: { type: 'object' }, contentQuality: { type: 'object' }, techStack: { type: 'array' },
          } } } } },
          '400': { description: 'Invalid URL' },
          '429': { description: 'Rate limit exceeded' },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/api/analyze': {
      post: {
        summary: 'Analyze a URL (public)',
        description: 'Same as /api/v1/analyze but without API key. Rate limited to 5/day.',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['url'], properties: { url: { type: 'string' } } } } } },
        responses: { '200': { description: 'Analysis result' }, '429': { description: 'Rate limit exceeded' } },
      },
    },
    '/api/stats': {
      get: {
        summary: 'Get platform statistics',
        description: 'Returns total analyses count and average score.',
        responses: { '200': { description: 'Stats', content: { 'application/json': { schema: { type: 'object', properties: { totalAnalyses: { type: 'integer' }, avgScore: { type: 'integer' } } } } } } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', description: 'API key from your dashboard' },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
  });
}
