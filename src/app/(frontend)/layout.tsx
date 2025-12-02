import type { Metadata } from 'next'

import { Inter, Roboto_Serif, Roboto_Mono, Playfair_Display, Caveat } from 'next/font/google'
import React from 'react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

import { cn } from 'src/utilities/cn'
import { AdminBar } from '@/components/AdminBar'
import Footer from '@/components/skxv/footer'
import { Header } from '@/globals/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'

import { ThemeConfig } from '@/globals/ThemeConfig/Component'
import { resolveSlugs } from '@/utilities/resolveSlugs'
import localization from '@/localization.config'
import { PublicContextProps } from '@/utilities/publicContextProps'
import Script from 'next/script'

import './globals.css'

// Change fonts by changing class Geist_Mono or Geist.
// No change in tailwind.config.mjs needed (Because it's already synced via --font-mono and --font-sans variables). Just make sure, that these variables stay.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const robotoSerif = Roboto_Serif({ subsets: ['latin'], variable: '--font-serif' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'),
  title: {
    default: 'Sebastian Skov (SKXV) - Frontend Engineer & UI/UX Designer',
    template: '%s | Sebastian Skov',
  },
  description:
    'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Student at Roskilde University. Specializing in TypeScript, React, Next.js, Payload CMS, and Tailwind CSS.',
  keywords: [
    'Sebastian Skov',
    'SKXV',
    'Frontend Engineer',
    'UI/UX Designer',
    'Web Developer',
    'TypeScript',
    'React',
    'Next.js',
    'Payload CMS',
    'Tailwind CSS',
    'Roskilde',
    'Denmark',
    'TypoConsult',
    'Arevo Digital',
  ],
  authors: [{ name: 'Sebastian Skov', url: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work' }],
  creator: 'Sebastian Skov',
  publisher: 'Sebastian Skov',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Skov (SKXV) - Frontend Engineer & UI/UX Designer',
    description:
      'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
    creator: '@skxvdk',
    images: [`${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const paramsR = await params
  const { slugs } = paramsR
  const slugData = resolveSlugs(slugs || [])
  const { isEnabled } = await draftMode()

  const publicContext: PublicContextProps = {
    ...slugData,
  }

  return (
    <html
      className={cn(
        inter.variable,
        robotoSerif.variable,
        robotoMono.variable,
        playfair.variable,
        caveat.variable,
      )}
      lang={slugData.locale || localization.defaultLocale}
      suppressHydrationWarning
    >
      <head>
        <ThemeConfig publicContext={publicContext} />
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="font-mono">
        <Script
          async
          defer
          src="https://umami.arevodigital.dk/script.js"
          data-website-id="f843ebec-8bc9-4096-8eb3-859a1bfa871c"
        />
        <Providers>
          <Analytics />
          <div className="mx-auto flex w-full max-w-screen-md flex-col p-4">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
