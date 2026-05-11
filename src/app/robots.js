export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/sondage/", "/questionnaires/", "/api/"],
      },
    ],
    sitemap: "https://www.ticketche.com/sitemap.xml",
    host: "https://www.ticketche.com",
  };
}