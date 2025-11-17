import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateHome: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating home page after favorite-songs change`)

  revalidatePath('/', 'page')

  return doc
}

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating home page after favorite-songs deletion`)

  revalidatePath('/', 'page')

  return doc
}

