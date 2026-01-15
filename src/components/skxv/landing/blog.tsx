import React from 'react'
import Card from '../reusables/card'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cn } from '@/utilities'
import Image from 'next/image'
import Link from 'next/link'
import { ActionButton } from '../reusables/action'
import { ArrowRightIcon } from 'lucide-react'

const Blog = async () => {
  const payload = await getPayload({ config: configPromise })
  const postsRequest = await payload.find({
    collection: 'posts',
    limit: 5,
    sort: 'publishedAt',
  })

  const posts = postsRequest.docs

  return (
    <Card title="Blog" titlePosition="left">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              className={cn(
                'border-foreground group mb-4 flex cursor-pointer items-center gap-4 border-b-2 pb-4',
                post.id === posts[posts.length - 1].id ? 'mb-0 border-b-0 pb-0' : '',
              )}
              key={index}
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
          ))}
          <Link href="/blog">
            <ActionButton icon={<ArrowRightIcon className="size-4" />} className="w-full">
              View all
            </ActionButton>
          </Link>
        </div>
      ) : (
        <p className="text-muted-foreground italic">(Coming soon)</p>
      )}
    </Card>
  )
}

export default Blog
