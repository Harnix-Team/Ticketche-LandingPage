/** En-tete des pages de contenu (a propos, contact, juridique, recrutement). */
export function PageHeader({ title, intro, children, className = "" }) {
  return (
    <header className={`tk-shell pt-8 lg:pt-14 ${className}`}>
      <h1 className="tk-display max-w-[34ch] text-[clamp(2.5rem,6vw,4.5rem)]">{title}</h1>
      {intro && <p className="mt-4 max-w-[60ch] text-[1.0625rem] text-ink-2">{intro}</p>}
      {children}
    </header>
  );
}
