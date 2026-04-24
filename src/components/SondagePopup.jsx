"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChartBar } from "@phosphor-icons/react";

/* B2 — Pop-up à déclenchement intelligent */
const COOKIE_KEY = "tc_popup_dismissed";
const EXCLUDED   = ["/sondage", "/questionnaires", "/admin"];

export default function SondagePopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const isExcluded = EXCLUDED.some((p) => pathname?.startsWith(p));

  /* B2 — Ne pas déclencher si cookie 30 jours ou sondage déjà soumis */
  function hasCookie() {
    if (typeof document === "undefined") return false;
    return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_KEY}=`));
  }

  function hasDone() {
    try { return !!localStorage.getItem("ticketche_sondage_done"); } catch { return false; }
  }

  function dismiss() {
    setVisible(false);
    /* B2 — cookie 30 jours */
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    document.cookie = `${COOKIE_KEY}=1; expires=${exp.toUTCString()}; path=/`;
  }

  function tryShow() {
    if (!hasCookie() && !hasDone() && !isExcluded) setVisible(true);
  }

  useEffect(() => {
    if (isExcluded || hasCookie() || hasDone()) return;

    /* B2 — Déclencheur 1 : 30 secondes de présence sur la page */
    timerRef.current = setTimeout(tryShow, 30000);

    /* B2 — Déclencheur 2 : exit intent — déplacement souris vers barre d'adresse */
    const onMouseLeave = (e) => {
      if (e.clientY <= 0) {
        tryShow();
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isExcluded]);

  if (!visible || isExcluded) return null;

  return (
    <div
      className="tc-popup-overlay"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="tc-popup">
        <button onClick={dismiss} className="tc-popup__close" aria-label="Fermer">
          <X size={16} weight="bold" />
        </button>

        <div className="tc-popup__icon">
          <ChartBar size={28} weight="fill" />
        </div>

        {/* B2 — Titre exact */}
        <h3 className="tc-popup__title">Aidez-nous à améliorer vos transports</h3>

        {/* B2 — Corps exact */}
        <p className="tc-popup__body">
          TicketChé prépare un service de bus et de covoiturage sur{" "}
          <strong>Cotonou ↔ Abomey-Calavi</strong>. Votre avis compte —{" "}
          <strong>3 minutes, anonyme, gratuit.</strong>
        </p>

        {/* B2 — CTA exact + UTM popup_site */}
        <Link
          href="/sondage?utm_source=site&utm_medium=popup&utm_campaign=enquete2026"
          className="tc-popup__cta"
          onClick={dismiss}
        >
          Participer au sondage
        </Link>

        {/* B2 — lien "Non merci" */}
        <button onClick={dismiss} className="tc-popup__skip">
          Non merci
        </button>
      </div>
    </div>
  );
}