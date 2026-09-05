export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/sondage/", "/questionnaires/", "/api/"],
      },
    ],
    sitemap: "https://ticketche.com/sitemap.xml",
    host: "https://ticketche.com",
  };
}