"use client";

import { Briefcase, Building2, CalendarDays, Check, CircleCheck, Clock, MapPin, SearchX, Share2 } from "@/components/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchJobBySlug, formatJobDate, formatSalaryText } from "@/app/services/jobsApi";
import { Section } from "@/components/detail/Sections";
import { ApplicationModal } from "@/components/recrutement/ApplicationModal";
import { experienceYears, RemoteBadge, TypeBadge } from "@/components/recrutement/JobBadges";
import { Button } from "@/components/ui/Button";

function ShareButton({ className = "" }) {
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
    <Button variant="outline" onClick={handleShare} className={className}>
      {copied ? <Check className="size-[1.125rem] text-ok" aria-hidden /> : <Share2 className="size-[1.125rem]" aria-hidden />}
      <span aria-live="polite">{copied ? "Lien copié !" : "Partager"}</span>
    </Button>
  );
}

function BulletList({ items }) {
  return (
    <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5 text-ink-2 marker:text-brand">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function Tags({ items, tone = "bg-sunken text-ink-2" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className={`tk-label rounded-media px-3 py-1.5 text-[0.8125rem] ${tone}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function JobDetailPage() {
  const { slug } = useParams();
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

  const salaryText = formatSalaryText(job.remuneration, "Rémunération selon profil");
  const place = `${job.location.city}, ${job.location.country}`;
  const experience = experienceYears(job.conditions.experience_years);
  const details = [
    { icon: Building2, label: "Département", value: job.department },
    { icon: Briefcase, label: "Type de contrat", value: job.type },
    { icon: MapPin, label: "Localisation", value: place },
    { icon: Clock, label: "Expérience", value: experience },
    {
      icon: CalendarDays,
      label: "Prise de poste",
      value: formatJobDate(job.conditions.start_date, { day: "numeric", month: "long", year: "numeric" }),
    },
  ];

  return (
    <>
      <div className="tk-shell pt-5 pb-28 lg:pb-8">
        <nav aria-label="Fil d'Ariane" className="tk-label mb-6 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
          <Link href="/recrutement/" className="hover:text-brand">
            Offres d&apos;emploi
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-ink-2">
            {job.job_title}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-x-14">
          <header className="min-w-0">
            <ul className="mb-3 flex flex-wrap gap-1.5">
              <li>
                <TypeBadge type={job.type} />
              </li>
              <li>
                <RemoteBadge remote={job.location.remote} />
              </li>
            </ul>
            <h1 className="tk-display text-[clamp(2.25rem,5vw,4rem)]">{job.job_title}</h1>
            <p className="tk-label mt-3 text-brand">{job.department}</p>
            {/* Sur téléphone, la carte « Détails » suit immédiatement et porte les mêmes informations. */}
            <ul className="mt-4 hidden flex-col gap-2 text-ink-2 lg:flex">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-[1.125rem] shrink-0 text-brand" aria-hidden />
                {place}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-[1.125rem] shrink-0 text-brand" aria-hidden />
                {experience} d&apos;expérience
              </li>
              <li className="flex items-center gap-2.5">
                <CalendarDays className="size-[1.125rem] shrink-0 text-brand" aria-hidden />
                Prise de poste : {formatJobDate(job.conditions.start_date, { month: "long", year: "numeric" })}
              </li>
            </ul>
            <ShareButton className="mt-5" />
          </header>

          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-6 lg:sticky lg:top-24">
              <h2 className="tk-title text-[1.25rem]">Détails</h2>
              <ul className="flex flex-col gap-3.5">
                {details.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-media bg-brand-soft text-brand">
                      <Icon className="size-[1.125rem]" aria-hidden />
                    </span>
                    <p className="min-w-0 text-[0.9375rem]">
                      <span className="block text-[0.8125rem] text-ink-3">{label}</span>
                      <span className="tk-label text-ink">{value}</span>
                    </p>
                  </li>
                ))}
              </ul>
              <div className="rounded-card bg-brand-soft p-4">
                <p className="text-[0.8125rem] text-ink-2">Rémunération mensuelle</p>
                <p className="tk-title mt-1 text-[1.25rem] text-brand">{salaryText}</p>
              </div>
              <div className="hidden lg:block">
                <Button size="lg" className="w-full" onClick={() => setModalOpen(true)}>
                  <Briefcase className="size-[1.125rem]" aria-hidden />
                  Postuler à cette offre
                </Button>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-10 lg:col-start-1">
            <Section id="poste" title="À propos du poste">
              <p className="max-w-[68ch] whitespace-pre-line text-ink-2">{job.description}</p>
            </Section>

            <Section id="missions" title="Vos missions">
              <BulletList items={job.missions} />
            </Section>

            <Section id="profil" title="Profil recherché">
              <BulletList items={job.profile} />
            </Section>

            <Section id="competences" title="Compétences">
              <h3 className="tk-label mb-2.5 text-[0.9375rem] text-ink">Requises</h3>
              <Tags items={job.skills_required} />
              {job.skills_bonus?.length > 0 && (
                <>
                  <h3 className="tk-label mt-5 mb-2.5 text-[0.9375rem] text-clay">Un plus</h3>
                  <Tags items={job.skills_bonus} tone="bg-clay-soft text-clay" />
                </>
              )}
            </Section>

            <Section id="avantages" title="Avantages">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {job.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-ink-2">
                    <CircleCheck className="mt-0.5 size-[1.125rem] shrink-0 text-ok" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </div>

      <div
        data-sticky-cta
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        <Button className="w-full" onClick={() => setModalOpen(true)}>
          <Briefcase className="size-[1.125rem]" aria-hidden />
          Postuler à cette offre
        </Button>
      </div>

      {modalOpen && <ApplicationModal job={job} onClose={() => setModalOpen(false)} />}
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div role="status" className="tk-shell pt-5 pb-8">
      <span className="sr-only">Chargement de l&apos;offre</span>
      <div className="tk-skeleton h-4 w-48" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-x-14">
        <div className="flex flex-col gap-4">
          <div className="tk-skeleton h-7 w-40" />
          <div className="tk-skeleton h-24 max-w-[32rem]" />
          <div className="tk-skeleton h-44" />
          <div className="tk-skeleton h-44" />
        </div>
        <div className="tk-skeleton h-96" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="tk-shell flex flex-col items-start gap-4 py-16 lg:py-24">
      <SearchX className="size-9 text-ink-3" aria-hidden />
      <div>
        <h1 className="tk-display text-[clamp(2.25rem,5vw,4rem)]">Offre introuvable</h1>
        <p className="mt-3 text-ink-2">Cette offre n&apos;existe pas ou a été pourvue.</p>
      </div>
      <Button href="/recrutement/" variant="soft">
        Retour aux offres
      </Button>
    </div>
  );
}
