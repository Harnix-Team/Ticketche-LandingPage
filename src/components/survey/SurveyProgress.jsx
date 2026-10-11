/**
 * Progression par segments. `fill` est le remplissage du segment en pourcentage,
 * `current` marque l'étape en cours quand elle n'a pas de remplissage propre.
 */
export function SurveyProgress({ segments, label, className = "" }) {
  const done = segments.filter((segment) => segment.fill >= 100).length;

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-label="Progression"
        aria-valuemin={0}
        aria-valuemax={segments.length}
        aria-valuenow={done}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {segments.map((segment) => (
          <span
            key={segment.id}
            className={`h-1.5 flex-1 overflow-hidden rounded-full ${segment.current ? "bg-line-strong" : "bg-line"}`}
          >
            <span
              className="block h-full rounded-full bg-brand transition-[width] duration-300 ease-out-soft"
              style={{ width: `${segment.fill}%` }}
            />
          </span>
        ))}
      </div>
      <p aria-live="polite" className="tk-label mt-2 text-[0.8125rem] text-ink-2">
        {label}
      </p>
    </div>
  );
}
