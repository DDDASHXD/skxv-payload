import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Card from './reusables/card'
import { Media } from '../Media'
import CharacterMarquee from './character-marquee'

const FavoriteSongs = async () => {
  const payload = await getPayload({ config: configPromise })
  const favoriteSongs = await payload.find({
    collection: 'favorite-songs',
  })

  return (
    <Card title="Favorite Songs (Right now)" titlePosition="left" className="flex">
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {favoriteSongs.docs.map((song) => (
          <div key={song.id} className="group flex flex-col">
            {song.cover && (
              <Media resource={song.cover} imgClassName="w-full aspect-square object-cover" />
            )}
            <CharacterMarquee
              text={song.title || ''}
              className="text-sm font-medium group-hover:underline hover:underline"
            />
            <CharacterMarquee text={song.album || ''} className="text-xs italic" />
            <CharacterMarquee text={song.artist || ''} className="text-muted-foreground text-xs" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default FavoriteSongs
