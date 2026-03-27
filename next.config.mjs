/** @type {import('next').NextConfig} */
// v17 — Modified to force Next.js dev server restart and full recompile
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
