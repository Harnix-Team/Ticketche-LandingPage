import { Suspense } from "react";
import SondageClient from "./SondageClient";

export const metadata = {
  title: "Sondage Ticketché | Donnez votre avis",
  description:
    "Participez au sondage Ticketché et aidez-nous à améliorer nos services. Votre avis compte pour bâtir la meilleure expérience de mobilité urbaine au Bénin.",
  alternates: { canonical: "/sondage" },
  robots: { index: false, follow: false },
};

export default function SondagePage() {
  return (
    <Suspense fallback={null}>
      <SondageClient />
    </Suspense>
  );
}