/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Active l'export statique
  trailingSlash: true,
  images: {
    unoptimized: true, // Nécessaire pour l'export statique
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "ngrok-skip-browser-warning", value: "true" }
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