/** @type {import('next').NextConfig} */
// Force complete dev server restart — v50 clear all Turbopack in-memory caches
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
}

export default nextConfig
