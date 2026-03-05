"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, User, Tag, Ticket, ArrowLeft,
  NavigationArrow, Link as LinkIcon, Users, Clock,
  ArrowRight, ArrowSquareOut, Sparkle,
} from "@phosphor-icons/react";

function TicketCard({ ticket, index }) {
  const isFree = ticket.price === 0;
  const remaining = ticket.quantity ? ticket.quantity - (ticket.quantity_sold ?? 0) : null;
  const pct = remaining && ticket.quantity ? Math.round((remaining / ticket.quantity) * 100) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className="flex items-stretch rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div className="relative flex flex-col items-center justify-center bg-[#005F69] px-4 py-5 flex-shrink-0">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-50" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-50" />
        <Ticket className="w-5 h-5 text-white mb-2" />
        <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">ticketche</span>
      </div>
      <div className="w-px border-l-2 border-dashed border-gray-200 self-stretch" />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-base leading-snug mb-1">{ticket.title}</h4>
            {ticket.description && <p className="text-gray-500 text-xs leading-relaxed">{ticket.description}</p>}
            {remaining !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{remaining} places restantes</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: index * 0.08 + 0.3 }} className="h-full rounded-full bg-[#005F69]" />
                </div>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`font-black text-xl ${isFree ? "text-[#005F69]" : "text-gray-900"}`}>{isFree ? "Gratuit" : ticket.price.toLocaleString()}</div>
            {!isFree && <div className="text-xs text-gray-400">FCFA</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgramItem({ item, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }} className="flex gap-4 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.07 + 0.15, type: "spring" }}
          className="w-9 h-9 rounded-xl bg-[#005F69] flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-black text-sm">{index + 1}</span>
        </motion.div>
        <div className="w-px flex-1 bg-[#005F69]/20 mt-2" />
      </div>
      <div className="pb-6 flex-1">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 group-hover:border-[#005F69]/30 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h4>
            {item.start_time && (
              <span className="text-[#005F69] text-xs font-bold bg-[#005F69]/10 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />{item.start_time}
              </span>
            )}
          </div>
          {item.description && <p className="text-gray-500 text-xs leading-relaxed mt-1">{item.description}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data.success) setEvent(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEventDetails();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getMinPrice = (tickets = []) => {
    const prices = tickets.map((t) => t.price).filter((p) => p > 0);
    if (prices.length === 0) return "Gratuit";
    return Math.min(...prices).toLocaleString() + " FCFA";
  };

  const heroImg = event?.images?.[activeImage]?.url ?? "/images/logo.png";
  const mapsUrl = event ? `https://maps.google.com/?q=${event.latitude},${event.longitude}` : "#";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-[#005F69]/20 border-t-[#005F69] mx-auto mb-4" />
        <p className="text-gray-500 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🎟️</div>
        <p className="text-gray-700 text-lg font-bold mb-2">Événement introuvable</p>
        <button onClick={() => window.close()} className="text-[#005F69] underline text-sm">Fermer</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image src={heroImg} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => window.close()}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/25 transition">
          <ArrowLeft className="w-4 h-4" />Retour
        </motion.button>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
          {event.is_featured && (
            <span className="flex items-center gap-1.5 bg-[#692C00] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              <Sparkle className="w-3 h-3" /> À la une
            </span>
          )}
          {event.format && <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase">{event.format}</span>}
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-10 max-w-4xl">
          {event.category && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#005F69]/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-3">
              <Tag className="w-3 h-3" />{event.category.title}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black leading-tight text-white mb-3 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            {event.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/60" />{formatDate(event.start_date)}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-white/60" />{event.location_name}</span>
            {event.tickets?.length > 0 && (
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Ticket className="w-4 h-4 text-white/70" />À partir de {getMinPrice(event.tickets)}
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* STICKY BAR */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{event.title}</p>
            {event.tickets?.length > 0 && <p className="text-[#005F69] text-xs font-semibold">{getMinPrice(event.tickets)}</p>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <motion.a href={mapsUrl} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition">
              <NavigationArrow className="w-4 h-4" /><span className="hidden sm:inline">Itinéraire</span>
            </motion.a>
            <motion.a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#692C00] hover:bg-[#7a3300] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition">
              <Ticket className="w-4 h-4" />Réserver
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* CONTENU */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {event.images?.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 overflow-x-auto pb-1">
            {event.images.map((img, i) => (
              <motion.button key={img.id} whileHover={{ scale: 1.05 }} onClick={() => setActiveImage(i)}
                className={`relative w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#005F69] shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"}`}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {event.description && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#005F69] block flex-shrink-0" />À propos de cet événement
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </motion.section>
        )}

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#692C00] block flex-shrink-0" />Détails
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-start gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-[#005F69]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Calendar className="w-4 h-4 text-[#005F69]" /></div>
              <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Date de début</p><p className="text-gray-800 font-medium text-sm">{formatDate(event.start_date)}</p></div>
            </div>
            {event.end_date && (
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-[#005F69]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Calendar className="w-4 h-4 text-[#005F69]" /></div>
                <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Date de fin</p><p className="text-gray-800 font-medium text-sm">{formatDate(event.end_date)}</p></div>
              </div>
            )}
            <div className="flex items-start gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-[#692C00]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><MapPin className="w-4 h-4 text-[#692C00]" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Lieu</p>
                <p className="text-gray-800 font-medium text-sm">{event.location_name}</p>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[#005F69] text-xs font-semibold flex items-center gap-1 mt-1 hover:underline">
                  Voir sur Google Maps <ArrowSquareOut className="w-3 h-3" />
                </a>
              </div>
            </div>
            {event.format && (
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-[#005F69]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Tag className="w-4 h-4 text-[#005F69]" /></div>
                <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Format</p><p className="text-gray-800 font-medium text-sm">{event.format}</p></div>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-[#692C00]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Users className="w-4 h-4 text-[#692C00]" /></div>
                <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Capacité</p><p className="text-gray-800 font-medium text-sm">{event.capacity} personnes</p></div>
              </div>
            )}
            {event.online_link && (
              <div className="flex items-start gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-[#005F69]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><LinkIcon className="w-4 h-4 text-[#005F69]" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Lien en ligne</p>
                  <a href={event.online_link} target="_blank" rel="noopener noreferrer"
                    className="text-[#005F69] text-sm font-semibold hover:underline flex items-center gap-1">
                    Rejoindre <ArrowSquareOut className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {event.tickets?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#005F69] block flex-shrink-0" />Tickets disponibles
            </h2>
            <div className="space-y-3">
              {event.tickets.map((ticket, i) => <TicketCard key={ticket.id} ticket={ticket} index={i} />)}
            </div>
            <motion.a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-3 bg-[#692C00] hover:bg-[#7a3300] text-white py-4 rounded-2xl font-bold text-base shadow-lg transition">
              <Ticket className="w-5 h-5" />Réserver mes tickets sur ticketché<ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.section>
        )}

        {event.program_items?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#692C00] block flex-shrink-0" />Programme
            </h2>
            <div>{event.program_items.map((item, i) => <ProgramItem key={i} item={item} index={i} />)}</div>
          </motion.section>
        )}

        {event.organizer && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#005F69] block flex-shrink-0" />Organisateur
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#005F69] flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-white" /></div>
              <div>
                <p className="font-bold text-gray-900">{event.organizer.first_name} {event.organizer.second_name}</p>
                {event.organizer.address && <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{event.organizer.address}</p>}
                {event.organizer.phone_number && <p className="text-[#005F69] text-sm font-semibold mt-0.5">{event.organizer.country_code} {event.organizer.phone_number}</p>}
              </div>
            </div>
          </motion.section>
        )}

        {event.places?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#692C00] block flex-shrink-0" />Lieux associés
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {event.places.map((place) => (
                <div key={place.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:border-[#005F69]/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#692C00]/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-[#692C00]" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{place.name}</p>
                    <p className="text-gray-400 text-xs">{place.city} · {place.available_places} places dispo</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid sm:grid-cols-2 gap-3 pb-8">
          <motion.a href={mapsUrl} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#005F69] text-[#005F69] py-4 rounded-2xl font-bold hover:bg-[#005F69]/5 transition">
            <NavigationArrow className="w-5 h-5" />Voir l'itinéraire
          </motion.a>
          <motion.a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-[#692C00] hover:bg-[#7a3300] text-white py-4 rounded-2xl font-bold shadow-lg transition">
            <Ticket className="w-5 h-5" />Prendre mon ticket
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}