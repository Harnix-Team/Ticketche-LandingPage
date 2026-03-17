import { useCallback } from "react";

const STORE_URLS = {
  android: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
  ios: "https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811?",
};

export function useDeepLink() {
  const openInApp = useCallback((type, id) => {
    const paths = {
      event: `events/details?eventId=${id}`,
      place: `places/details?placeId=${id}`,
      referral: `sign-up?referral_code=${id}`,
    };

    const path = paths[type];
    if (!path) return;

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isAndroid) {
      const intentUrl =
        `intent://${path}#Intent;` +
        `scheme=ticketche;` +
        `package=com.harnixsas.ticketche;` +
        `S.browser_fallback_url=${encodeURIComponent(STORE_URLS.android)};` +
        `end`;
      window.location.href = intentUrl;

    } else if (isIOS) {
      let appOpened = false;
      const onBlur = () => { appOpened = true; };
      window.addEventListener("blur", onBlur);
      window.location.href = `ticketche://${path}`;
      setTimeout(() => {
        window.removeEventListener("blur", onBlur);
        if (!appOpened) window.location.href = STORE_URLS.ios;
      }, 1200);

    } else {
      window.open(`https://ticketche.com/${path}`, "_blank");
    }
  }, []);

  return { openInApp };
}
