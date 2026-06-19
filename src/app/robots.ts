import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourusername.github.io/dropship-ai'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/admin/', '/cart/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
