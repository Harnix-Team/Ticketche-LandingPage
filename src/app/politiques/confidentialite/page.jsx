import ConfidentialiteClient from "./ConfidentialiteClient";

export const metadata = {
  title: "Politique de Confidentialité | Ticketché",
  description:
    "Politique de confidentialité de Ticketché. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.",
  alternates: { canonical: "/politiques/confidentialite" },
  robots: { index: true, follow: false },
};

export default function PrivacyPolicyPage() {
  return <ConfidentialiteClient />;
}