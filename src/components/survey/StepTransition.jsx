"use client";

import { useState } from "react";

/** Fondu court au changement d'étape, jamais au premier affichage. */
export function StepTransition({ stepKey, children, className = "" }) {
  const [initialKey] = useState(stepKey);
  const [moved, setMoved] = useState(false);

  if (!moved && stepKey !== initialKey) setMoved(true);

  return (
    <div
      key={stepKey}
      className={`${moved ? "motion-safe:animate-[tk-rise_0.28s_var(--ease-out-soft)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
