import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hafood.vn'
  
  // Get all published news articles
  const news = await prisma.news.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() }
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/news',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // News article routes
  const newsRoutes = news.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Tag routes
  const tags = await prisma.news.findMany({
    where: { isPublished: true },
    select: { tags: true }
  })
  const uniqueTags = [...new Set(tags.flatMap(n => n.tags))]
  const tagRoutes = uniqueTags.map((tag) => ({
    url: `${baseUrl}/news?tag=${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...newsRoutes, ...tagRoutes]
} 