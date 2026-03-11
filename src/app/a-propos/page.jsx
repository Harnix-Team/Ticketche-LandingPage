"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star } from "@phosphor-icons/react";
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
  { cx: "4%",  cy: "72%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }, { x: 11, y: -6, size: 6, opacity: 0.18, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "89%", cy: "70%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -9, y: -8, size: 6, opacity: 0.18, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "44%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "94%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.20, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "4%",  stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 2, delay: "0.2s", dur: "2.8s", color: "#00818f" }] },
  { cx: "74%", cy: "92%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
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

const TEAM_AVATARS = [
  "/images/users/user1.png",
  "/images/users/user2.png",
  "/images/users/user3.png",
  "/images/users/user4.png",
];

export default function AboutPage() {
  const [current, setCurrent] = useState(0);
  const [carouselImages, setCarouselImages] = useState(STATIC_IMAGES);

  // Fetch images depuis events + places
useEffect(() => {
  const fetchImages = async () => {
    try {
      const [eventsRes, placesRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/events`).then(r => r.json()),
        fetchAllPlaces(),
      ]);

      const eventImages = eventsRes.status === "fulfilled" && eventsRes.value?.success
        ? (eventsRes.value.data ?? [])
            .filter(e => e.images?.length > 0)
            .map(e => e.images[0].url)
            .filter(Boolean)
            .slice(0, 4)
        : [];

      const placeImages = placesRes.status === "fulfilled" && placesRes.value?.success
        ? (placesRes.value.data ?? [])
            .filter(p => p.images?.length > 0)
            .map(p => {
              const link = p.images[0].link;
              if (!link) return null;
              const cleaned = link.replace("/storage/app/public", "/storage");
              return cleaned.startsWith("http")
                ? cleaned
                : `https://api.ticketche.com${cleaned}`;
            })
            .filter(Boolean)
            .slice(0, 4)
        : [];

      const allImages = [...STATIC_IMAGES, ...eventImages, ...placeImages];
      if (allImages.length > 0) setCarouselImages(allImages);
    } catch (err) {
      console.error("Erreur fetch images:", err);
    }
  };
  fetchImages();
}, []);

  // Autoplay
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(t);
  }, [current, carouselImages.length]);

  const next = (current + 1) % carouselImages.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

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

        .ap-root {
          font-family: 'Archivo', sans-serif;
          background: #ecf5f5;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
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
        .ap-badge-text { font-size: 12px; font-weight: 700; color: #0a1a1c; letter-spacing: 0.02em; font-family: 'Archivo', sans-serif; }

        .ap-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #0a1a1c;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
          font-family: 'Archivo', sans-serif;
        }
        .ap-title span { color: #005f69; }
        .ap-sub {
          color: #6b7280;
          font-size: 19px;
          line-height: 1.75;
          max-width: 440px;
          margin-bottom: 36px;
          font-family: 'Archivo', sans-serif;
        }
        .ap-btns { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .ap-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #005f69; color: white;
          font-weight: 800; font-size: 14px; padding: 14px 24px;
          border-radius: 999px; text-decoration: none;
          font-family: 'Archivo', sans-serif;
          transition: all .2s ease;
          box-shadow: 0 6px 20px rgba(0,95,105,0.3);
        }
        .ap-btn-primary:hover { background: #007a8a; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,95,105,0.4); }

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
        .ap-circle-big img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.6s ease; }
        .ap-circle-small {
          position: absolute;
          right: 4%; bottom: 12%;
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

        @media (max-width: 900px) {
          .ap-hero { grid-template-columns: 1fr; padding: 80px 24px 60px; text-align: center; }
          .ap-sub { max-width: 100%; }
          .ap-btns { justify-content: center; }
          .ap-right { height: 340px; }
          .ap-circle-big { width: 240px; height: 240px; }
          .ap-circle-small { width: 130px; height: 130px; }
        }
          @keyframes apBtnPulse {
  0%,100% { box-shadow: 0 6px 20px rgba(0,95,105,0.3), 0 0 0 0 rgba(0,95,105,0.4); }
  50%      { box-shadow: 0 10px 28px rgba(0,95,105,0.45), 0 0 0 10px rgba(0,95,105,0); }
}
@keyframes apArrow {
  0%,100% { transform: translateX(0px); }
  50%      { transform: translateX(5px); }
}
.ap-btn-animated {
  animation: apBtnPulse 2s ease-in-out infinite;
}
.ap-btn-animated svg {
  animation: apArrow 1s ease-in-out infinite;
}
.ap-btn-animated:hover {
  animation: none;
  background: #007a8a !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,95,105,0.5) !important;
}
      `}</style>

      <div className="ap-root">
        <StarClusters />

        <div className="ap-hero">

          {/* ── Colonne gauche ── */}
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
  <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer" className="ap-btn-primary ap-btn-animated">
    Découvrir Ticketché <ArrowRight weight="bold" style={{ width: 16, height: 16 }} />
  </a>
</div>
          </div>

          {/* ── Colonne droite ── */}
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
    </>
  );
}