"use client";

import { Users, Target, Trophy } from "@phosphor-icons/react";

export default function AboutPage() {
  return (
    <main className="bg-[#f6f7f8] font-archivo">

      {/* HERO */}
      <section className="relative bg-[#016b73] pt-40 pb-56 rounded-t-[140px]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold !text-white mb-4">
            À propos de Ticketché
          </h1>
          <p className="max-w-xl mx-auto !text-white font-bold text-xl">
            Ticketché simplifie la gestion de vos événements, billets et services pour une expérience complète et fluide.
          </p>
        </div>

        {/* IMAGES */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-80px] flex gap-4 items-end">
          <img
            src="https://images.pexels.com/photos/7652126/pexels-photo-7652126.jpeg"
            className="w-[220px] h-[200px] object-cover rounded-xl shadow-xl"
            alt="Événement Ticketché"
          />
          <img
            src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
            className="w-[220px] h-[150px] object-cover rounded-xl shadow-xl self-center"
            alt="Paiement Ticketché"
          />
          <img
            src="https://images.pexels.com/photos/5439402/pexels-photo-5439402.jpeg"
            className="w-[220px] h-[200px] object-cover rounded-xl shadow-xl"
            alt="Services Ticketché"
          />
          <img
            src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
            className="w-[220px] h-[150px] object-cover rounded-xl shadow-xl self-center"
            alt="Gestion emplacements Ticketché"
          />
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS PRINCIPALES */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24">
        <h2 className="text-3xl font-semibold text-gray-900 mb-10 max-w-xl">
          Ce que Ticketché vous permet de faire
        </h2>
        <div className="grid md:grid-cols-2 gap-12 text-gray-600 leading-relaxed">
          <p>
            Gérez vos événements et tickets pour concerts, festivals, réunions en présentiel ou en ligne. Ajoutez des emplacements, parkings, garages ou services de lavage.
          </p>
          <p>
            Recevez des avis, utilisez le paiement Mobile Money ou le portefeuille numérique, appliquez des codes promo et simplifiez l’expérience pour vos participants.
          </p>
        </div>
      </section>

      {/* IMAGE + TEXTE (We empower) */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl order-1 md:order-2">
          <img
            src="https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg"
            className="w-full h-[380px] object-cover"
            alt="Interface Ticketché"
          />
        </div>

        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Gérez vos événements et services facilement
          </h2>
          <p className="text-gray-600 mb-4">
            Créez vos événements, enregistrez vos emplacements, parkings et services additionnels. Payez vos tickets directement depuis Ticketché.
          </p>
          <p className="text-gray-600">
            Offrez à vos participants une expérience complète et fluide avec la billetterie, les avis et les codes promo.
          </p>
        </div>
      </section>

      {/* SECTION “OUR MISSION” */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl order-1 md:order-1">
          <img
            src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
            className="w-full h-[380px] object-cover"
            alt="Mission Ticketché"
          />
        </div>

        <div className="order-2 md:order-2">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Notre mission
          </h2>
          <p className="text-gray-600 mb-4">
            Faciliter l’accès aux événements et simplifier la gestion des services comme les parkings, emplacements et lavages pour les organisateurs et participants.
          </p>
          <p className="text-gray-600">
            Nous voulons que chaque événement soit simple à gérer, sécurisé et agréable pour tous grâce à Ticketché.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Les atouts de Ticketché
          </h2>
          <p className="text-gray-600">
            Tous les services nécessaires pour vos événements et emplacements en un seul endroit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="bg-[#016b73] text-white p-4 rounded-full mb-4">
              <Users size={28} weight="fill" />
            </div>
            <h3 className="font-semibold mb-2">Billetterie & Événements</h3>
            <p className="text-gray-600 text-sm">
              Créez, vendez et gérez vos tickets pour tous types d’événements.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-[#016b73] text-white p-4 rounded-full mb-4">
              <Target size={28} weight="fill" />
            </div>
            <h3 className="font-semibold mb-2">Services & Emplacements</h3>
            <p className="text-gray-600 text-sm">
              Ajoutez parkings, garages, lavages et autres services pour vos participants.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-[#016b73] text-white p-4 rounded-full mb-4">
              <Trophy size={28} weight="fill" />
            </div>
            <h3 className="font-semibold mb-2">Paiements & Promotions</h3>
            <p className="text-gray-600 text-sm">
              Mobile Money, portefeuille numérique et codes promo pour une expérience complète.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}