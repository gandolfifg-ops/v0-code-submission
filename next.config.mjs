/** @type {import('next').NextConfig} */
// Force dev server restart — v49 final clean build 2026-03-26T03
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
}

export default nextConfig
