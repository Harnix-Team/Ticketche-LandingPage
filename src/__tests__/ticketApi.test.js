import {
  requestTicketCode,
  confirmTicketCode,
  fetchTicketSummary,
  requestTicketReplacement,
} from "@/api/ticketApi";

const ok = (data) => ({ ok: true, status: 200, json: async () => ({ success: true, data }) });
const fail = (status, message) => ({ ok: false, status, json: async () => ({ message }) });

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("ticketApi", () => {
  it("posts the request payload and unwraps data", async () => {
    fetch.mockResolvedValue(ok({ destination: { channel: "email", masked: "a***@x.com" } }));
    const res = await requestTicketCode("TKEV-7K3M-Q9X2", "email");
    expect(res.destination.masked).toBe("a***@x.com");
    const [url, opts] = fetch.mock.calls[0];
    expect(url).toMatch(/\/tickets\/verification\/request$/);
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ reference: "TKEV-7K3M-Q9X2", channel: "email" });
  });

  it("omits the channel when not provided", async () => {
    fetch.mockResolvedValue(ok({}));
    await requestTicketCode("EVT-AB12-CD34");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ reference: "EVT-AB12-CD34" });
  });

  it("confirms, fetches summary and requests a replacement", async () => {
    fetch.mockResolvedValue(ok({ verification_token: "tok" }));
    await confirmTicketCode("REF", "123456");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ reference: "REF", code: "123456" });
    await fetchTicketSummary("tok");
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ verification_token: "tok" });
    await requestTicketReplacement("tok", 5, "perdu");
    expect(fetch.mock.calls[2][0]).toMatch(/\/tickets\/replacement-requests$/);
    expect(JSON.parse(fetch.mock.calls[2][1].body)).toEqual({
      verification_token: "tok",
      item_id: 5,
      reason: "perdu",
    });
  });

  it("carries the HTTP status and server message in errors", async () => {
    fetch.mockResolvedValue(fail(422, "Règle métier"));
    await expect(requestTicketReplacement("t", 1)).rejects.toMatchObject({
      status: 422,
      serverMessage: "Règle métier",
    });
  });

  it("maps network failures to status 0", async () => {
    fetch.mockRejectedValue(new TypeError("fail"));
    await expect(fetchTicketSummary("t")).rejects.toMatchObject({ status: 0 });
  });
});
