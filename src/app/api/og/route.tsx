import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const W = 1200;
const H = 630;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Комплектация объектов под ключ';
  const subtitle = searchParams.get('subtitle') ?? 'FF&E · OS&E · Логистика · Сертификация';

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1A1A1A',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Accent bar top-left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 8,
            height: H,
            backgroundColor: '#0077C8',
          }}
        />

        {/* Grid decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 320,
            height: H,
            backgroundImage:
              'radial-gradient(circle at 100% 50%, rgba(0,119,200,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo / brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 'auto',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: '#0077C8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: -1,
            }}
          >
            RI
          </div>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            PROJECTS
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: title.length > 50 ? 42 : 52,
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: 20,
            maxWidth: 820,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#6B7280',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 0.5,
            marginBottom: 48,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
          }}
        >
          <span style={{ color: '#6B7280', fontSize: 18 }}>riprojects.org</span>
          <div
            style={{
              display: 'flex',
              gap: 12,
              color: '#0077C8',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Ташкент · СНГ
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
    },
  );
}
