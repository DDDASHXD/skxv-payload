import { ImageResponse } from 'next/og'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Sebastian Skov (SKXV)'
    const subtitle =
      searchParams.get('subtitle') || 'Frontend Engineer & UI/UX Designer'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                marginBottom: 20,
                letterSpacing: '-0.05em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 36,
                color: '#888',
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 20,
                fontSize: 24,
                color: '#666',
              }}
            >
              <span>TypeScript</span>
              <span>•</span>
              <span>React</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Payload CMS</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

