import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

// Social card for a public shared SEO report: analyzed domain + score + grade.
export const runtime = 'nodejs';
export const alt = 'SEO Report · SEO Snapshot';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function gradeFor(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function scoreColor(score: number): string {
  if (score >= 75) return '#34d399';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

export default async function ReportOpengraphImage({ params }: { params: { id: string } }) {
  let domain = '';
  let score: number | null = null;

  // Only surface real data for reports that were explicitly made public.
  try {
    const analysis = await prisma.analysis.findUnique({ where: { id: params.id } });
    if (analysis?.public) {
      const data = JSON.parse(analysis.data);
      if (typeof data.score === 'number') score = data.score;
      if (typeof data.url === 'string') {
        try {
          domain = new URL(data.url).hostname.replace(/^www\./, '');
        } catch {
          domain = data.url;
        }
      }
    }
  } catch {
    // fall back to generic branded card
  }

  const hasData = score !== null;
  const color = hasData ? scoreColor(score as number) : '#818cf8';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '80px',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)',
          color: 'white',
        }}
      >
        {/* Left: brand + domain */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
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
            <div style={{ marginLeft: 14, fontSize: 24, color: 'rgba(255,255,255,0.35)' }}>· Report</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
              SEO Report for
            </div>
            <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, letterSpacing: '-0.02em', maxWidth: 640 }}>
              {domain || 'Your website'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#818cf8', fontWeight: 600 }}>
            seosnapshot.dev
          </div>
        </div>

        {/* Right: score ring */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 320 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 280,
              height: 280,
              borderRadius: 280,
              border: `12px solid ${color}`,
            }}
          >
            {hasData ? (
              <>
                <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, color }}>{score}</div>
                <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em' }}>
                  GRADE {gradeFor(score as number)}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color, textAlign: 'center' }}>SEO</div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
