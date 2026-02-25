"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Tag, Users, Ticket } from "lucide-react";
import { getDownloadLink } from "@/utils/deviceDetection";

const API_BASE_URL = "https://api.ticketche.com";

export const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadLink, setDownloadLink] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    setDownloadLink(getDownloadLink());
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getMinPrice = (tickets) => {
    const prices = tickets.map((t) => t.price).filter((p) => p > 0);
    if (prices.length === 0) return "Gratuit";
    return Math.min(...prices).toLocaleString() + " FCFA";
  };

  const getEventImage = (event) => {
    if (event.images && event.images.length > 0) {
      return event.images[0].url;
    }
    return "/images/logo.png";
  };

  const handleEventClick = (event) => {
    window.open(`/events/${event.id}`, "_blank");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <section className="pt-10 lg:pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-600">Chargement des evenements...</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section id="events" className="pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre */}
        <motion.div
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl md:text-4xl max-w-2xl mx-auto font-bold text-gray-800 mb-4">
            Evenements disponibles sur ticketche
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Decouvrez les prochains evenements et reservez vos tickets en
            quelques clics.
          </p>
        </motion.div>

        {/* Grille */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {events.slice(0, 6).map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              onClick={() => handleEventClick(event)}
              className="bg-gray-50 border border-gray-200 p-3 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative w-full pt-[56%] overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={getEventImage(event)}
                    alt={event.title}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                </motion.div>

                {/* Badge categorie */}
                {event.category && (
                  <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                    <Tag className="w-3 h-3 text-[#005f69]" />
                    <span className="text-xs font-semibold text-gray-800">
                      {event.category.title}
                    </span>
                  </div>
                )}

                {/* Badge featured */}
                {event.is_featured && (
                  <div className="absolute top-3 right-3 bg-[#692C00] rounded-full px-3 py-1 shadow-md">
                    <span className="text-xs font-semibold text-white">
                      A la une
                    </span>
                  </div>
                )}

                {/* Badge format */}
                <div className="absolute bottom-3 right-3 bg-[#005f69] rounded-full px-3 py-1 shadow-md">
                  <span className="text-xs font-semibold text-white">
                    {event.format}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="py-4 px-2">
                {/* Titre */}
                <motion.h3
                  className="text-md font-bold text-gray-900 mb-2"
                  whileHover={{ color: "#005f69" }}
                  transition={{ duration: 0.2 }}
                >
                  {event.title}
                </motion.h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 text-[#005f69]" />
                  <span>{formatDate(event.start_date)}</span>
                </div>

                {/* Lieu */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 text-[#005f69]" />
                  <span className="truncate">{event.location_name}</span>
                </div>

                <div className="flex justify-between items-center">
                  {/* Prix */}
                  <div className="flex items-center gap-1 text-[#692C00]">
                    <Ticket className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {getMinPrice(event.tickets)}
                    </span>
                  </div>

                  {/* Reservations */}
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.reservations_count} reservation
                      {event.reservations_count > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block cursor-pointer bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg relative overflow-hidden group no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#047a7f] to-[#005f69] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Voir tous les evenements
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
