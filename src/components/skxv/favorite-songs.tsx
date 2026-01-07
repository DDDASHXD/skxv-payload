import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Card from './reusables/card'
import CharacterMarquee from './character-marquee'
import Link from 'next/link'
import Image from 'next/image'

const FavoriteSongs = async () => {
  const payload = await getPayload({ config: configPromise })
  const favoriteSongs = await payload.find({
    collection: 'favorite-songs',
  })

  return (
    <Card title="Favorite Songs (Right now)" titlePosition="left" className="flex">
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {favoriteSongs.docs.map((song) => (
          <Link href={song.link || ''} key={song.id} className="cursor-pointer">
            <div className="group flex flex-col">
              {song.cover && typeof song.cover === 'object' && song.cover.url && (
                <Image
                  src={song.cover.url}
                  alt={song.title || ''}
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover"
                />
              )}
              <CharacterMarquee
                text={song.title || ''}
                className="text-sm font-medium"
                textClassName="group-hover:underline hover:underline"
              />
              <CharacterMarquee text={song.album || ''} className="text-xs italic" />
              <CharacterMarquee
                text={song.artist || ''}
                className="text-muted-foreground text-xs"
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

export default FavoriteSongs
