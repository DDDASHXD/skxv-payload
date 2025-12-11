import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { revalidateHome, revalidateHomeAfterDelete } from '../hooks/revalidate-home'

const Confessions: CollectionConfig = {
  slug: 'confessions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateHome],
    afterDelete: [revalidateHomeAfterDelete],
  },
  fields: [
    {
      name: 'content',
      type: 'text',
      required: true,
    },
  ],
}

export default Confessions
