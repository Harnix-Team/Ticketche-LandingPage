"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

export const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const currentYear = new Date().getFullYear();

  const getLinkHref = (anchor) => (isHomePage ? anchor : `/${anchor}`);

  const footerLinks = {
    "Liens utiles": [
      { label: "À propos", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Emplacements", href: "#locations" },
      { label: "Événements", href: "#events" },
      { label: "Avis clients", href: "#reviews" },
      { label: "Contactez-nous", href: "#contact" },
      { label: "Recrutement", href: "https://recrutement.ticketche.com" },
    ],
    "Réseaux sociaux": [
      { label: "Facebook", href: "/", icon: FacebookLogo },
      { label: "Instagram", href: "/", icon: InstagramLogo },
      { label: "LinkedIn", href: "/", icon: LinkedinLogo },
    ],
    "Contact": [
      { label: "(+229) 99 98 43 45", href: "tel:+22999984345" },
      { label: "support@ticketche.com", href: "mailto:support@ticketche.com" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] shadow-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">

          {/* Logo + description + badges */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4 sm:mb-6">
              <Image
                src="/images/logo.png"
                alt="Ticketché Logo"
                width={160}
                height={54}
                className="max-w-full transition transform hover:scale-105"
              />
            </div>
            <p className="text-gray-700 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
              <b>ticketché</b> simplifie la gestion de vos véhicules avec une solution numérique innovante et intuitive.
            </p>

            {/* Badges stores */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com/app/ticketche/id6743762073"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-badge"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Télécharger sur l'App Store"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-badge footer-badge--google"
              >
                <img
                  src="https://play.google.com/intl/fr_fr/badges/static/images/badges/fr_badge_web_generic.png"
                  alt="Disponible sur Google Play"
                />
              </a>
            </div>
          </div>

          {/* Colonnes de liens */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 flex flex-col space-y-3 sm:space-y-4">
              <h3 className="font-bold text-gray-900 mb-1 sm:mb-3 text-base sm:text-lg border-b border-gray-200 pb-2">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index} className="group">
                    {link.icon ? (
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-700 hover:text-teal-600 transition duration-300 group-hover:translate-x-1 text-sm sm:text-base"
                      >
                        <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-teal-500 transition flex-shrink-0" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ) : (
                      <Link
                        href={link.href.startsWith("#") ? getLinkHref(link.href) : link.href}
                        className="text-gray-700 hover:text-teal-600 transition duration-300 hover:pl-1 text-sm sm:text-base"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
            Copyright © {currentYear}{" "}
            <span className="font-semibold text-teal-600">ticketché</span>. Tous droits réservés.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-center">
            <Link href="/politiques/conditions" className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition duration-300 hover:underline font-bold">
              Conditions Générales
            </Link>
            <Link href="/politiques/confidentialite" className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition duration-300 font-bold hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
