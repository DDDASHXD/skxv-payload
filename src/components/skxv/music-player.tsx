'use client'

import React from 'react'
import CharacterMarquee from './character-marquee'

type CurrentTrack = {
  album: string
  albumCoverUrl: string | null
  artists: string[]
  artistUrls: (string | null)[]
  durationMs: number
  isPlaying: boolean
  progressMs: number
  previewUrl: string | null
  songUrl: string | null
  title: string
  updatedAt: number
}

const POLL_INTERVAL_MS = 15_000

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const MusicPlayer = () => {
  const [track, setTrack] = React.useState<CurrentTrack | null>(null)
  const [now, setNow] = React.useState(() => Date.now())
  const [isPreviewPlaying, setIsPreviewPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const fetchCurrentlyPlaying = React.useCallback(async () => {
    try {
      const response = await fetch('/api/spotify/currently-playing', {
        cache: 'no-store',
      })

      if (response.status === 204) {
        setTrack(null)
        return
      }

      if (!response.ok) {
        setTrack(null)
        return
      }

      const nextTrack = (await response.json()) as CurrentTrack

      if (!nextTrack.isPlaying) {
        setTrack(null)
        return
      }

      setTrack(nextTrack)
      setNow(Date.now())
    } catch {
      setTrack(null)
    }
  }, [])

  React.useEffect(() => {
    fetchCurrentlyPlaying()

    const interval = window.setInterval(fetchCurrentlyPlaying, POLL_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [fetchCurrentlyPlaying])

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(interval)
  }, [])

  React.useEffect(() => {
    setIsPreviewPlaying(false)

    return () => {
      audioRef.current?.pause()
    }
  }, [track?.previewUrl])

  if (!track) return null

  const elapsedMs = Math.min(
    track.durationMs,
    track.progressMs + Math.max(0, now - track.updatedAt),
  )
  const progress = track.durationMs > 0 ? (elapsedMs / track.durationMs) * 100 : 0
  const artists = track.artists.join(', ')
  const previewLabel = track.previewUrl
    ? isPreviewPlaying
      ? 'Stop preview'
      : 'Listen to preview'
    : 'Preview unavailable'

  const togglePreview = async () => {
    const audio = audioRef.current
    if (!audio || !track.previewUrl) return

    if (isPreviewPlaying) {
      audio.pause()
      audio.currentTime = 0
      setIsPreviewPlaying(false)
      return
    }

    try {
      audio.currentTime = 0
      await audio.play()
      setIsPreviewPlaying(true)
    } catch {
      setIsPreviewPlaying(false)
    }
  }

  return (
    <div
      className="bg-background fixed bottom-0 left-0 z-9999 w-screen border-t-2 border-black"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-screen-md min-w-0 items-center gap-6 px-4 py-2">
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            className="group relative bg-black disabled:cursor-not-allowed"
            onClick={togglePreview}
            disabled={!track.previewUrl}
            aria-label={previewLabel}
            title={previewLabel}
          >
            <span className="absolute bottom-[calc(100%+3px)] left-1/2 hidden w-max -translate-x-1/2 bg-black text-sm text-white group-hover:block">
              {previewLabel}
            </span>
            <div
              className="bg-muted aspect-square size-12 shrink-0 border border-black bg-cover bg-center group-hover:opacity-30"
              role="img"
              aria-label={`${track.album} album cover`}
              style={
                track.albumCoverUrl ? { backgroundImage: `url(${track.albumCoverUrl})` } : undefined
              }
            ></div>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-transparent group-hover:text-white">
              {isPreviewPlaying ? '■' : '►'}
            </span>
            {track.previewUrl ? (
              <audio
                ref={audioRef}
                src={track.previewUrl}
                preload="none"
                onEnded={() => setIsPreviewPlaying(false)}
                onPause={() => setIsPreviewPlaying(false)}
              />
            ) : null}
          </button>

          <div className="flex max-w-20 flex-col gap-0.5 md:max-w-36">
            {track.songUrl ? (
              <a href={track.songUrl} target="_blank" rel="noreferrer">
                <CharacterMarquee
                  text={track.title}
                  className="text-sm font-medium"
                  textClassName="hover:underline"
                />
              </a>
            ) : (
              <CharacterMarquee text={track.title} className="text-sm font-medium" />
            )}
            {track.artistUrls[0] ? (
              <a href={track.artistUrls[0]} target="_blank" rel="noreferrer">
                <CharacterMarquee
                  text={artists}
                  className="text-xs italic"
                  textClassName="hover:underline"
                />
              </a>
            ) : (
              <CharacterMarquee text={artists} className="text-xs italic" />
            )}
          </div>
        </div>

        <ProgressBar value={progress} />
        <p className="shrink-0 text-sm">{formatTime(elapsedMs)}</p>
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
}

const FILL_CHAR = '█'

const ProgressBar = ({ value }: ProgressBarProps) => {
  const pct = Math.min(100, Math.max(0, value))
  const containerRef = React.useRef<HTMLDivElement>(null)
  const probeRef = React.useRef<HTMLSpanElement>(null)
  const [totalSlots, setTotalSlots] = React.useState(0)

  const measureSlots = React.useCallback(() => {
    const container = containerRef.current
    const probe = probeRef.current
    if (!container || !probe) return
    const charWidth = probe.getBoundingClientRect().width
    if (charWidth <= 0) return
    const next = Math.max(0, Math.floor(container.clientWidth / charWidth))
    setTotalSlots((prev) => (prev === next ? prev : next))
  }, [])

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    measureSlots()
    const ro = new ResizeObserver(measureSlots)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measureSlots])

  const filledSlots =
    totalSlots > 0 ? Math.min(totalSlots, Math.round((pct / 100) * totalSlots)) : 0
  const emptySlots = Math.max(0, totalSlots - filledSlots)

  const line =
    totalSlots > 0
      ? FILL_CHAR.repeat(filledSlots) + (emptySlots > 0 ? ' '.repeat(emptySlots) : '')
      : ''

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 relative flex h-5 min-h-0 min-w-0 flex-1 items-center overflow-hidden font-mono text-[13px] leading-5"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Playback progress"
    >
      <span
        ref={probeRef}
        className="bg-muted pointer-events-none absolute top-0 left-0 opacity-0"
        aria-hidden
      >
        {FILL_CHAR}
      </span>
      <span className="text-muted block pb-[3px] whitespace-pre select-none">{line}</span>
    </div>
  )
}

export default MusicPlayer
