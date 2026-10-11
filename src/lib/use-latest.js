import { useEffect, useRef } from "react";

/** Derniere valeur recue, lisible depuis un effet sans que celui-ci se relance quand elle change d'identite. */
export function useLatest(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}
