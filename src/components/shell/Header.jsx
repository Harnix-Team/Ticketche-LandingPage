"use client";

import { Menu, Search as SearchIcon, X } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GetApp } from "@/components/shell/GetApp";
import { Logo } from "@/components/shell/Logo";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/components/shell/nav";
import { Search } from "@/components/shell/Search";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

const HIDDEN_ROUTES = [/^\/admin\/enquete\/?$/];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPanel(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = panel === "menu" ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  if (HIDDEN_ROUTES.some((route) => route.test(pathname))) return null;

  const toggle = (name) => setPanel((current) => (current === name ? null : name));

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/85 backdrop-blur-xl transition-[border-color] duration-300 ${
        scrolled || panel ? "border-line" : "border-transparent"
      }`}
    >
      <div className="tk-shell flex h-16 items-center gap-2 sm:gap-3 lg:gap-6">
        <Logo compact className="h-[1.375rem] sm:h-6" />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map(({ href, label, match }) => {
            const active = match.test(pathname);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`tk-label relative rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors ${
                  active ? "text-brand" : "text-ink-2 hover:text-ink"
                }`}
              >
                {label}
                {active && <span className="absolute inset-x-3.5 -bottom-[0.6875rem] h-0.5 rounded-full bg-brand" aria-hidden />}
              </Link>
            );
          })}
        </nav>

        <Search className="ml-auto hidden w-full max-w-sm md:block" />

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
          <button
            type="button"
            onClick={() => toggle("search")}
            aria-label="Rechercher"
            aria-expanded={panel === "search"}
            className="grid size-10 place-items-center rounded-full text-ink-2 hover:bg-sunken hover:text-ink md:hidden"
          >
            <SearchIcon className="size-[1.125rem]" aria-hidden />
          </button>
          <ThemeToggle className="hidden sm:grid" />
          <GetApp size="sm" className="ml-1" />
          <button
            type="button"
            onClick={() => toggle("menu")}
            aria-label={panel === "menu" ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={panel === "menu"}
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-sunken lg:hidden"
          >
            {panel === "menu" ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {panel === "search" && (
        <div className="tk-shell pb-3 md:hidden">
          <Search autoFocus />
        </div>
      )}

      {panel === "menu" && (
        <div className="tk-shell h-[calc(100dvh-4rem)] overflow-y-auto pt-2 pb-10 motion-safe:animate-[tk-rise_0.28s_var(--ease-out-soft)] lg:hidden">
          <nav aria-label="Navigation principale" className="grid grid-cols-2 gap-2.5">
            {PRIMARY_NAV.map(({ href, label, icon: Icon, match }) => (
              <Link
                key={href}
                href={href}
                aria-current={match.test(pathname) ? "page" : undefined}
                className="flex flex-col gap-6 rounded-card border border-line bg-surface p-4 aria-[current]:border-brand aria-[current]:text-brand"
              >
                <Icon className="size-6 text-brand" aria-hidden />
                <span className="tk-title text-xl">{label}</span>
              </Link>
            ))}
          </nav>
          <nav aria-label="Ticketché" className="mt-6 flex flex-col">
            {SECONDARY_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="tk-label border-b border-line py-3.5 text-[1.0625rem] text-ink">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[0.9375rem] text-ink-2">Thème clair ou sombre</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
