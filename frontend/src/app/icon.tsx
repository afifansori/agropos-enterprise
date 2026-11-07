import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          borderRadius: 8,
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 18,
          color: 'white',
          letterSpacing: '-1px',
        }}
      >
        A
      </div>
    ),
    { ...size }
  )
}

