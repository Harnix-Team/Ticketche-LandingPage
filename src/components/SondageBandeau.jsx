"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, MegaphoneSimple } from "@phosphor-icons/react";

/* B2 — Bandeau flottant bas de page, permanent sur toutes les pages sauf /sondage */
// "réapparaît à la session suivante" → sessionStorage (effacé à la fermeture du navigateur)
const SESSION_KEY = "tc_bandeau_dismissed";
const EXCLUDED = ["/sondage", "/questionnaires", "/admin"];

export default function SondageBandeau() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isExcluded = EXCLUDED.some((p) => pathname?.startsWith(p));

  /* sessionStorage — effacé automatiquement à la fermeture du navigateur */
  function hasDismissed() {
    try { return !!sessionStorage.getItem(SESSION_KEY); } catch { return false; }
  }

  function hasDone() {
    try { return !!localStorage.getItem("ticketche_sondage_done"); } catch { return false; }
  }

  /* Fermeture : sessionStorage → réapparaît à la prochaine session (fermeture navigateur) */
  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {}
  }

  useEffect(() => {
    if (isExcluded || hasDismissed() || hasDone()) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, [isExcluded]);

  if (!visible || isExcluded) return null;

  return (
    <div className="tc-bandeau">
      <div className="tc-bandeau__inner">
        <MegaphoneSimple size={18} weight="fill" className="tc-bandeau__icon" />

        {/* B2 — texte exact du cahier des charges */}
        <p className="tc-bandeau__text">
          <span className="tc-bandeau__text--desktop">
            Vous faites Cotonou ↔ Calavi tous les jours ?{" "}
          </span>
          Donnez votre avis — 3 min suffisent.
        </p>

        <div className="tc-bandeau__actions">
          {/* B2 — CTA #E8A020, URL avec UTM bandeau_site */}
          <Link
            href="/sondage?utm_source=site&utm_medium=bandeau&utm_campaign=enquete2026"
            className="tc-bandeau__cta"
            onClick={dismiss}
          >
            Répondre au sondage
          </Link>
          {/* B2 — fermeture par croix */}
          <button onClick={dismiss} className="tc-bandeau__close" aria-label="Fermer">
            <X size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}