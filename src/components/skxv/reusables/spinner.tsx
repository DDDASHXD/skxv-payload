'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

interface SpinnerProps {
  size?: 'small' | 'large'
  rotation?: 'cw' | 'ccw'
  className?: string
}

const Spinner = ({ size = 'large', rotation = 'cw', className }: SpinnerProps) => {
  const PATTERNS = {
    small: ['⠟', '⠯', '⠷', '⠾', '⠽', '⠻'],
    large: ['⡿', '⣟', '⣯', '⣷', '⣾', '⣽', '⣻', '⢿'],
  }

  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => {
        if (rotation === 'cw') {
          return (index - 1 + PATTERNS[size].length) % PATTERNS[size].length
        } else {
          return (index + 1) % PATTERNS[size].length
        }
      })
    }, 100)
    return () => clearInterval(interval)
  }, [size, rotation])

  return (
    <div
      className={cn('text-primary text-2xl', size === 'small' ? 'text-sm' : 'text-lg', className)}
    >
      {PATTERNS[size][index]}
    </div>
  )
}

export default Spinner
