import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RSVP_FIELD, RSVP_HONEYPOT_FIELD } from "@/util/rsvpForm";
import { POST } from "@/pages/api/rsvp";

vi.mock("@/util/googleSheetsApi", () => ({
	appendRowsToSheet: vi.fn().mockResolvedValue({ ok: true }),
}));

import { appendRowsToSheet } from "@/util/googleSheetsApi";

const SHEET_ID = "fake-spreadsheet-id";

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
	return POST({ request } as Parameters<typeof POST>[0]);
};

beforeEach(() => {
	vi.stubEnv("GOOGLE_SPREADSHEET_ID", SHEET_ID);
	vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "sa@project.iam.gserviceaccount.com");
	vi.stubEnv("GOOGLE_PRIVATE_KEY", "fake-key");
	vi.mocked(appendRowsToSheet).mockResolvedValue({ ok: true });
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

describe("POST /api/rsvp", () => {
	it("returns 503 when the spreadsheet ID is not configured", async () => {
		vi.stubEnv("GOOGLE_SPREADSHEET_ID", "");

		const res = await post(validForm());
		expect(res.status).toBe(503);
		expect(await res.json()).toMatchObject({ ok: false, kind: "not_configured" });
		expect(appendRowsToSheet).not.toHaveBeenCalled();
	});

	it("silently accepts and drops honeypot (spam) submissions", async () => {
		const res = await post(validForm({ [RSVP_HONEYPOT_FIELD]: "buy-cheap-stuff" }));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		expect(appendRowsToSheet).not.toHaveBeenCalled();
	});

	it("returns 400 with field errors for invalid input", async () => {
		const form = validForm({ [RSVP_FIELD.email]: "not-an-email" });
		const res = await post(form);
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body).toMatchObject({ ok: false, kind: "validation" });
		expect(body.fieldErrors[RSVP_FIELD.email]).toBeDefined();
		expect(appendRowsToSheet).not.toHaveBeenCalled();
	});

	it("forwards a valid submission and returns ok", async () => {
		const res = await post(validForm());
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		expect(appendRowsToSheet).toHaveBeenCalledTimes(1);
		expect(appendRowsToSheet).toHaveBeenCalledWith("RSVPs", expect.any(Array));
	});

	it("returns 502 when the upstream sheet write fails", async () => {
		vi.mocked(appendRowsToSheet).mockResolvedValueOnce({ ok: false, reason: "upstream" });

		const res = await post(validForm());
		expect(res.status).toBe(502);
		expect(await res.json()).toMatchObject({ ok: false, kind: "upstream" });
	});
});
