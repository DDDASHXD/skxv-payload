import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const payload = await getPayload({ config })

    const existingConfig = await payload.findGlobal({
      slug: 'themeConfig',
    })

    await payload.updateGlobal({
      slug: 'themeConfig',
      data: {
        ...existingConfig,
        darkmodeColors: {
          ...(existingConfig.darkmodeColors || {}),
          enableDarkMode: true,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Dark mode enabled successfully!',
    })
  } catch (error) {
    console.error('Error enabling dark mode:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to enable dark mode',
      },
      { status: 500 },
    )
  }
}


