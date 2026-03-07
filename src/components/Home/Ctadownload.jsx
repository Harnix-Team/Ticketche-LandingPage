"use client";

const stores = [
  {
    label: "Download on the App Store",
    href: "https://apps.apple.com/app/ticketche/id6743762073",
    src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
  },
  {
    label: "Get it on Google Play",
    href: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  },
];

export default function CTADownload() {
  return (
    <section style={{
      fontFamily: "'Archivo', sans-serif",
      padding: "clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)",
      background: "#ecf5f6",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── CARD ── */}
        <div style={{
          background: "linear-gradient(to bottom, #ffffff 0%, #00515a 100%)",
          borderRadius: "clamp(24px, 3vw, 40px)",
          border: "1.5px solid rgba(0,81,90,0.2)",
          boxShadow: "0 24px 80px rgba(0,81,90,0.18)",
          padding: "clamp(40px, 5vw, 70px) clamp(32px, 5vw, 72px)",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 4vw, 64px)",
          alignItems: "center",
          minHeight: "clamp(280px, 32vw, 400px)",
        }}>

          {/* Halo déco */}
          <div style={{
            position: "absolute", bottom: "-80px", right: "10%",
            width: "350px", height: "350px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* ── COLONNE GAUCHE : image ── */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            height: "100%",
          }}>
            <img
              src="/images/Hero/heroImg.png"
              alt="Ticketché app"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>

          {/* ── COLONNE DROITE : texte + badges ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 2.5vw, 28px)", position: "relative", zIndex: 1 }}>

            <div>
              <h2 style={{
                fontSize: "clamp(1.8rem, 2.8vw, 2.8rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: "0 0 clamp(12px, 1.5vw, 18px) 0",
              }}>
                Téléchargez<br />Notre Application
              </h2>
              <p style={{
                fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.75,
                margin: 0,
                maxWidth: "380px",
              }}>
                Téléchargez gratuitement notre application sur l'App Store ou Google Play
                et profitez de tous nos services depuis votre téléphone.
              </p>
            </div>

            {/* Badges officiels */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              {stores.map(({ label, href, src }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: "inline-block",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.opacity = "0.88";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <img
                    src={src}
                    alt={label}
                    style={{ height: "48px", width: "auto", display: "block" }}
                  />
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}