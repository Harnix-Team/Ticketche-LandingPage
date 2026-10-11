import {
  Activity, ArrowUpRight, Banknote, CalendarDays, Car, ChartColumn, ClipboardList, CreditCard, Handshake, MapPin,
  QrCode, ReceiptText, ShieldCheck, Smartphone, Star, Tag, Ticket, TrendingUp, Users, UtensilsCrossed, Wallet,
} from "@/components/icons";
import Link from "next/link";
import { IconList, Split } from "@/components/about/Blocks";
import { AppBand } from "@/components/home/AppBand";
import { Faq } from "@/components/home/Faq";
import { TypeGrid } from "@/components/home/TypeGrid";
import { GetApp } from "@/components/shell/GetApp";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { HoverPhoto, ON_PHOTO, ON_PHOTO_SOFT, ON_PHOTO_TILE, photoGroup } from "@/components/ui/HoverPhoto";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCatalog, getMenu } from "@/lib/api";
import { isUpcoming } from "@/lib/cards";

export const revalidate = 300;

export const metadata = {
  title: "À propos de Ticketché | Événements, lieux et restaurants au Bénin",
  description:
    "Découvrez Ticketché, l'application béninoise qui réunit la billetterie d'événements, les lieux de tous types (hôtels, culture, nature, sorties, parkings, garages, lavages) et les restaurants. Notre mission et nos services.",
  keywords: [
    "Ticketché à propos",
    "startup Bénin",
    "mobilité urbaine Cotonou",
    "application parking Bénin",
    "billetterie Bénin",
    "Harnix-Team",
  ],
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos de Ticketché | Événements, lieux et restaurants au Bénin",
    description:
      "Ticketché réunit la billetterie d'événements, les lieux de tous types et les restaurants du Bénin dans une seule application.",
    url: "https://ticketche.com/a-propos",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "À propos de Ticketché" }],
  },
};

const COVERAGE = [
  {
    icon: CalendarDays,
    key: "event",
    title: "Événements",
    text: "Concerts, festivals, soirées, conférences : trouvez les événements autour de vous et prenez vos billets en quelques gestes.",
    href: "/events/",
    action: "Voir les événements",
  },
  {
    icon: MapPin,
    key: "place",
    title: "Lieux",
    text: "Hôtels, culture, nature, sorties, sport et shopping, mais aussi parkings, garages, lavages et stations-service, avec leurs horaires, leurs tarifs et leurs avis.",
    href: "/establishments/",
    action: "Voir les lieux",
  },
  {
    icon: UtensilsCrossed,
    key: "restaurant",
    title: "Restaurants",
    text: "Le menu complet avant de vous déplacer, et la commande quand elle est proposée.",
    href: "/restaurants/",
    action: "Voir les restaurants",
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Tout ce qui vous entoure",
    text: "Repérez en un instant les événements, les lieux et les restaurants disponibles près de vous, où que vous soyez.",
  },
  {
    icon: Wallet,
    title: "Portefeuille numérique",
    text: "Centralisez votre solde, rechargez par Mobile Money et réglez tous vos services Ticketché en un geste.",
  },
  {
    icon: QrCode,
    title: "QR code et accès rapide",
    text: "Un ticket numérique infalsifiable pour chaque réservation. Un scan suffit : zéro papier, zéro file d’attente.",
  },
  {
    icon: ReceiptText,
    title: "Tous vos tickets au même endroit",
    text: "Gardez une trace de vos tickets et de vos transactions. Plus besoin de conserver des papiers.",
  },
  {
    icon: Star,
    title: "Avis et notations",
    text: "Consultez les avis avant de choisir une adresse. Notez votre expérience et aidez la communauté.",
  },
  {
    icon: Tag,
    title: "Codes promo et réductions",
    text: "Saisissez un code promo au paiement pour obtenir une réduction immédiate sur vos services.",
  },
  {
    icon: Car,
    title: "Véhicules enregistrés",
    text: "Ajoutez vos véhicules une fois pour toutes. Chaque réservation de parking, de lavage ou de garage y est rattachée.",
  },
  {
    icon: Handshake,
    title: "Services additionnels",
    text: "Les gérants proposent des extras, comme la vidange, le gonflage des pneus ou le nettoyage intérieur, réservables dans l’application.",
  },
];

