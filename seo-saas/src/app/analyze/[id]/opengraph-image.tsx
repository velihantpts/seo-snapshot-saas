import { ImageResponse } from 'next/og';

// Analyze pages are private/auth-gated, so we intentionally do NOT surface the
// analyzed domain or score here (that would leak private data via the OG image
// of any shared URL). Render a generic branded card instead.
export const runtime = 'nodejs';
export const alt = 'SEO Report · SEO Snapshot';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function AnalyzeOpengraphImage() {
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, letterSpacing: '-0.02em' }}>
            SEO Report
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 30, color: 'rgba(255,255,255,0.55)' }}>
            123 checks · copy-paste fixes · security grade
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#818cf8', fontWeight: 600 }}>
          seosnapshot.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
