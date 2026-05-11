import ConditionsClient from "./ConditionsClient";

export const metadata = {
  title: "Conditions Générales d'Utilisation | Ticketché",
  description:
    "Conditions générales d'utilisation de la plateforme Ticketché. Lisez attentivement nos CGU avant d'utiliser nos services au Bénin.",
  alternates: { canonical: "/politiques/conditions" },
  robots: { index: true, follow: false },
};

export default function TermsAndConditionsPage() {
  return <ConditionsClient />;
}