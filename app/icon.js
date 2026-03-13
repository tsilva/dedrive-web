import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0d0d0d 0%, #111827 55%, #0f766e 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f8fafc',
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: '-0.08em',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 360,
            height: 360,
            borderRadius: 88,
            border: '12px solid rgba(255,255,255,0.14)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
            background: 'radial-gradient(circle at top, rgba(59,130,246,0.35), rgba(15,23,42,0.95))',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          d
        </div>
      </div>
    ),
    size
  );
}
