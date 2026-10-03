const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2";

async function post(path, body) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    const error = new Error("Network error");
    error.status = 0;
    error.cause = cause;
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.serverMessage = payload?.message || null;
    throw error;
  }
  return payload?.data || payload;
}

export const requestTicketCode = (reference, channel) =>
  post("/tickets/verification/request", channel ? { reference, channel } : { reference });

export const confirmTicketCode = (reference, code) =>
  post("/tickets/verification/confirm", { reference, code });

export const fetchTicketSummary = (verificationToken) =>
  post("/tickets/verification/summary", { verification_token: verificationToken });

export const requestTicketReplacement = (verificationToken, itemId, reason) =>
  post("/tickets/replacement-requests", {
    verification_token: verificationToken,
    item_id: itemId,
    ...(reason ? { reason } : {}),
  });
