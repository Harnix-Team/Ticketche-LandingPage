"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

export default function APropos() {
  return (
    <main className="bg-white min-h-screen pt-24">

      {/* ── Banner titre ── */}
      <motion.div
        className="apropos-container mx-auto px-4 mb-12"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <div className="apropos-banner">
          <h1>Qui sommes nous ?</h1>
        </div>
      </motion.div>

      {/* ── Paragraphes intro ── */}
      <div className="apropos-container apropos-intro mx-auto px-6 mb-14">
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <strong>TicketCHE</strong> est une application mobile tout-en-un qui
          sécurise et simplifie la gestion de vos services du quotidien au Bénin.
          Elle repose sur un système de{" "}
          <strong>QR codes intelligents</strong> pour digitaliser les entrées et
          sorties, et utilise <strong>l'argent mobile</strong> pour fluidifier et
          garantir chaque transaction entre utilisateurs et prestataires.
        </motion.p>

        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          Avec <strong>TicketCHE</strong>, les conducteurs peuvent gérer leurs
          parkings, lavages et garages en toute sérénité grâce à des{" "}
          <strong>tickets numériques horodatés</strong>, tandis que les
          organisateurs d'événements diffusent et vendent leurs billets{" "}
          <strong>de manière fiable et instantanée</strong>. La plateforme
          intègre également des{" "}
          <strong>outils de gestion pour les gérants</strong> pour un suivi
          efficace des opérations et des encaissements. Son objectif est de
          rendre les services urbains{" "}
          <strong style={{ color: "#692C00" }}>
            plus transparents, sécurisés et accessibles
          </strong>{" "}
          pour tous les acteurs du marché béninois.
        </motion.p>
      </div>

      {/* ── Bloc 2 colonnes ── */}
      <motion.div
        className="apropos-container apropos-grid-2col mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
      >
        {/* Colonne gauche — carte texte */}
        <div className="apropos-card-left">
          <div>
            <h2>Nous vous facilitons la gestion de vos services</h2>
            <p>
              Simplifiez la gestion de vos stationnements, lavages et
              événements avec une solution sécurisée et digitalisée. Grâce à{" "}
              <strong>TicketCHE</strong>, effectuez vos paiements en toute
              tranquillité et assurez un suivi transparent de chaque opération
              en temps réel.
            </p>
          </div>

          {/* Stats */}
          <div className="apropos-stats">
            {[
              { value: "2 villes", label: "Cotonou & Abomey-Calavi" },
              { value: "4 services", label: "Parking · Lavage · Garage · Événements" },
              { value: "100%", label: "Paiements sécurisés & cryptés" },
            ].map((stat, i) => (
              <div key={i} className="apropos-stat-item">
                <div className="apropos-stat-dot" />
                <div>
                  <span className="apropos-stat-value">{stat.value}</span>
                  <span className="apropos-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite — image */}
        <div className="flex items-center justify-center mt-10">
          <div className="apropos-img-wrap">
            <Image
              src="/images/apropos.png"
              alt="TicketCHE en action"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* ── MISSION ── */}
      <motion.div
        className="apropos-container mx-auto px-4 mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        custom={0}
      >
        <div className="mb-8">
          <h2 className="title-sub mb-8">
            Notre mission ?<br />
            <span>Apporter de la transparence dans le marché</span>
          </h2>
        </div>

        <div className="apropos-mission-grid">
          {/* Cartes gauche */}
          <div className="apropos-cards-col">
            {[
              {
                title: "Une solution pour un marché inclusif",
                desc: "La mission de TicketCHE est d'apporter transparence, sécurité et fluidité à l'ensemble des services urbains au Bénin. En résolvant les problèmes de files d'attente, de billets perdus et de paiements non sécurisés, nous offrons une solution digitale intégrée pour des transactions simples, sûres et valorisantes pour toutes les parties prenantes.",
              },
              {
                title: "Innovation technologique pour la confiance",
                desc: "En s'appuyant sur les QR codes intelligents, le mobile money et la digitalisation des opérations, TicketCHE révolutionne durablement l'expérience des services du quotidien, instaurant une nouvelle norme de fiabilité et d'inclusion financière sur les marchés urbains béninois.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 14px 36px rgba(105,44,0,0.15)",
                  borderColor: "#692C00",
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="apropos-mission-card"
              >
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Image droite */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="apropos-mission-img"
          >
            <Image src="/images/mission.jpg" alt="Mission TicketCHE" fill className="object-cover" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── VISION ── */}
      <motion.div
        className="apropos-container mx-auto px-4 mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        custom={0}
      >
        <div className="apropos-vision-grid">
          {/* Image gauche */}
          <div className="apropos-vision-img">
            <Image src="/images/vision.jpg" alt="Vision TicketCHE" fill className="object-cover" />
          </div>

          {/* Texte droite */}
          <div className="apropos-vision-text">
            <h2>Notre mission ?</h2>
            <h3>
              Digitaliser les services urbains au{" "}
              <span style={{ color: "#692C00" }}>Bénin</span>
            </h3>
            <p className="vision-label">Vision ?</p>
            <p>
              D'ici 2030, TicketCHE s'imposera comme l'écosystème digital
              leader au Bénin pour une expérience de services urbains
              révolutionnée. Grâce à sa plateforme intégrée alliant QR codes
              intelligents, mobile money et intelligence artificielle,
              TicketCHE deviendra la solution privilégiée pour des transactions
              transparentes et sécurisées à chaque étape. Pionnière en matière
              de confiance et d'efficacité, TicketCHE insufflera une nouvelle
              norme de fiabilité sur les marchés urbains béninois.
            </p>
          </div>
        </div>

        {/* Barre stats */}
        <motion.div
          className="apropos-stats-bar"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: "+ 3000", label: "utilisateurs" },
            { value: "+ 500", label: "tickets émis" },
            { value: "+ 50", label: "établissements" },
            { value: "4", label: "services disponibles" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="apropos-stats-bar__value">{stat.value}</div>
              <div className="apropos-stats-bar__label">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── CTA ── */}
      <section className="apropos-cta">
        <div className="apropos-cta__inner">
          <motion.div
            className="apropos-cta__text"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>Rejoignez notre communauté dès aujourd'hui</h2>
            <p>
              Ne manquez pas l'opportunité de transformer votre expérience avec
              TicketCHE. Téléchargez l'application dès maintenant pour être
              parmi les premiers à découvrir nos services innovants au Bénin.
            </p>
          </motion.div>

          <motion.a
            href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="apropos-cta__btn"
          >
            Télécharger
          </motion.a>
        </div>
      </section>

    </main>
  );
}
