import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

const FavoriteSongs: CollectionConfig = {
  slug: 'favorite-songs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'artist',
      type: 'text',
      required: true,
    },
    {
      name: 'album',
      type: 'text',
      required: false,
    },
    {
      name: 'link',
      type: 'text',
      required: false,
    },
  ],
}

export default FavoriteSongs
