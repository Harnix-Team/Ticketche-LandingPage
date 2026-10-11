"use client";

import { Moon, Sun } from "@/components/icons";
import { THEME_KEY } from "@/components/shell/theme";

export function ThemeToggle({ className = "" }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
    };

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Le choix ne sera pas memorise, il s'applique quand meme.
    }

    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer de thème, clair ou sombre"
      className={`grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      <Sun className="hidden size-[1.125rem] dark:block" aria-hidden />
      <Moon className="size-[1.125rem] dark:hidden" aria-hidden />
    </button>
  );
}
