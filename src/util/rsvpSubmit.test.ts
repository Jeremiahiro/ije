import { afterEach, describe, expect, it, vi } from "vitest";
import { RSVP_FIELD } from "./rsvpForm";
import { submitRsvpFormData } from "./rsvpSubmit";

const sampleFormData = (): FormData => {
	const fd = new FormData();
	fd.set(RSVP_FIELD.fullName, "Ada Okonkwo");
	fd.set(RSVP_FIELD.email, "ada@example.com");
	fd.set(RSVP_FIELD.countryResidence, "nigeria");
	fd.set(RSVP_FIELD.eventTraditional, "yes");
	return fd;
};

describe("submitRsvpFormData", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns success when API responds ok", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ ok: true }),
			}),
		);

		const result = await submitRsvpFormData(sampleFormData());
		expect(result).toEqual({ ok: true });
	});

	it("returns validation errors from API", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: false,
				status: 400,
				json: async () => ({
					ok: false,
					kind: "validation",
					fieldErrors: { [RSVP_FIELD.email]: "bad" },
				}),
			}),
		);

		const result = await submitRsvpFormData(sampleFormData());
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.kind).toBe("validation");
		expect(result.fieldErrors[RSVP_FIELD.email]).toBe("bad");
	});
});
