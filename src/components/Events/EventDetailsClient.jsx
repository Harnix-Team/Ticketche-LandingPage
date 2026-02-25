"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  User,
  Tag,
  Ticket,
  ArrowLeft,
  Navigation,
  Link,
  Users,
} from "lucide-react";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
      // 1. Essaie localStorage d'abord
      try {
        const stored = localStorage.getItem("selectedEvent");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === id) {
            setEvent(parsed);
            setLoading(false);
            // Fetch quand meme les details complets en arriere plan
            fetchEventDetails();
            return;
          }
        }
      } catch {}

      // 2. Fetch les details complets
      await fetchEventDetails();
    };

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#005f69] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Evenement introuvable</p>
          <button
            onClick={() => window.close()}
            className="text-[#005f69] underline"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const mapsUrl =
    "https://maps.google.com/?q=" + event.latitude + "," + event.longitude;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.close()}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg truncate">
            {event.title}
          </h1>
          {event.category && (
            <span className="ml-auto flex items-center gap-1 bg-[#005f69]/10 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3 text-[#005f69]" />
              <span className="text-xs font-semibold text-[#005f69]">
                {event.category.title}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Galerie */}
        {event.images?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={event.images[activeImage]?.url}
                alt={event.title}
                fill
                className="object-cover"
              />
              {/* Badge format */}
              <div className="absolute bottom-3 right-3 bg-[#005f69] rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-white">
                  {event.format}
                </span>
              </div>
              {event.is_featured && (
                <div className="absolute top-3 right-3 bg-[#692C00] rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-white">
                    A la une
                  </span>
                </div>
              )}
            </div>
            {event.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {event.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={
                      "relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition " +
                      (activeImage === i
                        ? "border-[#005f69]"
                        : "border-transparent")
                    }
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* A propos */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            A propos de cet evenement
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </motion.section>

        {/* Details */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Details</h2>

          {/* Dates */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-[#005f69] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700">Date de debut</p>
              <p className="text-gray-500 text-sm">
                {formatDate(event.start_date)}
              </p>
              {event.end_date && (
                <>
                  <p className="font-semibold text-gray-700 mt-2">
                    Date de fin
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(event.end_date)}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-[#005f69] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700">
                {event.location_name}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005f69] text-sm underline"
              >
                Voir sur Google Maps
              </a>
            </div>
          </div>

          {/* Format */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <Tag className="w-5 h-5 text-[#005f69] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700">Format</p>
              <p className="text-gray-500 text-sm">{event.format}</p>
            </div>
          </div>

          {/* Lien en ligne */}
          {event.online_link && (
            <div className="flex items-start gap-3 py-3 border-b border-gray-100">
              <Link className="w-5 h-5 text-[#005f69] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-700">Lien en ligne</p>
                <a
                  href={event.online_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005f69] text-sm underline truncate block"
                >
                  {event.online_link}
                </a>
              </div>
            </div>
          )}

          {/* Capacite */}
          {event.capacity && (
            <div className="flex items-start gap-3 py-3">
              <Users className="w-5 h-5 text-[#005f69] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-700">Capacite</p>
                <p className="text-gray-500 text-sm">
                  {event.capacity} personnes
                </p>
              </div>
            </div>
          )}
        </motion.section>

        {/* Tickets */}
        {event.tickets?.length > 0 && (
          <motion.section
            className="bg-white rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#005f69]" />
              Tickets disponibles
            </h2>
            <div className="space-y-3">
              {event.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {ticket.title}
                    </p>
                    {ticket.quantity && (
                      <p className="text-sm text-gray-500">
                        {ticket.quantity - ticket.quantity_sold} restants sur{" "}
                        {ticket.quantity}
                      </p>
                    )}
                  </div>
                  <span
                    className={
                      "font-bold px-3 py-1 rounded-full text-sm " +
                      (ticket.price === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-[#005f69]/10 text-[#005f69]")
                    }
                  >
                    {ticket.price === 0
                      ? "Gratuit"
                      : ticket.price.toLocaleString() + " FCFA"}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Organisateur */}
        {event.organizer && (
          <motion.section
            className="bg-white rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#005f69]" />
              Organisateur
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#005f69]/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-[#005f69]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {event.organizer.first_name} {event.organizer.second_name}
                </p>
                <p className="text-sm text-gray-500">
                  {event.organizer.address}
                </p>
                <p className="text-sm text-[#005f69]">
                  {event.organizer.country_code} {event.organizer.phone_number}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Programme */}
        {event.program_items?.length > 0 && (
          <motion.section
            className="bg-white rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Programme</h2>
            <div className="space-y-3">
              {event.program_items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-[#005f69] flex-shrink-0 mt-2" />
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    )}
                    {item.start_time && (
                      <p className="text-xs text-[#005f69] mt-1">
                        {item.start_time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Emplacements lies */}
        {event.places?.length > 0 && (
          <motion.section
            className="bg-white rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#005f69]" />
              Emplacements lies
            </h2>
            {event.places.map((place) => (
              <div
                key={place.id}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-[#692C00]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#692C00]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{place.name}</p>
                  <p className="text-sm text-gray-500">
                    {place.city} - {place.available_places} places disponibles
                  </p>
                </div>
              </div>
            ))}
          </motion.section>
        )}
        {/* Bouton prendre un ticket */}
        <motion.div
          className="text-center pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#692C00] to-[#8B3A00] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Ticket className="w-5 h-5" />
            Prendre un ticket
          </a>
        </motion.div>
        {/* Bouton itineraire */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Navigation className="w-5 h-5" />
            Voir l'itineraire
          </a>
        </motion.div>
      </div>
    </main>
  );
}
