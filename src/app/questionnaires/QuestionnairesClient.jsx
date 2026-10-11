"use client";

import { ArrowUpRight, CalendarDays, ChartColumn, Clock, MessageCircle, Search, ShieldCheck, Users } from "@/components/icons";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { fetchQuestionnaires } from "@/app/services/questionnairesApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { PHONE_NUMBER } from "@/config/constants";

const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, "")}?text=${encodeURIComponent(
  "Bonjour, j'ai une question concernant vos questionnaires en ligne."
)}`;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function QuestionnaireCard({ q }) {
  return (
    <Link
      href="/sondage?utm_source=site&utm_medium=popup"
      className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-colors duration-200 hover:border-brand"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-media bg-brand-soft text-brand">
          <ChartColumn className="size-5" aria-hidden />
        </span>
        <span className="tk-label inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[0.75rem] text-brand">
          <ShieldCheck className="size-3.5" aria-hidden />
          Anonyme
        </span>
      </div>

      <h2 className="tk-title mt-4 text-xl">{q.title}</h2>
      <p className="mt-1.5 text-[0.9375rem] text-ink-2">{q.description}</p>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-ink-2">
        <li className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatDate(q.createdAt)}
        </li>
        <li className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />~{q.estimatedMinutes} min
        </li>
        <li className="flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {q.totalResponses} participants
        </li>
      </ul>

      <span className="tk-label mt-auto flex items-center gap-1 pt-5 text-[0.9375rem] text-brand">
        Participer
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5" aria-hidden>
      <div className="tk-skeleton size-11" />
      <div className="tk-skeleton h-5 w-2/3" />
      <div className="tk-skeleton h-3.5 w-full" />
      <div className="tk-skeleton h-3.5 w-5/6" />
      <div className="tk-skeleton mt-2 h-3.5 w-1/2" />
    </li>
  );
}

export default function QuestionnairesClient() {
  const searchId = useId();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuestionnaires().then(setQuestionnaires).finally(() => setLoading(false));
  }, []);

  const filtered = questionnaires.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = questionnaires.filter((q) => q.status === "active").length;

  const stats = [
    { icon: Users, value: "50+", label: "Participants" },
    { icon: ChartColumn, value: loading ? "…" : String(activeCount), label: "Sondages actifs" },
    { icon: Clock, value: "< 5 min", label: "Par sondage" },
  ];

  return (
    <div className="pb-16">
      <PageHeader
        title="Votre voix façonne nos prochains services"
        intro="Participez à nos sondages anonymes et contribuez directement à l'évolution de Ticketché. Chaque réponse compte et façonne les services de demain."
      />

      <div className="tk-shell mt-8">
        <ul className="grid gap-2 xs:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
              <Icon className="size-5 shrink-0 text-brand" aria-hidden />
              <p className="min-w-0 text-[0.8125rem] text-ink-2">
                <span className="tk-title block text-xl text-ink">{value}</span>
                {label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-80">
            <label htmlFor={searchId} className="sr-only">
              Rechercher un questionnaire
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <Input
              id={searchId}
              type="search"
              className="pl-10"
              placeholder="Rechercher un questionnaire…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p aria-live="polite" className="text-[0.875rem] text-ink-2">
            {loading ? "Chargement…" : `${filtered.length} questionnaire${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </ul>
        ) : filtered.length === 0 ? (
          <div className="mt-4 rounded-card border border-line bg-surface px-5 py-10 text-center">
            <h2 className="tk-title text-xl">Aucun questionnaire pour le moment</h2>
            <p className="mt-1.5 text-ink-2">Revenez bientôt : de nouveaux sondages seront publiés prochainement.</p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {filtered.map((q) => (
              <li key={q.id}>
                <QuestionnaireCard q={q} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="tk-title text-xl">100 % anonyme & confidentiel</h2>
            <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] text-ink-2">
              Vos réponses ne sont jamais associées à votre identité. Elles servent uniquement à améliorer nos
              services pour vous.
            </p>
          </div>
          <Button href={WHATSAPP_URL} variant="outline" className="shrink-0">
            <MessageCircle className="size-4" aria-hidden />
            Une question ?
          </Button>
        </div>
      </div>
    </div>
  );
}
