"use client";
import { useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Star, Car, Wrench, Swatches, Ticket, Bell, MapPin } from "@phosphor-icons/react";
import { fetchAllPlaces } from "@/app/services/api";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

const STATIC_IMAGES = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
  "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&q=80",
];

const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 8, opacity: 0.28, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "91%", cy: "5%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -12, y: 11, size: 8, opacity: 0.25, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "40%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 13, y: -7, size: 6, opacity: 0.20, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "94%", cy: "38%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -11, y: 9, size: 6, opacity: 0.20, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "44%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "74%", cy: "92%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
];

const SERVICES = [
  { icon: <Car weight="bold" />,      title: "Parking intelligent",   desc: "Trouvez et réservez une place de parking en temps réel. Fini le stress de chercher.", num: "01" },
  { icon: <Swatches weight="bold" />, title: "Car wash express",       desc: "Réservez votre lavage auto où que vous soyez. Votre véhicule brille, vous souriez.", num: "02", highlight: true },
  { icon: <Wrench weight="bold" />,   title: "Garage & réparation",    desc: "Accédez aux meilleurs garages du Bénin et prenez rendez-vous en quelques secondes.", num: "03" },
  { icon: <Ticket weight="bold" />,   title: "Billetterie événements", desc: "Concerts, festivals, soirées — achetez vos billets directement depuis l'appli.", num: "04" },
  { icon: <MapPin weight="bold" />,   title: "Géolocalisation live",   desc: "Repérez les services autour de vous en temps réel, où que vous soyez au Bénin.", num: "05" },
  { icon: <Bell weight="bold" />,     title: "Actualités & alertes",   desc: "Restez informé des dernières nouveautés, offres exclusives et nouveaux établissements.", num: "06" },
];

