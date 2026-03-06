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
    { href: "/a-propos", label: "À propos", isPage: true },
    { href: "/contact", label: "FAQ & Contact", isPage: true },
  ];

  // ─── ScrollSpy
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
                <nav>
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

      {/* ─── CSS ─── */}
      <style jsx>{`
        .hdrLink {
          font-weight: 600;
          padding: 0 1rem;
          color: #333;
          transition: color 0.3s ease;
          position: relative;
          padding-bottom: 4px;
        }
        .hdrLink:hover,
        .hdrLink.active {
          color: #00c4cc;
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

        .hdrCta {
          font-size: clamp(0.92rem, 1.05vw, 1rem);    /* même taille réduite */
          font-weight: 700;
          background: #00515a;
          color: white;
          padding: clamp(0.55rem, 0.9vw, 0.75rem) clamp(1.3rem, 1.8vw, 1.6rem);
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
          font-size: clamp(0.98rem, 4vw, 1.1rem);     /* réduit mais lisible */
          font-weight: 600;
          color: #333;
          padding: 1rem 0;
          display: block;
          transition: color 0.3s;
        }
        .hdrMobileLink:hover {
          color: #00515a;
        }

        .hdrMobileCta {
          font-size: clamp(1.02rem, 4.5vw, 1.15rem);  /* légèrement plus gros */
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
        }
      `}</style>
    </header>
  );
};