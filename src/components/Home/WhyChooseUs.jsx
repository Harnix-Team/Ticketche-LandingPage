"use client";

import { Headset, ShieldCheck, Lightning } from "@phosphor-icons/react";

const reasons = [
  {
    Icon: Headset,
    title: "Support 24/7",
    description: "Notre équipe est disponible à toute heure pour répondre à vos questions et résoudre vos problèmes rapidement.",
    href: "#contact",
  },
  {
    Icon: ShieldCheck,
    title: "Paiements Sécurisés",
    description: "Toutes vos transactions sont protégées. Payez via Mobile Money ou carte bancaire en toute confiance.",
    href: "#services",
  },
  {
    Icon: Lightning,
    title: "Accès Instantané",
    description: "Recevez votre QR code en quelques secondes et accédez à tous vos services sans attente ni paperasse.",
    href: "#download",
  },
];

export default function WhyChooseUs() {
  return (
    <>
      <style>{`
        .wcu-section {
          font-family: 'Archivo', sans-serif;
          padding: clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px);
          background: #ffffff;
          text-align: center;
        }

        .wcu-title {
          font-size: clamp(1.7rem, 3.4vw, 2.6rem);
          font-weight: 900;
          color: #0a1a1c;
          letter-spacing: -0.03em;
          margin: 0 0 clamp(36px, 5vw, 64px);
          line-height: 1.1;
        }

        .wcu-title span { color: #005f69; }

        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .wcu-grid { grid-template-columns: 1fr; max-width: 380px; }
        }

        /* Card with border-radius */
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

        /* Top-left corner — dark */
       
.wcu-card::before,
.wcu-card::after { display: none; }

.wcu-tr {
  position: absolute;
  top: -1px; right: -1px;
  width: 40px;
  height: 40px;
  border-top: 5px solid #005f69;
  border-right: 5px solid #005f69;
  border-radius: 0 20px 0 0;
}

.wcu-bl {
  position: absolute;
  bottom: -1px; left: -1px;
  width: 40px;
  height: 40px;
  border-bottom: 5px solid #005f69;
  border-left: 5px solid #005f69;
  border-radius: 0 0 0 20px;
}
      

        .wcu-icon-box {
          width: 68px;
          height: 68px;
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
          font-size: 20px;
          font-weight: 800;
          color: #0a1a1c;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .wcu-card-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.75;
          margin: 0 0 24px;
        }

        .wcu-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #005f69;
          text-decoration: none;
          transition: gap 0.2s ease;
        }
        .wcu-link:hover { gap: 10px; }
      `}</style>

      <section className="wcu-section">
        <h2 className="wcu-title">
          3 Raisons de choisir <span>ticketché</span>
        </h2>

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