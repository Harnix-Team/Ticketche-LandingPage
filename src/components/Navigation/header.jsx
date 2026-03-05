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
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // ─── Init download link
  useEffect(() => {
    setDownloadLink(getDownloadLink());
  }, []);

  // ─── Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [pathname]);

  const getLinkHref = (anchor) => (isHomePage ? anchor : `/${anchor}`);

  const navLinks = [
    { href: "#events", label: "Événements" },
    { href: "#emplacements", label: "Emplacements" },
    { href: "/nos-services", label: "Services", isPage: true },
    { href: "/a-propos", label: "À propos", isPage: true },
    { href: "/contact", label: "FAQ & Contact", isPage: true },
  ];

  // ─── ScrollSpy (supporte les sections chargées en async)
  useEffect(() => {
    const observedSections = new Set();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link =
            document.querySelector(`a[href="#${id}"]`) ||
            document.querySelector(`a[href="/#${id}"]`);
          if (link) {
            if (entry.isIntersecting) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    // Observe une section si pas déjà observée
    const observeSection = (el) => {
      if (el.id && !observedSections.has(el.id)) {
        observedSections.add(el.id);
        intersectionObserver.observe(el);
      }
    };

    // Observe les sections déjà présentes
    document.querySelectorAll("section[id]").forEach(observeSection);

    // Observe les sections ajoutées dynamiquement (ex: après fetch API)
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll("section[id]").forEach(observeSection);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <header className="hdr">
      <div className={`hdrContainer ${isScrolled ? "scrolled" : ""}`}>
        <div className={`hdrGlass ${isScrolled ? "scrolled" : ""}`}>
          <div className={`hdrInner ${isScrolled ? "scrolled" : ""}`}>

            {/* DESKTOP */}
            <div className="hdrContent">
              {/* Logo */}
              <Link href="/" className="hdrLogo">
                <div className={`hdrLogoImg ${isScrolled ? "scrolled" : ""}`}>
                  <Image
                    src="/images/logo.png"
                    alt="Ticketché"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Nav + CTA */}
              <div className={`hdrRight ${isScrolled ? "scrolled" : ""}`}>
                <nav className="hdrNav">
                  {navLinks.map(({ href, label, isPage }) =>
                    isPage ? (
                      <Link
                        key={href}
                        href={href}
                        className={`hdrLink ${pathname === href ? "active" : ""}`}
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        key={href}
                        href={getLinkHref(href)}
                        className="hdrLink"
                      >
                        {label}
                      </Link>
                    )
                  )}
                </nav>

                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hdrCta"
                >
                  Télécharger
                </a>
              </div>
            </div>

            {/* MOBILE */}
            <div className="hdrMobileWrapper">
              <Link href="/" className="hdrLogo">
                <div className={`hdrLogoImg ${isScrolled ? "scrolled" : ""}`}>
                  <Image
                    src="/images/logo.png"
                    alt="Ticketché"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hdrToggle ${isScrolled ? "scrolled" : ""}`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" weight="bold" />
                ) : (
                  <List className="w-5 h-5" weight="bold" />
                )}
              </button>
            </div>

          </div>

          {/* MOBILE MENU */}
          <div className={`hdrMobile ${isMenuOpen ? "open" : ""} ${isScrolled ? "scrolled" : ""}`}>
            <nav className="px-4">
              {navLinks.map(({ href, label, isPage }) =>
                isPage ? (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="hdrMobileLink"
                  >
                    {label}
                  </Link>
                ) : (
                  <Link
                    key={href}
                    href={getLinkHref(href)}
                    onClick={() => setIsMenuOpen(false)}
                    className="hdrMobileLink"
                  >
                    {label}
                  </Link>
                )
              )}
            </nav>

            <div className="px-4">
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hdrMobileCta"
              >
                Télécharger
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ─── CSS soulignement actif décalé ─── */}
      <style jsx>{`
        .hdrLink {
          position: relative;
          padding-bottom: 4px;
        }
        .hdrLink.active::after {
          content: "";
          position: absolute;
          left: 10px;
          bottom: 0;
          width: calc(100% - 20px);
          height: 2px;
          background-color: #00c4cc;
          border-radius: 1px;
        }
      `}</style>
    </header>
  );
};