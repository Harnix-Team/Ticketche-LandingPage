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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        @keyframes floatPhone {
          0%,100% { transform: translateY(0px) rotate(-3deg); }
          50%      { transform: translateY(-14px) rotate(-3deg); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,-20px) scale(1.12); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-20px,25px) scale(0.9); }
        }
        .animate-shimmer { animation: shimmer 3.2s ease-in-out infinite; }
        .animate-floatPhone { animation: floatPhone 4s ease-in-out infinite; }
        .animate-orb1 { animation: orb1 7s ease-in-out infinite; }
        .animate-orb2 { animation: orb2 9s ease-in-out infinite; }
        .badge-link { transition: transform 0.22s ease, filter 0.22s ease; }
        .badge-link:hover { transform: translateY(-4px); filter: brightness(1.08); }
        .cta-btn:hover .btn-arrow { transform: translateX(4px); }
      `}</style>

      <section
        className="bg-[#f0f7f8] overflow-hidden"
        style={{
          fontFamily: "'Archivo', sans-serif",
          padding: "clamp(60px,8vw,110px) clamp(20px,5vw,72px)",
        }}
      >
        <div className="max-w-[1100px] mx-auto">

          {/* ── CARD ── */}
          <div
            className="relative overflow-hidden rounded-[clamp(28px,3vw,44px)] grid grid-cols-1 md:grid-cols-2 items-center"
            style={{
              background: "linear-gradient(135deg, #00353d 0%, #00515a 45%, #00818f 100%)",
              boxShadow: "0 40px 100px rgba(0,53,61,0.35), 0 8px 32px rgba(0,81,90,0.2)",
              minHeight: "clamp(340px,36vw,460px)",
            }}
          >

            {/* ── Orbes déco ── */}
            <div
              className="absolute top-[-80px] right-[5%] w-[380px] h-[380px] rounded-full pointer-events-none animate-orb1 opacity-30"
              style={{ background: "radial-gradient(circle, #00c9b1 0%, transparent 65%)", filter: "blur(50px)" }}
            />
            <div
              className="absolute bottom-[-60px] left-[30%] w-[280px] h-[280px] rounded-full pointer-events-none animate-orb2 opacity-20"
              style={{ background: "radial-gradient(circle, #00d8ec 0%, transparent 65%)", filter: "blur(40px)" }}
            />

            {/* ── Lignes décoratives (grid pattern) ── */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* ── Arc décoratif bas droite ── */}
            <div
              className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none border-[40px] border-white/5"
            />
            <div
              className="absolute bottom-[-80px] right-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none border-[24px] border-white/5"
            />

            {/* ── COLONNE GAUCHE : texte ── */}
            <div
              className="relative z-10 flex flex-col gap-[clamp(18px,2.5vw,30px)]"
              style={{ padding: "clamp(40px,4vw,64px) clamp(28px,3.5vw,60px)" }}
            >

              {/* Tag */}
              <div className="inline-flex items-center gap-2 w-fit rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-[6px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#00e5ca] shadow-[0_0_8px_rgba(0,229,202,0.8)]" />
                <span className="text-white/80 text-[0.75rem] font-semibold tracking-widest uppercase">
                  Disponible maintenant
                </span>
              </div>

              {/* Titre */}
              <h2
                className="text-white font-black leading-[1.08] tracking-[-0.03em] m-0"
                style={{ fontSize: "clamp(2rem,3.2vw,3.2rem)" }}
              >
                Votre vie simplifiée,<br />
                <span
                  className="relative inline-block"
                  style={{
                    background: "linear-gradient(90deg, #00e5ca, #7ffce8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  dans votre poche.
                </span>
              </h2>

              {/* Sous-titre */}
              <p
                className="text-white/60 leading-[1.75] m-0 max-w-[360px]"
                style={{ fontSize: "clamp(0.88rem,1.1vw,1rem)" }}
              >
                Parking, lavage, garage, événements — tout en un. Téléchargez
                gratuitement et rejoignez des milliers d'utilisateurs satisfaits.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 items-center">
                {stores.map(({ label, href, src }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="badge-link inline-block rounded-[10px] overflow-hidden"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
                  >
                    <img
                      src={src}
                      alt={label}
                      style={{ height: "44px", width: "auto", display: "block" }}
                    />
                  </a>
                ))}
              </div>

            </div>

            {/* ── COLONNE DROITE : phone ── */}
            <div className="relative z-10 flex items-end justify-center overflow-hidden h-full min-h-[280px] md:min-h-0">
              {/* Reflet / glow sous le phone */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[80px] pointer-events-none blur-[32px] opacity-40"
                style={{ background: "radial-gradient(ellipse, #00e5ca 0%, transparent 70%)" }}
              />
              <img
                src="/images/Hero/heroImg.png"
                alt="Ticketché app"
                className="relative z-[2] w-[clamp(200px,36vw,400px)] h-auto object-contain block animate-floatPhone"
                style={{ transformOrigin: "bottom center", maxHeight: "clamp(280px,38vw,440px)" }}
              />
            </div>

          </div>

        </div>
      </section>
    </>
  );
}