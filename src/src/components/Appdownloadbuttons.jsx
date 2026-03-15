"use client";

const stores = [
  {
    label: "Download on the App Store",
    href: "https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811?",
    src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
  },
  {
    label: "Get it on Google Play",
    href: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  },
];

export function AppDownloadButtons() {
  return (
    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
      {stores.map(({ label, href, src }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{ display: "inline-block", transition: "transform 0.2s ease, opacity 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
        >
          <img src={src} alt={label} style={{ height: "48px", width: "auto", display: "block" }} />
        </a>
      ))}
    </div>
  );
}