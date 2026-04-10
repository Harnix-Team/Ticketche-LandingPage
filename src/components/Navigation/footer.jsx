"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FacebookLogo,
  TiktokLogo,
  InstagramLogo,
} from "@phosphor-icons/react";

export const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const currentYear = 2026;

  const getLinkHref = (anchor) => (isHomePage ? anchor : `/${anchor}`);

  const navigationLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Services", href: "/a-propos#nos-services" },
    { label: "Événements", href: "#events" },
  ];

  const usefulLinks = [
    { label: "Emplacements", href: "#emplacements" },
    { label: "Avis clients", href: "#reviews" },
    { label: "Contactez-nous", href: "/contact" },
    { label: "Recrutement", href: "/recrutement" },
  ];

  const contactLinks = [
    { label: "(+229) 01 40 51 21 33", href: "tel:+2290140512133" },
    { label: "support@ticketche.com", href: "mailto:support@ticketche.com" },
  ];

  const policyLinks = [
    {
      label: "Politique de confidentialité",
      href: "/politiques/confidentialite",
    },
    { label: "Conditions d'utilisation", href: "/politiques/conditions" },
    { label: "Mentions légales", href: "/politiques/mentions" },
  ];
  const socialLinks = [
    { icon: FacebookLogo, href: "https://www.facebook.com/share/1AaDERj83T/?mibextid=wwXIfr", label: "Facebook" },
    { icon: TiktokLogo, href: "https://www.tiktok.com/@ticketch?_r=1&_t=ZS-94YYeuvBujN", label: "TikTok" },
    { icon: InstagramLogo, href: "https://www.instagram.com/ticketche?igsh=eXl0MjZmeHByaDg5", label: "Instagram" },
  ];

  const appStoreLinks = [
    {
      href: "https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811?",
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
  .tck-footer {
    font-family: 'Archivo', var(--font-archivo), sans-serif;
    background: linear-gradient(180deg, #f4fafb 0%, #eef7f8 100%);
    border-top: 1px solid rgba(0,105,116,0.15);
    color: #123c40;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(6px);
  }

  .tck-footer::before {
    content: '';
    position: absolute;
    top: -140px; right: -140px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,105,116,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .tck-footer-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 64px 40px 0;
  }

  /* ══ TOP BAND ══ */
  .tck-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 40px;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba(0,105,116,0.15);
    flex-wrap: wrap;
  }

  .tck-brand { display: flex; flex-direction: column; gap: 14px; max-width: 280px; }

  .tck-tagline {
    font-size: 10px;
    font-weight: 400;
    color: #000;
    line-height: 1.8;
  }

  .tck-tagline b {
    font-weight: 600;
    color: #006974;
  }

  .tck-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }

  /* App badges */
  .tck-app-row { display: flex; gap: 10px; align-items: center; }
  .tck-app-btn {
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;
    transition: transform .4s cubic-bezier(.22,1,.36,1), 
                box-shadow .4s ease, 
                filter .4s ease;
  }
  .tck-app-btn:hover {
    transform: translateY(-4px) scale(1.06);
    box-shadow: 0 14px 32px rgba(0,105,116,0.25);
    filter: brightness(1.08);
  }
  .tck-app-btn:active { transform: scale(0.97); }

  /* Social buttons */
  .tck-socials { display: flex; gap: 10px; }
  .tck-social {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: rgba(0,105,116,0.08);
    border: 1px solid rgba(0,105,116,0.2);
    backdrop-filter: blur(8px);
    color: #006974;
    display: flex; align-items: center; justify-content: center;
    transition: all .35s cubic-bezier(.22,1,.36,1);
  }
  .tck-social:hover {
    background: #006974;
    color: #fff;
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,105,116,0.35);
  }

  /* ══ LINKS GRID ══ */
  .tck-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px 32px;
    padding: 52px 0;
    border-bottom: 1px solid rgba(0,105,116,0.15);
  }

  .tck-col-title {
    font-size: 10px; /* ← -1 */
    font-weight: 800;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #003f46;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tck-col-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0,63,70,0.35);
  }

  .tck-col ul {
    list-style: none;
    padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 12px;
  }

  .tck-col ul li a {
    font-size: 12px; /* ← -1 */
    font-weight: 500;
    color: #3f7076;
    text-decoration: none;
    position: relative;
    transition: color .3s ease, transform .3s ease;
  }

  .tck-col ul li a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #006974, #00a0ad);
    border-radius: 4px;
    transition: width .35s cubic-bezier(.22,1,.36,1);
  }

  .tck-col ul li a:hover {
    color: #006974;
    transform: translateX(4px);
  }

  .tck-col ul li a:hover::after {
    width: 100%;
  }

  /* ══ BOTTOM BAR ══ */
  .tck-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0 18px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .tck-copy {
    font-size: 11px; /* ← -1 */
    color: #7aaeb4;
  }

  .tck-copy span {
    font-weight: 600;
    color: #006974;
    font-size: 14px; /* ← -1 */
    letter-spacing: 0.2px;
  }

  .tck-policy-row { display: flex; gap: 22px; flex-wrap: wrap; }

  .tck-policy-row a {
    font-size: 11px; /* ← -1 */
    color: #6fa4aa;
    text-decoration: none;
    transition: color .3s ease;
  }

  .tck-policy-row a:hover {
    color: #006974;
  }

  @media (max-width: 900px) {
    .tck-top { flex-direction: column; }
    .tck-actions { align-items: flex-start; }
    .tck-links { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 540px) {
   .tck-links { grid-template-columns: 1fr; }
  .tck-bottom { flex-direction: column; align-items: center; text-align: center; }
  .tck-policy-row { justify-content: center; }
  }
`}</style>

      <footer className="tck-footer">
        <div className="tck-footer-inner">
          {/* ── TOP ── */}
          <div className="tck-top">
            <div className="tck-brand">
              <Image
                src="/images/logo.png"
                alt="Ticketché Logo"
                width={148}
                height={50}
              />
              <p className="tck-tagline">
                <b>ticketché</b> simplifie la gestion de vos véhicules avec une
                solution numérique innovante et intuitive.
              </p>
            </div>

            <div className="tck-actions">
              <div className="tck-app-row">
                {appStoreLinks.map(({ href, src, alt }) => (
                  <a
                    key={alt}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tck-app-btn"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt}
                      style={{
                        height: "36px",
                        width: "auto",
                        display: "block",
                      }}
                    />
                  </a>
                ))}
              </div>
              <div className="tck-socials">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="tck-social"
                  >
                    <Icon size={22} weight="fill" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── LIENS 4 colonnes ── */}
          <div className="tck-links">
            <div className="tck-col">
              <div className="tck-col-title">Navigation</div>
              <ul>
                {navigationLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={
                        link.href.startsWith("#")
                          ? getLinkHref(link.href)
                          : link.href
                      }
                    >
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
                    <Link
                      href={
                        link.href.startsWith("#")
                          ? getLinkHref(link.href)
                          : link.href
                      }
                    >
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
                <Link key={i} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};