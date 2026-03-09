"use client";

import { MapPin, Envelope, Phone, WhatsappLogo } from "@phosphor-icons/react";

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      {/* ── CONTACT SECTION ── */}
      <section className="bg-[#e6dfd9] py-16 px-4 mt-24 flex items-center justify-center">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Bloc coordonnées */}
          <div className="md:w-1/2 bg-[#692c00] text-white p-10 flex flex-col justify-center gap-6">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>Coordonnées</h2>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <MapPin weight="fill" className="w-6 h-6" />
              Abomey-Calavi, Parana, Bénin
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <Envelope weight="fill" className="w-6 h-6" />
              hello@ticketché.app
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <Phone weight="fill" className="w-6 h-6" />
              +229 01 62 60 83 58
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <WhatsappLogo weight="fill" className="w-6 h-6" />
              +229 01 49 80 80 36
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center gap-6">
            <h2 className="text-2xl font-semibold text-[#692c00]">Contactez-nous</h2>
            <p className="text-gray-700">
              Rejoignez l'écosystème TicketCHE et découvrez une expérience de
              réservation sécurisée, flexible et transparente. Une solution qui
              révolutionne la gestion de vos parkings, lavages et événements.
            </p>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Nom" className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
                <input type="text" placeholder="Prénom" className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              </div>
              <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              <textarea placeholder="Message" className="border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              <button type="submit" className="bg-[#692c00] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#805633] transition-colors">
                Envoyer
              </button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}