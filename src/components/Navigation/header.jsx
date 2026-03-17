"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { getDownloadLink } from "@/utils/deviceDetection";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => { setDownloadLink(getDownloadLink()); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSection("");
  }, [pathname]);

  useEffect(() => {
    if (!isHomePage) setActiveSection("");
  }, [isHomePage]);

  const getLinkHref = (anchor) => (isHomePage ? anchor : `/${anchor}`);

  const navLinks = [
    { href: "/a-propos", label: "À propos", isPage: true },
    { href: "/events", label: "Événements", isPage: true },
    { href: "/establishments", label: "Emplacements", isPage: true },
    { href: "/contact", label: "Contact", isPage: true },
  ];

  useEffect(() => {
    if (!isHomePage) return;
    const observedSections = new Set();
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    const observeSection = (el) => {
      if (el.id && !observedSections.has(el.id)) {
        observedSections.add(el.id);
        intersectionObserver.observe(el);
      }
    };
    document.querySelectorAll("section[id]").forEach(observeSection);
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll("section[id]").forEach(observeSection);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => { intersectionObserver.disconnect(); mutationObserver.disconnect(); };
  }, [isHomePage]);

  const isActive = (link) => {
    if (link.isPage) return pathname.startsWith(link.href);
    if (!isHomePage) return false;
    return activeSection === link.sectionId;
  };

  return (
    <header className="hdr">
      <div className={`hdrContainer ${isScrolled ? "scrolled" : ""}`}>
        <div className={`hdrGlass ${isScrolled ? "scrolled" : ""}`}>
          <div className={`hdrInner ${isScrolled ? "scrolled" : ""}`}>

            {/* DESKTOP */}
            <div className="hdrContent">
              <Link href="/" className="hdrLogo">
                <div className={`hdrLogoImg ${isScrolled ? "scrolled" : ""}`}>
                  <Image src="/images/logo.png" alt="Ticketché" fill className="object-contain" priority />
                </div>
              </Link>
              <div className={`hdrRight ${isScrolled ? "scrolled" : ""}`}>
                <nav>
                  {navLinks.map((link) => {
                    const active = isActive(link);
                    return (
                      <Link
                        key={link.href}
                        href={link.isPage ? link.href : getLinkHref(link.href)}
                        className={`hdrLink ${active ? "active" : ""}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="hdrCta">
                  Télécharger
                </a>
              </div>
            </div>

            {/* MOBILE bar */}
            <div className="hdrMobileWrapper">
              <Link href="/" className="hdrLogo">
                <div className={`hdrLogoImg ${isScrolled ? "scrolled" : ""}`}>
                  <Image src="/images/logo.png" alt="Ticketché" fill className="object-contain" priority />
                </div>
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`hdrToggle ${isScrolled ? "scrolled" : ""}`} aria-label="Toggle menu">
                {isMenuOpen ? <X className="w-5 h-5" weight="bold" /> : <List className="w-5 h-5" weight="bold" />}
              </button>
            </div>

          </div>

          {/* MOBILE MENU */}
          <div className={`hdrMobile ${isMenuOpen ? "open" : ""} ${isScrolled ? "scrolled" : ""}`}>
            <nav className="px-4">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.href}
                    href={link.isPage ? link.href : getLinkHref(link.href)}
                    onClick={() => setIsMenuOpen(false)}
                    className={`hdrMobileLink ${active ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4">
              <a href={downloadLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="hdrMobileCta">
                Télécharger
              </a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .hdrLink {
          font-weight: 600;
          padding: 6px 14px;
          color: #333;
          border-radius: 999px;
          transition: color 0.25s ease, background 0.25s ease;
        }
        .hdrLink:hover,
        .hdrLink.active {
          color: #005f69;
          background: #ecf5f5;
        }

        .hdrCta {
          font-size: clamp(0.92rem, 1.05vw, 1rem);
          font-weight: 700;
          background: #00515a;
          color: white;
padding: 0.65rem 1.4rem;
          border-radius: 999px;
          transition: all 0.3s ease;
          min-width: 130px;
          text-align: center;
        }
        .hdrCta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 196, 204, 0.3);
        }

        .hdrMobileLink {
          font-size: clamp(0.98rem, 4vw, 1.1rem);
          font-weight: 600;
          color: #333;
          padding: 1rem 0;
          display: block;
          transition: color 0.25s ease;
          border: none !important;
          text-decoration: none;
        }
        .hdrMobileLink:hover,
        .hdrMobileLink.active { color: #005f69; }

        .hdrMobileCta {
          font-size: clamp(1.02rem, 4.5vw, 1.15rem);
          font-weight: 700;
          background: #00515a;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 999px;
          text-align: center;
          display: block;
          margin-top: 1.5rem;
          transition: all 0.3s;
        }
        .hdrMobileCta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 196, 204, 0.3);
        }

        .hdrMobileWrapper { display: none; }
        .hdrMobile        { display: none; padding-bottom: 1.25rem; }
        .hdrMobile.open   { display: block; }

        @media (max-width: 767px) {
          .hdrContent        { display: none; }
          .hdrMobileWrapper  { display: flex; align-items: center; justify-content: space-between; width: 100%; }
          .hdrMobile { background: #ffffff; border-radius: 0 0 20px 20px; }
          .hdrContainer      { padding: 10px 16px; }
          .hdrGlass          { background: transparent !important; backdrop-filter: none; border-radius: 0 !important; }
          .hdrGlass.scrolled {
            background: #ffffff !important;
            backdrop-filter: none;
            border-radius: 20px !important;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          .hdrMobile.open { margin-top: 0; }
        }
      `}</style>
    </header>
  );
};