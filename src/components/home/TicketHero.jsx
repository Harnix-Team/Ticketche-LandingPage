"use client";

import { ArrowRight, Clock, MapPin, Star } from "@/components/icons";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Media } from "@/components/ui/Media";
import { dateBadge, formatPrice } from "@/lib/format";
import { eventCategoryIcon, placeTypeIcon, RECO_REASONS } from "@/lib/icons";
import { track } from "@/lib/tracking";

const SLIDE_MS = 6500;
// Inclinaison maximale du billet, en degres, quand le pointeur atteint le bord de la fenetre.
const MAX_TILT = 9;
// Amplitude du gyroscope, en degres, qui donne l'inclinaison maximale.
const GYRO_RANGE = 25;

/** Contenu du talon : ce qu'on lirait sur un vrai billet, selon le type d'objet. */
function stub(item) {
  if (item.kind === "event") {
    const badge = dateBadge(item.start);

    return {
      big: badge?.day,
      unit: badge?.month,
      lines: [badge && `${badge.weekday} à ${badge.time}`, item.locationName],
      price: item.minPrice === null ? null : item.minPrice > 0 ? formatPrice(item.minPrice) : "Gratuit",
      priceLabel: item.minPrice > 0 ? "À partir de" : "Entrée",
      action: "Voir l’événement",
    };
  }

  if (item.kind === "restaurant") {
    return {
      big: item.cuisine ?? "Restaurant",
      lines: [item.city ?? item.address, item.isOpen === true ? "Ouvert maintenant" : null],
      price: item.canOrder ? "Commande en ligne" : "Menu complet",
      action: "Voir le menu",
    };
  }

  return {
    big: item.rating ? item.rating.toFixed(1).replace(".", ",") : item.types[0]?.label,
    unit: item.rating ? "sur 5" : null,
    lines: [item.rating ? `${item.reviewCount} avis` : null, item.isOpen === true ? "Ouvert maintenant" : null],
    price: item.minPrice ? formatPrice(item.minPrice) : null,
    priceLabel: "À partir de",
    action: "Voir le lieu",
  };
}

const kicker = (item) => {
  if (item.kind === "event") return { icon: eventCategoryIcon(item.category?.title), label: item.category?.title ?? "Événement" };
  if (item.kind === "restaurant") return { icon: MapPin, label: item.city ?? "Restaurant" };

  return { icon: placeTypeIcon(item.types[0]?.icon), label: [item.types[0]?.label, item.city].filter(Boolean).join(", ") };
};

/**
 * Le billet de la une : les objets que le moteur de recommandation classe en tete, presentes comme un
 * ticket (affiche a gauche, talon detachable a droite). Defile seul, se met en pause au survol et au focus.
 * A la souris, il pivote vers le pointeur et un reflet de lumiere glisse a sa surface.
 */
