import { ImageResponse } from 'next/og';
import { getBlogPost } from '@/lib/blog';

// Per-article social card: renders the article title on the dark branded card.
export const runtime = 'nodejs';
export const alt = 'SEO Snapshot · Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function BlogOpengraphImage({ params }: { params: { slug: string } }) {
  let title = 'SEO Snapshot Blog';
  try {
    const post = await getBlogPost(params.slug);
    if (post?.title) title = post.title;
  } catch {
    // fall back to the generic branded title
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)',
          color: 'white',
        }}
      >
        {/* Brand + section label */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ marginLeft: 18, fontSize: 28, fontWeight: 600 }}>SEO Snapshot</div>
          <div style={{ marginLeft: 14, fontSize: 24, color: 'rgba(255,255,255,0.35)' }}>· Blog</div>
        </div>

        {/* Article title */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 54 : 66,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#818cf8', fontWeight: 600 }}>
          seosnapshot.dev/blog
        </div>
      </div>
    ),
    { ...size },
  );
}
