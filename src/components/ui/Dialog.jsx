"use client";

import { X } from "@/components/icons";
import { useEffect, useRef } from "react";

/** Fenetre modale native : focus piege et touche Echap geres par le navigateur. */
export function Dialog({ open, onClose, title, children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-label={title}
      className={`m-auto w-[min(92vw,30rem)] rounded-panel border border-line bg-surface p-0 text-ink backdrop:bg-scrim backdrop:backdrop-blur-[2px] open:animate-[tk-rise_0.32s_var(--ease-out-soft)] ${className}`}
    >
      <div className="relative p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3.5 right-3.5 grid size-9 place-items-center rounded-full text-ink-2 hover:bg-sunken hover:text-ink"
        >
          <X className="size-[1.125rem]" aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  );
}
