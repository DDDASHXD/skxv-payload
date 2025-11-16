import { MetadataRoute } from 'next'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'

  // Add your static pages here
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    // Add more static pages as you create them
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.8,
    // },
  ]

  // If you have dynamic pages (e.g., blog posts), fetch them here
  // Example:
  // const posts = await fetchBlogPosts()
  // const dynamicPages = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return [...staticPages]
}

