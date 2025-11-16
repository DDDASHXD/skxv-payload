import type { Metadata } from 'next'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
  siteName: 'Sebastian Skov - Frontend Engineer',
  title: 'Sebastian Skov (SKXV) - Frontend Engineer & UI/UX Designer',
  locale: 'en_US',
  url: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
  images: [
    {
      url: `${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Sebastian Skov - Frontend Engineer & UI/UX Designer',
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  const mergedOG = { ...defaultOpenGraph, ...og }
  // Prevent setting images: undefined, as this would prevent next.js from setting the automatically generated image url
  if (!mergedOG.images) {
    delete mergedOG.images
  }
  return mergedOG
}
