'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function createConfession(content: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    const confession = await payload.create({
      collection: 'confessions',
      data: {
        content,
      },
    })

    return { success: true, confession }
  } catch (error) {
    console.error('Error creating confession:', error)
    return { success: false, error: 'Failed to create confession' }
  }
}

export async function getRandomConfession() {
  try {
    const payload = await getPayload({ config: configPromise })

    const confessions = await payload.find({
      collection: 'confessions',
      limit: 0,
    })

    if (confessions.docs.length === 0) {
      return { success: false, error: 'No confessions found' }
    }

    const randomIndex = Math.floor(Math.random() * confessions.docs.length)
    const confession = confessions.docs[randomIndex]

    return { success: true, confession }
  } catch (error) {
    console.error('Error getting random confession:', error)
    return { success: false, error: 'Failed to get random confession' }
  }
}
