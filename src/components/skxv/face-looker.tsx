'use client'

import React from 'react'
import Image from 'next/image'

// Grid configuration (must match your generated images)
const P_MIN = -15
const P_MAX = 15
const STEP = 3
const SIZE = 256

interface FaceLookerProps {
  basePath?: string
  showDebug?: boolean
  className?: string
  width?: number
  height?: number
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

const quantizeToGrid = (val: number): number => {
  const raw = P_MIN + ((val + 1) * (P_MAX - P_MIN)) / 2 // [-1,1] -> [-15,15]
  const snapped = Math.round(raw / STEP) * STEP
  return clamp(snapped, P_MIN, P_MAX)
}

const sanitize = (val: number): string => {
  const str = Number(val).toFixed(1) // force one decimal, e.g. 0 -> 0.0
  return str.replace('-', 'm').replace('.', 'p')
}

const gridToFilename = (px: number, py: number): string => {
  return `gaze_px${sanitize(px)}_py${sanitize(py)}_${SIZE}.webp`
}

export const FaceLooker: React.FC<FaceLookerProps> = ({
  basePath = '/faces/',
  showDebug = false,
  className = '',
  width = 360,
  height = 360,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = React.useState<string>('')
  const [debugInfo, setDebugInfo] = React.useState<{
    x: number
    y: number
    filename: string
  } | null>(null)

  const setFromClient = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const nx = (clientX - centerX) / (rect.width / 2)
      const ny = (centerY - clientY) / (rect.height / 2)

      const clampedX = clamp(nx, -1, 1)
      const clampedY = clamp(ny, -1, 1)

      const px = quantizeToGrid(clampedX)
      const py = quantizeToGrid(clampedY)

      const filename = gridToFilename(px, py)
      const imagePath = `${basePath}${filename}`

      setCurrentImage(imagePath)

      if (showDebug) {
        setDebugInfo({
          x: Math.round(clientX - rect.left),
          y: Math.round(clientY - rect.top),
          filename,
        })
      }
    },
    [basePath, showDebug],
  )

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setFromClient(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0]
        setFromClient(t.clientX, t.clientY)
      }
    }

    // Track pointer anywhere on the page
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Initialize at center
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setFromClient(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [setFromClient])

  return (
    <div
      ref={containerRef}
      className={`bg-background relative hidden overflow-hidden rounded-lg md:block ${className}`}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
        height,
      }}
    >
      {currentImage && (
        <Image
          src={currentImage}
          alt="Face following gaze"
          fill
          className="object-contain transition-opacity duration-100 ease-out"
          priority
        />
      )}

      {showDebug && debugInfo && (
        <div className="absolute top-2.5 left-2.5 rounded bg-black/80 px-3 py-2 font-mono text-xs leading-relaxed text-white">
          Mouse: ({debugInfo.x}, {debugInfo.y})<br />
          Image: {debugInfo.filename}
        </div>
      )}
    </div>
  )
}
