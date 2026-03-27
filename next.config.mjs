/** @type {import('next').NextConfig} */
// v55 — Force restart, inputVal IS declared at line 319 in current source
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
