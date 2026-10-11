"use client";

import { useEffect, useState } from "react";

/** QR code vers une adresse du site, a scanner depuis un ordinateur pour poursuivre sur telephone. */
export function ScanCode({ value, className = "" }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode")
      .then((QR) => QR.toString(value, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0d2326", light: "#ffffff" } }))
      .then((markup) => !cancelled && setSvg(markup))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div
      className={`rounded-2xl bg-white p-3 [&>svg]:size-full ${className}`}
      role="img"
      aria-label="QR code à scanner avec votre téléphone"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
