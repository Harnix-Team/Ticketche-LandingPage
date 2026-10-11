"use client";

import { ArrowUpRight, Banknote, Building2, Clock, Headset, MapPin, Monitor, Paintbrush, Search, SearchX, TrendingUp } from "@/components/icons";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { fetchJobs, formatSalaryText } from "@/app/services/jobsApi";
import { ApplicationModal } from "@/components/recrutement/ApplicationModal";
import { experienceYears, RemoteBadge, TypeBadge } from "@/components/recrutement/JobBadges";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";

const DEPARTMENT_ICONS = {
  Technologie: Monitor,
  "Service Client": Headset,
  Commercial: TrendingUp,
  "Produit & Design": Paintbrush,
};

const SPONTANEOUS_JOB = {
  id: null,
  job_title: "Candidature spontanée",
  department: "Ticketché",
  location: { city: "Cotonou", country: "Bénin", remote: "hybride" },
};

function JobCard({ job }) {
  const DepartmentIcon = DEPARTMENT_ICONS[job.department] ?? Building2;
  const salaryText = formatSalaryText(job.remuneration, "Selon profil");

  return (
    <li>
      <Link
        href={`/recrutement/${job.slug}/`}
        className="group flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-strong"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-media bg-brand-soft text-brand">
            <DepartmentIcon className="size-5" aria-hidden />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <TypeBadge type={job.type} />
            <RemoteBadge remote={job.location.remote} />
          </div>
        </div>

        <div className="flex-1">
          <p className="tk-label text-[0.8125rem] text-brand">{job.department}</p>
          <h2 className="tk-title mt-1 text-[1.25rem] text-ink">{job.job_title}</h2>
          <p className="mt-2 text-[0.9375rem] text-ink-2">
            {job.description.length > 110 ? job.description.slice(0, 110) + "…" : job.description}
          </p>
        </div>

        <ul className="flex flex-col gap-1.5 text-[0.875rem] text-ink-2">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
            {job.location.city}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
            {experienceYears(job.conditions.experience_years)} d&apos;expérience
          </li>
          <li className="tk-label flex items-start gap-2 text-ink">
            <Banknote className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            {salaryText}
          </li>
        </ul>

        <span className="tk-label flex items-center gap-1 border-t border-line pt-3.5 text-[0.875rem] text-brand">
          Voir l&apos;offre
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export default function RecrutementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const searchId = useId();

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

  const stats = [
    { label: "Postes ouverts", value: jobs.length },
    { label: "Siège social", value: "Cotonou" },
    { label: "Fondée en", value: "2024" },
    { label: "Utilisateurs actifs", value: "+1 000" },
  ];

  return (
    <>
      <PageHeader
        title="Rejoignez l'équipe qui réinvente la mobilité au Bénin"
        intro="Construisons ensemble l'avenir de la mobilité urbaine. Découvrez nos offres d'emploi et participez à une aventure qui transforme des milliers de vies chaque jour."
      />

      <div className="tk-shell flex flex-col gap-8 pt-8 pb-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5 md:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[0.8125rem] text-ink-2">{label}</dt>
              <dd className="tk-title mt-0.5 text-[1.5rem] text-brand">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-3">
          <div role="search" className="relative max-w-[34rem]">
            <label htmlFor={searchId} className="sr-only">
              Rechercher une offre
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <Input
              id={searchId}
              type="search"
              className="pl-10"
              placeholder="Rechercher un poste, département, ville…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div
            role="group"
            aria-label="Département"
            className="-mx-[clamp(1rem,4vw,2.5rem)] flex gap-2 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] tk-no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {departments.map((department) => (
              <Chip key={department} active={filter === department} onClick={() => setFilter(department)}>
                {department}
              </Chip>
            ))}
          </div>
        </div>

        {loading ? (
          <div role="status" className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            <span className="sr-only">Chargement des offres</span>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="tk-skeleton h-72" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-8">
            <SearchX className="size-9 text-ink-3" aria-hidden />
            <div>
              <h2 className="tk-title text-xl">Aucun poste trouvé</h2>
              <p className="mt-1.5 text-ink-2">Essayez d&apos;autres mots-clés ou supprimez les filtres.</p>
            </div>
          </div>
        ) : (
          <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ul>
        )}

        {!loading && (
          <section className="flex flex-col items-start gap-5 rounded-panel border border-line bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="tk-title text-[1.5rem]">Vous ne trouvez pas votre bonheur ?</h2>
              <p className="mt-1.5 max-w-[56ch] text-ink-2">
                Envoyez-nous une candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels.
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="shrink-0">
              Candidature spontanée
            </Button>
          </section>
        )}
      </div>

      {modalOpen && <ApplicationModal job={SPONTANEOUS_JOB} onClose={() => setModalOpen(false)} />}
    </>
  );
}
