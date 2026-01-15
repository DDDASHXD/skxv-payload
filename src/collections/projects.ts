import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { revalidateHome, revalidateHomeAfterDelete } from '../hooks/revalidate-home'
import {
  InlineToolbarFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const ensureSingleHighlighted: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  if (data.highlighted === true) {
    const whereClause: any = {
      highlighted: {
        equals: true,
      },
    }

    if (originalDoc?.id) {
      whereClause.id = {
        not_equals: originalDoc.id,
      }
    }

    const otherHighlightedProjects = await req.payload.find({
      collection: 'projects',
      where: whereClause,
      limit: 100,
    })

    if (otherHighlightedProjects.docs.length > 0) {
      await Promise.all(
        otherHighlightedProjects.docs.map((project) =>
          req.payload.update({
            collection: 'projects',
            id: project.id,
            data: {
              highlighted: false,
            } as any,
          }),
        ),
      )
    }
  }

  return data
}

const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [ensureSingleHighlighted],
    afterChange: [revalidateHome],
    afterDelete: [revalidateHomeAfterDelete],
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'highlighted',
      type: 'checkbox',
      admin: {
        description: 'Only one project can be highlighted at a time',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'longDescription',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'Long Description',
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
  ],
}

export default Projects
