"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";

const faqs = [
  {
    question: "Qu'est-ce que Ticketché ?",
    answer:
      "Ticketché est une super-application qui centralise 4 services du quotidien : parking, lavage auto, garage & mécanique, billetterie d'événements et gestion d'événements. Utilisateurs et gérants y trouvent chacun les outils adaptés à leurs besoins, en temps réel.",
  },
  {
    question: "Quels services sont disponibles sur Ticketché ?",
    answer:
      "Ticketché couvre 4 domaines : (1) Parking - localisez et réservez une place en temps réel ; (2) Lavage auto - repérez les centres notés près de chez vous ; (3) Garage & mécanique — confiez votre véhicule à des garages certifiés ; Billetterie - achetez vos billets de concerts, soirées ou expos en ligne ; (4) Événements - créez et gérez vos événements avec vente de tickets intégrée.",
  },
  {
    question: "Comment réserver un service sur Ticketché ?",
    answer:
      "Ouvrez l'app, choisissez le service souhaité (parking, lavage, garage ou billet d'événement), sélectionnez votre prestataire, confirmez et payez en mobile money ou par carte. Votre ticket numérique est généré instantanément.",
  },
  {
    question: "Comment les gérants utilisent-ils Ticketché ?",
    answer:
      "Les gérants de parkings, centres de lavage, garages et organisateurs d'événements disposent d'un espace dédié : suivi en temps réel des véhicules et entrées, encaissement mobile money, statistiques de fréquentation, gestion du personnel et billetterie numérique sécurisée.",
  },
  {
    question: "Qui peut utiliser Ticketché ?",
    answer:
      "Tout le monde ! Les utilisateurs pour trouver et réserver des services automobiles ou acheter des billets. Les gérants et organisateurs pour digitaliser leur activité, réduire la fraude et suivre leurs performances. Particuliers, professionnels et associations sont les bienvenus.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(1);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq-root">
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,900;1,700&display=swap"
        rel="stylesheet"
      />

      <div className="faq-inner">

        {/* ── LEFT : accordion ── */}
        <div className="faq-left">
          <p className="faq-eyebrow">FAQ</p>
          <h2 className="faq-heading">
            Vous avez des<br />
            <em>questions ?</em>
          </h2>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                <button className="faq-trigger" onClick={() => toggle(i)}>
                  <span className="faq-q">{faq.question}</span>
                  <span className="faq-icon">
                    {openIndex === i
                      ? <MinusCircle size={28} weight="fill" />
                      : <PlusCircle size={28} weight="fill" />}
                  </span>
                </button>
                <div className="faq-body">
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT : orbe + 1 image top ── */}
        <div className="faq-right">

          <div className="faq-card">
            <div className="faq-halo" />

            {/* Orbe background image */}
            <img src="/images/Hero/orbe.png" alt="" className="faq-orbe" />

            {/* Badge */}
            <div className="faq-badge">
              <span className="faq-badge-num">4</span>
              <span className="faq-badge-label">services<br />en 1 app</span>
            </div>

            {/* Image TOP uniquement */}
            <div className="faq-img-wrap img-top">
              <img src="/images/faq/faq1.jpg" alt="Service Ticketché" className="faq-img" />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .faq-root,
        .faq-root * {
          font-family: 'Archivo', sans-serif !important;
          box-sizing: border-box;
        }

        .faq-root {
background: #ecf5f5;
margin-top: -160px;
padding: 0 clamp(20px, 6vw, 88px) 5px ;
overflow: visible;
        }

        .faq-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          /* big gap between left FAQ and right card panel */
          grid-template-columns: 1fr 1fr;
          gap: clamp(72px, 10vw, 140px);
          align-items: center;
          overflow: visible;
        }

        /* ── LEFT ── */
        .faq-left { padding-top: 4px; }

        .faq-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #04545d;
          margin: 0 0 16px;
        }

        .faq-heading {
          font-size: clamp(1.9rem, 3vw, 2.9rem);
          font-weight: 900;
          line-height: 1.08;
          color: #001e22;
          margin: 0 0 clamp(30px, 4vw, 48px);
        }
        .faq-heading em {
          font-style: italic;
          color: #04545d;
        }

        .faq-list { display: flex; flex-direction: column; }
        .faq-item { border-bottom: 1px solid rgba(0,30,34,0.12); }
        .faq-item:first-child { border-top: 1px solid rgba(0,30,34,0.12); }

        .faq-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: clamp(13px, 1.7vw, 19px) 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .faq-q {
          font-size: clamp(0.9rem, 1.05vw, 1.05rem);
          font-weight: 600;
          color: #001e22;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .faq-item:not(.open) .faq-q {
          font-weight: 500;
          color: #3a5a5e;
        }

        .faq-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(0,30,34,0.22);
          transition: color 0.25s;
        }
        .faq-item.open .faq-icon { color: #04545d; }

        .faq-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .faq-item.open .faq-body { max-height: 260px; }

        .faq-answer {
          font-size: clamp(0.86rem, 1vw, 0.97rem);
          color: rgba(0,30,34,0.60);
          line-height: 1.78;
          padding-bottom: clamp(13px, 1.7vw, 19px);
          margin: 0;
        }

        /* ── RIGHT ── */
        .faq-right {
          display: flex;
          justify-content: center;
          align-items: center;
          /* vertical padding so overflowing images aren't clipped */
          padding: clamp(60px, 8vw, 100px) 0;
          overflow: visible;
        }

        /* ── Orbe portrait card ── */
        .faq-card {
          position: relative;
          background: transparent;
          border-radius: clamp(24px, 3vw, 40px);
          width: 170%;
          aspect-ratio: 3 / 5;
          box-shadow: none;
          overflow: visible;
        }

        .faq-orbe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 110%;
          object-fit: cover;
          border-radius: clamp(24px, 3vw, 40px);
          pointer-events: none;
          z-index: 0;
        }

        .faq-halo {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .faq-badge {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.32);
          backdrop-filter: blur(10px);
          color: #fff;
          border-radius: 10px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 20;
          white-space: nowrap;
        }
        .faq-badge-num {
          font-size: 1.5rem;
          font-weight: 900;
          color: #f0b429;
          line-height: 1;
        }
        .faq-badge-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.3;
          opacity: 0.88;
        }

        /* ── Image cards ── */
        .faq-img-wrap {
          position: absolute;
          left: 8%;
          right: 8%;
          border-radius: clamp(14px, 1.8vw, 22px);
          overflow: hidden;
          border: 4px solid rgba(255,255,255,0.92);
          box-shadow: 0 20px 56px rgba(0,30,34,0.36);
          line-height: 0;
          z-index: 10;
        }

        .img-top {
          top: 35%;
        }

        .faq-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.55s ease;
        }
        .faq-img-wrap:hover .faq-img {
          transform: scale(1.03);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .faq-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .faq-right {
            padding: clamp(80px, 12vw, 120px) 0;
          }
          .faq-card {
            width: 48%;
            min-width: 180px;
          }
        }

        @media (max-width: 520px) {
          .faq-card { width: 60%; }
        }
      `}</style>
    </section>
  );
}