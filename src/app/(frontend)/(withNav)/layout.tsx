import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-8">
      <Link href="/" className="">
        <Image src="/skxv.svg" alt="SKXV" width={100} height={100} className="h-6 w-auto" />
      </Link>
      <div className="">{children}</div>
    </div>
  )
}

export default Layout
