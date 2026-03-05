"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, LockKey, Eye, Database, UserCheck, Bell, FileText, Scales, Globe, ArrowClockwise, Envelope } from "@phosphor-icons/react";

const PrivacyPolicyPage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sections = [
    {
      icon: UserCheck,
      title: "1. Responsable du traitement des données",
      content: (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#005F69] mt-2"></div>
              <div>
                <p className="font-semibold text-gray-800">Application</p>
                <p className="text-gray-600">Ticketché</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#005F69] mt-2"></div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">support@ticketche.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#005F69] mt-2"></div>
              <div>
                <p className="font-semibold text-gray-800">Téléphone</p>
                <p className="text-gray-600">+229 0199984345</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#005F69] mt-2"></div>
              <div>
                <p className="font-semibold text-gray-800">Adresse</p>
                <p className="text-gray-600">Abomey-Calavi, Bénin</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Database,
      title: "2. Données collectées",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600">
            Nous collectons les données suivantes pour assurer le bon
            fonctionnement de l'application :
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                <span className="w-8 h-8 bg-[#005F69] text-white rounded-lg flex items-center justify-center text-sm mr-2">
                  1
                </span>
                Identification
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Nom et prénom</li>
                <li>• Adresse email</li>
                <li>• Numéro de téléphone</li>
                <li>• Date de naissance</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                <span className="w-8 h-8 bg-[#005F69] text-white rounded-lg flex items-center justify-center text-sm mr-2">
                  2
                </span>
                Véhicule
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Immatriculation</li>
                <li>• Marque et modèle</li>
                <li>• Couleur</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                <span className="w-8 h-8 bg-[#005F69] text-white rounded-lg flex items-center justify-center text-sm mr-2">
                  3
                </span>
                Localisation
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Position GPS (avec consentement)</li>
                <li>• Historique des parkings</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
              <h4 className="font-bold text-[#005F69] mb-3 flex items-center">
                <span className="w-8 h-8 bg-[#005F69] text-white rounded-lg flex items-center justify-center text-sm mr-2">
                  4
                </span>
                Paiement
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Informations de facturation</li>
                <li>• Historique des transactions</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-[#005F69] p-4 rounded-r-lg">
            <p className="text-sm text-gray-700">
              <strong>Note importante :</strong> Les données de carte bancaire
              sont traitées uniquement par nos prestataires certifiés (Stripe,
              PayPal) et ne sont jamais stockées sur nos serveurs.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Eye,
      title: "3. Pourquoi collectons-nous vos données ?",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Gestion des réservations",
              desc: "Traiter vos demandes de parking, garage et lavage",
            },
            {
              title: "Traitement des paiements",
              desc: "Facturation et gestion des transactions",
            },
            {
              title: "Communication",
              desc: "Confirmations, notifications et informations",
            },
            {
              title: "Amélioration du service",
              desc: "Analyse et optimisation de l'application",
            },
            {
              title: "Support client",
              desc: "Répondre à vos questions et problèmes",
            },
            { title: "Sécurité", desc: "Prévention des fraudes et sécurité" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-white`}
            >
              <div
                className={`w-10 h-10 rounded-full bg-[#005F69] text-white flex items-center justify-center font-bold mb-3`}
              >
                {idx + 1}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      icon: Scales,
      title: "4. Base légale du traitement",
      content: (
        <div className="space-y-3">
          {[
            {
              title: "Exécution du contrat",
              desc: "Fourniture des services demandés",
            },
            {
              title: "Consentement",
              desc: "Acceptation explicite du traitement (ex: géolocalisation)",
            },
            {
              title: "Intérêt légitime",
              desc: "Amélioration des services et prévention des fraudes",
            },
            {
              title: "Obligation légale",
              desc: "Respect des obligations fiscales et comptables",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-[#005F69] text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Globe,
      title: "5. Partage et destinataires des données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Vos données peuvent être partagées avec les destinataires suivants,
            uniquement dans le cadre strict de nos services :
          </p>
          <div className="grid gap-3">
            {[
              {
                icon: "🏢",
                title: "Gestionnaires de parkings",
                desc: "Pour traiter vos réservations",
              },
              {
                icon: "💳",
                title: "Prestataires de paiement",
                desc: "Stripe, PayPal pour paiements sécurisés",
              },
              {
                icon: "☁️",
                title: "Services d'hébergement",
                desc: "Stockage sécurisé des données",
              },
              {
                icon: "📧",
                title: "Services de communication",
                desc: "Envoi d'emails et notifications",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-green-200 transition-all"
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl">
            <p className="text-green-900 font-semibold">
              ⚠️ Important : Nous ne vendons jamais vos données personnelles à
              des tiers.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: "6. Durée de conservation des données",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              type: "Données de compte",
              duration: "Jusqu'à suppression + 1 an",
              color: "bg-green-100 text-green-800",
            },
            {
              type: "Données de transaction",
              duration: "10 ans",
              color: "bg-green-100 text-green-800",
            },
            {
              type: "Données de géolocalisation",
              duration: "6 mois maximum",
              color: "bg-green-100 text-green-800",
            },
            {
              type: "Logs de connexion",
              duration: "1 an",
              color: "bg-green-100 text-green-800",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${item.color}`}
              >
                {item.duration}
              </div>
              <h4 className="font-bold text-gray-800">{item.type}</h4>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Shield,
      title: "7. Vos droits sur vos données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              {
                title: "Droit d'accès",
                desc: "Consulter vos données",
                icon: "👁️",
              },
              {
                title: "Droit de rectification",
                desc: "Corriger vos données",
                icon: "✏️",
              },
              {
                title: "Droit à l'effacement",
                desc: "Supprimer vos données",
                icon: "🗑️",
              },
              {
                title: "Droit à la portabilité",
                desc: "Récupérer vos données",
                icon: "📦",
              },
              {
                title: "Droit d'opposition",
                desc: "Refuser le traitement",
                icon: "🚫",
              },
              {
                title: "Droit à la limitation",
                desc: "Limiter le traitement",
                icon: "⏸️",
              },
            ].map((right, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100"
              >
                <span className="text-2xl">{right.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{right.title}</h4>
                  <p className="text-sm text-gray-600">{right.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#005f69] rounded-2xl p-6 text-white">
            <h4 className="font-bold text-lg mb-4">
              Pour exercer vos droits :
            </h4>
            <div className="space-y-2">
              <p className="flex items-center">
                <Envelope className="w-5 h-5 mr-2" /> support@ticketche.com
              </p>
              <p className="flex items-center">
                💬 Directement depuis les paramètres de l'application
              </p>
            </div>
            <p className="mt-4 text-green-100 text-sm">
              ⏱️ Délai de réponse : 30 jours maximum
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: LockKey,
      title: "8. Sécurité de vos données",
      content: (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "🔐",
              title: "Chiffrement SSL/TLS",
              desc: "Communications sécurisées",
            },
            {
              icon: "🛡️",
              title: "Serveurs certifiés",
              desc: "Stockage sécurisé",
            },
            {
              icon: "🔑",
              title: "Authentification forte",
              desc: "Gestion des accès",
            },
            {
              icon: "💾",
              title: "Sauvegardes régulières",
              desc: "Plan de reprise d'activité",
            },
            {
              icon: "🔍",
              title: "Audits de sécurité",
              desc: "Vérifications régulières",
            },
            {
              icon: "⚡",
              title: "Monitoring 24/7",
              desc: "Surveillance continue",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-5 bg-white border-2 border-gray-100 rounded-xl text-center hover:border-green-200 hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      icon: ArrowClockwise,
      title: "9. Cookies et technologies de suivi",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            L'application utilise des technologies similaires aux cookies pour :
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Maintenir votre session connectée",
              "Mémoriser vos préférences",
              "Analyser l'utilisation",
              "Améliorer les performances",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-[#005F69] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            💡 Vous pouvez gérer ces préférences depuis les paramètres de
            l'application.
          </p>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "10. Modifications de la politique",
      content: (
        <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
          <p className="text-gray-700 leading-relaxed">
            Nous pouvons modifier cette politique à tout moment. En cas de
            modification importante, vous serez informé par notification dans
            l'application ou par email. Nous vous encourageons à consulter
            régulièrement cette page.
          </p>
        </div>
      ),
    },
    {
      icon: Envelope,
      title: "11. Contact",
      content: (
        <div className="space-y-4">
          <div className="bg-[#005f69] rounded-2xl p-6 text-white">
            <h4 className="font-bold text-lg mb-4">
              Délégué à la Protection des Données (DPO)
            </h4>
            <div className="space-y-2">
              <p className="flex items-center">
                <Envelope className="w-5 h-5 mr-2" /> support@ticketche.com
              </p>
              <p className="flex items-center">📞 [Numéro de téléphone]</p>
              <p className="flex items-center">📍 [Adresse complète]</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#005f69] text-white py-28 lg:pt-36 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Politique de confidentialité
            </h1>
            <p className="text-xl text-green-100 mb-2">
              Votre vie privée est notre priorité
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#005F69]"
        >
          <p className="md:text-lg text-gray-700 leading-relaxed">
            Chez <span className="font-bold text-[#005F69]">Ticketché</span>, nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. Cette politique explique de manière transparente comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-[#005f69] rounded-xl flex items-center justify-center flex-shrink-0">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="md:text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            <div>{section.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;