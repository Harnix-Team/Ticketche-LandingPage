"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowUpRight, Star, Car, Wrench, Swatches, Ticket, Bell, MapPin,
  CheckCircle, Users, Wallet, Tag, QrCode, Handshake, DeviceMobile, CreditCard,
  ChartBar, Money, Pulse, ShieldCheck, ClipboardText, TrendUp, NavigationArrow
} from "@phosphor-icons/react";
import { fetchAllPlaces } from "@/app/services/api";
import FAQSection from "@/components/Home/FaqSection";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

const STATIC_IMAGES = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
  "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&q=80",
];

const CLUSTERS = [
  { cx: "2%",  cy: "4%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 8, opacity: 0.25, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "91%", cy: "3%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.38, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -12, y: 11, size: 8, opacity: 0.22, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "18%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.28, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 13, y: -7, size: 6, opacity: 0.18, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "95%", cy: "20%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.32, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -11, y: 9, size: 6, opacity: 0.18, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "44%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.20, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "3%",  cy: "34%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.25, anim: 1, delay: "0.4s", dur: "3.2s", color: "#00818f" }, { x: 12, y: 8,  size: 5, opacity: 0.15, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00515a" }] },
  { cx: "94%", cy: "36%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.28, anim: 2, delay: "0.2s", dur: "3.6s", color: "#00515a" }, { x: -10, y: 10, size: 6, opacity: 0.16, anim: 1, delay: "0.5s", dur: "3.0s", color: "#00818f" }] },
  { cx: "2%",  cy: "52%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.30, anim: 0, delay: "0.3s", dur: "3.4s", color: "#00818f" }, { x: 14, y: -9, size: 7, opacity: 0.18, anim: 2, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "93%", cy: "54%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.26, anim: 1, delay: "0.1s", dur: "3.1s", color: "#00515a" }] },
  { cx: "48%", cy: "38%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.16, anim: 0, delay: "0.5s", dur: "3.3s", color: "#00818f" }] },
  { cx: "1%",  cy: "68%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.28, anim: 2, delay: "0.2s", dur: "3.5s", color: "#00818f" }, { x: 11, y: -8, size: 6, opacity: 0.16, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00515a" }] },
  { cx: "95%", cy: "70%", stars: [{ x: 0, y: 0, size: 12, opacity: 0.32, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }, { x: -13, y: 10, size: 7, opacity: 0.20, anim: 2, delay: "0.6s", dur: "3.0s", color: "#00818f" }] },
  { cx: "3%",  cy: "84%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.24, anim: 0, delay: "0.1s", dur: "3.4s", color: "#00818f" }] },
  { cx: "92%", cy: "86%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.28, anim: 1, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -10, y: -8, size: 5, opacity: 0.15, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "50%", cy: "96%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.18, anim: 2, delay: "0.2s", dur: "3.3s", color: "#00818f" }] },
  { cx: "25%", cy: "12%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.15, anim: 0, delay: "0.5s", dur: "3.0s", color: "#00515a" }] },
  { cx: "72%", cy: "15%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.18, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00818f" }] },
  { cx: "20%", cy: "60%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.14, anim: 2, delay: "0.6s", dur: "3.5s", color: "#00515a" }] },
  { cx: "78%", cy: "62%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.16, anim: 0, delay: "0.2s", dur: "3.1s", color: "#00818f" }] },
  { cx: "35%", cy: "80%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.15, anim: 1, delay: "0.4s", dur: "2.9s", color: "#00515a" }] },
  { cx: "65%", cy: "82%", stars: [{ x: 0, y: 0, size: 8,  opacity: 0.20, anim: 2, delay: "0.1s", dur: "3.3s", color: "#00818f" }] },
];

const SERVICES = [
  { icon: <MapPin weight="bold" />,          title: "Trouvez des services autour de vous", desc: "Découvrez facilement des parkings, lavages et garages disponibles près de vous, directement depuis l'application.", num: "01" },
  { icon: <CreditCard weight="bold" />,      title: "Payez simplement",                    desc: "Effectuez vos paiements rapidement et en toute sécurité grâce aux solutions de paiement intégrées.", num: "02", highlight: true },
  { icon: <Wrench weight="bold" />,          title: "Accédez aux meilleurs garages",       desc: "Trouvez des garages fiables pour l'entretien et la réparation de votre véhicule.", num: "03" },
  { icon: <Ticket weight="bold" />,          title: "Découvrez les événements",            desc: "Concerts, festivals, soirées... accédez aux événements autour de vous et obtenez vos billets facilement.", num: "04" },
  { icon: <NavigationArrow weight="bold" />, title: "Localisation en temps réel",          desc: "Repérez instantanément les services disponibles autour de vous, où que vous soyez.", num: "05" },
  { icon: <ClipboardText weight="bold" />,   title: "Tous vos tickets au même endroit",    desc: "Gardez une trace de vos tickets et transactions. Plus besoin de conserver des papiers.", num: "06" },
];
const FEATURES = [
  { icon: MapPin,    title: "Parking · Lavage · Garage",  desc: "Localisez, réservez et payez en temps réel. Centres de lavage notés, garages certifiés, parkings disponibles près de vous.", accent: "#005F69" },
  { icon: Ticket,    title: "Billetterie & Événements",    desc: "Achetez vos billets de concerts, festivals et conférences. Gérez vos propres événements avec vente de tickets intégrée.", accent: "#692C00" },
  { icon: Wallet,    title: "Portefeuille numérique",      desc: "Centralisez votre solde, rechargez en Mobile Money et réglez tous vos services Ticketché d'un seul tap.", accent: "#005F69" },
  { icon: Tag,       title: "Codes promo & réductions",    desc: "Saisissez un code promo au paiement pour obtenir des réductions instantanées sur tous vos services.", accent: "#692C00" },
  { icon: Star,      title: "Avis & notations",            desc: "Consultez les avis vérifiés avant de choisir un prestataire. Notez votre expérience et aidez la communauté.", accent: "#005F69" },
  { icon: Car,       title: "Enregistrement de véhicules", desc: "Ajoutez vos véhicules une fois pour toujours. Chaque réservation est automatiquement rattachée.", accent: "#692C00" },
  { icon: QrCode,    title: "QR Code & accès rapide",      desc: "Ticket numérique infalsifiable pour chaque service. Scan instantané — zéro papier, zéro file d'attente.", accent: "#005F69" },
  { icon: Handshake, title: "Services additionnels",       desc: "Les gérants proposent des extras : vidange, gonflage pneus, nettoyage intérieur — réservables dans l'app.", accent: "#692C00" },
];

const USER_ITEMS = [
  { icon: MapPin,       title: "Trouvez rapidement le service qu'il vous faut", desc: "Services à proximité, prix, disponibilités, horaires et gérants les mieux notés — tout en un coup d'œil." },
  { icon: DeviceMobile, title: "Ticket numérique sécurisé",                     desc: "Fini les tickets papier qui se perdent. Votre ticket sur votre téléphone, clair, vérifiable à tout moment." },
  { icon: CreditCard,   title: "Paiement fluide et sécurisé",                   desc: "Payez sans tracas grâce à nos partenaires certifiés. Un simple scan à la sortie et vous êtes libre." },
  { icon: Ticket,       title: "Billets d'événements en ligne",                 desc: "Concerts, soirées, expos — réservez vos tickets depuis l'app, recevez votre QR code et entrez sans attendre." },
];

const MANAGER_ITEMS = [
  { icon: Pulse,         title: "Suivi en temps réel",     desc: "Véhicules en cours, opérations terminées, files d'attente et volumes journaliers." },
  { icon: Money,         title: "Encaissement simplifié",  desc: "Paiements espèces et mobile money avec traçabilité complète, sans erreurs." },
  { icon: ChartBar,      title: "Statistiques détaillées", desc: "Revenus, heures de pointe, services les plus demandés et progression du CA." },
  { icon: ShieldCheck,   title: "Réduction de la fraude",  desc: "Tickets numériques horodatés, impossibles à falsifier. Litiges éliminés." },
  { icon: Users,         title: "Gestion du personnel",    desc: "Performances individuelles, services traités et historique complet des agents." },
  { icon: ClipboardText, title: "Organisation renforcée",  desc: "Toutes vos opérations centralisées. Plus de papier, plus d'oublis, plus de pertes." },
  { icon: TrendUp,       title: "Revenus optimisés",       desc: "Identifiez vos meilleures plages horaires et maximisez votre rentabilité." },
  { icon: Ticket,        title: "Billetterie événements",  desc: "Créez vos événements, vendez vos tickets en ligne et suivez vos réservations." },
];

const TEAM_AVATARS = [
  "/images/users/user1.png",
  "/images/users/user2.png",
  "/images/users/user3.png",
  "/images/users/user4.png",
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `ctStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function AboutPage() {
  const [current, setCurrent] = useState(0);
  const [carouselImages, setCarouselImages] = useState(STATIC_IMAGES);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [eventsRes, placesRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/events`).then(r => r.json()),
          fetchAllPlaces(),
        ]);
        const eventImages = eventsRes.status === "fulfilled" && eventsRes.value?.success
          ? (eventsRes.value.data ?? []).filter(e => e.images?.length > 0).map(e => e.images[0].url).filter(Boolean).slice(0, 4)
          : [];
        const placeImages = placesRes.status === "fulfilled" && placesRes.value?.success
          ? (placesRes.value.data ?? []).filter(p => p.images?.length > 0).map(p => {
              const link = p.images[0].link;
              if (!link) return null;
              const cleaned = link.replace("/storage/app/public", "/storage");
              return cleaned.startsWith("http") ? cleaned : `https://api.ticketche.com${cleaned}`;
            }).filter(Boolean).slice(0, 4)
          : [];
        const allImages = [...STATIC_IMAGES, ...eventImages, ...placeImages];
        if (allImages.length > 0) setCarouselImages(allImages);
      } catch (err) {
        console.error("Erreur fetch images:", err);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % carouselImages.length), 3000);
    return () => clearInterval(t);
  }, [current, carouselImages.length]);

  const next = (current + 1) % carouselImages.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap');

        @keyframes ctStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes ctStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes ctStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 6px 20px rgba(0,95,105,0.3), 0 0 0 0 rgba(0,95,105,0.4); }
          50%      { box-shadow: 0 10px 28px rgba(0,95,105,0.45), 0 0 0 10px rgba(0,95,105,0); }
        }
        @keyframes btnArrow {
          0%,100% { transform: translateX(0px); }
          50%      { transform: translateX(5px); }
        }
        @keyframes ctaBtnPulse {
          0%,100% { box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 0 0 0 rgba(255,255,255,0.4); }
          50%      { box-shadow: 0 12px 28px rgba(0,0,0,0.22), 0 0 0 10px rgba(255,255,255,0); }
        }
        @keyframes ctaArrow {
          0%,100% { transform: translateX(0px); }
          50%      { transform: translateX(5px); }
        }
        @keyframes rotateBadge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .about-page {
          font-family: 'Archivo', sans-serif;
          background: #ecf5f5;
          width: 90vw;
          margin: 0 auto;
          position: relative;
          overflow-x: hidden;
        }

        /* ─── BOUTON COMMUN ─── */
        .tc-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #005f69; color: white;
          font-weight: 800; font-size: 14px;
          padding: 14px 24px; border-radius: 999px;
          text-decoration: none; transition: all .2s ease;
          animation: btnPulse 2s ease-in-out infinite;
          font-family: 'Archivo', sans-serif;
        }
        .tc-btn svg { animation: btnArrow 1s ease-in-out infinite; }
        .tc-btn:hover {
          animation: none; background: #007a8a;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,95,105,0.5);
        }
        .tc-btn:hover svg { animation: none; transform: translateX(4px); }

        /* ─── HERO ─── */
        .ap-hero-wrap { position: relative; }
        .ap-hero {
          position: relative; z-index: 2;
          padding: 100px 48px 80px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
        }
        .ap-badge {
          display: inline-flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid rgba(0,95,105,0.15);
          border-radius: 999px; padding: 8px 16px 8px 8px;
          margin-bottom: 28px; box-shadow: 0 2px 12px rgba(0,95,105,0.08);
        }
        .ap-badge-avatars { display: flex; }
        .ap-badge-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          border: 2px solid white; object-fit: cover; margin-left: -10px;
        }
        .ap-badge-avatar:first-child { margin-left: 0; }
        .ap-badge-text { font-size: 12px; font-weight: 700; color: #0a1a1c; letter-spacing: 0.02em; }
        .ap-title {
          font-size: clamp(32px, 4vw, 52px); font-weight: 900; color: #0a1a1c;
          line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px;
        }
        .ap-title span { color: #005f69; }
        .ap-sub { color: #6b7280; font-size: 19px; line-height: 1.75; max-width: 440px; margin-bottom: 36px; }
        .ap-btns { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .ap-right { position: relative; display: flex; align-items: center; justify-content: center; height: 480px; }
        .ap-circle-big {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-62%, -52%);
          width: 340px; height: 340px; border-radius: 50%; overflow: hidden;
          border: 5px solid white; box-shadow: 0 16px 48px rgba(0,95,105,0.22); z-index: 2;
        }
        .ap-circle-big img { width: 100%; height: 100%; object-fit: cover; }
        .ap-circle-small {
          position: absolute; right: 24%; bottom: 12%;
          width: 180px; height: 180px; border-radius: 50%; overflow: hidden;
          border: 4px solid white; box-shadow: 0 10px 32px rgba(0,95,105,0.2); z-index: 3;
        }
        .ap-circle-small img { width: 100%; height: 100%; object-fit: cover; }
        .ap-dots-sm {
          position: absolute; bottom: 8%; right: 18%;
          display: grid; grid-template-columns: repeat(4, 6px); gap: 5px;
          z-index: 4; pointer-events: none;
        }
        .ap-dot-sm { width: 6px; height: 6px; border-radius: 50%; background: #005f69; opacity: 0.25; }

        /* ─── À PROPOS ─── */
        .ab-section {
          padding: 20px 48px 90px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .ab-left {
          position: relative; height: 460px;
          display: flex; align-items: flex-start; gap: 16px;
        }
        .ab-img-back {
          position: relative; width: calc(50% - 8px); height: 88%;
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,95,105,0.18);
          z-index: 1; align-self: flex-start;
        }
        .ab-img-back img { width: 100%; height: 100%; object-fit: cover; }
        .ab-img-front {
          position: relative; width: calc(50% - 8px); height: 88%;
          border-radius: 20px; overflow: hidden;
          border: 5px solid white;
          box-shadow: 0 24px 56px rgba(0,95,105,0.22);
          z-index: 1; align-self: flex-end;
        }
        .ab-img-front img { width: 100%; height: 100%; object-fit: cover; }
        .ab-badge-circle {
          position: absolute; bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 108px; height: 108px;
          background: #005f69; border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 8px 28px rgba(0,95,105,0.40);
          z-index: 4; display: flex; align-items: center; justify-content: center;
          overflow: hidden; cursor: default;
        }
        .ab-badge-svg { position: absolute; inset: 0; animation: rotateBadge 14s linear infinite; }
        .ab-badge-arrow { position: relative; z-index: 1; color: white; }
        .ab-dots-grid {
          position: absolute; top: 12px; right: -20px;
          display: grid; grid-template-columns: repeat(5, 7px); gap: 6px;
          pointer-events: none; z-index: 0;
        }
        .ab-dot { width: 7px; height: 7px; border-radius: 50%; background: #005f69; opacity: 0.18; }
        .ab-tag {
          display: inline-block; background: rgba(0,95,105,0.10); color: #005f69;
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
        }
        .ab-title {
          font-size: clamp(26px, 3vw, 42px); font-weight: 900; color: #0a1a1c;
          line-height: 1.12; letter-spacing: -0.8px; margin-bottom: 18px;
        }
        .ab-title span { color: #005f69; }
        .ab-desc { font-size: 15px; color: #6b7280; line-height: 1.8; margin-bottom: 32px; max-width: 430px; }
        .ab-pills { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }
        .ab-pill {
          display: inline-flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid rgba(0,95,105,0.12);
          border-radius: 14px; padding: 12px 20px;
          box-shadow: 0 2px 12px rgba(0,95,105,0.07);
          font-size: 13px; font-weight: 700; color: #0a1a1c;
        }
        .ab-pill-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(0,95,105,0.10);
          display: flex; align-items: center; justify-content: center; color: #005f69;
        }

        /* ─── SERVICES ─── */
        .sv-root { padding: 32px 0 80px; }
        .sv-header { text-align: left; margin-bottom: 56px; padding: 0 32px; }
        .sv-badge {
          display: inline-block; background: rgba(0,95,105,0.10); color: #005f69;
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
        }
        .sv-title {
          font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: #0a1a1c;
          line-height: 1.15; max-width: 560px; margin: 0;
        }
        .sv-title span { color: #005f69; }
        .sv-grid {
          padding: 0 32px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .sv-card {
          background: white; border-radius: 22px; padding: 32px 28px 28px;
          position: relative; overflow: visible;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border: 1.5px solid rgba(0,95,105,0.10);
          box-shadow: 0 4px 20px rgba(0,95,105,0.07);
        }
        .sv-card::before {
          content: ''; position: absolute; top: -2px; left: -2px; width: 48px; height: 48px;
          border-top: 3px solid #005f69; border-left: 3px solid #005f69;
          border-radius: 22px 0 0 0; transition: all 0.3s ease;
        }
        .sv-card::after {
          content: ''; position: absolute; bottom: -2px; right: -2px; width: 48px; height: 48px;
          border-bottom: 3px solid #005f69; border-right: 3px solid #005f69;
          border-radius: 0 0 22px 0; transition: all 0.3s ease;
        }
        .sv-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,95,105,0.14); }
        .sv-card:hover::before, .sv-card:hover::after { width: 64px; height: 64px; border-color: #007a8a; }
        .sv-card-hl { background: #005f69 !important; border-color: #005f69 !important; box-shadow: 0 20px 48px rgba(0,95,105,0.38) !important; }
        .sv-card-hl::before { border-color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl::after  { border-color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl:hover   { transform: translateY(-6px); box-shadow: 0 28px 60px rgba(0,95,105,0.50) !important; }
        .sv-card-hl .sv-icon-wrap  { background: rgba(255,255,255,0.18) !important; }
        .sv-card-hl .sv-icon       { color: white !important; }
        .sv-card-hl .sv-card-title { color: white !important; }
        .sv-card-hl .sv-card-desc  { color: rgba(255,255,255,0.78) !important; }
        .sv-card-hl .sv-num        { color: rgba(255,255,255,0.35) !important; }
        .sv-card-hl .sv-arrow      { background: white !important; color: #005f69 !important; }
        .sv-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
        .sv-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(0,95,105,0.10);
          display: flex; align-items: center; justify-content: center;
        }
        .sv-icon { width: 24px; height: 24px; color: #005f69; }
        .sv-arrow {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,95,105,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #005f69; opacity: 0; transition: opacity 0.2s ease;
        }
        .sv-card:hover .sv-arrow { opacity: 1; }
        .sv-card-title { font-size: 17px; font-weight: 800; color: #0a1a1c; letter-spacing: -0.3px; margin-bottom: 10px; }
        .sv-card-desc  { font-size: 14px; line-height: 1.7; color: #6b7280; }
        .sv-num {
          margin-top: 24px; font-size: 12px; font-weight: 700;
          color: rgba(0,95,105,0.30); letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 10px;
        }
        .sv-num::after { content: ''; flex: 1; max-width: 48px; height: 1.5px; background: currentColor; border-radius: 2px; opacity: 0.5; }

        /* ─── FEATURES ─── */
        .ft-root { padding: 80px 32px; }
        .ft-header { text-align: center; margin-bottom: 56px; }
        .ft-tag {
          display: inline-flex; align-items: center;
          background: rgba(0,95,105,0.10); color: #005f69;
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
          border: 1px solid rgba(0,95,105,0.15);
        }
        .ft-title {
          font-size: clamp(28px, 3.5vw, 44px); font-weight: 900; color: #0a1a1c;
          line-height: 1.12; letter-spacing: -1px; margin-bottom: 14px;
        }
        .ft-title span { color: #005f69; }
        .ft-sub { font-size: 16px; color: #6b7280; max-width: 540px; margin: 0 auto; line-height: 1.75; }
        .ft-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .ft-card {
          background: white; border-radius: 20px; padding: 28px 24px;
          border: 1.5px solid rgba(0,95,105,0.10);
          box-shadow: 0 4px 16px rgba(0,95,105,0.06);
          position: relative; overflow: hidden;
          transition: all 0.3s ease; cursor: default;
        }
        .ft-card-line {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(to right, transparent, var(--accent), transparent);
          opacity: 0.5; transition: opacity 0.3s;
        }
        .ft-card:hover .ft-card-line { opacity: 1; }
        .ft-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; transition: all 0.3s ease;
        }
        .ft-card-title { font-size: 15px; font-weight: 800; color: #0a1a1c; margin-bottom: 8px; line-height: 1.3; transition: color 0.3s; }
        .ft-card-desc { font-size: 13px; color: #6b7280; line-height: 1.65; }
        .ft-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ft-pillar {
          display: flex; align-items: center; gap: 14px;
          background: white; border: 1.5px solid rgba(0,95,105,0.10);
          border-radius: 16px; padding: 16px 20px;
          box-shadow: 0 2px 12px rgba(0,95,105,0.06);
        }
        .ft-pillar-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(0,95,105,0.10);
          display: flex; align-items: center; justify-content: center;
          color: #005f69; flex-shrink: 0;
        }
        .ft-pillar-label { font-size: 14px; font-weight: 800; color: #0a1a1c; }
        .ft-pillar-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }

        /* ─── USERS ─── */
        .us-root { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .us-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 56px rgba(0,95,105,0.18); border: 4px solid white; }
        .us-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .us-tag {
          display: inline-block; background: rgba(0,95,105,0.10); color: #005f69;
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
        }
        .us-title { font-size: clamp(26px, 3vw, 42px); font-weight: 900; color: #0a1a1c; line-height: 1.12; letter-spacing: -0.8px; margin-bottom: 14px; }
        .us-title span { color: #005f69; }
        .us-desc { font-size: 15px; color: #6b7280; line-height: 1.8; margin-bottom: 28px; max-width: 440px; }
        .us-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
        .us-item {
          display: flex; align-items: flex-start; gap: 14px;
          background: white; border: 1.5px solid rgba(0,95,105,0.10);
          border-radius: 16px; padding: 16px 20px;
          box-shadow: 0 2px 12px rgba(0,95,105,0.06);
          transition: all 0.25s ease;
        }
        .us-item:hover { border-color: rgba(0,95,105,0.3); box-shadow: 0 8px 24px rgba(0,95,105,0.12); transform: translateX(4px); }
        .us-item-icon { width: 44px; height: 44px; border-radius: 12px; background: #005f69; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .us-item-title { font-size: 14px; font-weight: 800; color: #0a1a1c; margin-bottom: 4px; }
        .us-item-desc { font-size: 13px; color: #6b7280; line-height: 1.6; }

        /* ─── MANAGERS ─── */
        .mg-root { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .mg-tag {
          display: inline-block; background: rgba(105,44,0,0.10); color: #692C00;
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
        }
        .mg-title { font-size: clamp(26px, 3vw, 42px); font-weight: 900; color: #0a1a1c; line-height: 1.12; letter-spacing: -0.8px; margin-bottom: 14px; }
        .mg-title span { color: #692C00; }
        .mg-desc { font-size: 15px; color: #6b7280; line-height: 1.8; margin-bottom: 28px; max-width: 440px; }
        .mg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
        .mg-item {
          display: flex; align-items: flex-start; gap: 12px;
          background: white; border: 1.5px solid rgba(0,95,105,0.10);
          border-radius: 16px; padding: 14px 16px;
          box-shadow: 0 2px 10px rgba(0,95,105,0.05);
          transition: all 0.25s ease;
        }
        .mg-item:hover { border-color: rgba(105,44,0,0.25); box-shadow: 0 8px 24px rgba(105,44,0,0.10); transform: translateY(-2px); }
        .mg-item-icon { width: 36px; height: 36px; border-radius: 10px; background: #005f69; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .mg-item-title { font-size: 13px; font-weight: 800; color: #0a1a1c; margin-bottom: 3px; }
        .mg-item-desc { font-size: 12px; color: #6b7280; line-height: 1.55; }
        .mg-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 56px rgba(0,95,105,0.18); border: 4px solid white; }
        .mg-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ─── CTA ─── */
        .cta-root { padding: 0 32px 100px; }
        .cta-inner {
          background: #005f69; border-radius: 28px; padding: 72px 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 40px;
          position: relative; overflow: hidden;
        }
        .cta-inner::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,0.05);
        }
        .cta-inner::after {
          content: ''; position: absolute; bottom: -60px; left: 30%;
          width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04);
        }
        .cta-left { position: relative; z-index: 2; }
        .cta-tag { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 16px; }
        .cta-title { font-size: clamp(24px, 3vw, 40px); font-weight: 900; color: white; line-height: 1.15; letter-spacing: -0.8px; max-width: 480px; }
        .cta-title span { color: #7dd3d8; }
        .cta-sub { margin-top: 14px; font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 420px; }
        .cta-actions { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 2; flex-shrink: 0; }
        .cta-btn-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: white; color: #005f69; font-weight: 800; font-size: 14px;
          padding: 16px 28px; border-radius: 999px; text-decoration: none;
          transition: all .2s ease; white-space: nowrap;
          animation: ctaBtnPulse 2s ease-in-out infinite;
          font-family: 'Archivo', sans-serif;
        }
        .cta-btn-main svg { animation: ctaArrow 1.2s ease-in-out infinite; }
        .cta-btn-main:hover { animation: none; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,0.25); background: #f0fafa; }
        .cta-btn-main:hover svg { animation: none; transform: translateX(4px); }
        .cta-btn-sec {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 600;
          text-decoration: none; transition: color .2s; text-align: center;
        }
        .cta-btn-sec:hover { color: white; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .about-page { width: 100vw; }
          .ap-hero { grid-template-columns: 1fr; padding: 80px 24px 60px; text-align: center; }
          .ap-sub  { max-width: 100%; }
          .ap-btns { justify-content: center; }
          .ap-right { height: 340px; }
          .ap-circle-big   { width: 240px; height: 240px; }
          .ap-circle-small { width: 130px; height: 130px; }
          .ab-section { grid-template-columns: 1fr; padding: 40px 24px 60px; gap: 48px; }
          .ab-left { height: 380px; }
          .sv-grid { grid-template-columns: 1fr 1fr; }
          .ft-pillars { grid-template-columns: 1fr; }
          .us-root { grid-template-columns: 1fr; padding: 60px 24px; gap: 40px; }
          .mg-root { grid-template-columns: 1fr; padding: 60px 24px; gap: 40px; }
          .cta-inner { flex-direction: column; padding: 48px 36px; text-align: center; }
          .cta-actions { align-items: center; }
        }
        @media (max-width: 640px) {
          .ab-left { height: 300px; }
          .ft-grid { grid-template-columns: 1fr; }
          .ft-root { padding: 60px 20px; }
          .mg-grid { grid-template-columns: 1fr; }
          .sv-grid { grid-template-columns: 1fr; padding: 0 20px; }
          .cta-inner { padding: 40px 28px; border-radius: 20px; }
          .cta-root { padding: 0 20px 60px; }
        }
      `}</style>

      <div className="about-page">
        <StarClusters />

        {/* ══════════ HERO ══════════ */}
        <div className="ap-hero-wrap">
          <div className="ap-hero">
            <div>
              <div className="ap-badge">
                <div className="ap-badge-avatars">
                  {TEAM_AVATARS.map((src, i) => (
                    <img key={i} src={src} alt="" className="ap-badge-avatar" />
                  ))}
                </div>
                <span className="ap-badge-text">+15 ans d'expériences</span>
              </div>
              <h1 className="ap-title" style={{ fontSize: "clamp(26px, 3.2vw, 42px)" }}>
  Parking, lavage, garage,<br />
  événements. Une nouvelle<br />
  <span>façon de tout gérer.</span>
</h1>
<p className="ap-sub">
  Ticketché connecte les utilisateurs aux services et événements qui les entourent, en quelques clics. Pour les gestionnaires, c'est une solution simple pour organiser leurs activités, encaisser rapidement et offrir une meilleure expérience à leurs clients.
</p>
              <div className="ap-btns">
                <a
                  href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-btn"
                >
                  Découvrir Ticketché <ArrowRight weight="bold" size={16} />
                </a>
              </div>
            </div>
            <div className="ap-right">
              <div className="ap-circle-big">
                <img key={current} src={carouselImages[current]} alt="service" />
              </div>
              <div className="ap-circle-small">
                <img key={next} src={carouselImages[next]} alt="service suivant" />
              </div>
              <div className="ap-dots-sm">
                {Array.from({ length: 16 }).map((_, i) => <div key={i} className="ap-dot-sm" />)}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ À PROPOS ══════════ */}
        <div className="ab-section">
          <div className="ab-left">
            <div className="ab-dots-grid">
              {Array.from({ length: 25 }).map((_, i) => <div key={i} className="ab-dot" />)}
            </div>
            <div className="ab-img-back">
              <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80" alt="Concert" />
            </div>
            <div className="ab-img-front">
              <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80" alt="Parking" />
            </div>
            <div className="ab-badge-circle">
              <svg className="ab-badge-svg" viewBox="0 0 108 108">
                <defs>
                  <path id="circlePath" d="M 54,54 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
                </defs>
                <text fill="rgba(255,255,255,0.85)" fontSize="10.5" fontWeight="700" letterSpacing="2.8" fontFamily="Archivo, sans-serif">
                  <textPath href="#circlePath">TICKETCHÉ • AU QUOTIDIEN • </textPath>
                </text>
              </svg>
              <ArrowUpRight size={22} weight="bold" className="ab-badge-arrow" />
            </div>
          </div>
          <div>
            <div className="ab-tag">À propos de Ticketché</div>
            <h2 className="ab-title">
              La plateforme qui simplifie la vie urbaine<br />
              <span>au  Bénin.</span>
            </h2>
            <p className="ab-desc">
Ticketché réunit dans une seule application les services dont vous avez besoin au quotidien : parkings, lavages, garages et événements.
Trouvez rapidement un service autour de vous, accédez à des prestataires fiables et profitez d’une expérience simple, rapide et moderne.

Que vous soyez utilisateur ou gestionnaire de service, Ticketché vous aide à gagner du temps, mieux organiser vos activités et profiter pleinement de la ville.            </p>
            <div className="ab-pills">
              <div className="ab-pill">
                <div className="ab-pill-icon"><CheckCircle size={18} weight="bold" /></div>
                Services vérifiés <br /> Des prestataires sélectionnés pour garantir <br /> des services fiables et de qualité.
              </div>
              <div className="ab-pill">
                <div className="ab-pill-icon"><Users size={18} weight="bold" /></div>
                +5 000 utilisateurs <br />  Une communauté grandissante qui utilise déjà.
              </div>
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
              target="_blank"
              rel="noopener noreferrer"
              className="tc-btn"
            >
              Découvrir nos solutions <ArrowRight weight="bold" size={16} />
            </a>
          </div>
        </div>

        {/* ══════════ SERVICES ══════════ */}
        <div className="sv-root">
          <div className="sv-header">
            <div className="sv-badge">Nos services</div>
            <h2 className="sv-title" style={{ fontSize: "clamp(22px, 2.8vw, 36px)", letterSpacing: "-0.01em" }}>
  Réservez, gérez, profitez.<br />
  <span>en un clic.</span>
</h2>
          </div>
          <div className="sv-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className={`sv-card${s.highlight ? " sv-card-hl" : ""}`}>
                <div className="sv-card-top">
                  <div className="sv-icon-wrap"><span className="sv-icon">{s.icon}</span></div>
                  <div className="sv-arrow"><ArrowUpRight size={16} weight="bold" /></div>
                </div>
                <div className="sv-card-title">{s.title}</div>
                <div className="sv-card-desc">{s.desc}</div>
                <div className="sv-num">{s.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ PUISSANCE TICKETCHÉ ══════════ */}
        <div className="ft-root">
          <div className="ft-header">
            <div className="ft-tag">4 services, une seule application</div>
            <h2 className="ft-title">
              Découvrez la puissance de <span>Ticketché</span>
            </h2>
            <p className="ft-sub">
              Parking, lavage, garage, billetterie et événements - tout ce dont vous avez besoin dans une seule app.
            </p>
          </div>
          <div className="ft-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isHov = hoveredFeature === i;
              const isOther = hoveredFeature !== null && hoveredFeature !== i;
              return (
                <div
                  key={i}
                  className="ft-card"
                  style={{
                    "--accent": f.accent,
                    background: isHov ? `${f.accent}06` : "white",
                    borderColor: isHov ? `${f.accent}30` : "rgba(0,95,105,0.10)",
                    boxShadow: isHov ? `0 20px 40px ${f.accent}30` : "0 4px 16px rgba(0,95,105,0.06)",
                    opacity: isOther ? 0.6 : 1,
                    transform: isHov ? "translateY(-6px) scale(1.02)" : "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="ft-card-line" />
                  <div className="ft-icon-wrap" style={{ background: isHov ? f.accent : `${f.accent}18` }}>
                    <Icon
                      weight="duotone"
                      style={{
                        width: 24, height: 24,
                        color: isHov ? "white" : f.accent,
                        transform: isHov ? "rotate(8deg) scale(1.1)" : "none",
                        transition: "all 0.3s",
                      }}
                    />
                  </div>
                  <div className="ft-card-title" style={{ color: isHov ? f.accent : "#0a1a1c" }}>{f.title}</div>
                  <div className="ft-card-desc">{f.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="ft-pillars">
            {[
              { icon: DeviceMobile, label: "App mobile",   sub: "iOS & Android" },
              { icon: CreditCard,   label: "Mobile Money", sub: "Paiement sécurisé" },
              { icon: Users,        label: "Communauté",   sub: "Avis & entraide" },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="ft-pillar">
                <div className="ft-pillar-icon">
                  <Icon weight="duotone" style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <div className="ft-pillar-label">{label}</div>
                  <div className="ft-pillar-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ UTILISATEURS ══════════ */}
        <div className="us-root">
          <div className="us-img-wrap">
            <img src="/images/About/about3.png" alt="Ticketché app utilisateur" />
          </div>
          <div>
            <div className="us-tag">Pour les utilisateurs</div>
            <h2 className="us-title">
              Votre compagnon de <span>mobilité et de sorties</span>
            </h2>
            <p className="us-desc">
              Plus besoin de tourner en rond. <strong>Ticketché</strong> vous montre en temps réel les parkings disponibles, les centres de lavage les mieux notés et les garages certifiés près de vous.
            </p>
            <div className="us-list">
              {USER_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="us-item">
                    <div className="us-item-icon">
                      <Icon style={{ width: 22, height: 22 }} />
                    </div>
                    <div>
                      <div className="us-item-title">{item.title}</div>
                      <div className="us-item-desc">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
              target="_blank"
              rel="noopener noreferrer"
              className="tc-btn"
            >
              Télécharger l'app <ArrowRight weight="bold" size={16} />
            </a>
          </div>
        </div>

        {/* ══════════ GÉRANTS ══════════ */}
        <div className="mg-root">
          <div>
            <div className="mg-tag">Pour les gérants & organisateurs</div>
            <h2 className="mg-title">
              Vous êtes gérant<br />
              <span>ou organisateur ?</span>
            </h2>
            <p className="mg-desc">
              <strong>Ticketché</strong> vous aide à digitaliser et rentabiliser votre activité. Que vous gériez un parking, un centre de lavage, un garage ou que vous organisiez des événements - gagnez en visibilité, en organisation et en efficacité.
            </p>
            <div className="mg-grid">
              {MANAGER_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="mg-item">
                    <div className="mg-item-icon">
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div className="mg-item-title">{item.title}</div>
                      <div className="mg-item-desc">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
              target="_blank"
              rel="noopener noreferrer"
              className="tc-btn"
            >
              Rejoindre Ticketché <ArrowRight weight="bold" size={16} />
            </a>
          </div>
          <div className="mg-img-wrap">
            <img src="/images/About/about4.png" alt="Ticketché dashboard gérant" />
          </div>
        </div>

        {/* ══════════ FAQ ══════════ */}
        <FAQSection />

        {/* ══════════ CTA ══════════ */}
        <div className="cta-root">
          <div className="cta-inner">
            <div className="cta-left">
              <div className="cta-tag">Rejoignez Ticketché</div>
              <h2 className="cta-title">
                Prêt à simplifier votre<br />
                <span>quotidien au Bénin ?</span>
              </h2>
              <p className="cta-sub">
                Téléchargez l'application et accédez à des centaines de services autour de vous - parking, car wash, garages et événements.
              </p>
            </div>
            <div className="cta-actions">
              <a
                href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-main"
              >
                Télécharger l'app <ArrowRight weight="bold" size={16} />
              </a>
              <a href="/contact" className="cta-btn-sec">Nous contacter →</a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}