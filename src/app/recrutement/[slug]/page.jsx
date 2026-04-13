"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Share,
  Check,
  ArrowRight,
  CalendarBlank,
  Buildings,
  HouseLine,
  Globe,
  Motorcycle,
} from "@phosphor-icons/react";
import { fetchJobBySlug } from "@/app/services/jobsApi";
import { ApplicationModal } from "@/components/recrutement/ApplicationModal";

/* ─── Helpers ─────────────────────────────────────── */
function TypeBadge({ type }) {
  const colors = {
    CDI: { bg: "#e0f5f7", color: "#005f69", border: "#b2e5ea" },
    CDD: { bg: "#fff1e6", color: "#692c00", border: "#f5d0ae" },
  };
  const c = colors[type] || colors.CDI;
  return (
    <span
      style={{
        padding: "3px 12px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
    >
      {type}
    </span>
  );
}

function RemoteBadge({ remote }) {
  const map = {
    hybride: { icon: HouseLine, label: "Hybride" },
    présentiel: { icon: Buildings, label: "Présentiel" },
    "full-remote": { icon: Globe, label: "Full Remote" },
    terrain: { icon: Motorcycle, label: "Terrain" },
  };
  const { icon: Icon, label } = map[remote] || { icon: MapPin, label: remote };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 12px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        background: "rgba(0,95,105,0.07)",
        color: "#005f69",
        border: "1px solid rgba(0,95,105,0.18)",
      }}
    >
      <Icon size={11} weight="fill" />
      {label}
    </span>
  );
}

/* ─── Share Button ──────────────────────────────────── */
function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <button onClick={handleShare} className="jd-share-btn">
      {copied ? (
        <Check size={15} weight="bold" />
      ) : (
        <Share size={15} weight="bold" />
      )}
      {copied ? "Lien copié !" : "Partager"}
    </button>
  );
}

