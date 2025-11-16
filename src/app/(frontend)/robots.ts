import { MetadataRoute } from 'next'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/'],
      },
    ],
    sitemap: `${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/sitemap.xml`,
    host: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
  }
}