const TEAM_AVATARS = [
  "/images/users/user1.png",
  "/images/users/user2.png",
  "/images/users/user3.png",
  "/images/users/user4.png",
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `ctStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function AboutPage() {
  const [current, setCurrent] = useState(0);
  const [carouselImages, setCarouselImages] = useState(STATIC_IMAGES);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [eventsRes, placesRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/events`).then(r => r.json()),
          fetchAllPlaces(),
        ]);
        const eventImages = eventsRes.status === "fulfilled" && eventsRes.value?.success
          ? (eventsRes.value.data ?? []).filter(e => e.images?.length > 0).map(e => e.images[0].url).filter(Boolean).slice(0, 4)
          : [];
        const placeImages = placesRes.status === "fulfilled" && placesRes.value?.success
          ? (placesRes.value.data ?? []).filter(p => p.images?.length > 0).map(p => {
              const link = p.images[0].link;
              if (!link) return null;
              const cleaned = link.replace("/storage/app/public", "/storage");
              return cleaned.startsWith("http") ? cleaned : `https://api.ticketche.com${cleaned}`;
            }).filter(Boolean).slice(0, 4)
          : [];
        const allImages = [...STATIC_IMAGES, ...eventImages, ...placeImages];
        if (allImages.length > 0) setCarouselImages(allImages);
      } catch (err) {
        console.error("Erreur fetch images:", err);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % carouselImages.length), 3000);
    return () => clearInterval(t);
  }, [current, carouselImages.length]);

  const next = (current + 1) % carouselImages.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap');

        @keyframes ctStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes ctStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes ctStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @keyframes apBtnPulse {
          0%,100% { box-shadow: 0 6px 20px rgba(0,95,105,0.3), 0 0 0 0 rgba(0,95,105,0.4); }
          50%      { box-shadow: 0 10px 28px rgba(0,95,105,0.45), 0 0 0 10px rgba(0,95,105,0); }
        }
        @keyframes apArrow {
          0%,100% { transform: translateX(0px); }
          50%      { transform: translateX(5px); }
        }

        .about-page {
          font-family: 'Archivo', sans-serif;
          background: #ecf5f5;
          width: 100%;
        }

        /* ─── HERO ─── */
      .ap-hero-wrap {
  position: relative;
  overflow: hidden;
  min-height: auto;
}
        .ap-hero {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 48px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .ap-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1.5px solid rgba(0,95,105,0.15);
          border-radius: 999px;
          padding: 8px 16px 8px 8px;
          margin-bottom: 28px;
          box-shadow: 0 2px 12px rgba(0,95,105,0.08);
        }
        .ap-badge-avatars { display: flex; }
        .ap-badge-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 2px solid white;
          object-fit: cover;
          margin-left: -10px;
        }
        .ap-badge-avatar:first-child { margin-left: 0; }
        .ap-badge-text { font-size: 12px; font-weight: 700; color: #0a1a1c; letter-spacing: 0.02em; }
        .ap-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900; color: #0a1a1c;
          line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px;
        }
        .ap-title span { color: #005f69; }
        .ap-sub {
          color: #6b7280; font-size: 19px;
          line-height: 1.75; max-width: 440px; margin-bottom: 36px;
        }
        .ap-btns { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .ap-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #005f69; color: white;
          font-weight: 800; font-size: 14px; padding: 14px 24px;
          border-radius: 999px; text-decoration: none;
          transition: all .2s ease;
          animation: apBtnPulse 2s ease-in-out infinite;
        }
        .ap-btn-primary svg { animation: apArrow 1s ease-in-out infinite; }
        .ap-btn-primary:hover {
          animation: none;
          background: #007a8a;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,95,105,0.5);
        }
        .ap-right {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          height: 480px;
        }
        .ap-circle-big {
          position: absolute;
          left: 50%; top: 50%;
          transform: translate(-62%, -52%);
          width: 340px; height: 340px;
          border-radius: 50%; overflow: hidden;
          border: 5px solid white;
          box-shadow: 0 16px 48px rgba(0,95,105,0.22);
          z-index: 2;
        }
        .ap-circle-big img { width: 100%; height: 100%; object-fit: cover; }
        .ap-circle-small {
          position: absolute; right: 4%; bottom: 12%;
          width: 180px; height: 180px;
          border-radius: 50%; overflow: hidden;
          border: 4px solid white;
          box-shadow: 0 10px 32px rgba(0,95,105,0.2);
          z-index: 3;
        }
        .ap-circle-small img { width: 100%; height: 100%; object-fit: cover; }
        .ap-dots-sm {
          position: absolute; bottom: 8%; right: 18%;
          display: grid; grid-template-columns: repeat(4, 6px); gap: 5px;
          z-index: 4; pointer-events: none;
        }
        .ap-dot-sm { width: 6px; height: 6px; border-radius: 50%; background: #005f69; opacity: 0.25; }

        /* ─── SERVICES ─── */
        .sv-root { padding: 32px 0 100px; }
        .sv-header { text-align: center; margin-bottom: 56px; }
        .sv-badge {
          display: inline-block;
          background: rgba(0,95,105,0.10); color: #005f69;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
        }
        .sv-title {
          font-size: clamp(28px, 3.5vw, 46px); font-weight: 900;
          color: #0a1a1c; line-height: 1.15; letter-spacing: -1px;
          max-width: 560px; margin: 0 auto;
        }
        .sv-title span { color: #005f69; }
        .sv-grid {
          max-width: 1160px; margin: 0 auto; padding: 0 32px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .sv-card {
          background: white; border-radius: 22px; padding: 32px 28px 28px;
          position: relative; overflow: visible;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border: 1.5px solid rgba(0,95,105,0.10);
          box-shadow: 0 4px 20px rgba(0,95,105,0.07);
        }
        .sv-card::before {
          content: ''; position: absolute;
          top: -2px; left: -2px; width: 48px; height: 48px;
          border-top: 3px solid #005f69; border-left: 3px solid #005f69;
          border-radius: 22px 0 0 0; transition: all 0.3s ease;
        }
        .sv-card::after {
          content: ''; position: absolute;
          bottom: -2px; right: -2px; width: 48px; height: 48px;
          border-bottom: 3px solid #005f69; border-right: 3px solid #005f69;
          border-radius: 0 0 22px 0; transition: all 0.3s ease;
        }
        .sv-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,95,105,0.14); }
        .sv-card:hover::before, .sv-card:hover::after { width: 64px; height: 64px; border-color: #007a8a; }

        .sv-card-hl { background: #005f69 !important; border-color: #005f69 !important; box-shadow: 0 20px 48px rgba(0,95,105,0.38) !important; }
        .sv-card-hl::before { border-color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl::after  { border-color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl:hover   { transform: translateY(-6px); box-shadow: 0 28px 60px rgba(0,95,105,0.50) !important; }
        .sv-card-hl .sv-icon-wrap   { background: rgba(255,255,255,0.18) !important; }
        .sv-card-hl .sv-icon        { color: white !important; }
        .sv-card-hl .sv-card-title  { color: white !important; }
        .sv-card-hl .sv-card-desc   { color: rgba(255,255,255,0.78) !important; }
        .sv-card-hl .sv-num         { color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl .sv-arrow       { background: white !important; color: #005f69 !important; }

        .sv-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
        .sv-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(0,95,105,0.10);
          display: flex; align-items: center; justify-content: center;
        }
        .sv-icon { width: 24px; height: 24px; color: #005f69; }
        .sv-arrow {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,95,105,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #005f69; opacity: 0; transition: opacity 0.2s ease;
        }
        .sv-card:hover .sv-arrow { opacity: 1; }
        .sv-card-title { font-size: 17px; font-weight: 800; color: #0a1a1c; letter-spacing: -0.3px; margin-bottom: 10px; }
        .sv-card-desc  { font-size: 14px; line-height: 1.7; color: #6b7280; }
        .sv-num {
          margin-top: 24px; font-size: 12px; font-weight: 700;
          color: rgba(0,95,105,0.30); letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 10px;
        }
        .sv-num::after { content: ''; flex: 1; max-width: 48px; height: 1.5px; background: currentColor; border-radius: 2px; opacity: 0.5; }

        /* ─── CTA ─── */
        .cta-root { padding: 0 32px 100px; }
        .cta-inner {
          max-width: 1160px; margin: 0 auto;
          background: #005f69; border-radius: 28px; padding: 72px 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 40px;
          position: relative; overflow: hidden;
        }
        .cta-inner::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,0.05);
        }
        .cta-inner::after {
          content: ''; position: absolute; bottom: -60px; left: 30%;
          width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04);
        }
        .cta-left { position: relative; z-index: 2; }
        .cta-tag { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 16px; }
        .cta-title { font-size: clamp(24px, 3vw, 40px); font-weight: 900; color: white; line-height: 1.15; letter-spacing: -0.8px; max-width: 480px; }
        .cta-title span { color: #7dd3d8; }
        .cta-sub { margin-top: 14px; font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 420px; }
        .cta-actions { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 2; flex-shrink: 0; }
        .cta-btn-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: white; color: #005f69; font-weight: 800; font-size: 14px;
          padding: 16px 28px; border-radius: 999px; text-decoration: none;
          transition: all .2s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.18); white-space: nowrap;
        }
        .cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,0.25); }
        .cta-btn-sec {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 600;
          text-decoration: none; transition: color .2s; text-align: center;
        }
        .cta-btn-sec:hover { color: white; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .ap-hero { grid-template-columns: 1fr; padding: 80px 24px 60px; text-align: center; }
          .ap-sub  { max-width: 100%; }
          .ap-btns { justify-content: center; }
          .ap-right { height: 340px; }
          .ap-circle-big   { width: 240px; height: 240px; }
          .ap-circle-small { width: 130px; height: 130px; }
          .sv-grid { grid-template-columns: 1fr 1fr; }
          .cta-inner { flex-direction: column; padding: 48px 36px; text-align: center; }
          .cta-actions { align-items: center; }
        }
        @media (max-width: 640px) {
          .sv-grid { grid-template-columns: 1fr; padding: 0 20px; }
          .cta-inner { padding: 40px 28px; border-radius: 20px; }
          .cta-root { padding: 0 20px 60px; }
        }
      `}</style>

      <div className="about-page">

        {/* ══════════ HERO ══════════ */}
        <div className="ap-hero-wrap">
          <StarClusters />
          <div className="ap-hero">

            <div>
              <div className="ap-badge">
                <div className="ap-badge-avatars">
                  {TEAM_AVATARS.map((src, i) => (
                    <img key={i} src={src} alt="" className="ap-badge-avatar" />
                  ))}
                </div>
                <span className="ap-badge-text">+15 ans d'expériences</span>
              </div>

              <h1 className="ap-title">
                Parking, lavage, garage.<br />
                Tout ça, <span>en un clic.</span>
              </h1>

              <p className="ap-sub">
                Plus besoin de chercher - trouvez, réservez et profitez. Partout au Bénin.
              </p>

              <div className="ap-btns">
                <a
                  href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ap-btn-primary"
                >
                  Découvrir Ticketché <ArrowRight weight="bold" style={{ width: 16, height: 16 }} />
                </a>
              </div>
            </div>

            <div className="ap-right">
              <div className="ap-circle-big">
                <img key={current} src={carouselImages[current]} alt="service" />
              </div>
              <div className="ap-circle-small">
                <img key={next} src={carouselImages[next]} alt="service suivant" />
              </div>
              <div className="ap-dots-sm">
                {Array.from({ length: 16 }).map((_, i) => <div key={i} className="ap-dot-sm" />)}
              </div>
            </div>

          </div>
        </div>

        {/* ══════════ SERVICES ══════════ */}
        <div className="sv-root">
          <div className="sv-header">
            <div className="sv-badge">Nos services</div>
            <h2 className="sv-title">
              Tout ce dont vous avez besoin,<br />
              <span>en un seul endroit.</span>
            </h2>
          </div>

          <div className="sv-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className={`sv-card${s.highlight ? " sv-card-hl" : ""}`}>
                <div className="sv-card-top">
                  <div className="sv-icon-wrap">
                    <span className="sv-icon">{s.icon}</span>
                  </div>
                  <div className="sv-arrow">
                    <ArrowUpRight size={16} weight="bold" />
                  </div>
                </div>
                <div className="sv-card-title">{s.title}</div>
                <div className="sv-card-desc">{s.desc}</div>
                <div className="sv-num">{s.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ CTA ══════════ */}
        <div className="cta-root">
          <div className="cta-inner">
            <div className="cta-left">
              <div className="cta-tag">Rejoignez Ticketché</div>
              <h2 className="cta-title">
                Prêt à simplifier votre<br />
                <span>quotidien au Bénin ?</span>
              </h2>
              <p className="cta-sub">
                Téléchargez l'application et accédez à des centaines de services autour de vous — parking, car wash, garages et événements.
              </p>
            </div>

            <div className="cta-actions">
              <a
                href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-main"
              >
                Télécharger l'app <ArrowRight weight="bold" size={16} />
              </a>
              <a href="#contact" className="cta-btn-sec">
                Nous contacter →
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}