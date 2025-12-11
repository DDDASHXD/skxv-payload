'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

interface CharacterMarqueeProps {
  text: string
  className?: string
  speed?: number
  pauseDuration?: number
  textClassName?: string
}

const CharacterMarquee: React.FC<CharacterMarqueeProps> = ({
  text,
  className = '',
  speed = 200,
  pauseDuration = 3000,
  textClassName = '',
}) => {
  const [visibleText, setVisibleText] = React.useState(text)
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const animationRef = React.useRef<NodeJS.Timeout | null>(null)
  const startIndexRef = React.useRef(0)
  const directionRef = React.useRef<'forward' | 'backward'>('forward')
  const isPausedRef = React.useRef(false)

  React.useEffect(() => {
    const measureOverflow = () => {
      if (!containerRef.current || !measureRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const textWidth = measureRef.current.offsetWidth
      const overflow = textWidth > containerWidth

      setIsOverflowing(overflow)

      if (!overflow) {
        setVisibleText(text)
        if (animationRef.current) {
          clearInterval(animationRef.current)
          animationRef.current = null
        }
        return
      }

      // Calculate how many characters fit in the container
      const avgCharWidth = textWidth / text.length
      const visibleCharCount = Math.floor(containerWidth / avgCharWidth)

      // Start animation
      startIndexRef.current = 0
      directionRef.current = 'forward'
      isPausedRef.current = false
      setVisibleText(text.slice(0, visibleCharCount))

      if (animationRef.current) {
        clearInterval(animationRef.current)
      }

      animationRef.current = setInterval(() => {
        if (isPausedRef.current) return

        const maxStartIndex = text.length - visibleCharCount

        if (directionRef.current === 'forward') {
          if (startIndexRef.current >= maxStartIndex) {
            // Reached the end, pause and reverse
            isPausedRef.current = true
            setTimeout(() => {
              directionRef.current = 'backward'
              isPausedRef.current = false
            }, pauseDuration)
          } else {
            startIndexRef.current += 1
          }
        } else {
          if (startIndexRef.current <= 0) {
            // Reached the start, pause and go forward
            isPausedRef.current = true
            setTimeout(() => {
              directionRef.current = 'forward'
              isPausedRef.current = false
            }, pauseDuration)
          } else {
            startIndexRef.current -= 1
          }
        }

        const newVisibleText = text.slice(
          startIndexRef.current,
          startIndexRef.current + visibleCharCount,
        )
        setVisibleText(newVisibleText)
      }, speed)
    }

    measureOverflow()

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [text, speed, pauseDuration])

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      {/* Hidden measure span */}
      <span ref={measureRef} className="invisible absolute whitespace-nowrap" aria-hidden="true">
        {text}
      </span>

      {/* Visible text */}
      <span className={cn('inline-block whitespace-pre', textClassName)}>{visibleText}</span>
    </div>
  )
}

export default CharacterMarquee
