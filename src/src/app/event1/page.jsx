"use client";

import { useState } from "react";
import { MapPin, CalendarBlank, Clock } from "@phosphor-icons/react";

// ── Data ──────────────────────────────────────────────────────────────────────
const COLORS = [
  "/images/Events/1.jpg",
  "/images/Events/2.jpg",
  "/images/Events/3.jpg",
  "/images/Events/1.jpg",
  "/images/Events/2.jpg",
];

const heroEvents = [
  { id: 1, category: "COMEDY",  title: "William Smith Comedy Show",     subtitle: "Crack a Smile – 2022 Tour",      date: "Jun 27", time: "7:00 PM", location: "Cotonou, Bénin",    image: COLORS[0] },
  { id: 2, category: "CONCERT", title: "Shannon Weigel Acoustic Night", subtitle: "Tour Love Me As I Love You",     date: "Aug 28", time: "8:30 PM", location: "Porto-Novo, Bénin", image: COLORS[1] },
  { id: 3, category: "THEATRE", title: "La Nuit du Théâtre Béninois",   subtitle: "Le Groupe de Théâtre National",  date: "Aug 29", time: "8:00 PM", location: "Cotonou, Bénin",    image: COLORS[2] },
];

const upcomingEvents = [
  { id: 1, day: "27", month: "AUG", year: "2022", time: "7:00 PM", category: "COMEDY",   title: "William Smith Comedy Show",                          subtitle: "Crack a Smile – 2022 Tour",            image: COLORS[0] },
  { id: 2, day: "28", month: "AUG", year: "2022", time: "8:30 PM", category: "CONCERT",  title: "Shannon Weigel Acoustic Night",                      subtitle: "Tour Love Me As I Love You",           image: COLORS[1] },
  { id: 3, day: "29", month: "AUG", year: "2022", time: "8:00 PM", category: "THEATRE",  title: "The Lewistage Hamlet by William Shakespeare",        subtitle: "The Lewistage Theatre Drama Group",    image: COLORS[2] },
  { id: 4, day: "30", month: "AUG", year: "2022", time: "8:00 PM", category: "CONCERT",  title: "Edward Burgess – Sax on the Beach",                  subtitle: "Classical Summer Tour – 2022",         image: COLORS[3] },
  { id: 5, day: "1",  month: "SEP", year: "2022", time: "8:00 PM", category: "THEATRE",  title: "The Lewistage Cinderella – The Little Glass Slipper", subtitle: "The Lewistage Theatre Drama Group",   image: COLORS[4] },
];

let _clipCounter = 0;
let _ticketId = 0;

// ── Image UPCOMING : zigzag bord GAUCHE + encoche concave bord DROIT ─────────
function UpcomingTicketImage({ src, width = 160, height = 110 }) {
  const [id] = useState(() => `upt-${++_ticketId}`);
  const W = width;
  const H = height;

  const TD = 9;
  const TS = 10;
  const toothCount = Math.ceil(H / TS);
  const zigzagPoints = [`M ${TD} 0`];
  for (let i = 1; i <= toothCount + 1; i++) {
    const y = Math.min(i * TS, H);
    const x = i % 2 === 1 ? 0 : TD;
    zigzagPoints.push(`L ${x} ${y}`);
  }

  const PR = 16;
  const midY = H / 2;
  const toothEnd = toothCount % 2 === 1 ? 0 : TD;

  const d = [
    ...zigzagPoints,
    `L ${toothEnd} ${H}`,
    `L ${W} ${H}`,
    `L ${W} ${midY + PR}`,
    `A ${PR} ${PR} 0 0 1 ${W} ${midY - PR}`,
    `L ${W} 0`,
    `L ${TD} 0`,
    `Z`,
  ].join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", flexShrink: 0, overflow: "visible" }}>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <image href={src} width={W} height={H} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
    </svg>
  );
}

// ── Image HERO ────────────────────────────────────────────────────────────────
function HeroTicketImage({ src, width = 240, height = 210 }) {
  const [id] = useState(() => `hero-img-${++_clipCounter}`);
  const W = width, H = height;
  const TD = 9, TS = 11;
  const PR = 22;
  const midY = H / 2;
  const toothCount = Math.ceil(H / TS);

  const zigLeft = [`M ${TD} 0`];
  for (let i = 1; i <= toothCount + 1; i++) {
    const y = Math.min(i * TS, H);
    const x = i % 2 === 1 ? 0 : TD;
    zigLeft.push(`L ${x} ${y}`);
  }
  const toothEnd = toothCount % 2 === 1 ? 0 : TD;

  const d = [
    ...zigLeft,
    `L ${toothEnd} ${H}`,
    `L ${W} ${H}`,
    `L ${W} ${midY + PR}`,
    `A ${PR} ${PR} 0 0 1 ${W} ${midY - PR}`,
    `L ${W} 0`,
    `L ${TD} 0`,
    `Z`,
  ].join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", flexShrink: 0 }}>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <image href={src} width={W} height={H} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
    </svg>
  );
}

// ── Hero Ticket Card ──────────────────────────────────────────────────────────
const PERF_R = 22;

