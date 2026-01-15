import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import RichText from '@/components/RichText'
import localization from '@/localization.config'
import { PublicContextProps } from '@/utilities/publicContextProps'

const SingleBlogPage = async ({ params }: { params: { slug: string } }) => {
  const payload = await getPayload({ config: configPromise })
  const postRequest = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: params.slug,
      },
    },
  })

  if (postRequest.docs.length === 0) {
    notFound()
  }

  const post = postRequest.docs[0]

  const publicContext: PublicContextProps = {
    locale: localization.defaultLocale,
    isNotFound: false,
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <Image
        src={typeof post.cover === 'object' && post.cover !== null ? post.cover.url || '' : ''}
        alt={post.title}
        width={1000}
        height={1000}
        className="h-64 w-full object-cover"
      />
      <p className="text-muted-foreground">{post.exerpt}</p>
      <RichText content={post.content} publicContext={publicContext} />
    </div>
  )
}

export default SingleBlogPage
