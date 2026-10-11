"use client";

import Image from "next/image";
import { useState } from "react";
import { ScanCode } from "@/components/shell/ScanCode";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { APP_LINKS } from "@/config/appLinks";
import { getDeviceOS } from "@/utils/deviceDetection";
import { useDeepLink } from "@/utils/useDeepLink";

const SITE_URL = "https://ticketche.com";

/** Liens universels deja reconnus par l'app (apple-app-site-association) : un scan ouvre la bonne fiche. */
const SCAN_PATHS = {
  event: (id) => `/events/details?eventId=${id}`,
  place: (id) => `/places/details?placeId=${id}`,
};

/** Badges officiels des stores, en francais. Les chartes d'Apple et de Google imposent de ne pas les redessiner. */
const STORES = [
  { href: APP_LINKS.download.ios, src: "/images/stores/app-store-fr.svg", label: "Télécharger dans l’App Store", width: 152, height: 48 },
  { href: APP_LINKS.download.android, src: "/images/stores/google-play-fr.svg", label: "Disponible sur Google Play", width: 162, height: 48 },
];

export function StoreButtons({ className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {STORES.map(({ href, src, label, width, height }) => (
        <a
          key={src}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="block rounded-lg transition-transform duration-200 ease-out-soft hover:-translate-y-0.5"
        >
          <Image src={src} alt="" width={width} height={height} unoptimized className="h-12 w-auto" />
        </a>
      ))}
    </div>
  );
}

/**
 * Action principale du site : amener le visiteur dans l'application.
 * Sur telephone, ouvre l'app sur la bonne fiche (ou le store). Sur ordinateur, propose un QR code a scanner.
 */
export function GetApp({ children = "Obtenir l’app", target, variant = "gold", size = "md", className = "", reason }) {
  const [open, setOpen] = useState(false);
  const { openInApp } = useDeepLink();

  const onClick = () => {
    const os = getDeviceOS();
    if (os === "other") return setOpen(true);
    if (target) return openInApp(target.kind, target.id);
    window.location.href = APP_LINKS.download[os];
  };

  const scanUrl = `${SITE_URL}${target ? SCAN_PATHS[target.kind](target.id) : "/download/"}`;

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={onClick}>
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Obtenir l’application Ticketché">
        <div className="flex flex-col items-center gap-5 text-center">
          <div>
            <h2 className="tk-title text-2xl">Continuez sur votre téléphone</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-2">
              {reason ?? "Réservation, paiement Mobile Money et tickets se font dans l’application."} Scannez ce code avec
              l’appareil photo.
            </p>
          </div>
          {open && <ScanCode value={scanUrl} className="size-44" />}
          <StoreButtons className="justify-center" />
        </div>
      </Dialog>
    </>
  );
}
