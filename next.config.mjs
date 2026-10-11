const isDev = process.env.NODE_ENV !== "production";

/** Hote de l'API : c'est lui qui sert les visuels (`/storage/**`), quel que soit l'environnement. */
function apiImagePattern() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2");

    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      ...(url.port && { port: url.port }),
      pathname: "/storage/**",
    };
  } catch {
    return null;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Audit securite 2026-09-04 : ne pas divulguer le framework et sa version.
  poweredByHeader: false,
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  trailingSlash: true,
  images: {
    // `output: "export"` (build statique) interdit l'optimisation a la demande :
    // on ne la reactive que dans le mode serveur, celui reellement deploye.
    unoptimized: process.env.STATIC_EXPORT === "true",
    formats: ["image/avif", "image/webp"],
    // Les visuels des lieux et des evenements viennent du storage de l'API.
    // Sans cette autorisation, l'optimiseur repond 400 ("url" parameter is not allowed).
    // Les deux API sont listees en dur : `next start` relit ce fichier dans le conteneur, ou
    // NEXT_PUBLIC_API_URL (figee au build dans le code) n'est plus definie.
    remotePatterns: [
      { protocol: "https", hostname: "api.ticketche.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "dev.api.ticketche.com", pathname: "/storage/**" },
      apiImagePattern(),
      // Les seeders locaux pointent vers picsum.photos : hors production uniquement.
      ...(isDev
        ? [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "fastly.picsum.photos" },
          ]
        : []),
    ].filter(Boolean),
    // API locale sur localhost : l'optimiseur refuse les IP privees par defaut.
    dangerouslyAllowLocalIP: isDev,
  },
  async headers() {
    return [
      {
        // Les images de `public/` sont statiques et versionnees par le deploiement.
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
