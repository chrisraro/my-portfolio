import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-metadata'

// Spec §6. The four search crawlers that put pages in answers are named, so
// the welcome is explicit. Every other crawler, AI training crawlers included
// (GPTBot, ClaudeBot, Google-Extended, CCBot), falls under `*` and stays
// allowed: a decision on record (S5 plan). A crawler obeys only the most
// specific group that names it, so each group repeats the /api/ disallow.
const SEARCH_CRAWLERS = ['Googlebot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...SEARCH_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
