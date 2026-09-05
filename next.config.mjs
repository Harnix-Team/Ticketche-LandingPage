/** @type {import('next').NextConfig} */
const nextConfig = {
  // Audit securite 2026-09-04 : ne pas divulguer le framework et sa version.
  poweredByHeader: false,
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  trailingSlash: true,
  images: {
    // Audit performance 2026-09-04 (PERF-04) : l'optimiseur etait desactive
    // globalement, donc aucune conversion WebP/AVIF ni aucun `srcset` sur les
    // composants qui utilisent pourtant `next/image`.
    //
    // `output: "export"` (build statique) interdit l'optimisation a la demande :
    // on ne la reactive que dans le mode serveur, celui reellement deploye.
    unoptimized: process.env.STATIC_EXPORT === "true",
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Audit performance 2026-09-04 (PERF-04) : les images de `public/` etaient
        // servies avec `Cache-Control: public, max-age=0`, donc retelechargees a
        // chaque visite - 18,9 Mo sur la seule page d'accueil. Elles sont
        // statiques et versionnees par le deploiement : un cache long est le
        // comportement attendu.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Audit securite 2026-09-04 (DEP-04) : en-tetes absents en production.
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=(), payment=()",
          },
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
}

export default nextConfig;