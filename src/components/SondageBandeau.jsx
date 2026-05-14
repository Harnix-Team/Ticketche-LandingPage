"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, MegaphoneSimple } from "@phosphor-icons/react";

/* B2 — Bandeau flottant bas de page
   Logique de retry :
   - Max 3 affichages par session (sessionStorage → remis à zéro à la fermeture du navigateur)
   - À chaque fermeture sans soumission : on attend 1 minute puis on réaffiche
   - Si sondage déjà soumis (localStorage) → on n'affiche plus jamais
*/
const COUNT_KEY  = "tc_bandeau_count";   // nombre de fois que l'utilisateur a fermé
const EXCLUDED   = ["/sondage", "/questionnaires", "/admin"];
const MAX_COUNT  = 3;
const RETRY_MS   = 60_000; // 1 minute

export default function SondageBandeau() {
  const pathname   = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef   = useRef(null);

  const isExcluded = EXCLUDED.some((p) => pathname?.startsWith(p));

  /* Nombre de fermetures déjà enregistrées cette session */
  function getCount() {
    try { return parseInt(sessionStorage.getItem(COUNT_KEY) || "0", 10); }
    catch { return 0; }
  }

  function incrementCount() {
    try { sessionStorage.setItem(COUNT_KEY, String(getCount() + 1)); }
    catch (_) {}
  }

  /* Sondage déjà soumis → jamais réafficher */
  function hasDone() {
    try { return !!localStorage.getItem("ticketche_sondage_done"); }
    catch { return false; }
  }

  /* Fermeture :
     - Si sondage soumis → rien à faire, le bandeau ne reviendra plus (hasDone guard)
     - Sinon → incrémenter le compteur
       - compteur < MAX : planifier un retry dans 1 minute
       - compteur >= MAX : on ne planifie rien → plus d'affichage cette session
  */
  function dismiss() {
    setVisible(false);
    clearTimeout(timerRef.current);

    if (hasDone()) return; // sondage soumis entre-temps → on s'arrête

    const newCount = getCount() + 1;
    incrementCount();

    if (newCount < MAX_COUNT) {
      timerRef.current = setTimeout(() => {
        if (!hasDone()) setVisible(true);
      }, RETRY_MS);
    }
    // newCount >= MAX_COUNT → on ne planifie rien → fin pour cette session
  }

  /* Affichage initial : 1,8 s après le chargement de la page
     Conditions : page non exclue + sondage non soumis + quota non atteint
  */
  useEffect(() => {
    if (isExcluded || hasDone() || getCount() >= MAX_COUNT) return;

    timerRef.current = setTimeout(() => {
      if (!hasDone()) setVisible(true);
    }, 1800);

    return () => clearTimeout(timerRef.current);
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