import { useCallback } from "react";

const STORE_URLS = {
  android: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
  ios: "https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811?",
};

export function useDeepLink() {
  const openInApp = useCallback((type, id) => {
    const appPaths = {
      event: `events/details?eventId=${id}`,
      place: `places/details?placeId=${id}`,
      referral: `sign-up?referral_code=${id}`,
    };

    const webPaths = {
      event: `events/details?eventId=${id}`,
      place: `places/details?placeId=${id}`,
      referral: `sign-up?referral_code=${id}`,
    };

    const appPath = appPaths[type];
    const webPath = webPaths[type];
    if (!appPath) return;

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isAndroid) {
      const intentUrl =
        `intent://${appPath}#Intent;` +
        `scheme=ticketche;` +
        `package=com.harnixsas.ticketche;` +
        `S.browser_fallback_url=${encodeURIComponent(STORE_URLS.android)};` +
        `end`;
      window.location.href = intentUrl;

    } else if (isIOS) {
      let appOpened = false;
      const onBlur = () => { appOpened = true; };
      window.addEventListener("blur", onBlur);
      window.location.href = `ticketche://${appPath}`;
      setTimeout(() => {
        window.removeEventListener("blur", onBlur);
        if (!appOpened) window.location.href = STORE_URLS.ios;
      }, 1200);

    } else {
      // Desktop : navigation dans le même onglet
      window.location.href = `/${webPath}`;
    }
  }, []);

  return { openInApp };
}