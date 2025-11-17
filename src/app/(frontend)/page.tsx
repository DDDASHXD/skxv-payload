import { ActionButton, ActionGroup } from '@/components/skxv/reusables/action'
import Badge from '@/components/skxv/reusables/badge'
import Card from '@/components/skxv/reusables/card'
import InlineLink from '@/components/skxv/reusables/inline-link'
import Input from '@/components/skxv/reusables/input'
import Spinner from '@/components/skxv/reusables/spinner'
import Textarea from '@/components/skxv/reusables/textarea'
import { FaceLooker } from '@/components/skxv/face-looker'
import { ArrowLeft, ArrowUp, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import PageViews from '@/components/skxv/page-count'
import Link from 'next/link'
import RecentProjects from '@/components/skxv/landing/recent-projects'
import FavoriteSongs from '@/components/skxv/favorite-songs'
import BadgeButtonDropdown from '@/components/skxv/reusables/badge-button-dropdown'
import ThemeToggleDropdown from '@/components/skxv/theme-toggle-dropdown'
import type { Metadata } from 'next'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import {
  personStructuredData,
  websiteStructuredData,
  profilePageStructuredData,
} from '@/utilities/structured-data'

// Revalidate this page every 60 seconds (ISR fallback)
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home of SKXV',
  description:
    'Sebastian Skov (SKXV) is a UI/UX Designer and frontend web developer based in Roskilde, Denmark. Student at Roskilde University studying a humanitarian-technology bachelor. Working at TypoConsult.',
  openGraph: {
    title: 'Sebastian Skov (SKXV) - Frontend Engineer & UI/UX Designer',
    description:
      'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
    url: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
    siteName: 'Sebastian Skov - Frontend Engineer',
    type: 'profile',
    images: [
      {
        url: `${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sebastian Skov - Frontend Engineer & UI/UX Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Skov (SKXV) - Frontend Engineer & UI/UX Designer',
    description:
      'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
    creator: '@skxvdk',
    images: [`${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/og-image.jpg`],
  },
  alternates: {
    canonical: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
  },
}

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            personStructuredData,
            websiteStructuredData,
            profilePageStructuredData,
          ]),
        }}
      />
      <div>
        <div className="flex w-full gap-4">
          <div className="flex flex-col">
            <div className="mb-2 flex flex-col gap-2 md:flex-row">
              <b>Sebastian Skov (SKXV)</b>
              <div className="flex gap-2">
                <Badge>Frontend Engineer</Badge>
                <PageViews />
              </div>
            </div>
            <p>
              UI/UX Designer and frontend web developer based in Roskilde, Denmark. Student at
              Roskilde University studying a humanitarian-technology bachelor. Working at{' '}
              <InlineLink href="https://typoconsult.dk">TypoConsult</InlineLink>.
            </p>
          </div>
          <FaceLooker basePath="/faces/" showDebug={false} width={150} height={150} />
        </div>
        <FavoriteSongs />
        <Card title="Currently working on" titlePosition="left">
          <b>Arevo Plugins</b>
          <p className="mb-2">
            I&apos;m currently working on creating a centralized repository of plugins for Payload CMS.
            All community plugins are currently found through an arbitrary GitHub tag, and i would like to change that.
            Built under my Payload-specific website Arevo Digital, which is managed by a friend of mine and me.
          </p>
          <Link href="https://plugins.arevodigital.dk" className="w-full">
            <ActionButton icon={<ArrowRight className="size-4" />} className="w-full">
              Visit Arevo Plugins
            </ActionButton>
          </Link>
        </Card>
        <div className="flex w-full gap-4">
          <Card title="Skills" titlePosition="left" className="w-full">
            <ul className="list-inside list-disc">
              <li>Payload CMS</li>
              <li>TypeScript</li>
              <li>React</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>Figma</li>
            </ul>
          </Card>
          <Card title="Languages" titlePosition="left" className="w-full">
            <ul className="list-inside list-disc">
              <li>
                Danish <span className="text-muted-foreground">(Native)</span>
              </li>
              <li>
                English <span className="text-muted-foreground">(Fluent)</span>
              </li>
            </ul>
          </Card>
        </div>
        <RecentProjects />
        <Card title="Blog" titlePosition="left">
          <p>My blog is coming soon!</p>
        </Card>
      </div>
    </>
  )
}

export default Page
