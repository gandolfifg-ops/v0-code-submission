/** @type {import('next').NextConfig} */
// v52 — HARD DEV SERVER RESTART — Recreated config, new module graphs only
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
  async redirects() {
    return [
      { source: "/scholarships/York", destination: "/scholarships/york", permanent: true },
      { source: "/scholarships/OntarioTech", destination: "/scholarships/ontario-tech", permanent: true },
      { source: "/scholarships/Guelph", destination: "/scholarships/guelph", permanent: true },
      { source: "/scholarships/UBC", destination: "/scholarships/ubc", permanent: true },
      { source: "/scholarships/Western University", destination: "/scholarships/western", permanent: true },
      { source: "/scholarships/Western%20University", destination: "/scholarships/western", permanent: true },
      { source: "/scholarships/George Brown College", destination: "/scholarships/george-brown", permanent: true },
      { source: "/scholarships/George%20Brown%20College", destination: "/scholarships/george-brown", permanent: true },
    ]
  },
}

export default nextConfig
