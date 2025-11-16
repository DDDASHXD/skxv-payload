import { NextResponse } from 'next/server'

const UMAMI_URL = 'https://umami.arevodigital.dk'
const UMAMI_USERNAME = 'admin'
const UMAMI_PASSWORD = 'Aavlkdss7Xqqkusp7#'

interface UmamiAuthResponse {
  token: string
}

interface UmamiWebsite {
  id: string
  name: string
  domain: string
  shareId: string
}

interface UmamiPageView {
  x: string
  y: number
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

async function getWebsites(token: string): Promise<UmamiWebsite[]> {
  try {
    const response = await fetch(`${UMAMI_URL}/api/websites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch websites: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Failed to fetch websites:', error)
    throw error
  }
}

async function getPageViews(token: string, websiteId: string, startAt: number, endAt: number) {
  try {
    const response = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch page views: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch page views:', error)
    throw error
  }
}

async function getPageMetrics(token: string, websiteId: string, startAt: number, endAt: number) {
  try {
    const response = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch page metrics: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch page metrics:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')
    const period = searchParams.get('period') || '30d' // Default to 30 days

    // Calculate date range based on period
    const endAt = Date.now()
    let startAt = endAt

    switch (period) {
      case '24h':
        startAt = endAt - 24 * 60 * 60 * 1000
        break
      case '7d':
        startAt = endAt - 7 * 24 * 60 * 60 * 1000
        break
      case '30d':
        startAt = endAt - 30 * 24 * 60 * 60 * 1000
        break
      case '90d':
        startAt = endAt - 90 * 24 * 60 * 60 * 1000
        break
      case '1y':
        startAt = endAt - 365 * 24 * 60 * 60 * 1000
        break
      default:
        startAt = endAt - 30 * 24 * 60 * 60 * 1000
    }

    // Authenticate with Umami
    const token = await authenticateUmami()

    // Get websites if no specific website ID is provided
    if (!websiteId) {
      const websites = await getWebsites(token)

      // Fetch stats for all websites
      const allStats = await Promise.all(
        websites.map(async (website) => {
          const [stats, metrics] = await Promise.all([
            getPageViews(token, website.id, startAt, endAt),
            getPageMetrics(token, website.id, startAt, endAt),
          ])

          return {
            website: {
              id: website.id,
              name: website.name,
              domain: website.domain,
            },
            stats,
            metrics,
          }
        }),
      )

      return NextResponse.json({
        success: true,
        period,
        dateRange: {
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
        },
        data: allStats,
      })
    }

    // Fetch stats for a specific website
    const [stats, metrics] = await Promise.all([
      getPageViews(token, websiteId, startAt, endAt),
      getPageMetrics(token, websiteId, startAt, endAt),
    ])

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
      },
      data: {
        stats,
        metrics,
      },
    })
  } catch (error) {
    console.error('Error in Umami page views route:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch page views',
      },
      { status: 500 },
    )
  }
}
