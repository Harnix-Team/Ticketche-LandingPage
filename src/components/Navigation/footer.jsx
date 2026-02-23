"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { AppDownloadButtons } from "../Appdownloadbuttons";

export const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const currentYear = new Date().getFullYear();

  // Fonction pour gérer les liens avec ancres
  const getLinkHref = (anchor) => {
    return isHomePage ? anchor : `/${anchor}`;
  };

  const footerLinks = {
    "Liens utiles": [
      { label: "À propos", href: "#about" },
      { label: "Emplacements", href: "#locations" },
      { label: "Avis clients", href: "#reviews" },
      { label: "Contactez-nous", href: "#contact" },
      { label: "Recrutement", href: "https://recrutement.ticketche.com" },
    ],
    "Réseaux sociaux": [
      {
        label: "Facebook",
        href: "/",
        icon: Facebook,
      },
      {
        label: "Instagram",
        href: "/",
        icon: Instagram,
      },
      {
        label: "LinkedIn",
        href: "/",
        icon: Linkedin,
      },
    ],
    "Informations de contact": [
      { label: "(+229) 99 98 43 45", href: "tel:+22999984345" },
      { label: "support@ticketche.com", href: "mailto:support@ticketche.com" },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] shadow-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Logo et Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6 space-x-4">
              <Image
                src="/images/logo.png"
                alt="Ticketché Logo"
                width={180}
                height={60}
                className="max-w-full transition transform hover:scale-105"
              />
            </div>
            <p className="text-gray-700 mb-6 text-md leading-relaxed">
              <b>ticketché</b> simplifie la gestion de vos véhicules avec une solution
              numérique innovante et intuitive.
            </p>
            
            {/* Composant de boutons de téléchargement */}
            <AppDownloadButtons />
          </div>

          {/* Colonnes de liens */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div
              key={category}
              className="
                col-span-1 
                md:col-span-1 
                flex flex-col 
                space-y-4
                order-2
                md:order-none
              "
            >
              <h3 className="font-bold text-gray-900 mb-3 text-lg pb-2">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index} className="group">
                    {link.icon ? (
                      <Link
                        href={link.href}
                        className="
                          flex items-center space-x-3 
                          text-gray-700 hover:text-teal-600 
                          transition duration-300
                          group-hover:translate-x-2
                        "
                      >
                        <link.icon className="w-5 h-5 text-gray-500 group-hover:text-teal-500 transition" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ) : (
                      <Link
                        href={
                          link.href.startsWith("#")
                            ? getLinkHref(link.href)
                            : link.href
                        }
                        className="
                          text-gray-700 hover:text-teal-600 
                          transition duration-300
                          hover:pl-2
                          text-md
                        "
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

        {/* Copyright et Informations */}
        <div
          className="
            mt-12 pt-8 border-t border-gray-200 
            flex flex-col md:flex-row 
            justify-between 
            items-center 
            space-y-4 md:space-y-0
          "
        >
          <p className="text-gray-600 text-sm text-center md:text-left">
            Copyright © {currentYear}{" "}
            <span className="font-semibold text-teal-600">ticketché</span>. Tous
            droits réservés.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-center">
            <Link
              href="/politiques/conditions"
              className="
                text-sm text-gray-600 
                hover:text-teal-600 
                transition duration-300
                hover:underline
                font-bold
              "
            >
              Conditions Générales
            </Link>
            <Link
              href="/politiques/confidentialite"
              className="
                text-sm text-gray-600 
                hover:text-teal-600 
                transition duration-300
                font-bold
                hover:underline
              "
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};