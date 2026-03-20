/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "ngrok-skip-browser-warning", value: "true" }
        ],
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" }
        ],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://api.ticketche.com/:path*",
      },
    ];
  },
}

export default nextConfig;