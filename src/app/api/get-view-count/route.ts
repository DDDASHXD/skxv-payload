import { NextResponse } from 'next/server'

const UMAMI_URL = 'https://umami.skxv.dev'
const UMAMI_USERNAME = 'admin'
const UMAMI_PASSWORD = 'Aavlkdss7Xqqkusp7#'

interface UmamiAuthResponse {
  token: string
}

async function authenticateUmami(): Promise<string> {
  try {
    const response = await fetch(`${UMAMI_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: UMAMI_USERNAME,
        password: UMAMI_PASSWORD,
      }),
    })

    if (!response.ok) {
      throw new Error(`Umami authentication failed: ${response.statusText}`)
    }

    const data: UmamiAuthResponse = await response.json()
    return data.token
  } catch (error) {
    console.error('Failed to authenticate with Umami:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')

    if (!websiteId) {
      return NextResponse.json(
        {
          success: false,
          error: 'websiteId parameter is required',
        },
        { status: 400 },
      )
    }

    // Calculate date range (last 30 days)
    const endAt = Date.now()
    const startAt = endAt - 30 * 24 * 60 * 60 * 1000

    // Authenticate with Umami
    const token = await authenticateUmami()

    // Fetch stats
    const response = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`)
    }

    const stats = await response.json()

    return NextResponse.json({
      success: true,
      viewCount: stats.pageviews?.value || 0,
      visitors: stats.visitors?.value || 0,
      stats,
    })
  } catch (error) {
    console.error('Error fetching view count:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch view count',
      },
      { status: 500 },
    )
  }
}
