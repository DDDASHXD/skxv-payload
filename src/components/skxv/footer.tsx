import React from 'react'
import { ActionButton } from './reusables/action'
import { ActionGroup } from './reusables/action'
import { ArrowRight, ArrowLeft, ArrowUp, TwitterIcon, GithubIcon, MailIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggleDropdown from './theme-toggle-dropdown'

const Footer = () => {
  return (
    <div className="mt-8 flex flex-col gap-2">
      <ActionGroup>
        <Link href="https://github.com/DDDASHXD" className="w-full">
          <ActionButton icon={<GithubIcon className="size-4" />} className="w-full">
            GitHub
          </ActionButton>
        </Link>
        <Link href="https://x.com/skxvdev" className="w-full">
          <ActionButton icon={<TwitterIcon className="size-4" />} className="w-full">
            Twitter
          </ActionButton>
        </Link>
        <Link href="mailto:skov@skxv.dev" className="w-full">
          <ActionButton icon={<MailIcon className="size-4" />} className="w-full">
            Send me an email
          </ActionButton>
        </Link>
      </ActionGroup>
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div className="text-muted-foreground flex items-center gap-2 text-sm italic">
          © {new Date().getFullYear()}{' '}
          <Image
            src="/skxv.svg"
            alt="SKXV"
            width={100}
            height={100}
            className="h-4 w-auto pb-0.5"
          />{' '}
          All rights reserved.
        </div>
        <ThemeToggleDropdown position="top" />
      </div>
    </div>
  )
}

export default Footer

// https://camo.githubusercontent.com/abcde
