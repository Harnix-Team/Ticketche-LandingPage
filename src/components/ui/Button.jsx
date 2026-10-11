import Link from "next/link";

const BASE =
  "tk-label inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-out-soft active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";

const VARIANTS = {
  // L'or est reserve a l'action qui mene a l'application : une seule par ecran.
  gold: "bg-gold text-on-gold hover:brightness-105",
  brand: "bg-brand-fill text-white hover:brightness-110",
  soft: "bg-brand-soft text-brand hover:bg-sunken",
  outline: "border border-line-strong text-ink hover:border-brand hover:text-brand",
  ghost: "text-ink-2 hover:bg-sunken hover:text-ink",
  onDark: "bg-white/15 text-white hover:bg-white/25",
};

const SIZES = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
  icon: "size-10",
};

export function Button({ href, variant = "brand", size = "md", className = "", external = false, ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (!href) return <button type="button" className={classes} {...props} />;
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return <a href={href} className={classes} {...(/^https?:/.test(href) && { target: "_blank", rel: "noopener noreferrer" })} {...props} />;
  }

  return <Link href={href} className={classes} {...props} />;
}
