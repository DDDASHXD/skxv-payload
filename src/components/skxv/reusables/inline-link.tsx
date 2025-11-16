import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface InlineLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode
  className?: string
}

const InlineLink = ({ children, className, ...props }: InlineLinkProps) => {
  return (
    <Link className={cn('bg-muted hover:bg-accent underline', className)} {...props}>
      {children}
    </Link>
  )
}

export default InlineLink
