"use client";

const stores = [
  {
    label: "Download on the App Store",
    href:  "https://apps.apple.com/app/ticketche/id6743762073",
    src:   "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
  },
  {
    label: "Get it on Google Play",
    href:  "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    src:   "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  },
];

export const AppDownloadButtons = ({ className = "" }) => {
  return (
    <div className={`app-download-wrap ${className}`}>
      {stores.map(({ label, href, src }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="app-download-link"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} />
        </a>
      ))}
    </div>
  );
};
