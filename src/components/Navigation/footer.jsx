"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";


export const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const currentYear = 2026;

  const getLinkHref = (anchor) => (isHomePage ? anchor : `/${anchor}`);

  const navigationLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Événements", href: "#events" },
  ];

  const usefulLinks = [
    { label: "Emplacements", href: "#locations" },
    { label: "Avis clients", href: "#reviews" },
    { label: "Contactez-nous", href: "#contact" },
    { label: "Recrutement", href: "https://recrutement.ticketche.com" },
  ];

  const contactLinks = [
    { label: "(+229) 99 98 43 45", href: "tel:+22999984345" },
    { label: "support@ticketche.com", href: "mailto:support@ticketche.com" },
  ];

  const policyLinks = [
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
    { label: "Conditions d'utilisation", href: "/conditions-utilisation" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ];

  const socialLinks = [
    { icon: FacebookLogo, href: "/", label: "Facebook" },
    { icon: InstagramLogo, href: "/", label: "Instagram" },
    { icon: LinkedinLogo, href: "/", label: "LinkedIn" },
  ];

  const appStoreLinks = [
    {
      href: "https://apps.apple.com/app/ticketche/id6743762073",
      src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
      alt: "Download on the App Store",
    },
    {
      href: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
      src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
      alt: "Get it on Google Play",
    },
  ];

  return (
    <>
      <style>{`
        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #006974;
          color: #fff;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .footer-social-btn:hover {
          background: #004d57;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 6px 18px rgba(0,105,116,0.35);
        }

        /* Effet glow + légère rotation au survol */
        .footer-app-btn {
          display: inline-block;
          border-radius: 10px;
          overflow: hidden;
          line-height: 0;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.3s ease;
        }
        .footer-app-btn:hover {
          transform: scale(1.08) rotate(-1.5deg);
          box-shadow: 0 10px 28px rgba(0,105,116,0.28);
          filter: brightness(1.08) saturate(1.1);
        }
        .footer-app-btn:active {
          transform: scale(0.97);
          filter: brightness(0.95);
        }

        /* Texte description : max 3 lignes */
        .footer-desc {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: inherit;
          font-size: inherit;
          color: #374151;
          line-height: 1.7;
        }
      `}</style>

      <footer className="relative text-black overflow-hidden border-t border-[#8fbdc2]">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-4">

          {/*
            Grid asymétrique :
            - Col 1 (logo) : 2 fractions → plus large pour contenir logo + texte + boutons
            - Cols 2-5 : 1 fraction chacune → même largeur, même écart
          */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: "48px",
          }}>

            {/* ── Col 1 : Logo + desc + socials + app buttons ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Image
                src="/images/logo.png"
                alt="Ticketché Logo"
                width={160}
                height={54}
                style={{ marginBottom: "20px" }}
              />

              <p className="footer-desc">
                <b>ticketché</b> simplifie la gestion de vos véhicules avec une
                solution numérique innovante et intuitive.
              </p>

              {/* App buttons en haut, socials en bas */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  {appStoreLinks.map(({ href, src, alt }) => (
                    <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="footer-app-btn">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={alt} style={{ height: "38px", width: "auto", display: "block" }} />
                    </a>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <Link key={label} href={href} aria-label={label} className="footer-social-btn">
                      <Icon size={17} weight="fill" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Col 2 : Navigation ── */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Navigation</h3>
              <ul className="space-y-4">
                {navigationLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href.startsWith("#") ? getLinkHref(link.href) : link.href}
                      className="text-gray-700 hover:text-[#005f69] transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3 : Liens utiles ── */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Liens utiles</h3>
              <ul className="space-y-4">
                {usefulLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href.startsWith("#") ? getLinkHref(link.href) : link.href}
                      className="text-gray-700 hover:text-[#005f69] transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 4 : Politiques ── */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Politiques</h3>
              <ul className="space-y-4">
                {policyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-[#005f69] transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 5 : Contact ── */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                {contactLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-[#005f69] transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── Copyright ── */}
          <div style={{ marginTop: "48px", paddingTop: "20px", paddingBottom: "12px", textAlign: "center", borderTop: "1px solid #8fbdc2" }}>
            <p className="text-gray-700 text-sm">
              © {currentYear}{" "}
              <span className="font-semibold text-[#005f69]">ticketché</span>.
              Tous droits réservés.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};
