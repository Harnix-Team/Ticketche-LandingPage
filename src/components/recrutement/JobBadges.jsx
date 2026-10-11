import { Building2, Globe, House, MapPin, Motorbike } from "@/components/icons";

const BADGE = "tk-label inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[0.75rem]";

const TYPE_TONES = {
  CDD: "border-clay/40 text-clay",
  Stage: "border-line-strong text-ink-2",
};

export function TypeBadge({ type }) {
  return <span className={`${BADGE} ${TYPE_TONES[type] ?? "border-line-strong text-brand"}`}>{type}</span>;
}

const REMOTE_MODES = {
  hybride: { icon: House, label: "Hybride" },
  présentiel: { icon: Building2, label: "Présentiel" },
  "full-remote": { icon: Globe, label: "Full Remote" },
  terrain: { icon: Motorbike, label: "Terrain" },
};

export function RemoteBadge({ remote }) {
  const { icon: Icon, label } = REMOTE_MODES[remote] ?? { icon: MapPin, label: remote };

  return (
    <span className={`${BADGE} border-transparent bg-brand-soft text-brand`}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

/** « 1 année », « 3 années » : l'API renvoie tantôt un nombre, tantôt une chaîne. */
export function experienceYears(years) {
  return `${years} ${Number(years) <= 1 ? "année" : "années"}`;
}
