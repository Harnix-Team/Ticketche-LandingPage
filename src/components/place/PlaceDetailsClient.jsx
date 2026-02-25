"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import { MapPin, Clock, Star, User, Users, Wrench, ArrowLeft, Navigation } from "lucide-react";

export default function PlaceDetailsClient() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        const stored = localStorage.getItem("selectedPlace");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === id) {
            setPlace(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        const response = await fetchAllPlaces();
        if (response.success) {
          const found = response.data.find((p) => p.id === id);
          if (found) setPlace(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  const formatImage = (img) => {
    if (!img) return "/images/logo.png";
    return img.replace("/storage/app/public", "/storage");
  };

  const getPlaceRating = (p) => {
    if (p.noteUsers && p.noteUsers.length > 0) {
      const total = p.noteUsers.reduce((sum, n) => sum + parseFloat(n.star), 0);
      return (total / p.noteUsers.length).toFixed(1);
    }
    return null;
  };

  const getServicesByCategory = (services) => {
    return services
      .filter((s) => s.pivot.status === "ON")
      .reduce((acc, s) => {
        const cat = s.service_category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
      }, {});
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

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Emplacement introuvable</p>
          <button onClick={() => window.close()} className="text-[#005f69] underline">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const rating = getPlaceRating(place);
  const servicesByCategory = getServicesByCategory(place.services);
  const mapsUrl = "https://maps.google.com/?q=" + place.latitude + "," + place.longitude;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => window.close()} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-800 text-lg truncate">{place.name}</h1>
          {rating && (
            <span className="ml-auto flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-sm">{rating}</span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Galerie */}
        {place.images?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
              <Image src={formatImage(place.images[activeImage]?.link)} alt={place.name} fill className="object-cover" />
            </div>
            {place.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {place.images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveImage(i)} className={"relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition " + (activeImage === i ? "border-[#005f69]" : "border-transparent")}>
                    <Image src={formatImage(img.link)} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* A propos */}
        <motion.section className="bg-white rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h2 className="text-xl font-bold text-gray-800 mb-3">A propos</h2>
          <p className="text-gray-600 leading-relaxed">{place.description}</p>
          <div className="flex items-center gap-2 mt-4 text-[#005f69]">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{place.city}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            <span>{place.available_places} places disponibles sur {place.total_place}</span>
            {place.minimum_price && (
              <span className="font-semibold text-[#692C00]">A partir de {place.minimum_price} FCFA</span>
            )}
          </div>
        </motion.section>

        {/* Horaires */}
        <motion.section className="bg-white rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#005f69]" />
            Horaires d'ouverture
          </h2>
          <div className="space-y-2">
            {place.availabilities?.map((a) => (
              <div key={a.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">{a.day}</span>
                <span className="text-[#005f69] font-semibold">{a.open_hour} - {a.close_hour}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Services */}
        <motion.section className="bg-white rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#005f69]" />
            Services proposes
          </h2>
          {Object.entries(servicesByCategory).map(([category, services]) => (
            <div key={category} className="mb-5">
              <h3 className="text-sm font-bold text-[#692C00] uppercase tracking-wide mb-3">{category}</h3>
              <div className="space-y-2">
                {services.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{s.pivot.service_type_name}</span>
                    <span className="font-bold text-[#005f69]">{s.pivot.price.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        {/* Equipe */}
        <motion.section className="bg-white rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#005f69]" />
            Equipe
          </h2>
          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#005f69]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#005f69]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{place.owner.first_name} {place.owner.second_name}</p>
              <p className="text-sm text-gray-500">Proprietaire - {place.owner.address}</p>
            </div>
          </div>
          {place.managers?.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 rounded-full bg-[#692C00]/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[#692C00]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{m.user.first_name} {m.user.second_name}</p>
                <p className="text-sm text-gray-500">Gerant - {m.user.address}</p>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Avis */}
        {place.noteUsers?.length > 0 && (
          <motion.section className="bg-white rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#005f69]" />
              Avis clients ({place.noteUsers.length})
            </h2>
            <div className="space-y-4">
              {place.noteUsers.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">{note.user.first_name} {note.user.second_name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(parseInt(note.star))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{note.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Bouton itineraire */}
        <motion.div className="text-center pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
            <Navigation className="w-5 h-5" />
            Voir l'itineraire
          </a>
        </motion.div>

      </div>
    </main>
  );
}