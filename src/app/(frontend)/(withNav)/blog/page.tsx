import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { cn } from '@/utilities'
import Image from 'next/image'

const BlogPage = async () => {
  const payload = await getPayload({ config: configPromise })
  const postsRequest = await payload.find({
    collection: 'posts',
    limit: 99,
    sort: 'publishedAt',
  })
  const posts = postsRequest.docs

  if (posts.length === 0) {
    return <div>No posts found</div>
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            className={cn(
              'border-foreground group mb-4 flex cursor-pointer items-center gap-4 border-b-2 pb-4',
              post.id === posts[posts.length - 1].id ? 'mb-0 border-b-0 pb-0' : '',
            )}
            key={post.id}
          >
            <Image
              src={
                typeof post.cover === 'object' && post.cover !== null ? post.cover.url || '' : ''
              }
              alt={post.title}
              width={200}
              height={200}
              className="aspect-square h-24 w-24! object-cover"
            />
            <div className="flex flex-col gap-2">
              <h2 className="group-hover:underline">{post.title}</h2>
              <p className="text-muted-foreground line-clamp-2">{post.exerpt}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-muted-foreground italic">(Coming soon)</p>
      )}
    </div>
  )
}

export default BlogPage
