/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // `images.domains` is deprecated in Next 14 in favour of remotePatterns.
    // Microlink serves the live screenshots used by <LinkPreview>.
    remotePatterns: [
      { protocol: 'https', hostname: 'api.microlink.io' },
      { protocol: 'https', hostname: '**.microlink.io' },
    ],
  },
  trailingSlash: false,
  // Taken off the portfolio on 2026-11-23: their old addresses lead to the list.
  async redirects() {
    return ['giya', 'latag', 'connecta-ph'].map((slug) => ({
      source: `/projects/${slug}`,
      destination: '/projects',
      permanent: true,
    }))
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Keep console.error in production so API failures stay diagnosable.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
}

module.exports = nextConfig
