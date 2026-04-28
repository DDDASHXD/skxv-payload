import { NextResponse } from 'next/server'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const spotifyPreviewFinder = require('spotify-preview-finder') as SpotifyPreviewFinder

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const SPOTIFY_CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track'
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1'

type SpotifyTokenResponse = {
  access_token?: string
  expires_in?: number
  token_type?: string
  error?: string
}

type SpotifyImage = {
  url: string
  height: number | null
  width: number | null
}

type SpotifyTrack = {
  id: string
  type: 'track'
  name: string
  duration_ms: number
  preview_url: string | null
  external_urls?: {
    spotify?: string
  }
  album: {
    name: string
    images: SpotifyImage[]
  }
  artists: {
    external_urls?: {
      spotify?: string
    }
    name: string
  }[]
}

type SpotifyCurrentlyPlayingResponse = {
  is_playing: boolean
  progress_ms: number | null
  item: SpotifyTrack | null
}

type SpotifySearchResponse = {
  tracks?: {
    items: SpotifyTrack[]
  }
}

type SpotifyPreviewFinderResult = {
  error?: string
  results: {
    albumName: string
    durationMs: number
    name: string
    previewUrls: string[]
    spotifyUrl: string
    trackId: string
  }[]
  searchQuery?: string
  success: boolean
}

type SpotifyPreviewFinder = (
  songName: string,
  artistOrLimit?: string | number,
  limit?: number,
) => Promise<SpotifyPreviewFinderResult>

type SpotifyPreviewDebug = {
  finder: {
    error: string | null
    results: SpotifyPreviewFinderResult['results']
    searchQuery: string | null
    success: boolean | null
  }
  search: {
    error: string | null
    queries: {
      error: string | null
      items: {
        album: string
        artists: string[]
        id: string
        name: string
        previewUrl: string | null
        spotifyUrl: string | null
      }[]
      query: string
      status: number | null
    }[]
  }
  track: {
    error: string | null
    id: string
    previewUrl: string | null
    status: number | null
  }
}

const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return null
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as SpotifyTokenResponse

  return data.access_token || null
}

const pickAlbumCover = (images: SpotifyImage[]) => {
  return [...images].sort((a, b) => (b.width || 0) - (a.width || 0))[0]?.url || null
}

const summarizeTrack = (track: SpotifyTrack) => {
  return {
    album: track.album.name,
    artists: track.artists.map((artist) => artist.name),
    id: track.id,
    name: track.name,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls?.spotify || null,
  }
}

const getPreviewUrl = async (accessToken: string, track: SpotifyTrack) => {
  const debug: SpotifyPreviewDebug = {
    finder: {
      error: null,
      results: [],
      searchQuery: null,
      success: null,
    },
    search: {
      error: null,
      queries: [],
    },
    track: {
      error: null,
      id: track.id,
      previewUrl: null,
      status: null,
    },
  }

  try {
    const response = await fetch(`${SPOTIFY_API_ENDPOINT}/tracks/${track.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    debug.track.status = response.status

    if (response.ok) {
      const trackResponse = (await response.json()) as SpotifyTrack
      debug.track.previewUrl = trackResponse.preview_url || null

      if (trackResponse.preview_url) {
        return {
          debug,
          previewUrl: trackResponse.preview_url,
        }
      }
    } else {
      debug.track.error = await response.text()
    }
  } catch (error) {
    debug.track.error = error instanceof Error ? error.message : 'Unknown track lookup error'
  }

  const artist = track.artists[0]?.name

  try {
    const finderResult = await spotifyPreviewFinder(track.name, artist, 3)

    debug.finder = {
      error: finderResult.error || null,
      results: finderResult.results,
      searchQuery: finderResult.searchQuery || null,
      success: finderResult.success,
    }

    const previewUrl = finderResult.results.find((result) => result.previewUrls.length > 0)
      ?.previewUrls[0]

    if (previewUrl) {
      return {
        debug,
        previewUrl,
      }
    }
  } catch (error) {
    debug.finder.error =
      error instanceof Error ? error.message : 'Unknown spotify-preview-finder error'
    debug.finder.success = false
  }

  const queries = [artist ? `track:"${track.name}" artist:"${artist}"` : null, track.name].filter(
    Boolean,
  ) as string[]

  for (const query of queries) {
    const queryDebug: SpotifyPreviewDebug['search']['queries'][number] = {
      error: null,
      items: [],
      query,
      status: null,
    }

    const params = new URLSearchParams({
      limit: '5',
      q: query,
      type: 'track',
    })

    const response = await fetch(`${SPOTIFY_API_ENDPOINT}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    queryDebug.status = response.status

    if (!response.ok) {
      queryDebug.error = await response.text()
      debug.search.queries.push(queryDebug)
      continue
    }

    const search = (await response.json()) as SpotifySearchResponse
    queryDebug.items = search.tracks?.items.map(summarizeTrack) || []
    debug.search.queries.push(queryDebug)

    const previewUrl = search.tracks?.items.find((item) => item.preview_url)?.preview_url

    if (previewUrl) {
      return {
        debug,
        previewUrl,
      }
    }
  }

  return {
    debug,
    previewUrl: null,
  }
}

export async function GET() {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return new NextResponse(null, { status: 204 })
  }

  const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (response.status === 204 || response.status === 202) {
    return new NextResponse(null, { status: 204 })
  }

  if (!response.ok) {
    return new NextResponse(null, { status: 204 })
  }

  const data = (await response.json()) as SpotifyCurrentlyPlayingResponse
  const track = data.item

  if (!data.is_playing || !track || track.type !== 'track') {
    return new NextResponse(null, { status: 204 })
  }

  const preview = await getPreviewUrl(accessToken, track)

  return NextResponse.json(
    {
      album: track.album.name,
      albumCoverUrl: pickAlbumCover(track.album.images),
      artists: track.artists.map((artist) => artist.name),
      artistUrls: track.artists.map((artist) => artist.external_urls?.spotify || null),
      durationMs: track.duration_ms,
      debug: preview.debug,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms || 0,
      previewUrl: preview.previewUrl,
      songUrl: track.external_urls?.spotify || null,
      title: track.name,
      updatedAt: Date.now(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
