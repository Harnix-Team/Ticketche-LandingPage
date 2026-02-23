/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Active l'export statique
  trailingSlash: true,
  images: {
    unoptimized: true, // Nécessaire pour l'export statique
  },
}

export default nextConfig;
