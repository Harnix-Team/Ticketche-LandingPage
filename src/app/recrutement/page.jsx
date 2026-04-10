"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, CurrencyCircleDollar,
  ArrowRight, Star, Buildings, MagnifyingGlass,
  ArrowUpRight, Desktop, Headset, ChartLineUp, PaintBrush,
} from "@phosphor-icons/react";
import { fetchJobs } from "@/app/services/jobsApi";
import { ApplicationModal } from "@/components/recrutement/ApplicationModal";

/* ─── Star Clusters ─────────────────────────────────────── */
const CLUSTERS = [
  { cx: "2%", cy: "6%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" }] },
  { cx: "91%", cy: "5%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }] },
  { cx: "1%", cy: "45%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "94%", cy: "42%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `recStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── Type Badge ────────────────────────────────────────── */
function TypeBadge({ type }) {
  const colors = {
    CDI: { bg: "#e0f5f7", color: "#005f69", border: "#b2e5ea" },
    CDD: { bg: "#fff1e6", color: "#692c00", border: "#f5d0ae" },
    Stage: { bg: "#f3f0ff", color: "#4c3d8a", border: "#d4cafc" },
  };
  const c = colors[type] || colors.CDI;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "100px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {type}
    </span>
  );
}

/* ─── Remote Badge ──────────────────────────────────────── */
function RemoteBadge({ remote }) {
  const labels = { hybride: "Hybride", présentiel: "Présentiel", "full-remote": "Full Remote", terrain: "Terrain" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "100px",
      fontSize: "10px",
      fontWeight: 600,
      background: "rgba(0,95,105,0.07)",
      color: "#005f69",
      border: "1px solid rgba(0,95,105,0.18)",
    }}>
      {labels[remote] || remote}
    </span>
  );
}

/* ─── Job Card ──────────────────────────────────────────── */
function JobCard({ job, index }) {
  const deptConfig = {
    "Technologie":      { Icon: Desktop,     color: "#005f69", bg: "linear-gradient(135deg,#e0f5f7,#c5e8ec)" },
    "Service Client":   { Icon: Headset,     color: "#692c00", bg: "linear-gradient(135deg,#fff1e6,#f5d9bf)" },
    "Commercial":       { Icon: ChartLineUp, color: "#004a52", bg: "linear-gradient(135deg,#d6f0f3,#b8e4e9)" },
    "Produit & Design": { Icon: PaintBrush,  color: "#692c00", bg: "linear-gradient(135deg,#fff1e6,#f5d9bf)" },
  };
  const dept = deptConfig[job.department] || { Icon: Buildings, color: "#005f69", bg: "linear-gradient(135deg,#e0f5f7,#c5ecef)" };
  const { Icon: DeptIcon } = dept;

  const salaryText = job.remuneration.displayed
    ? `${job.remuneration.min.toLocaleString()} – ${job.remuneration.max.toLocaleString()} ${job.remuneration.currency}/${job.remuneration.period}`
    : "Selon profil";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Link href={`/recrutement/${job.slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
        <div className="job-card">

          {/* ── Gradient glow on hover ── */}
          <div className="job-card-glow" />

          {/* ── Header row ── */}
          <div className="job-card-header">
            <div className="job-dept-icon" style={{ background: dept.bg }}>
              <DeptIcon size={20} weight="fill" style={{ color: dept.color }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <TypeBadge type={job.type} />
              <RemoteBadge remote={job.location.remote} />
            </div>
          </div>

          {/* ── Title block ── */}
          <div className="job-card-body">
            <p className="job-card-dept">{job.department}</p>
            <h3 className="job-card-title">{job.job_title}</h3>
            <p className="job-card-desc">
              {job.description.length > 110 ? job.description.slice(0, 110) + "…" : job.description}
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="job-card-divider" />

          {/* ── Footer info ── */}
          <div className="job-card-footer">
            <div className="job-card-chips">
              <span className="job-chip">
                <MapPin size={11} weight="fill" />
                {job.location.city}
              </span>
              <span className="job-chip">
                <Clock size={11} weight="fill" />
                {job.conditions.experience_years}
              </span>
              <span className="job-chip job-chip--salary">
                <CurrencyCircleDollar size={12} weight="fill" />
                {salaryText}
              </span>
            </div>

            <div className="job-card-cta">
              <span>Voir l'offre</span>
              <span className="job-cta-arrow">
                <ArrowUpRight size={15} weight="bold" />
              </span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function RecrutementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);

  const SPONTANEOUS_JOB = {
    id: null,
    job_title: "Candidature spontanée",
    department: "Ticketché",
    location: { city: "Cotonou", country: "Bénin", remote: "hybride" },
  };

  useEffect(() => {
    fetchJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const departments = ["Tous", ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.job_title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || j.department === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{`
        @keyframes recStar0 { 0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.45; } 50% { transform: translate(-50%,-50%) scale(1.3); opacity: 0.7; } }
        @keyframes recStar1 { 0%, 100% { transform: translate(-50%,-50%) scale(1.1); opacity: 0.40; } 50% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.25; } }
        @keyframes recStar2 { 0%, 100% { transform: translate(-50%,-50%) rotate(0deg); opacity: 0.32; } 50% { transform: translate(-50%,-50%) rotate(180deg); opacity: 0.55; } }

        .rec-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f4fafb 0%, #eef7f8 60%, #f9fffe 100%);
          font-family: 'Archivo', sans-serif;
          padding-bottom: 80px;
        }

        /* ── Hero ── */
        .rec-hero {
          position: relative; overflow: hidden;
          padding: 120px 24px 160px;
          text-align: center;
          background: #9dcccc;
        }
        .rec-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,95,105,0.05) 0%, transparent 70%);
        }
        .rec-hero-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
        .rec-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,95,105,0.10); border: 1px solid rgba(0,95,105,0.20);
          color: #005f69; padding: 5px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 24px; backdrop-filter: blur(8px);
        }
        .rec-hero h1 {
          font-size: clamp(24px, 4vw, 48px); font-weight: 900;
          color: #003f46; line-height: 1.1; letter-spacing: -1px; margin-bottom: 16px;
        }
        .rec-hero h1 span { color: #003f46; }
        .rec-hero p { color: #638284; font-size: clamp(14px, 2vw, 17px); line-height: 1.7; margin-bottom: 0; }

        /* ── Stats strip ── */
        .rec-stats {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
          background: #fff; border-bottom: 1px solid rgba(0,95,105,0.1);
          padding: 20px 24px; box-shadow: 0 2px 16px rgba(0,95,105,0.06);
        }
        .rec-stat { text-align: center; }
        .rec-stat-num { font-size: 1.4rem; font-weight: 900; color: #005f69; line-height: 1; }
        .rec-stat-label { font-size: 11px; color: #7aaeb4; font-weight: 500; margin-top: 2px; }

        /* ── Search + Filter bar ── */
        .rec-bar {
          max-width: 1100px; margin: 40px auto 0; padding: 0 24px;
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
        }
        .rec-search {
          flex: 1; min-width: 240px; display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1.5px solid rgba(0,95,105,0.15);
          border-radius: 12px; padding: 10px 14px;
          box-shadow: 0 2px 12px rgba(0,95,105,0.06); transition: border-color 0.2s;
        }
        .rec-search:focus-within { border-color: #005f69; }
        .rec-search input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 14px; font-family: 'Archivo', sans-serif; color: #123c40;
        }
        .rec-search input::placeholder { color: #a0bfc3; }
        .rec-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .rec-filter-btn {
          padding: 8px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 600;
          border: 1.5px solid rgba(0,95,105,0.2); background: #fff; color: #3f7076;
          cursor: pointer; transition: all 0.2s ease; font-family: 'Archivo', sans-serif;
        }
        .rec-filter-btn:hover { border-color: #005f69; color: #005f69; }
        .rec-filter-btn.active { background: #005f69; color: #fff; border-color: #005f69; box-shadow: 0 4px 14px rgba(0,95,105,0.25); }

        /* ── Grid ── */
        .rec-grid {
          max-width: 1100px; margin: 32px auto 40px; padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        /* ════════════════════════════════
           JOB CARD — nouveau design
        ════════════════════════════════ */
        .job-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid rgba(0,95,105,0.1);
          padding: 22px 22px 18px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease,
                      border-color 0.2s ease;
        }
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(0,95,105,0.13);
          border-color: rgba(0,95,105,0.28);
        }

        /* Glow teal qui remonte depuis le bas au hover */
        .job-card-glow {
          position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
          width: 200px; height: 100px;
          background: radial-gradient(ellipse, rgba(0,95,105,0.12), transparent 70%);
          pointer-events: none; transition: opacity 0.35s ease, bottom 0.35s ease;
          opacity: 0;
        }
        .job-card:hover .job-card-glow { opacity: 1; bottom: -20px; }

        /* Header */
        .job-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 18px;
        }
        .job-dept-icon {
          width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .job-card:hover .job-dept-icon { transform: rotate(-6deg) scale(1.08); }

        /* Body */
        .job-card-body { flex: 1; margin-bottom: 16px; }
        .job-card-dept {
          font-size: 10px; font-weight: 700; color: #005f69;
          text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px;
        }
        .job-card-title {
          font-size: 1.05rem; font-weight: 900; color: #111827;
          line-height: 1.25; margin: 0 0 10px; letter-spacing: -0.2px;
        }
        .job-card-desc {
          font-size: 13px; color: #6b7280; line-height: 1.65; margin: 0;
        }

        /* Divider */
        .job-card-divider { height: 12px; }

        /* Footer */
        .job-card-footer { display: flex; flex-direction: column; gap: 12px; }

        /* Chips */
        .job-card-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .job-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 100px;
          background: #ecf5f5;
          font-size: 11px; font-weight: 600; color: #004a52;
          transition: background 0.2s;
        }
        .job-chip svg { color: #7aaeb4; flex-shrink: 0; }
        .job-chip--salary {
          background: rgba(0,95,105,0.1); color: #005f69; font-weight: 700;
        }
        .job-chip--salary svg { color: #005f69; }

        /* CTA row */
        .job-card-cta {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px 10px 16px; border-radius: 12px;
          background: linear-gradient(135deg, #004a52, #006370);
          color: #fff; font-size: 13px; font-weight: 700;
          transition: background 0.25s ease;
        }
        .job-card:hover .job-card-cta {
          background: linear-gradient(135deg, #005f69, #007d88);
        }
        .job-cta-arrow {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.25s ease, background 0.2s ease;
        }
        .job-card:hover .job-cta-arrow {
          transform: translate(2px, -2px);
          background: rgba(255,255,255,0.25);
        }

        /* ── Empty state ── */
        .rec-empty { text-align: center; padding: 80px 24px; color: #7aaeb4; }
        .rec-empty h3 { font-size: 1.1rem; font-weight: 700; color: #3f7076; margin-bottom: 8px; }
        .rec-empty p { font-size: 14px; }

        /* ── Loading skeleton ── */
        .rec-skeleton {
          background: linear-gradient(90deg, #e0f5f7 25%, #f4fafb 50%, #e0f5f7 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── CTA band ── */
        .rec-cta-band {
          background: linear-gradient(135deg, #005f69 0%, #007d88 100%);
          margin: 0 24px 80px;
          border-radius: 20px; padding: 48px 40px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
          max-width: 1052px; margin-left: auto; margin-right: auto;
          box-shadow: 0 16px 48px rgba(0,95,105,0.2);
        }
        .rec-cta-band h2 { color: #fff; font-size: 1.5rem; font-weight: 900; margin: 0 0 8px; }
        .rec-cta-band p { color: rgba(255,255,255,0.8); font-size: 14px; margin: 0; }
        .rec-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #005f69;
          padding: 12px 24px; border-radius: 100px;
          font-size: 14px; font-weight: 800;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .rec-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        @media (max-width: 640px) {
          .rec-hero { padding: 100px 20px 60px; }
          .rec-stats { gap: 24px; }
          .rec-grid { grid-template-columns: 1fr; padding: 0 16px; }
          .rec-bar { flex-direction: column; }
          .rec-cta-band { flex-direction: column; text-align: center; margin: 0 16px 60px; }
        }
      `}</style>

      <div className="rec-page">
        {/* ── Hero ── */}
        <div className="rec-hero">
          <StarClusters />
          <div className="rec-hero-inner">
            <div className="rec-hero-badge">
              <Briefcase size={12} weight="fill" />
              Carrières & Recrutement
            </div>
            <h1>
              Rejoignez l'équipe<br />
              <span>qui réinvente</span> la mobilité<br />
              au Bénin
            </h1>
            <p>
              Construisons ensemble l'avenir de la mobilité urbaine. Découvrez nos offres d'emploi et participez à une aventure qui transforme des milliers de vies chaque jour.
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="rec-stats">
          <div className="rec-stat"><div className="rec-stat-num">{jobs.length}</div><div className="rec-stat-label">Postes ouverts</div></div>
          <div className="rec-stat"><div className="rec-stat-num">Cotonou</div><div className="rec-stat-label">Siège social</div></div>
          <div className="rec-stat"><div className="rec-stat-num">2024</div><div className="rec-stat-label">Fondée en</div></div>
          <div className="rec-stat"><div className="rec-stat-num">+1 000</div><div className="rec-stat-label">Utilisateurs actifs</div></div>
        </div>

        {/* ── Search & Filters ── */}
        <div className="rec-bar">
          <div className="rec-search">
            <MagnifyingGlass size={16} style={{ color: "#7aaeb4", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Rechercher un poste, département, ville…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rec-filters">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`rec-filter-btn${filter === d ? " active" : ""}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="rec-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", height: 320 }}>
                <div className="rec-skeleton" style={{ height: "100%" }} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="rec-empty" style={{ gridColumn: "1 / -1" }}>
              <h3>Aucun poste trouvé</h3>
              <p>Essayez d'autres mots-clés ou supprimez les filtres.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── CTA candidature spontanée ── */}
        {!loading && (
          <div className="rec-cta-band">
            <div>
              <h2>Vous ne trouvez pas votre bonheur ?</h2>
              <p>Envoyez-nous une candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="rec-cta-btn">
              Candidature spontanée
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        )}

        <AnimatePresence>
          {modalOpen && (
            <ApplicationModal job={SPONTANEOUS_JOB} onClose={() => setModalOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}