import { Plus } from "@/components/icons";
import { FaqStructuredData } from "@/components/StructuredData";

export const HOME_FAQ = [
  {
    question: "Qu’est-ce que Ticketché ?",
    answer:
      "Une application béninoise qui réunit en un seul compte la billetterie d’événements, les lieux à découvrir (hôtels, culture, nature, sorties, parkings, garages) et les restaurants.",
  },
  {
    question: "Comment acheter un billet ou réserver un lieu ?",
    answer:
      "Choisissez un événement ou un lieu sur ce site, puis ouvrez-le dans l’application : vous y réservez, payez, et recevez votre ticket sous forme de QR code à présenter à l’entrée.",
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    answer:
      "Le Mobile Money et le portefeuille Ticketché, que vous rechargez depuis l’application. Les prix sont en francs CFA.",
  },
  {
    question: "L’application est-elle gratuite ?",
    answer: "Oui. Elle se télécharge gratuitement sur Google Play et sur l’App Store. Vous ne payez que ce que vous réservez.",
  },
  {
    question: "Dans quelles villes Ticketché est-il présent ?",
    answer:
      "Au Bénin, avec le plus grand nombre d’adresses à Cotonou et Abomey-Calavi, et des lieux à Porto-Novo, Ouidah, Grand-Popo, Parakou ou Natitingou.",
  },
  {
    question: "Je suis organisateur ou gérant, comment être référencé ?",
    answer:
      "Créez votre événement ou ajoutez votre lieu depuis l’application. Une fois validé par l’équipe, il apparaît dans l’application et sur ce site.",
  },
];

export function Faq({ questions = HOME_FAQ }) {
  return (
    <section className="tk-shell grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="questions">
      <FaqStructuredData questions={questions} />
      <div>
        <h2 id="questions" className="tk-display text-[clamp(2rem,4vw,3.25rem)]">
          Questions fréquentes
        </h2>
        <p className="mt-4 max-w-[40ch] text-ink-2">
          Une autre question ? Écrivez à{" "}
          <a href="mailto:support@ticketche.com" className="text-brand underline underline-offset-4">
            support@ticketche.com
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group/faq rounded-card border border-line bg-surface transition-colors duration-300 open:border-line-strong hover:border-line-strong">
            <summary className="tk-label flex list-none items-center justify-between gap-4 px-5 py-4.5 text-[1.0625rem] text-ink [&::-webkit-details-marker]:hidden">
              {question}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Plus className="size-4 transition-transform duration-300 ease-out-soft group-open/faq:rotate-45" aria-hidden />
              </span>
            </summary>
            <p className="max-w-[68ch] px-5 pb-5 text-ink-2">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
