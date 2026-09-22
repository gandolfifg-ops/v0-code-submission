/** @type {import('next').NextConfig} */
// v52 — HARD DEV SERVER RESTART — Recreated config, new module graphs only
const nextConfig = {
  // Typecheck and lint must pass on Vercel builds (verified locally with tsc + pnpm lint).
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      { source: "/scholarships/York", destination: "/scholarships/york", statusCode: 308 },
      { source: "/scholarships/OntarioTech", destination: "/scholarships/ontario-tech", statusCode: 308 },
      { source: "/scholarships/Guelph", destination: "/scholarships/guelph", statusCode: 308 },
      { source: "/scholarships/UBC", destination: "/scholarships/ubc", statusCode: 308 },
      { source: "/scholarships/Western University", destination: "/scholarships/western", statusCode: 308 },
      { source: "/scholarships/Western%20University", destination: "/scholarships/western", statusCode: 308 },
      { source: "/scholarships/George Brown College", destination: "/scholarships/george-brown", statusCode: 308 },
      { source: "/scholarships/George%20Brown%20College", destination: "/scholarships/george-brown", statusCode: 308 },
      { source: "/scholarships/university-of-toronto", destination: "/scholarships/u-of-t", statusCode: 308 },
    ]
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
      { source: "/og.png", destination: "/opengraph-image" },
    ]
  },
}

export default nextConfig
