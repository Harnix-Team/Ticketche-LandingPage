const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/** Hotes declares dans `images.remotePatterns` (next.config.mjs). Tout autre visuel est servi tel quel. */
const OPTIMIZED_HOSTS = new Set(
  [
    "api.ticketche.com",
    hostOf(process.env.NEXT_PUBLIC_API_URL),
    ...(process.env.NODE_ENV !== "production" ? ["picsum.photos", "fastly.picsum.photos"] : []),
  ].filter(Boolean)
);

export const canOptimize = (src) => typeof src === "string" && (src.startsWith("/") || OPTIMIZED_HOSTS.has(hostOf(src)));
