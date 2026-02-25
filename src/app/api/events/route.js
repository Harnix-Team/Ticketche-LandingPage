export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://api.ticketche.com/api/v2/events");
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Erreur fetch events:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}