import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase'

const BASE_URL = 'https://energydirectory.ca'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()

  // Fetch all categories
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categoriesRaw } = await (supabase as any)
    .from('categories')
    .select('slug, created_at')
    .order('name')
  const categories = (categoriesRaw || []) as { slug: string; created_at: string }[]

  // Fetch all active vendors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vendorsRaw } = await (supabase as any)
    .from('vendors')
    .select('slug, updated_at')
    .eq('active', true)
    .order('company_name')
  const vendors = (vendorsRaw || []) as { slug: string; updated_at: string }[]

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/list-your-business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: cat.created_at ? new Date(cat.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const vendorRoutes: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: `${BASE_URL}/vendors/${vendor.slug}`,
    lastModified: vendor.updated_at ? new Date(vendor.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...vendorRoutes]
}
