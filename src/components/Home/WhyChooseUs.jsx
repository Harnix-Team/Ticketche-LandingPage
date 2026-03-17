"use client";

import { DeviceMobileCamera, Money, ChartBar, Star } from "@phosphor-icons/react";

const reasons = [
  {
    Icon: DeviceMobileCamera,
    title: "Gestion simple depuis votre téléphone",
    description: "Avec Ticketché, gérez facilement vos parkings, lavages, garages ou événements directement depuis votre smartphone. Suivez vos activités, vos clients et gardez le contrôle sur votre business à tout moment.",
    href: "#download",
  },
  {
    Icon: Money,
    title: "Paiements rapides et sans stress",
    description: "Recevez les paiements en quelques secondes via Mobile Money. Chaque paiement génère automatiquement un ticket numérique avec QR code, pour un suivi simple et professionnel.",
    href: "#services",
  },
  {
    Icon: ChartBar,
    title: "Une vue claire de votre activité",
    description: "Consultez vos entrées, vos transactions et vos performances en temps réel. Tout est centralisé pour vous permettre de mieux gérer et développer votre activité.",
    href: "#contact",
  },
];

const CLUSTERS = [
  { cx: "3%", cy: "10%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.50, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "92%", cy: "8%", stars: [{ x: 0, y: 0, size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -13, y: 12, size: 9, opacity: 0.30, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%", cy: "50%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 14, y: -8, size: 7, opacity: 0.25, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "95%", cy: "45%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -12, y: 10, size: 7, opacity: 0.25, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "5%", cy: "82%", stars: [{ x: 0, y: 0, size: 9, opacity: 0.30, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }, { x: 11, y: -7, size: 6, opacity: 0.22, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -10, y: -9, size: 7, opacity: 0.22, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "48%", cy: "3%", stars: [{ x: 0, y: 0, size: 8, opacity: 0.28, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "92%", stars: [{ x: 0, y: 0, size: 8, opacity: 0.25, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "6%", stars: [{ x: 0, y: 0, size: 7, opacity: 0.22, anim: 2, delay: "0.2s", dur: "2.8s", color: "#00818f" }] },
  { cx: "75%", cy: "90%", stars: [{ x: 0, y: 0, size: 7, opacity: 0.22, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `wcuStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function WhyChooseUs() {
  return (
    <>
      <style>{`
        @keyframes wcuStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes wcuStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes wcuStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }

        .wcu-section {
          font-family: 'Archivo', sans-serif;
          padding: clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px);
          background: #ecf5f5;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .wcu-title-wrap {
          position: relative;
          z-index: 2;
          margin: 0 0 clamp(36px, 5vw, 64px);
        }

        .wcu-title {
          font-size: clamp(1.7rem, 3.4vw, 2.6rem);
          font-weight: 900;
          color: #0a1a1c;
          letter-spacing: -0.03em;
          margin: 0;
          line-height: 1.3;
          display: inline;
        }

        .wcu-title span { color: #005f69; }

        .wcu-title-star {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          filter: drop-shadow(0 0 4px #00818f88);
        }
        .wcu-title-star-1 { animation: wcuStar1 3s ease-in-out infinite; }
        .wcu-title-star-2 { animation: wcuStar1 3s ease-in-out 0.4s infinite; }

        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .wcu-grid { grid-template-columns: 1fr; max-width: 380px; }
        }

        .wcu-card {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          border: 1.5px solid rgba(0,0,0,0.08);
          padding: 36px 28px 32px;
          text-align: left;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
          overflow: hidden;
        }

        .wcu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,95,105,0.12);
        }

        .wcu-card::before,
        .wcu-card::after { display: none; }

        .wcu-tr {
          position: absolute;
          top: -1px; right: -1px;
          width: 40px; height: 40px;
          border-top: 5px solid #005f69;
          border-right: 5px solid #005f69;
          border-radius: 0 20px 0 0;
        }

        .wcu-bl {
          position: absolute;
          bottom: -1px; left: -1px;
          width: 40px; height: 40px;
          border-bottom: 5px solid #005f69;
          border-left: 5px solid #005f69;
          border-radius: 0 0 0 20px;
        }

        .wcu-icon-box {
          width: 68px; height: 68px;
          border-radius: 18px;
          background: #005f69;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }
        .wcu-card:hover .wcu-icon-box { transform: scale(1.08); }

        .wcu-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #0a1a1c;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .wcu-card-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.75;
          margin: 0;
        }
      `}</style>

      <section className="wcu-section">
        <StarClusters />

        <div className="wcu-title-wrap">
          <h2 className="wcu-title">
            <span>ticketché</span>, c'est quoi ?&nbsp;
            <span className="wcu-title-star wcu-title-star-1">
              <Star weight="fill" style={{ width: 20, height: 20, color: "#005f69" }} />
            </span>
            <span className="wcu-title-star wcu-title-star-2" style={{ marginLeft: "4px" }}>
              <Star weight="fill" style={{ width: 14, height: 14, color: "#00818f" }} />
            </span>
          </h2>
        </div>

        <div className="wcu-grid">
          {reasons.map((r, i) => (
            <div key={i} className="wcu-card">
              <span className="wcu-tr" />
              <span className="wcu-bl" />

              <div className="wcu-icon-box">
                <r.Icon weight="fill" style={{ width: 34, height: 34, color: "#ffffff" }} />
              </div>

              <h3 className="wcu-card-title">{r.title}</h3>
              <p className="wcu-card-desc">{r.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}