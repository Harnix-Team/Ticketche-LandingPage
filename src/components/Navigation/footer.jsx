"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import { AppDownloadButtons } from "../Appdownloadbuttons";

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

  return (
    <footer className="relative text-black overflow-hidden border-t border-[#8fbdc2]">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

          {/* Logo + description + réseaux sociaux */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Image
                src="/images/logo.png"
                alt="Ticketché Logo"
                width={160}
                height={54}
                className="mb-6"
              />
              <p className="text-gray-800 text-sm leading-relaxed">
                <b>ticketché</b> simplifie la gestion de vos véhicules avec une
                solution numérique innovante et intuitive.
              </p>
            </div>

            {/* Réseaux sociaux en bas, alignés avec les boutons */}
            <div className="flex items-center gap-4 mt-16">
              <Link href="/" className="p-2 rounded-full hover:scale-110 transition">
                <FacebookLogo size={24} color="#005f69" />
              </Link>
              <Link href="/" className="p-2 rounded-full hover:scale-110 transition">
                <InstagramLogo size={24} color="#005f69" />
              </Link>
              <Link href="/" className="p-2 rounded-full hover:scale-110 transition">
                <LinkedinLogo size={24} color="#005f69" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
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

          {/* Liens utiles */}
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

          {/* Contact + boutons app en bas */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
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

            {/* Boutons Apple + Google en bas, alignés avec les icônes sociales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px", marginTop: "150px" }}
            >
              <a href="https://apps.apple.com/app/ticketche/id6743762073" target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" style={{ height: "40px", width: "auto" }} />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: "40px", width: "auto" }} />
              </a>
            </motion.div>
          </div>

        </div>

        {/* Copyright centré */}
        <div className="mt-20 pt-8 text-center border-t border-[#8fbdc2]">
          <p className="text-gray-700 text-sm">
            © {currentYear}{" "}
            <span className="font-semibold text-[#005f69]">ticketché</span>.
            Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};