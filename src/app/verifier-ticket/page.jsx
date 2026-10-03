import VerifierTicketClient from "./VerifierTicketClient";

export const metadata = {
  title: "Vérifier mon ticket | Ticketché",
  description:
    "Vérifiez votre ticket Ticketché avec sa référence et un code reçu par e-mail ou SMS, retrouvez votre QR code et l'accès en ligne à votre événement.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/verifier-ticket" },
};

export default function VerifierTicketPage() {
  return <VerifierTicketClient />;
}