export function TicketHero({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ticketRef = useRef(null);
  const glareRef = useRef(null);
  const item = items[index];

  useEffect(() => {
    if (paused || items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % items.length), SLIDE_MS);

    return () => clearTimeout(timer);
  }, [index, paused, items.length]);

  // Une impression par diapositive affichee.
  useEffect(() => {
    if (item) track("IMPRESSION", item, { surface: "HOME" });
  }, [item]);

  useEffect(() => {
    const ticket = ticketRef.current;
    const glare = glareRef.current;
    if (!ticket || !glare || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.set(ticket, { transformPerspective: 1100 });
      gsap.set(glare, { "--glare-x": "50%", "--glare-y": "50%" });
    });
    const motion = { duration: 0.9, ease: "power3.out", overwrite: "auto" };
    const unit = gsap.utils.clamp(-1, 1);
    const stops = [];
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      stops.push(() => target.removeEventListener(type, handler, options));
    };
    const onScreen = () => {
      const box = ticket.getBoundingClientRect();

      return box.bottom > 0 && box.top < innerHeight ? box : null;
    };
    // x et y entre -1 et 1 : le billet pivote vers ce point et le reflet s'y pose.
    const tilt = (x, y) => {
      gsap.to(ticket, { rotationY: x * MAX_TILT, rotationX: -y * MAX_TILT, ...motion });
      gsap.to(glare, { "--glare-x": `${50 + x * 60}%`, "--glare-y": `${50 + y * 60}%`, opacity: Math.min(1, 0.25 + Math.hypot(x, y) * 1.3), ...motion });
    };

    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      listen(window, "pointermove", (event) => {
        const box = onScreen();
        if (box) tilt(unit((event.clientX - box.left - box.width / 2) / (innerWidth / 2)), unit((event.clientY - box.top - box.height / 2) / (innerHeight / 2)));
      }, { passive: true });
      listen(document.documentElement, "pointerleave", () => {
        gsap.to(ticket, { rotationX: 0, rotationY: 0, duration: 1.4, ease: "elastic.out(1, 0.7)", overwrite: "auto" });
        gsap.to(glare, { opacity: 0, duration: 0.6, overwrite: "auto" });
      });
    } else if ("DeviceOrientationEvent" in window) {
      // Sur telephone, le gyroscope remplace le pointeur. La premiere mesure sert de position de repos.
      let rest = null;
      const start = () =>
        listen(window, "deviceorientation", ({ beta, gamma }) => {
          if (beta === null || gamma === null || !onScreen()) return;
          rest ??= { beta, gamma };
          tilt(unit((gamma - rest.gamma) / GYRO_RANGE), unit((beta - rest.beta) / GYRO_RANGE));
        });

      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // iOS n'ouvre le gyroscope qu'a la demande, depuis un geste de l'utilisateur.
        listen(window, "touchend", () => DeviceOrientationEvent.requestPermission().then((state) => state === "granted" && start()).catch(() => {}), { once: true });
      } else {
        start();
      }
    }

    return () => {
      stops.forEach((stop) => stop());
      context.revert();
    };
  }, []);

  if (!item) return null;

  const { big, unit, lines, price, priceLabel, action } = stub(item);
  const { icon: KickerIcon, label: kickerLabel } = kicker(item);
  const reason = RECO_REASONS[item.reco?.reason];

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link
        ref={ticketRef}
        href={item.path}
        onClick={() => track("CLICK", item, { surface: "HOME" })}
        className="tk-ticket group/ticket h-[30rem] will-change-transform md:h-[25rem] lg:h-[27rem]"
        aria-label={`${item.name}. ${action}`}
      >
        <div className="relative min-h-0 overflow-hidden">
          {items.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out-soft ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
              aria-hidden={slideIndex !== index}
            >
              <Media
                src={slide.images[0]}
                alt=""
                sizes="(max-width: 896px) 100vw, 760px"
                priority={slideIndex === 0}
                eager={slideIndex === 0}
                icon={kicker(slide).icon}
                className={`size-full ${slideIndex === index ? "motion-safe:animate-[tk-drift_9s_linear_both]" : ""}`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-t from-[#0d2326]/90 via-[#0d2326]/25 to-transparent" aria-hidden />

          <div key={item.id} className="tk-enter absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:p-7">
            <p className="tk-label flex items-center gap-2 text-[0.8125rem] text-white/85" style={{ "--i": 0 }}>
              <KickerIcon className="size-4" aria-hidden />
              {kickerLabel}
            </p>
            <p className="tk-display max-w-[18ch] text-[clamp(1.75rem,3.6vw,2.75rem)] text-white" style={{ "--i": 1 }}>
              {item.name}
            </p>
            {reason && (
              <p className="tk-label flex w-fit items-center gap-1.5 rounded-full bg-white/16 px-3 py-1.5 text-[0.75rem] text-white backdrop-blur-md" style={{ "--i": 2 }}>
                <reason.icon className="size-3.5" aria-hidden />
                {reason.label}
              </p>
            )}
          </div>
        </div>

        <div key={`stub-${item.id}`} className="tk-enter flex min-w-0 items-center justify-between gap-4 p-5 md:flex-col md:items-start md:justify-between md:p-7">
          <div className="min-w-0" style={{ "--i": 1 }}>
            <p className="flex items-baseline gap-2">
              <span className={`tk-display text-gold ${String(big ?? "").length > 4 ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl"}`}>{big}</span>
              {unit && <span className="tk-label text-base text-white/80 md:text-lg">{unit}</span>}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-[0.8125rem] text-white/80 md:mt-4 md:text-[0.875rem]">
              {lines.filter(Boolean).map((line, lineIndex) => {
                const LineIcon = lineIndex === 0 ? (item.kind === "place" ? Star : Clock) : MapPin;

                return (
                  <li key={line} className="flex items-center gap-1.5">
                    <LineIcon className="size-3.5 shrink-0 text-white/60" aria-hidden />
                    <span className="truncate">{line}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3 md:w-full md:items-start" style={{ "--i": 2 }}>
            {price && (
              <p className="text-right md:text-left">
                {priceLabel && <span className="block text-[0.75rem] text-white/65">{priceLabel}</span>}
                <span className="tk-title text-lg text-white md:text-xl">{price}</span>
              </p>
            )}
            <span className="tk-label inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.9375rem] text-[#0d2326] transition-transform duration-300 ease-out-soft group-hover/ticket:translate-x-1">
              {action}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
        <span ref={glareRef} className="tk-ticket-glare" aria-hidden />
      </Link>

      {items.length > 1 && (
        <div className="mt-4 flex items-center gap-2" role="group" aria-label="À la une">
          {items.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`${slideIndex + 1} sur ${items.length} : ${slide.name}`}
              aria-current={slideIndex === index}
              className="group/dot relative h-6 grow basis-0 sm:max-w-16"
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line-strong">
                {slideIndex === index && (
                  <span
                    className="absolute inset-0 origin-left rounded-full bg-brand motion-reduce:animate-none"
                    style={{ animation: `tk-progress ${SLIDE_MS}ms linear both`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
