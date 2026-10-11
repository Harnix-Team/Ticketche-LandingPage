import { LoaderCircle } from "@/components/icons";

/** Libellé long dans un bouton : il passe à la ligne au lieu de déborder sur un petit écran. */
export const WRAP_BUTTON = "h-auto! min-h-11 whitespace-normal! py-2.5 text-center";

const NOTICE_TONES = {
  info: "border-line bg-brand-soft text-ink",
  warn: "border-line bg-clay-soft text-clay",
  error: "border-danger/40 bg-surface text-danger",
};

/** Colonne centrée des formulaires : 40rem au plus. */
export function FormShell({ children, narrow = false }) {
  return (
    <div className="tk-shell pt-8 pb-16 lg:pt-14">
      <div className={`mx-auto w-full ${narrow ? "max-w-[28rem]" : "max-w-[40rem]"}`}>{children}</div>
    </div>
  );
}

export function LoadingState({ label }) {
  return (
    <div role="status" className="tk-shell flex min-h-[50dvh] flex-col items-center justify-center gap-3 text-ink-2">
      <LoaderCircle className="size-7 animate-spin text-brand motion-reduce:animate-none" aria-hidden />
      <p>{label}</p>
    </div>
  );
}

/** Écran d'état (merci, introuvable, déjà répondu) : il porte le titre de la page, sauf si elle en a déjà un. */
export function StatePanel({ icon: Icon, title, children, as: Title = "h1" }) {
  return (
    <div className="mx-auto flex max-w-[28rem] flex-col items-center gap-4 py-6 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon className="size-8" aria-hidden />
      </span>
      <Title className="tk-title text-[clamp(1.5rem,6vw,2rem)]">{title}</Title>
      {children}
    </div>
  );
}

export function Notice({ tone = "info", icon: Icon, children, className = "", ...props }) {
  return (
    <div {...props} className={`flex items-start gap-2.5 rounded-media border px-3.5 py-3 text-[0.875rem] ${NOTICE_TONES[tone]} ${className}`}>
      {Icon && <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