const USER_ITEMS = [
  {
    icon: MapPin,
    title: "Trouvez rapidement ce qu’il vous faut",
    text: "Adresses à proximité, prix, disponibilités, horaires et avis, en un coup d’œil.",
  },
  {
    icon: Smartphone,
    title: "Ticket numérique sécurisé",
    text: "Fini les tickets papier qui se perdent. Votre ticket reste sur votre téléphone, clair et vérifiable à tout moment.",
  },
  {
    icon: CreditCard,
    title: "Paiement fluide et sécurisé",
    text: "Payez sans tracas par Mobile Money, grâce à nos partenaires certifiés. Un simple scan et vous êtes libre.",
  },
  {
    icon: Ticket,
    title: "Billets d’événements en ligne",
    text: "Concerts, soirées, expositions : réservez vos tickets depuis l’application, recevez votre QR code et entrez sans attendre.",
  },
];

const MANAGER_ITEMS = [
  {
    icon: Activity,
    title: "Suivi en temps réel",
    text: "Réservations en cours, opérations terminées, files d’attente et volumes de la journée.",
  },
  {
    icon: Banknote,
    title: "Encaissement simplifié",
    text: "Paiements en espèces et par Mobile Money, avec une traçabilité complète et sans erreurs.",
  },
  {
    icon: ChartColumn,
    title: "Statistiques détaillées",
    text: "Revenus, heures de pointe, services les plus demandés et progression du chiffre d’affaires.",
  },
  {
    icon: ShieldCheck,
    title: "Réduction de la fraude",
    text: "Des tickets numériques horodatés, impossibles à falsifier, qui évitent les litiges.",
  },
  {
    icon: Users,
    title: "Gestion du personnel",
    text: "Performances individuelles, services traités et historique complet des agents.",
  },
  {
    icon: ClipboardList,
    title: "Organisation renforcée",
    text: "Toutes vos opérations centralisées. Plus de papier, plus d’oublis, plus de pertes.",
  },
  {
    icon: TrendingUp,
    title: "Revenus optimisés",
    text: "Identifiez vos meilleures plages horaires et améliorez votre rentabilité.",
  },
  {
    icon: Ticket,
    title: "Billetterie d’événements",
    text: "Créez vos événements, vendez vos tickets en ligne et suivez vos réservations.",
  },
];


