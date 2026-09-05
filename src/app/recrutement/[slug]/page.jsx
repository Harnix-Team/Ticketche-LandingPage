import JobDetailClient from "./JobDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | Offre d'emploi — Ticketché`,
    description: `Postulez au poste de ${formattedTitle} chez Ticketché. Rejoignez une startup béninoise innovante spécialisée dans la mobilité urbaine et la billetterie événementielle.`,
    keywords: [
      `emploi ${formattedTitle} Bénin`,
      "recrutement Ticketché",
      "offre emploi Cotonou",
    ],
    alternates: { canonical: `/recrutement/${slug}` },
    openGraph: {
      title: `${formattedTitle} | Offre d'emploi — Ticketché`,
      description: `Postulez au poste de ${formattedTitle} chez Ticketché.`,
      url: `https://ticketche.com/recrutement/${slug}`,
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: `Offre d'emploi — Ticketché` }],
    },
  };
}

export default function JobDetailPage() {
  return <JobDetailClient />;
}