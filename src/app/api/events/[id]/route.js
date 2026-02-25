// Détails d'un évènement par Id

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const response = await fetch(`https://api.ticketche.com/api/v2/events/${params.id}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}