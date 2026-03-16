export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const res = await fetch(`https://api.ticketche.com${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data);
}
