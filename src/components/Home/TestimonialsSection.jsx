"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Stéphane TOGBANOU",
      location: "Cotonou",
      quote:
        "Depuis que j'utilise ticketché, la gestion de mes parkings est devenue un jeu d'enfant. L'application est intuitive et m'a fait gagner un temps précieux!",
      avatar: "/images/users/user1.png",
    },
    {
      name: "Fatoumata DIALLO",
      location: "Porto-Novo",
      quote:
        "ticketché a complètement transformé ma façon de gérer mes véhicules professionnels. Gain de temps, traçabilité, simplicité - tout ce dont j'avais besoin !",
      avatar: "/images/users/user2.png",
    },
    {
      name: "Romuald SANNI",
      location: "Abomey-Calavi",
      quote:
        "Je ne peux plus me passer de ticketché. Suivre mes entretiens, trouver un parking, programmer un lavage - tout est devenu tellement simple.",
      avatar: "/images/users/user3.png",
    },
    {
      name: "Patrick HOUNDJANTO",
      location: "Parakou",
      quote:
        "En tant que professionnelle mobile, ticketché est mon assistant indispensable. Je gère mes déplacements avec une efficacité incroyable.",
      avatar: "/images/users/user4.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Nombre de témoignages à afficher (3 sur desktop, 1 sur mobile)
  const [itemsToShow, setItemsToShow] = useState(3);

  // Gérer le responsive
  useState(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth >= 768 ? 3 : 1);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsToShow >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsToShow) : prev - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  // Si pas assez d'éléments, compléter avec le début
  if (visibleTestimonials.length < itemsToShow) {
    const remaining = itemsToShow - visibleTestimonials.length;
    visibleTestimonials.push(...testimonials.slice(0, remaining));
  }

  return (
    <section id="reviews" className="pb-10 lg:pt-0 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Ils parlent de leur expérience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment ticketché simplifie le quotidien de nos
            utilisateurs à travers leurs témoignages.
          </p>
        </motion.div>

        <div className="relative">
          {/* Cards Slider */}
          <div className="overflow-hidden">
            <motion.div
              className="grid lg:grid-cols-3 gap-4"
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  {/* Avatar et infos en haut */}
                  <div className="flex items-center mb-4">
                    <div className="relative w-14 h-14 mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Citation */}
                  <p className="text-gray-700 text-md leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentIndex + itemsToShow >= testimonials.length}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Indicators (optionnel) */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
              length: Math.ceil(testimonials.length / itemsToShow),
            }).map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentIndex(idx * itemsToShow)}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / itemsToShow) === idx
                    ? "w-8 bg-teal-700"
                    : "w-2 bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
