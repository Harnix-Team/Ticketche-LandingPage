"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBar,
  Clock,
  Users,
  CalendarBlank,
  ArrowUpRight,
  CheckCircle,
  Star,
  MagnifyingGlass,
  Sparkle,
  ShieldCheck,
} from "@phosphor-icons/react";
import { fetchQuestionnaires } from "@/app/services/questionnairesApi";
import { PHONE_NUMBER } from "@/config/constants";

/* ─── Star Clusters ─────────────────────────────────────── */
const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }] },
  { cx: "91%", cy: "5%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }] },
  { cx: "1%",  cy: "45%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "94%", cy: "42%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
  { cx: "48%", cy: "2%",  stars: [{ x: 0, y: 0, size: 8,  opacity: 0.22, anim: 1, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "5%",  cy: "78%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 2, delay: "0.2s", dur: "2.9s", color: "#00818f" }] },
  { cx: "88%", cy: "75%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 0, delay: "0.4s", dur: "3.1s", color: "#00515a" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div
          key={ci}
          style={{ position:"absolute", left:cluster.cx, top:cluster.cy, width:0, height:0, zIndex:0, pointerEvents:"none" }}
        >
          {cluster.stars.map((s, si) => (
            <div
              key={si}
              style={{
                position:"absolute", left:s.x, top:s.y,
                transform:"translate(-50%,-50%)", opacity:s.opacity,
                animation:`qStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
                filter:`drop-shadow(0 0 3px ${s.color}88)`,
              }}
            >
              <Star weight="fill" style={{ width:s.size, height:s.size, color:s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── Helpers ─────────────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });
}

/* ─── Card ────────────────────────────────────────────────── */
function QuestionnaireCard({ q, index }) {
  return (
    <Link href="/sondage" className="qcard-wrap" style={{ textDecoration:"none" }}>
      <motion.div
        className="qcard-wrap-inner"
        initial={{ opacity:0, y:32 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.45, delay:index*0.12, ease:[0.22,1,0.36,1] }}
      >
      <div className="qcard">
        <div className="qcard-glow" aria-hidden />
        <div className="qcard-accent" aria-hidden />

        <div className="qcard-header">
          <div className="qcard-icon"><ChartBar size={22} weight="fill" /></div>
          <span className="qcard-badge"><ShieldCheck size={11} weight="fill" />Anonyme</span>
        </div>

        <div className="qcard-body">
          <h2 className="qcard-title">{q.title}</h2>
          <p className="qcard-desc">{q.description}</p>
        </div>

        <div className="qcard-meta">
          <span className="qcard-chip"><CalendarBlank size={12} weight="fill" />{formatDate(q.createdAt)}</span>
          <span className="qcard-chip"><Clock size={12} weight="fill" />~{q.estimatedMinutes} min</span>
          <span className="qcard-chip"><Users size={12} weight="fill" />{q.totalResponses} participants</span>
        </div>

        <div className="qcard-cta">
          <span>Participer</span>
          <div className="qcard-cta-arrow"><ArrowUpRight size={14} weight="bold" /></div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}

/* ─── Skeleton ────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="qcard">
      <div className="qcard-accent" aria-hidden />
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div className="q-skel" style={{ width:48, height:48, borderRadius:14 }} />
        <div className="q-skel" style={{ width:"70%", height:20, borderRadius:6 }} />
        <div className="q-skel" style={{ width:"100%", height:14, borderRadius:6 }} />
        <div className="q-skel" style={{ width:"85%",  height:14, borderRadius:6 }} />
        <div className="q-skel" style={{ width:"55%",  height:14, borderRadius:6, marginTop:8 }} />
        <div className="q-skel" style={{ width:"100%", height:44, borderRadius:12, marginTop:16 }} />
      </div>
    </div>
  );
}

/* ─── Empty ───────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div className="qlist-empty" initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <Sparkle size={44} weight="fill" style={{ color:"#00949f", marginBottom:16 }} />
      <h3>Aucun questionnaire pour le moment</h3>
      <p>Revenez bientôt — de nouveaux sondages seront publiés prochainement.</p>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");

  useEffect(() => {
    fetchQuestionnaires().then(setQuestionnaires).finally(() => setLoading(false));
  }, []);

  const filtered = questionnaires.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = questionnaires.filter((q) => q.status === "active").length;

  return (
    <div className="qlist-page">

      {/* ── HERO ── */}
      <div className="qlist-hero">
        <StarClusters />
        <div className="qlist-hero-inner">
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>
            <div className="qlist-hero-badge">
              <ChartBar size={12} weight="fill" />
              Sondages &amp; Questionnaires
            </div>
            <h1>
              Votre voix&nbsp;façonne<br />
              nos prochains services
            </h1>
            <p className="qlist-hero-sub">
              Participez à nos sondages anonymes et contribuez directement à l&apos;évolution
              de Ticketché. Chaque réponse compte et façonne les services de demain.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <motion.div
        className="qlist-stats"
        initial={{ opacity:0, y:-10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4, delay:0.15 }}
      >
        {[
          { icon: Users,    val: "50+",                              lbl: "Participants"    },
          { icon: ChartBar, val: loading ? "—" : String(activeCount), lbl: "Sondages actifs" },
          { icon: Clock,    val: "< 5 min",                          lbl: "Par sondage"     },
        ].map(({ icon: Icon, val, lbl }) => (
          <div key={lbl} className="qlist-stat">
            <div className="qlist-stat-icon"><Icon size={17} weight="fill" /></div>
            <div>
              <div className="qlist-stat-val">{val}</div>
              <div className="qlist-stat-lbl">{lbl}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── BODY ── */}
      <div className="qlist-body">

        {/* Search */}
        <div className="qlist-search-row">
          <div className="qlist-search">
            <MagnifyingGlass size={16} weight="bold" style={{ color:"#7aaeb4", flexShrink:0 }} />
            <input
              type="text"
              placeholder="Rechercher un questionnaire…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="qlist-count">
            {loading ? "Chargement…" : `${filtered.length} questionnaire${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="qlist-grid">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="qlist-grid">
            <AnimatePresence>
              {filtered.map((q, i) => (
                <QuestionnaireCard key={q.id} q={q} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="qlist-cta-band"
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5 }}
        >
          <div>
            <h2>100 % anonyme &amp; confidentiel</h2>
            <p>Vos réponses ne sont jamais associées à votre identité. Elles servent uniquement à améliorer nos services pour vous.</p>
          </div>
          <a
            href={`https://wa.me/${PHONE_NUMBER.replace(/\s/g, "")}?text=${encodeURIComponent("Bonjour, j'ai une question concernant vos questionnaires en ligne.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="qlist-cta-btn"
          >
            <CheckCircle size={16} weight="fill" />
            Une question ?
          </a>
        </motion.div>
      </div>
    </div>
  );
}