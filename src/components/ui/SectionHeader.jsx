import { ArrowUpRight } from "@/components/icons";
import Link from "next/link";

/**
 * Titre de rubrique. `sweep` reprend l'animation des rubriques recommandees de l'app :
 * la pastille se remplit du degrade de marque a intervalles reguliers.
 */
export function SectionHeader({ title, icon: Icon, sweep = false, description, href, hrefLabel = "Tout voir", as: Tag = "h2" }) {
  return (
    <div className="tk-shell mb-4 flex items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3" data-icon-trigger>
        {Icon && (
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${sweep ? "tk-sweep" : "bg-brand-soft text-brand"}`}>
            <Icon className="size-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <Tag className="tk-title text-[clamp(1.375rem,2.4vw,1.875rem)] leading-none">{title}</Tag>
          {description && <p className="mt-1 max-w-[60ch] text-[0.875rem] leading-snug text-ink-2">{description}</p>}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="tk-label group/more flex shrink-0 items-center gap-1 pb-1 text-[0.875rem] text-brand underline-offset-4 hover:underline"
        >
          {hrefLabel}
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover/more:translate-x-0.5 group-hover/more:-translate-y-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
