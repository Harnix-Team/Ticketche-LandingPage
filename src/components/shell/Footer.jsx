import { FacebookLogo, InstagramLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ConsentToggle } from "@/components/shell/ConsentControls";
import { StoreButtons } from "@/components/shell/GetApp";
import { Logo } from "@/components/shell/Logo";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/components/shell/nav";
import { PHONE_DISPLAY } from "@/config/constants";

const SOCIALS = [
  { icon: FacebookLogo, href: "https://www.facebook.com/share/1AaDERj83T/?mibextid=wwXIfr", label: "Facebook" },
  { icon: TiktokLogo, href: "https://www.tiktok.com/@ticketch?_r=1&_t=ZS-94YYeuvBujN", label: "TikTok" },
  { icon: InstagramLogo, href: "https://www.instagram.com/ticketche?igsh=eXl0MjZmeHByaDg5", label: "Instagram" },
];

const linkClass = "underline-offset-4 hover:text-ink hover:underline";

function Column({ title, children }) {
  return (
    <div>
      <h2 className="tk-label mb-3 text-[0.875rem] text-ink">{title}</h2>
      <ul className="flex flex-col gap-2.5 text-[0.9375rem] text-ink-2">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="tk-shell grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-5">
          <Logo className="h-7 self-start" />
          <p className="max-w-[34ch] text-[0.9375rem] text-ink-2">
            Tout ce qui nécessite un ticket, au même endroit. Événements, lieux et restaurants au Bénin.
          </p>
          <StoreButtons />
        </div>

        <Column title="Découvrir">
          {PRIMARY_NAV.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass}>{label}</Link>
            </li>
          ))}
          <li>
            <Link href="/download/" className={linkClass}>Télécharger l’application</Link>
          </li>
        </Column>

        <Column title="Ticketché">
          {SECONDARY_NAV.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass}>{label}</Link>
            </li>
          ))}
        </Column>

        <Column title="Nous joindre">
          <li>
            <a href="tel:+2290140512133" className={linkClass}>{PHONE_DISPLAY}</a>
          </li>
          <li>
            <a href="mailto:support@ticketche.com" className={linkClass}>support@ticketche.com</a>
          </li>
          <li className="mt-1 flex gap-1.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-brand hover:text-brand"
              >
                <Icon className="size-[1.125rem]" weight="fill" aria-hidden />
              </a>
            ))}
          </li>
        </Column>
      </div>

      <div className="border-t border-line">
        <div className="tk-shell flex flex-col gap-3 py-5 text-[0.8125rem] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Ticketché, édité par Harnix-Team, Abomey-Calavi, Bénin.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>{label}</Link>
              </li>
            ))}
            <li>
              <ConsentToggle />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
