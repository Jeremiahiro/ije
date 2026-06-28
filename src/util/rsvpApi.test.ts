import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RSVP_FIELD, RSVP_HONEYPOT_FIELD } from "@/util/rsvpForm";
import { POST } from "@/pages/api/rsvp";

const WEBHOOK = "https://script.example.com/exec";

const validForm = (extra: Record<string, string> = {}): FormData => {
	const f = new FormData();
	f.set(RSVP_FIELD.fullName, "Ada Okonkwo");
	f.set(RSVP_FIELD.email, "ada@example.com");
	f.set(RSVP_FIELD.countryResidence, "nigeria");
	f.set(RSVP_FIELD.eventTraditional, "yes");
	for (const [k, v] of Object.entries(extra)) f.set(k, v);
	return f;
};

const post = (form: FormData): Promise<Response> => {
	const request = new Request("https://site.test/api/rsvp", {
		method: "POST",
		body: form,
	});
	// Only `request` is read by the handler.
	return POST({ request } as Parameters<typeof POST>[0]);
};

const okFetch = () =>
	vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));

beforeEach(() => {
	vi.stubEnv("RSVP_GOOGLE_SCRIPT_URL", WEBHOOK);
	vi.stubEnv("RSVP_SCRIPT_SECRET", "shh");
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("POST /api/rsvp", () => {
	it("returns 503 when the webhook URL is not configured", async () => {
		vi.stubEnv("RSVP_GOOGLE_SCRIPT_URL", "");
		const fetchMock = okFetch();
		vi.stubGlobal("fetch", fetchMock);

		const res = await post(validForm());
		expect(res.status).toBe(503);
		expect(await res.json()).toMatchObject({ ok: false, kind: "not_configured" });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("silently accepts and drops honeypot (spam) submissions", async () => {
		const fetchMock = okFetch();
		vi.stubGlobal("fetch", fetchMock);

		const res = await post(validForm({ [RSVP_HONEYPOT_FIELD]: "buy-cheap-stuff" }));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		// Crucially, nothing was forwarded to the sheet.
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("returns 400 with field errors for invalid input", async () => {
		const fetchMock = okFetch();
		vi.stubGlobal("fetch", fetchMock);

		const form = validForm({ [RSVP_FIELD.email]: "not-an-email" });
		const res = await post(form);
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body).toMatchObject({ ok: false, kind: "validation" });
		expect(body.fieldErrors[RSVP_FIELD.email]).toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("forwards a valid submission and returns ok", async () => {
		const fetchMock = okFetch();
		vi.stubGlobal("fetch", fetchMock);

		const res = await post(validForm());
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith(WEBHOOK, expect.objectContaining({ method: "POST" }));
	});

	it("returns 502 when the upstream sheet write fails", async () => {
		const fetchMock = vi.fn(async () => new Response("nope", { status: 500 }));
		vi.stubGlobal("fetch", fetchMock);

		const res = await post(validForm());
		expect(res.status).toBe(502);
		expect(await res.json()).toMatchObject({ ok: false, kind: "upstream" });
	});
});
