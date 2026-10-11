import { useId } from "react";

const CONTROL =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 aria-[invalid=true]:border-danger";

/** Libelle, champ, aide et message d'erreur relies pour les lecteurs d'ecran. */
export function Field({ label, hint, error, required = false, children, className = "" }) {
  const id = useId();
  const describedBy = [hint && `${id}-aide`, error && `${id}-erreur`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="tk-label text-[0.875rem] text-ink">
        {label}
        {required && <span className="text-danger" aria-hidden> *</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined, required })}
      {hint && !error && <p id={`${id}-aide`} className="text-[0.8125rem] text-ink-3">{hint}</p>}
      {error && <p id={`${id}-erreur`} role="alert" className="text-[0.8125rem] text-danger">{error}</p>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={`${CONTROL} h-11 ${className}`} {...props} />;
}

export function Textarea({ className = "", rows = 5, ...props }) {
  return <textarea rows={rows} className={`${CONTROL} py-3 ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${CONTROL} h-11 appearance-none bg-[length:1rem] bg-[right_0.875rem_center] bg-no-repeat pr-10 ${className}`} {...props}>
      {children}
    </select>
  );
}