export default async function AProposPage() {
  const now = new Date();
  const catalog = await getCatalog();
  const typesInUse = new Set(catalog.places.flatMap((place) => place.types.map(({ type }) => type)));

  // Photos de fond des trois cartes : un evenement a venir, le lieu le mieux note, un plat du premier menu publie.
  const withPhoto = (items) => items.find((item) => item.images.length > 0);
  const firstRestaurant = catalog.restaurants.find((restaurant) => !restaurant.resthora) ?? catalog.restaurants[0];
  const menu = firstRestaurant ? await getMenu(firstRestaurant.menuKey) : null;
  const coverPhotos = {
    event: withPhoto(catalog.events.filter((event) => isUpcoming(event, now)))?.images[0],
    place: withPhoto([...catalog.places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)))?.images[0],
    restaurant: menu?.flatMap((category) => category.items).find((item) => item.image)?.image ?? withPhoto(catalog.restaurants)?.images[0],
  };

  const liveStats = [
    { label: "Événements à venir", value: catalog.events.filter((event) => isUpcoming(event, now)).length },
    { label: "Lieux référencés", value: catalog.places.length },
    { label: "Restaurants", value: catalog.restaurants.length },
    { label: "Types de lieux", value: typesInUse.size },
  ]
    .filter(({ value }) => value > 0);

  return (
    <div className="flex flex-col gap-[clamp(3.5rem,7vw,6rem)] pb-8">
      <div>
        <PageHeader
          title="À propos de Ticketché"
          intro="Ticketché connecte les Béninois aux événements, aux lieux et aux restaurants qui les entourent. Trouvez, réservez et payez en quelques gestes, que vous cherchiez une sortie, un service du quotidien ou que vous gériez un établissement."
        >
          <div className="mt-7 flex flex-wrap gap-2.5">
            <GetApp variant="brand" size="lg">
              <Smartphone className="size-5" aria-hidden />
              Obtenir l’application
            </GetApp>
            <Button href="/contact/" variant="outline" size="lg">
              Nous contacter
            </Button>
          </div>
        </PageHeader>

        {liveStats.length > 0 && (
          <dl className="tk-shell mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:mt-14 lg:grid-cols-5">
            {[...liveStats, { label: "Utilisateurs", value: 5000, prefix: "+" }].map(({ label, value, prefix }) => (
              <div key={label} className="flex flex-col-reverse justify-end gap-1 rounded-card border border-line bg-surface p-4 sm:p-5">
                <dt className="text-[0.875rem] text-ink-2">{label}</dt>
                <dd className="tk-display text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
                  <CountUp value={value} prefix={prefix} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <Split id="mission" title="Simplifier la vie urbaine au Bénin">
        <div className="flex max-w-[62ch] flex-col gap-4 text-[1.0625rem] text-ink-2">
          <p>
            Ticketché réunit dans une seule application ce dont vous avez besoin pour sortir, vous déplacer et vous
            organiser : la billetterie des événements, des lieux de tous types et les restaurants. Trouvez rapidement
            une adresse autour de vous, accédez à des prestataires fiables et profitez d’une expérience simple,
            rapide et moderne.
          </p>
          <p>
            Les lieux ne s’arrêtent plus aux parkings, aux garages et aux lavages. Vous y trouvez aussi des hôtels,
            des lieux de culture et de nature, des sorties, du sport, du shopping et des stations-service.
          </p>
          <p>
            Que vous soyez utilisateur, gérant d’un lieu ou organisateur d’événements, Ticketché vous aide à gagner
            du temps, à mieux organiser vos activités et à profiter pleinement de la ville.
          </p>
        </div>
      </Split>

      <section aria-label="Ce que couvre Ticketché" className="flex flex-col gap-10">
        <div>
          <SectionHeader
            title="Ce que couvre Ticketché"
            description="Tout ce qui nécessite un ticket, au même endroit."
          />
          <ul className="tk-shell grid gap-3 md:grid-cols-3">
            {COVERAGE.map(({ key, icon: Icon, title, text, href, action }) => (
              <li key={title}>
                <Link
                  href={href}
                  className={`flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 ease-out-soft hover:border-line-strong hover:shadow-[0_14px_28px_-14px_rgb(13_35_38/0.28)] ${photoGroup(coverPhotos[key])}`}
                >
                  <HoverPhoto src={coverPhotos[key]} kind={key} sizes="(max-width: 768px) 100vw, 420px" />
                  <span className={`grid size-11 place-items-center rounded-xl bg-brand-soft text-brand ${ON_PHOTO_TILE}`}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className={`tk-title mt-4 text-xl ${ON_PHOTO}`}>{title}</h3>
                  <p className={`mt-2 flex-1 text-[0.9375rem] text-ink-2 ${ON_PHOTO_SOFT}`}>{text}</p>
                  <span className={`tk-label mt-5 flex items-center gap-1 text-[0.875rem] text-brand ${ON_PHOTO}`}>
                    {action}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover/photo:translate-x-0.5 group-hover/photo:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {typesInUse.size > 0 && catalog.placeTypes.length > 0 && (
          <div>
            <SectionHeader
              as="h3"
              title="Des lieux de tous types"
              description="Le nombre de lieux publiés pour chaque type, mis à jour en continu."
              href="/establishments/"
              hrefLabel="Tous les lieux"
            />
            <TypeGrid placeTypes={catalog.placeTypes} places={catalog.places} />
          </div>
        )}
      </section>

      <section aria-label="Dans l’application">
        <SectionHeader
          title="Dans l’application"
          description="Le site vous aide à choisir. L’application réserve, encaisse et garde vos tickets."
        />
        <ul className="tk-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-card border border-line bg-surface p-5">
              <Icon className="size-6 text-brand" aria-hidden />
              <h3 className="tk-title mt-4 text-lg">{title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-ink-2">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Split
        id="utilisateurs"
        title="Votre compagnon de mobilité et de sorties"
        intro="Plus besoin de tourner en rond. Ticketché vous montre les événements à venir, les adresses les mieux notées et les lieux ouverts près de vous."
      >
        <IconList items={USER_ITEMS} />
      </Split>

      <Split
        id="gerants"
        title="Vous êtes gérant ou organisateur ?"
        intro="Ticketché vous aide à digitaliser et à rentabiliser votre activité. Que vous gériez un hôtel, un lieu culturel, un parking, un lavage ou un garage, ou que vous organisiez des événements, gagnez en visibilité, en organisation et en efficacité."
        action={
          <GetApp variant="outline" reason="L’inscription de votre lieu ou de votre événement se fait dans l’application.">
            Rejoindre Ticketché
          </GetApp>
        }
      >
        <IconList items={MANAGER_ITEMS} tone="clay" />
      </Split>

      <AppBand />
      <Faq />
    </div>
  );
}
