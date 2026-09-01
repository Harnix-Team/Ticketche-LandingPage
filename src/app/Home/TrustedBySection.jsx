"use client";

const logos = [
  { name: "Nix", src: "/images/trust/Logo Nix.png" },
  { name: "Resthora", src: "/images/trust/Resthora Noir.png" },
  { name: "DefenseScheduler", src: "/images/trust/defensescheduler.png" },
  { name: "IFRI", src: "/images/trust/ifri.png" },
  { name: "Librairie Café", src: "/images/trust/libCafe.jpg" },
  { name: "Eclat", src: "/images/trust/logo-dark.jpg" },
];

const allLogos = [...logos, ...logos, ...logos];

export default function TrustedBySection() {
  return (
    <section
      style={{
        background: "#ecf5f5",
        overflow: "hidden",
        width: "100%",
      }}
      className="pt-15 pb-15"
    >
      <p
        style={{
          textAlign: "center",
          fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
          fontWeight: 600,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "#2d6b72",
          marginBottom: "50px",
        }}
      >
        Ils nous font confiance
      </p>

      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <div
          className="trusted-fade-left"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to right, #ecf5f5, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          className="trusted-fade-right"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to left, #ecf5f5, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(40px, 6vw, 72px)",
            animation: "scrollLogos 28s linear infinite",
            width: "max-content",
          }}
        >
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              style={{
                width: "clamp(160px, 20vw, 240px)",
                height: "84px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.88,
                transition: "opacity 0.25s, transform 0.25s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLogos {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
}
