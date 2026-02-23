"use client";
import { useState } from "react";
import Image from "next/image";
import { Confetti } from "../Confetti";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation basique
    if (!formData.name || !formData.email || !formData.message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Construction du message WhatsApp en bon français
    const whatsappMessage = `Bonjour ! 👋

    Je vous contacte via le site Ticketché.

    *Informations de contact :*
    - Nom : ${formData.name}
    - Email : ${formData.email}${
          formData.phone ? `\n• Téléphone : ${formData.phone}` : ""
        }

    *Message :*
    ${formData.message}

    Merci de me recontacter dès que possible.

    Cordialement,
    ${formData.name}`;

    // Encodage du message pour l'URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    const whatsappNumber = "22999984345";

    // Ouverture de WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    // Réinitialisation du formulaire
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-10 lg:py-20 px-4 relative overflow-hidden">
      <div className="hidden lg:block">
        <Confetti density="medium" colors="default" />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Section Image */}
          <div className="relative hidden md:block">
            <Image
              src="/images/Contact/contact.png"
              alt="Contact Ticketché"
              width={600}
              height={500}
              className="rounded-2xl object-cover"
            />
          </div>

          {/* Formulaire de contact */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Contactez-nous
            </h2>
            <p className="text-gray-600 mb-8">
              Vous avez une question, une suggestion ou besoin d'aide ?
              Remplissez le formulaire et notre équipe vous répondra dans les
              plus brefs délais.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-[#E9EEF2] border border-gray-300 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Votre nom et prénom(s)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-[#E9EEF2] border border-gray-300 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="votre-mail@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-[#E9EEF2] border border-gray-300 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+229 01xxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-[#E9EEF2] border border-gray-300 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Votre message..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-4 rounded-lg hover:bg-teal-800 transition duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Envoyer via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
