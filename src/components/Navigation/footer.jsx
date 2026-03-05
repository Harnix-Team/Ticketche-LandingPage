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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .tck-footer {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f0f7f8;
          border-top: 1px solid #c2dde0;
          color: #1a3a3f;
          position: relative;
          overflow: hidden;
        }

        /* Subtle teal wash in the corner */
        .tck-footer::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(0,105,116,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .tck-footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 32px 0;
        }

        /* ── TOP BAND : logo + tagline + app/socials ── */
        .tck-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          padding-bottom: 48px;
          border-bottom: 1px solid #c2dde0;
          flex-wrap: wrap;
        }

        .tck-brand { display: flex; flex-direction: column; gap: 14px; max-width: 320px; }
        .tck-tagline {
          font-size: 13.5px;
          font-weight: 400;
          color: #4a7a80;
          line-height: 1.75;
        }
        .tck-tagline b { color: #006974; font-weight: 600; }

        .tck-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; }

        .tck-app-row { display: flex; gap: 10px; align-items: center; }
        .tck-app-btn {
          display: inline-block;
          border-radius: 9px;
          overflow: hidden;
          line-height: 0;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
        }
        .tck-app-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 22px rgba(0,105,116,0.22);
        }

        .tck-socials { display: flex; gap: 8px; }
        .tck-social {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: #006974;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .tck-social:hover {
          background: #004d57;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,105,116,0.3);
        }

        /* ── LINKS GRID ── */
        .tck-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 32px;
          padding: 48px 0;
          border-bottom: 1px solid #c2dde0;
        }

        .tck-col-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #006974;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tck-col-title::after {
          content: '';
          display: block;
          flex: 1;
          height: 1px;
          background: #c2dde0;
        }

        .tck-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .tck-col ul li a {
          font-size: 13.5px;
          font-weight: 400;
          color: #3a6a70;
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s;
          display: block;
        }
        .tck-col ul li a:hover {
          color: #006974;
          padding-left: 6px;
        }

        /* ── BOTTOM BAR ── */
        .tck-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .tck-copy {
          font-size: 12.5px;
          color: #6a9da3;
        }
        .tck-copy span { font-weight: 600; color: #006974; }

        .tck-policy-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .tck-policy-row a {
          font-size: 12px;
          color: #6a9da3;
          text-decoration: none;
          transition: color 0.2s;
        }
        .tck-policy-row a:hover { color: #006974; }

        @media (max-width: 900px) {
          .tck-top { flex-direction: column; }
          .tck-actions { align-items: flex-start; }
          .tck-links { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .tck-links { grid-template-columns: 1fr; }
          .tck-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="tck-footer">
        <div className="tck-footer-inner">

          {/* ── TOP : brand + app/socials ── */}
          <div className="tck-top">
            <div className="tck-brand">
              <Image src="/images/logo.png" alt="Ticketché Logo" width={148} height={50} />
              <p className="tck-tagline">
                <b>ticketché</b> simplifie la gestion de vos véhicules avec une
                solution numérique innovante et intuitive.
              </p>
            </div>

            <div className="tck-actions">
              {/* App store badges */}
              <div className="tck-app-row">
                {appStoreLinks.map(({ href, src, alt }) => (
                  <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="tck-app-btn">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} style={{ height: "36px", width: "auto", display: "block" }} />
                  </a>
                ))}
              </div>
              {/* Socials */}
              <div className="tck-socials">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link key={label} href={href} aria-label={label} className="tck-social">
                    <Icon size={16} weight="fill" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── LINKS GRID : 4 colonnes égales ── */}
          <div className="tck-links">
            <div className="tck-col">
              <div className="tck-col-title">Navigation</div>
              <ul>
                {navigationLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href.startsWith("#") ? getLinkHref(link.href) : link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tck-col">
              <div className="tck-col-title">Liens utiles</div>
              <ul>
                {usefulLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href.startsWith("#") ? getLinkHref(link.href) : link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tck-col">
              <div className="tck-col-title">Politiques</div>
              <ul>
                {policyLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tck-col">
              <div className="tck-col-title">Contact</div>
              <ul>
                {contactLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="tck-bottom">
            <p className="tck-copy">
              © {currentYear} <span>ticketché</span>. Tous droits réservés.
            </p>
            <nav className="tck-policy-row">
              {policyLinks.map((link, i) => (
                <Link key={i} href={link.href}>{link.label}</Link>
              ))}
            </nav>
          </div>

        </div>
      </footer>
    </>
  );
};
