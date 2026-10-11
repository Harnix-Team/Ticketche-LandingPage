"use client";

import { ChevronRight, Menu, Search as SearchIcon, X } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GetApp } from "@/components/shell/GetApp";
import { Logo } from "@/components/shell/Logo";
import { HEADER_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/components/shell/nav";
import { Search } from "@/components/shell/Search";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Button } from "@/components/ui/Button";

const HIDDEN_ROUTES = [/^\/admin\/enquete\/?$/];
// Menu mobile ouvert : l'en-tete devient un ecran plein et opaque, au-dessus du widget de chat (z-index 1 000 001).
const MENU_OPEN = "max-lg:fixed max-lg:inset-0 max-lg:z-[1000002] max-lg:flex max-lg:h-dvh max-lg:flex-col max-lg:bg-bg";

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
      } ${panel === "menu" ? MENU_OPEN : ""}`}
    >
      <div className="tk-shell flex h-16 shrink-0 items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
        <Logo compact className="h-[1.375rem] sm:h-6" />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {HEADER_NAV.map(({ href, label, match }) => {
            const active = match.test(pathname);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`tk-label relative rounded-full px-2.5 py-2 text-[0.9375rem] whitespace-nowrap transition-colors xl:px-3.5 ${
                  active ? "text-brand" : "text-ink-2 hover:text-ink"
                }`}
              >
                {label}
                {active && <span className="absolute inset-x-2.5 -bottom-[0.6875rem] h-0.5 rounded-full bg-brand xl:inset-x-3.5" aria-hidden />}
              </Link>
            );
          })}
        </nav>

        <Search className="ml-auto hidden w-full max-w-sm min-w-0 md:block" />

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <ThemeToggle className="hidden sm:grid" />
          <GetApp size="sm" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggle("search")}
            aria-label="Rechercher"
            aria-expanded={panel === "search"}
            className="md:hidden"
          >
            <SearchIcon className="size-[1.125rem]" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggle("menu")}
            aria-label={panel === "menu" ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={panel === "menu"}
            className="lg:hidden"
          >
            {panel === "menu" ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </div>
      </div>

      {panel === "search" && (
        <div className="tk-shell pb-3 md:hidden">
          <Search autoFocus />
        </div>
      )}

      {panel === "menu" && (
        <div className="tk-shell min-h-0 flex-1 overflow-y-auto pt-2 pb-10 motion-safe:animate-[tk-rise_0.28s_var(--ease-out-soft)] lg:hidden">
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
          <nav aria-label="Ticketché" className="mt-2.5 flex flex-col gap-2.5">
            {SECONDARY_NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname.startsWith(href.slice(0, -1)) ? "page" : undefined}
                className="tk-label flex items-center gap-2.5 rounded-card border border-line bg-surface px-4 py-3.5 text-[0.9375rem] text-ink aria-[current]:border-brand aria-[current]:text-brand"
              >
                <Icon className="size-[1.125rem] shrink-0 text-ink-3" aria-hidden />
                {label}
                <ChevronRight className="ml-auto size-4 shrink-0 text-ink-3" aria-hidden />
              </Link>
            ))}
          </nav>
          <div className="mt-2.5 flex items-center justify-between rounded-card border border-line bg-surface py-2.5 pr-2.5 pl-4">
            <span className="tk-label text-[0.9375rem] text-ink">Thème clair ou sombre</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
