import { ImageResponse } from 'next/og';

// Site-wide default social card. Rendered to PNG so Facebook, LinkedIn, X,
// Slack and Discord (none of which render SVG) get a real raster image.
// force-dynamic: render on-demand instead of at build. next/og on the node
// runtime throws "Invalid URL" during static export (@vercel/og font path),
// but renders fine at request time — this sidesteps that build-only bug.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const alt = 'SEO Snapshot — Free SEO Analyzer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
        {/* Brand lockup */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ marginLeft: 20, fontSize: 34, fontWeight: 600 }}>SEO Snapshot</div>
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Free SEO Analyzer
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
            123 checks · copy-paste fixes · no signup
          </div>
        </div>

        {/* Footer accent */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#818cf8', fontWeight: 600 }}>
          seosnapshot.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
