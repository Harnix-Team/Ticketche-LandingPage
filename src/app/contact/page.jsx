import { Mail, MapPin, Phone } from "@/components/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { PHONE_DISPLAY } from "@/config/constants";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contactez Ticketché | Support & Assistance au Bénin",
  description:
    "Une question, un partenariat ou besoin d'assistance ? Contactez l'équipe Ticketché. Nous répondons dans les plus brefs délais. Disponible pour particuliers et professionnels.",
  keywords: [
    "contact Ticketché",
    "support Ticketché",
    "assistance Bénin",
    "partenariat Ticketché",
    "service client Cotonou",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contactez Ticketché | Support & Assistance",
    description:
      "Une question ou un partenariat ? Contactez l'équipe Ticketché, nous répondons dans les plus brefs délais.",
    url: "https://ticketche.com/contact",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Contact Ticketché" }],
  },
};

const DETAILS = [
  { icon: MapPin, label: "Notre localisation", value: "Abomey Calavi, Bénin" },
  { icon: Phone, label: "Appelez-nous", value: PHONE_DISPLAY, href: "tel:+2290140512133" },
  { icon: Mail, label: "Envoyez un email", value: "support@ticketche.com", href: "mailto:support@ticketche.com" },
];

export default function ContactPage() {
  return (
    <div className="pb-8">
      <PageHeader
        title="Besoin d’aide ?"
        intro="Contactez-nous et un représentant vous répondra dans les plus brefs délais."
      />

      <div className="tk-shell mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <section aria-labelledby="coordonnees">
          <h2 id="coordonnees" className="tk-title text-[1.5rem]">
            Nos coordonnées
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {DETAILS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="flex min-w-0 flex-col">
                  <span className="text-[0.875rem] text-ink-2">{label}</span>
                  {href ? (
                    <a href={href} className="tk-label break-words text-ink underline-offset-4 hover:text-brand hover:underline">
                      {value}
                    </a>
                  ) : (
                    <span className="tk-label text-ink">{value}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ecrire" className="rounded-panel border border-line bg-surface p-5 sm:p-8">
          <h2 id="ecrire" className="tk-title text-[1.5rem]">
            Écrivez-nous
          </h2>
          <p className="mt-2 mb-6 text-[0.9375rem] text-ink-2">
            Votre message arrive directement à l’équipe Ticketché, qui vous répond par e-mail.
          </p>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