function HeroTicketCard({ event, onPrev, onNext }) {
  const PR = PERF_R;
  const cardH = 210;
  const imgW = 240;

  return (
    <div style={{ position: "relative", overflow: "visible" }}>
      {/* Left arrow */}
      <div
        onClick={onPrev}
        style={{
          position: "absolute",
          left: -PR,
          top: "50%",
          transform: "translateY(-50%)",
          width: PR * 2,
          height: PR * 2,
          borderRadius: "50%",
          background: "rgba(10,3,0,0.85)",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>‹</span>
      </div>

      {/* Card */}
      <div
        style={{
          display: "flex",
          background: "#fff",
          boxShadow: "0 24px 72px rgba(0,0,0,0.45)",
          minHeight: cardH,
          overflow: "hidden",
        }}
      >
        {/* Text */}
        <div
          style={{
            flex: 1,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <div>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#692c00", marginBottom: "5px" }}>
              {event.category}
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#5a3020", marginBottom: "2px", lineHeight: 1.3 }}>
              {event.title}
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1rem, 2vw, 1.45rem)",
                fontWeight: 700,
                color: "#1a0a00",
                lineHeight: 1.2,
                marginBottom: "10px",
              }}
            >
              {event.subtitle}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#8a5a44", marginBottom: "14px" }}>
              <MapPin size={14} weight="bold" color="#692c00" />
              {event.location}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: "14px", fontSize: "11px", color: "#6b4030" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <CalendarBlank size={14} weight="bold" color="#692c00" />
                {event.date}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={14} weight="bold" color="#692c00" />
                {event.time}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                style={{
                  background: "#fff",
                  color: "#1a0a00",
                  border: "1.5px solid #1a0a00",
                  borderRadius: "6px",
                  padding: "9px 20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
                }}
              >
                Get Tickets
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#1a0a00",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <HeroTicketImage src={event.image} width={imgW} height={cardH} />
      </div>

      {/* Right arrow */}
      <div
        onClick={onNext}
        style={{
          position: "absolute",
          right: -PR,
          top: "50%",
          transform: "translateY(-50%)",
          width: PR * 2,
          height: PR * 2,
          borderRadius: "50%",
          background: "rgba(10,3,0,0.85)",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>›</span>
      </div>
    </div>
  );
}

// ── Upcoming Event Row ────────────────────────────────────────────────────────
function UpcomingRow({ event, isFirst }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderTop: isFirst ? "1px solid rgba(105,44,0,0.10)" : "none",
        borderBottom: "1px solid rgba(105,44,0,0.10)",
        padding: "18px 0",
      }}
    >
      <div style={{ flexShrink: 0, width: "58px", textAlign: "center", marginRight: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#692c00", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {event.month}
        </div>
        <div style={{ fontSize: "28px", fontWeight: 900, color: "#1a0a00", lineHeight: 1, margin: "1px 0" }}>{event.day}</div>
        <div style={{ fontSize: "9px", color: "#aaa" }}>{event.year}</div>
        <div style={{ marginTop: "7px", background: "#692c00", color: "#fff", borderRadius: "4px", padding: "2px 7px", fontSize: "8px", fontWeight: 700, letterSpacing: "0.04em" }}>
          {event.time}
        </div>
      </div>

      <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(105,44,0,0.12)", marginRight: "18px", flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#692c00", marginBottom: "3px" }}>
          {event.category}
        </p>
        <p style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)", fontWeight: 700, color: "#1a0a00", lineHeight: 1.3, marginBottom: "2px" }}>
          {event.title}
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
            color: "#6b4030",
            marginBottom: "12px",
          }}
        >
          {event.subtitle}
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            style={{
              background: "#692c00",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 18px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get Tickets
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#444",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            View Details
          </button>
        </div>
      </div>

      <div style={{ flexShrink: 0, marginLeft: "18px" }}>
        <UpcomingTicketImage src={event.image} width={160} height={110} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EventPage() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i === 0 ? heroEvents.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === heroEvents.length - 1 ? 0 : i + 1));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Archivo:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Archivo', system-ui, sans-serif;
          background: #fff;
        }
        .view-all-btn:hover {
          background: #692c00 !important;
          color: #fff !important;
        }
      `}</style>

      <div style={{ fontFamily: "'Archivo', sans-serif", background: "#fff", minHeight: "100vh" }}>
        {/* HERO */}
        <section
          style={{
            position: "relative",
            minHeight: "clamp(460px, 55vw, 640px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {heroEvents.map((e, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${e.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                opacity: i === current ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(40,12,0,0.62) 0%, rgba(12,3,0,0.85) 100%)" }} />

          <div
            style={{
              position: "relative",
              zIndex: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "clamp(40px,6vw,72px) clamp(48px,8vw,120px) clamp(48px,6vw,72px)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                marginBottom: "10px",
              }}
            >
              • Les Événements Ticketché •
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.9rem, 5vw, 4rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.08,
                marginBottom: "clamp(28px,4vw,48px)",
                textShadow: "0 2px 32px rgba(0,0,0,0.5)",
              }}
            >
              June 27th – July 4th
            </h1>

            <div style={{ width: "100%", maxWidth: "clamp(480px, 72vw, 840px)", margin: "0 auto" }}>
              <HeroTicketCard event={heroEvents[current]} onPrev={prev} onNext={next} />
              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
                {heroEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: i === current ? 20 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(48px,7vw,88px) clamp(20px,4vw,40px)" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(32px,4vw,52px)" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 900,
                color: "#1a0a00",
                marginBottom: "10px",
              }}
            >
              Featured Upcoming Events
            </h2>
            <p style={{ fontSize: "13px", color: "#8a6a5a", lineHeight: 1.6, maxWidth: "380px", margin: "0 auto" }}>
              Keep coming back to our website to stay informed about the activities in our theater and reserve your preferred seats in advance.
            </p>
          </div>

          <div>
            {upcomingEvents.map((ev, i) => (
              <UpcomingRow key={ev.id} event={ev} isFirst={i === 0} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <button
              className="view-all-btn"
              style={{
                border: "2px solid #692c00",
                color: "#692c00",
                background: "transparent",
                borderRadius: "999px",
                padding: "12px 36px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              View All Events
            </button>
          </div>
        </section>
      </div>
    </>
  );
}