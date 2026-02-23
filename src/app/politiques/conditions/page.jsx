"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  AlertCircle, 
  User, 
  Smartphone, 
  CreditCard, 
  RefreshCw, 
  Shield, 
  Lock, 
  Scale, 
  Mail,
  CheckCircle2,
  XCircle
} from "lucide-react";

const TermsAndConditionsPage = () => {
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
      icon: FileText,
      title: "1. Objet",
      content: (
        <p className="text-gray-600 leading-relaxed">
          Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation
          de l'application mobile Ticketché, ainsi que les droits et obligations des utilisateurs et de l'éditeur.
        </p>
      ),
    },
    {
      icon: AlertCircle,
      title: "2. Éditeur de l'application",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Application", value: "Ticketché" },
            { label: "Email", value: "support@ticketche.com" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#005f69] mt-2"></div>
              <div>
                <p className="font-semibold text-gray-800">{item.label}</p>
                <p className="text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Smartphone,
      title: "3. Accès à l'application",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            L'application Ticketché est accessible gratuitement via les plateformes Apple App Store et Google Play Store.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-100">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-bold text-gray-800 mb-1">Prérequis</h4>
              <p className="text-sm text-gray-600">Smartphone iOS ou Android compatible</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-100">
              <div className="text-3xl mb-2">🌐</div>
              <h4 className="font-bold text-gray-800 mb-1">Connexion</h4>
              <p className="text-sm text-gray-600">Internet requis (frais à votre charge)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: User,
      title: "4. Inscription et compte utilisateur",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Pour utiliser les services de Ticketché, l'utilisateur doit créer un compte personnel en fournissant
            des informations exactes et à jour.
          </p>
          <div className="space-y-3">
            {[
              { icon: "✅", text: "Fournir des informations exactes (nom, email, téléphone)" },
              { icon: "🔒", text: "Maintenir la confidentialité de vos identifiants" },
              { icon: "⚠️", text: "Signaler immédiatement toute utilisation frauduleuse" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: CheckCircle2,
      title: "5. Services proposés",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Ticketché met à disposition les services suivants :
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: "🅿️", title: "Réservation parking", desc: "Places en temps réel" },
              { icon: "📍", title: "Localisation", desc: "Parkings disponibles" },
              { icon: "🔧", title: "Gestion garages", desc: "Espaces de stationnement" },
              { icon: "🚿", title: "Lavage automobile", desc: "Services de nettoyage" },
              { icon: "📊", title: "Historique", desc: "Suivi des réservations" },
              { icon: "💳", title: "Paiements", desc: "Transactions sécurisées" },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-start space-x-3 p-4 bg-gradient-to-r from-teal-50 to-white rounded-lg border border-teal-100"
              >
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{service.title}</h4>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "6. Tarifs et paiement",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "💰", title: "Tarifs transparents", desc: "Prix affichés avec taxes incluses" },
              { icon: "🔐", title: "Paiements sécurisés", desc: "Stripe, PayPal certifiés" },
              { icon: "📧", title: "Reçus instantanés", desc: "Envoyés par email" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-5 bg-white border-2 border-gray-100 rounded-xl text-center hover:border-teal-200 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-xl">
            <p className="text-teal-900">
              <strong>🔒 Sécurité :</strong> Ticketché ne stocke aucune donnée de carte bancaire sur ses serveurs.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "7. Responsabilités",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
            <p className="text-green-900 font-semibold mb-2">
              Ticketché agit en tant qu'intermédiaire
            </p>
            <p className="text-green-800 text-sm">
              Entre les utilisateurs et les prestataires de services (parkings, garages, lavages)
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">Ticketché ne peut être tenu responsable de :</h4>
            {[
              "Dommages causés au véhicule pendant le stationnement",
              "Vol ou détérioration d'objets dans le véhicule",
              "Indisponibilité temporaire de l'application",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  !
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-white p-4 rounded-xl border border-teal-200">
            <p className="text-gray-700">
              <strong>⚠️ Responsabilité de l'utilisateur :</strong> Vérifier que le véhicule est correctement stationné et fermé
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Lock,
      title: "8. Propriété intellectuelle",
      content: (
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border-2 border-green-200">
          <p className="text-gray-700 leading-relaxed">
            L'ensemble des éléments de l'application Ticketché (logo, design, code source, textes, images) est
            protégé par les droits de propriété intellectuelle. Toute reproduction, représentation ou exploitation
            non autorisée est <span className="font-bold text-green-900">strictement interdite</span>.
          </p>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "9. Protection des données personnelles",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Ticketché collecte et traite les données personnelles conformément au RGPD et à notre Politique de
            Confidentialité.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: "👁️", title: "Droit d'accès", desc: "Consulter vos données" },
              { icon: "✏️", title: "Droit de rectification", desc: "Corriger vos données" },
              { icon: "🗑️", title: "Droit à l'effacement", desc: "Supprimer vos données" },
              { icon: "📦", title: "Droit à la portabilité", desc: "Récupérer vos données" },
            ].map((right, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-teal-50 to-white rounded-lg border border-teal-100">
                <span className="text-2xl">{right.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{right.title}</h4>
                  <p className="text-xs text-gray-600">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-xl">
            <p className="text-teal-900">
              <Mail className="w-5 h-5 inline mr-2" />
              <strong>Contact :</strong> support@ticketche.com
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: RefreshCw,
      title: "10. Modifications des CGU",
      content: (
        <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
          <p className="text-gray-700 leading-relaxed">
            Ticketché se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
            informés de toute modification par notification dans l'application ou par email. L'utilisation continue
            de l'application après modification vaut acceptation des nouvelles conditions.
          </p>
        </div>
      ),
    },
    {
      icon: Scale,
      title: "11. Droit applicable et litiges",
      content: (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-xl border-2 border-green-200">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-green-600" />
              Droit applicable
            </h4>
            <p className="text-gray-700">Les présentes CGU sont régies par le droit béninois.</p>
          </div>
          <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-xl border-2 border-green-200">
            <h4 className="font-bold text-gray-800 mb-2">En cas de litige</h4>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2 text-green-600">1.</span>
                <span>Recherche d'une solution amiable en priorité</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 text-green-600">2.</span>
                <span>À défaut, les tribunaux compétents de Cotonou sont seuls compétents</span>
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "12. Contact",
      content: (
        <div className="bg-gradient-to-r from-[#005f69] to-teal-700 rounded-2xl p-6 text-white">
          <h4 className="font-bold text-lg mb-4">Pour toute question concernant ces CGU</h4>
          <div className="space-y-3">
            <p className="flex items-center">
              <Mail className="w-5 h-5 mr-3" />
              support@ticketche.com
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-[#005f69] text-white py-28 lg:pt-36 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-xl text-teal-100 mb-2">
              Utilisation claire et transparente de Ticketché
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border-t-4 border-[#005f69]"
        >
          <div className="flex items-start space-x-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Bienvenue sur Ticketché
              </h2>
              <p className="md:text-lg text-gray-700 leading-relaxed">
                Ticketché est une application mobile de gestion de parkings, garages et services de lavage.
                En utilisant notre application, vous acceptez les présentes conditions générales d'utilisation.
              </p>
            </div>
          </div>
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

export default TermsAndConditionsPage;