/* ─── Main Detail Page ──────────────────────────────── */
export default function JobDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchJobBySlug(slug).then((data) => {
      setJob(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (!job) return <NotFound />;

  const salaryText = job.remuneration.displayed
    ? `${job.remuneration.min.toLocaleString()} – ${job.remuneration.max.toLocaleString()} ${job.remuneration.currency} / ${job.remuneration.period}`
    : "Rémunération selon profil";

  return (
    <>
      <style>{`
        .jd-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f4fafb 0%, #eef7f8 100%);
          font-family: 'Archivo', sans-serif;
          padding-bottom: 120px;
        }

        /* ── Hero ── */
        .jd-hero {
          background: #9dcccc;
          padding: 100px 24px 52px;
          position: relative; overflow: hidden;
        }
        .jd-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,95,105,0.05), transparent 70%);
        }
        .jd-hero-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
        .jd-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 24px;
        }
        .jd-breadcrumb a {
          color: #003f46; font-size: 13px; font-weight: 600;
          text-decoration: none; display: flex; align-items: center; gap: 5px;
          transition: color 0.2s; opacity: 0.75;
        }
        .jd-breadcrumb a:hover { opacity: 1; }
        .jd-breadcrumb span { color: #003f46; font-size: 12px; opacity: 0.4; }
        .jd-breadcrumb-current { color: #005f69; font-size: 13px; font-weight: 700; opacity: 1; }

        .jd-hero-dept {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #005f69; margin-bottom: 12px;
        }
        .jd-hero h1 {
          font-size: clamp(24px, 4vw, 48px);
          font-weight: 900; color: #003f46; line-height: 1.1;
          letter-spacing: -1px; margin-bottom: 20px;
        }
        .jd-hero-badges { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
        .jd-hero-meta { display: flex; gap: 12px; flex-wrap: wrap; }

        /* ── Meta items — base ── */
        .jd-hero-meta-item {
          display: inline-flex; align-items: center; gap: 6px;
          color: #638284; font-size: 13px; font-weight: 500;
        }

        /* ── Meta items — accentués (location, expérience, prise de poste) ── */
        .jd-hero-meta-item--accent {
          display: inline-flex; align-items: center; gap: 5px;
          color: #003f46; font-size: 13px; font-weight: 800;
        }
        .jd-hero-meta-item--accent svg { color: #005f69; flex-shrink: 0; position: relative; top: 0.5px; }

        .jd-hero-actions {
          display: flex; align-items: center; gap: 10px;
          margin-top: 28px;
        }
        .jd-share-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 100px;
          background: rgba(0,95,105,0.10);
          border: 1.5px solid rgba(0,95,105,0.22);
          color: #003f46; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Archivo', sans-serif;
        }
        .jd-share-btn:hover { background: rgba(0,95,105,0.18); }

        /* ── Content layout ── */
        .jd-layout {
          max-width: 900px; margin: 0 auto; padding: 40px 24px 0;
          display: grid; grid-template-columns: 1fr 320px; gap: 28px;
        }
        @media (max-width: 768px) { .jd-layout { grid-template-columns: 1fr; } }

        /* ── Cards ── */
        .jd-card {
          background: #fff; border-radius: 18px;
          border: 1.5px solid rgba(0,95,105,0.1);
          padding: 28px;
          box-shadow: 0 2px 16px rgba(0,95,105,0.05);
          margin-bottom: 20px;
        }
        .jd-section-title {
          font-size: 14px; font-weight: 800; color: #005f69;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin: 0 0 20px; display: flex; align-items: center; gap: 8px;
        }

        .jd-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .jd-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14px; color: #374151; line-height: 1.6;
        }
        .jd-list li::before {
          content: ''; width: 7px; height: 7px; border-radius: 50%;
          background: #005f69; flex-shrink: 0; margin-top: 7px;
        }

        .jd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .jd-tag {
          padding: 5px 12px; border-radius: 100px;
          background: rgba(0,95,105,0.07);
          border: 1px solid rgba(0,95,105,0.15);
          font-size: 12px; font-weight: 600; color: #005f69;
        }
        .jd-tag-bonus { background: rgba(105,44,0,0.07); border-color: rgba(105,44,0,0.15); color: #692c00; }

        .jd-desc { font-size: 14px; color: #374151; line-height: 1.75; }

        /* ── Sidebar ── */
        .jd-info-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 0; border-bottom: 1px solid rgba(0,95,105,0.08);
        }
        .jd-info-row:last-child { border-bottom: none; }
        .jd-info-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(0,95,105,0.08);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Sidebar rows accentués ── */
        .jd-info-row--accent .jd-info-icon {
          background: rgba(0,95,105,0.15);
        }
        .jd-info-row--accent .jd-info-icon svg { color: #005f69 !important; }
        .jd-info-row--accent .jd-info-value {
          color: #005f69;
          font-size: 14px;
          font-weight: 800;
        }
        .jd-info-row--accent .jd-info-label {
          color: #005f69;
          opacity: 0.7;
        }

        .jd-info-label { font-size: 11px; color: #7aaeb4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .jd-info-value { font-size: 13px; color: #1f2937; font-weight: 700; margin-top: 2px; }

        .jd-salary-card {
          background: linear-gradient(135deg, #005f69, #007d88);
          border-radius: 14px; padding: 20px;
          text-align: center; color: #fff; margin-top: 16px;
        }
        .jd-salary-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; margin-bottom: 6px; }
        .jd-salary-amount { font-size: 1.1rem; font-weight: 900; line-height: 1.2; }

        /* ── Floating Apply button ── */
        .jd-float-btn {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 100;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 100px;
          background: linear-gradient(135deg, #004a52, #005f69, #007a87);
          color: #fff; font-size: 15px; font-weight: 800;
          box-shadow: 0 4px 20px rgba(0,95,105,0.35);
          border: none; cursor: pointer;
          font-family: 'Archivo', sans-serif;
          white-space: nowrap; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .jd-float-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          animation: jdShineSweep 3s ease-in-out infinite;
        }
        .jd-float-btn::after {
          content: ''; position: absolute; inset: -3px; border-radius: 100px;
          background: linear-gradient(135deg, #004a52, #005f69, #007a87);
          z-index: -1; opacity: 0;
          animation: jdPulseGlow 2.5s ease-in-out infinite;
        }
        .jd-float-btn:hover {
          transform: translateX(-50%) translateY(-3px) scale(1.03);
          box-shadow: 0 8px 32px rgba(0,95,105,0.5);
        }
        .jd-float-icon { animation: jdIconBounce 2s ease-in-out infinite; display: flex; }
        .jd-float-btn:hover .jd-float-icon { animation: none; transform: translateY(2px); }
        @keyframes jdShineSweep  { 0%, 100% { left: -100%; } 50% { left: 100%; } }
        @keyframes jdPulseGlow   { 0%, 100% { opacity: 0; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.06); } }
        @keyframes jdIconBounce  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
        }
        @media (min-width: 640px) {
          .modal-overlay { align-items: center; padding: 20px; }
        }
        .modal-box {
          background: #fff;
          border-radius: 24px 24px 0 0;
          width: 100%; max-width: 600px;
          max-height: 92vh; overflow-y: auto;
          position: relative;
          scrollbar-width: thin; scrollbar-color: #b2e5ea #f4fafb;
          outline: none;
        }
        .modal-box:focus { outline: none; }
        .modal-overlay:focus { outline: none; }
        @media (min-width: 640px) { .modal-box { border-radius: 24px; } }

        .modal-close {
          position: sticky; top: 16px; float: right; margin: 16px 16px 0 0; z-index: 10;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.06); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #374151; transition: background 0.2s;
        }
        .modal-close:hover { background: rgba(0,0,0,0.12); }

        .modal-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(0,95,105,0.1);
        }
        .modal-header h2 { font-size: 1.1rem; font-weight: 900; color: #111827; margin: 0 0 4px; }
        .modal-header p { font-size: 13px; color: #7aaeb4; margin: 0; }

        .modal-body { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 16px; }

        .modal-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .modal-row-2 { grid-template-columns: 1fr; } }

        .modal-field { display: flex; flex-direction: column; gap: 5px; }
        .modal-field label { font-size: 12px; font-weight: 700; color: #374151; }
        .field-wrap { position: relative; }
        .field-wrap.has-icon input { padding-left: 36px; }
        .field-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #7aaeb4; display: flex; align-items: center;
        }
        .modal-field input, .modal-field textarea {
          width: 100%; padding: 10px 12px;
          border: 1.5px solid rgba(0,95,105,0.15);
          border-radius: 10px; font-size: 14px;
          font-family: 'Archivo', sans-serif; color: #111827;
          background: #fafeff; outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .modal-field input:focus, .modal-field textarea:focus { border-color: #005f69; }
        .modal-field input.field-error, .modal-field textarea.field-error { border-color: #e53e3e; }
        .field-err-msg {
          font-size: 11px; color: #e53e3e; font-weight: 600;
          display: flex; align-items: center; gap: 4px;
        }

        .file-drop {
          border: 2px dashed rgba(0,95,105,0.2);
          border-radius: 10px; padding: 16px;
          cursor: pointer; text-align: center;
          background: rgba(0,95,105,0.03);
          transition: border-color 0.2s, background 0.2s;
        }
        .file-drop:hover { border-color: #005f69; background: rgba(0,95,105,0.06); }
        .file-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #7aaeb4; font-size: 12px; }
        .file-selected { display: flex; align-items: center; gap: 8px; justify-content: center; font-size: 13px; color: #005f69; font-weight: 600; }

        .modal-error-band {
          display: flex; align-items: center; gap: 8px;
          background: #fff5f5; border: 1px solid #feb2b2;
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #e53e3e; font-weight: 500;
        }

        .modal-submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #005f69, #007d88);
          color: #fff; padding: 14px 24px; border-radius: 12px;
          font-size: 15px; font-weight: 800;
          border: none; cursor: pointer; width: 100%;
          font-family: 'Archivo', sans-serif;
          transition: opacity 0.2s;
        }
        .modal-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-submit-btn:not(:disabled):hover { opacity: 0.9; }

        .modal-success { padding: 48px 24px; text-align: center; }
        .modal-success-icon { margin-bottom: 16px; }
        .modal-success h3 { font-size: 1.3rem; font-weight: 900; color: #111827; margin: 0 0 10px; }
        .modal-success p { font-size: 14px; color: #5a7a80; line-height: 1.7; margin: 0 0 24px; }
        .modal-btn-close {
          padding: 10px 28px; border-radius: 100px;
          background: rgba(0,95,105,0.1); border: none;
          color: #005f69; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: 'Archivo', sans-serif;
          transition: background 0.2s;
        }
        .modal-btn-close:hover { background: rgba(0,95,105,0.18); }

        /* ── Not found ── */
        .jd-not-found { text-align: center; padding: 120px 24px; color: #7aaeb4; }
        .jd-not-found h2 { font-size: 1.5rem; font-weight: 900; color: #374151; margin-bottom: 8px; }

        @media (max-width: 640px) {
          .jd-hero { padding: 90px 20px 40px; }
          .jd-layout { padding: 20px 16px 0; gap: 16px; }
          .jd-float-btn { bottom: 16px; padding: 13px 24px; font-size: 14px; }
        }
      `}</style>

      <div className="jd-page">
        {/* ── Hero ── */}
        <div className="jd-hero">
          <div className="jd-hero-inner">
            <div className="jd-breadcrumb">
              <Link href="/recrutement">
                <ArrowLeft size={13} weight="bold" /> Offres d'emploi
              </Link>
              <span>/</span>
              <span className="jd-breadcrumb-current">{job.job_title}</span>
            </div>
            <div className="jd-hero-dept">{job.department}</div>
            <h1>{job.job_title}</h1>
            <div className="jd-hero-badges">
              <TypeBadge type={job.type} />
              <RemoteBadge remote={job.location.remote} />
              <span className="jd-hero-meta-item--accent">
                <MapPin size={14} weight="fill" /> {job.location.city},{" "}
                {job.location.country}
              </span>
              <span className="jd-hero-meta-item--accent">
                <Clock size={14} weight="fill" />{" "}
                {job.conditions.experience_years} année(s) d'expérience
              </span>
              <span className="jd-hero-meta-item--accent">
                <CalendarBlank size={14} weight="fill" /> Prise de poste :{" "}
                {new Date(job.conditions.start_date).toLocaleDateString(
                  "fr-FR",
                  { month: "long", year: "numeric" },
                )}
              </span>
            </div>
            <div className="jd-hero-actions">
              <ShareButton />
            </div>
          </div>
        </div>

        {/* ── Layout ── */}
        <div className="jd-layout">
          {/* Main content */}
          <div>
            {/* Description */}
            <div className="jd-card">
              <div className="jd-section-title">À propos du poste</div>
              <p className="jd-desc">{job.description}</p>
            </div>

            {/* Missions */}
            <div className="jd-card">
              <div className="jd-section-title">Vos missions</div>
              <ul className="jd-list">
                {job.missions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Profile */}
            <div className="jd-card">
              <div className="jd-section-title">Profil recherché</div>
              <ul className="jd-list">
                {job.profile.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="jd-card">
              <div className="jd-section-title">Compétences</div>
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Requises
                </p>
                <div className="jd-tags">
                  {job.skills_required.map((s) => (
                    <span key={s} className="jd-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {job.skills_bonus?.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#692c00",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Un plus
                  </p>
                  <div className="jd-tags">
                    {job.skills_bonus.map((s) => (
                      <span key={s} className="jd-tag jd-tag-bonus">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="jd-card">
              <div className="jd-section-title">Avantages</div>
              <div className="jd-tags">
                {job.benefits.map((b) => (
                  <span
                    key={b}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 100,
                      background: "#ecf5f5",
                      border: "1px solid rgba(0,95,105,0.2)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#005f69",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <CheckCircle
                      size={13}
                      weight="fill"
                      style={{ color: "#005f69", flexShrink: 0 }}
                    />{" "}
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="jd-card" style={{ position: "sticky", top: 90 }}>
              <div className="jd-section-title">Détails</div>

              {[
                {
                  icon: <Buildings size={16} style={{ color: "#005f69" }} />,
                  label: "Département",
                  value: job.department,
                  accent: false,
                },
                {
                  icon: <Briefcase size={16} style={{ color: "#005f69" }} />,
                  label: "Type de contrat",
                  value: job.type,
                  accent: false,
                },
                {
                  icon: <MapPin size={16} style={{ color: "#005f69" }} />,
                  label: "Localisation",
                  value: `${job.location.city}, ${job.location.country}`,
                  accent: true,
                },
                {
                  icon: <Clock size={16} style={{ color: "#005f69" }} />,
                  label: "Expérience",
                  value: job.conditions.experience_years,
                  accent: true,
                },
                {
                  icon: (
                    <CalendarBlank size={16} style={{ color: "#005f69" }} />
                  ),
                  label: "Prise de poste",
                  value: new Date(job.conditions.start_date).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" },
                  ),
                  accent: true,
                },
              ].map(({ icon, label, value, accent }) => (
                <div
                  key={label}
                  className={`jd-info-row${accent ? " jd-info-row--accent" : ""}`}
                >
                  <div className="jd-info-icon">{icon}</div>
                  <div>
                    <div className="jd-info-label">{label}</div>
                    <div className="jd-info-value">{value}</div>
                  </div>
                </div>
              ))}

              <div className="jd-salary-card">
                <div className="jd-salary-label">Rémunération mensuelle</div>
                <div className="jd-salary-amount">{salaryText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating CTA ── */}
      <button className="jd-float-btn" onClick={() => setModalOpen(true)}>
        <span className="jd-float-icon" style={{ display: "flex" }}>
          <Briefcase size={18} weight="fill" />
        </span>
        Postuler à cette offre
      </button>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <ApplicationModal job={job} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4fafb",
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <div style={{ height: 280, background: "#9dcccc" }} />
      <div
        style={{
          maxWidth: 900,
          margin: "40px auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 180,
              borderRadius: 18,
              background:
                "linear-gradient(90deg, #e0f5f7 25%, #f4fafb 50%, #e0f5f7 75%)",
              backgroundSize: "200% 100%",
              animation: "skeletonShimmer 1.5s infinite",
              marginBottom: 20,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="jd-not-found">
      <style>{`.jd-not-found { text-align: center; padding: 140px 24px; font-family: Archivo, sans-serif; }`}</style>
      <h2>Offre introuvable</h2>
      <p style={{ color: "#7aaeb4", marginBottom: 24 }}>
        Cette offre n'existe pas ou a été pourvue.
      </p>
      <Link
        href="/recrutement"
        style={{ color: "#005f69", fontWeight: 700, textDecoration: "none" }}
      >
        <ArrowLeft size={13} weight="bold" /> Retour aux offres
      </Link>
    </div>
  );
}
