"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getDownloadLink, isMobileDevice } from "@/utils/deviceDetection";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Détecte l'appareil et définit le lien approprié
  useEffect(() => {
    setDownloadLink(getDownloadLink());
  }, []);

  // Détecte le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkHref = (anchor) => {
    return isHomePage ? anchor : `/${anchor}`;
  };

  const getButtonText = () => {
    if (typeof window === "undefined") return "Télécharger l'app";
    return isMobileDevice() ? "Télécharger maintenant" : "Télécharger l'app";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`
            bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl
            shadow-lg hover:shadow-xl border border-gray-200/50
            transition-all duration-300
            ${isScrolled ? "shadow-2xl scale-[0.98]" : "shadow-lg"}
          `}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 sm:py-5">
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <div className="relative w-28 h-12 sm:w-32 sm:h-14 transition-transform group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="Ticketché Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Link
                  href={getLinkHref("#about")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  À propos
                </Link>
                <Link
                  href={getLinkHref("#locations")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  Emplacements
                </Link>
                <Link
                  href={getLinkHref("#events")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  Event
                </Link>
                <Link
                  href={getLinkHref("#reviews")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  Avis clients
                </Link>
                <Link
                  href={getLinkHref("#faq")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  FAQ
                </Link>
                <Link
                  href={getLinkHref("#contact")}
                  className="px-4 py-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                >
                  Contact
                </Link>
              </nav>

              {/* CTA Button Desktop */}
              <div className="hidden lg:block">
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 py-3 bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#005f69]/30 hover:scale-105"
                >
                  <span className="relative z-10">{getButtonText()}</span>
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-gray-200/50 py-4 animate-slideDown">
                <nav className="space-y-1">
                  <Link
                    href={getLinkHref("#about")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link
                    href={getLinkHref("#locations")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Emplacements
                  </Link>
                  <Link
                    href={getLinkHref("#events")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Event
                  </Link>
                  <Link
                    href={getLinkHref("#reviews")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Avis clients
                  </Link>
                  <Link
                    href={getLinkHref("#faq")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    href={getLinkHref("#contact")}
                    className="block px-4 py-3 text-gray-700 hover:text-[#005f69] hover:bg-[#005f69]/5 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  {/* CTA Mobile */}
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 px-6 py-3 bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white text-center font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getButtonText()}
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
