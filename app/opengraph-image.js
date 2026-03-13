import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #050816 0%, #0f172a 45%, #0f766e 100%)',
          color: '#f8fafc',
          padding: '54px 60px',
          fontFamily: 'system-ui',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0) 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -90,
            width: 460,
            height: 460,
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.28) 0%, rgba(34,197,94,0) 74%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 78,
                height: 78,
                borderRadius: 22,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: '-0.08em',
              }}
            >
              d
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 28, opacity: 0.8 }}>dedrive</div>
              <div style={{ fontSize: 20, opacity: 0.68 }}>Private Google Drive cleanup</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              maxWidth: 770,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 70,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: '-0.06em',
              }}
            >
              Find and remove duplicate files in Google Drive
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                lineHeight: 1.35,
                color: 'rgba(248,250,252,0.84)',
                maxWidth: 880,
              }}
            >
              Scan by checksum, preview matches, keep the right copy, and safely move extras into a _dupes folder.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
            }}
          >
            {['Private', 'Browser-based', 'Free'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 20px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
