"use client";

import { useEffect } from "react";
import { APP_LINKS } from "@/config/appLinks";
import { getDeviceOS } from "@/utils/deviceDetection";

/** Sur telephone, la page de telechargement mene droit au bon store. */
export function StoreRedirect() {
  useEffect(() => {
    const os = getDeviceOS();
    if (os !== "other") window.location.replace(APP_LINKS.download[os]);
  }, []);

  return null;
}
