import Link from "next/link";

const BASE =
  "tk-label inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] transition-colors duration-200";

// Puce active en brun, inactive en gris froid : meme code couleur que les puces de l'app.
const STATE = {
  true: "bg-clay text-white dark:text-[#2a1400]",
  false: "bg-sunken text-ink-2 hover:text-ink",
};

export function Chip({ active = false, icon: Icon, count, href, children, ...props }) {
  const content = (
    <>
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
      {count !== undefined && <span className="opacity-70">{count}</span>}
    </>
  );
  const className = `${BASE} ${STATE[active]}`;

  if (href) {
    return (
      <Link href={href} scroll={false} className={className} aria-current={active ? "true" : undefined} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} aria-pressed={active} {...props}>
      {content}
    </button>
  );
}
