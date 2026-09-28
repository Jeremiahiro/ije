import { describe, expect, it, vi } from "vitest";
import {
	parseWeddingTrainFormData,
	validateWeddingTrainForm,
	WEDDING_TRAIN_FIELD,
	WEDDING_TRAIN_HONEYPOT_FIELD,
	WEDDING_TRAIN_MAX_LEN,
	type WeddingTrainRecord,
} from "@/util/weddingTrainForm";
import { recordToWeddingTrainSheetRow, rowToValues } from "@/util/weddingTrainSheet";
import { POST } from "@/pages/api/join";

vi.mock("@/util/googleSheetsApi", () => ({
	appendRowsToSheet: vi.fn().mockResolvedValue({ ok: true }),
}));

import { appendRowsToSheet } from "@/util/googleSheetsApi";

const unableForm = (name: string): FormData => {
	const f = new FormData();
	f.set(WEDDING_TRAIN_FIELD.fullName, name);
	f.set(WEDDING_TRAIN_FIELD.role, "train");
	f.set(WEDDING_TRAIN_FIELD.finalDecision, "unable");
	return f;
};

describe("validateWeddingTrainForm", () => {
	it("rejects an overly long name", () => {
		const name = "a".repeat(WEDDING_TRAIN_MAX_LEN.full_name + 1);
		const result = validateWeddingTrainForm(parseWeddingTrainFormData(unableForm(name)));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.fieldErrors[WEDDING_TRAIN_FIELD.fullName]).toBe("Name is too long.");
	});
});

describe("wedding train sheet row", () => {
	it("neutralizes formula injection in the name", () => {
		const record: WeddingTrainRecord = {
			full_name: '=HYPERLINK("https://evil.test","x")',
			role: "train",
			accommodation: "self_arrange",
			accommodation_nights: "",
			outfit: "self_source",
			outfit_scope: "",
			outfit_tier: "",
			outfit_self_confirm: true,
			commit_attend: true,
			commit_outfit: true,
			commit_travel: true,
			commit_contact: true,
			commit_church: false,
			final_decision: "honoured",
		};
		const values = rowToValues(recordToWeddingTrainSheetRow(record));
		expect(values[1]).toBe(`'${record.full_name}`);
	});
});

describe("POST /api/join", () => {
	const post = (form: FormData) =>
		POST({
			request: new Request("https://site.test/api/join", { method: "POST", body: form }),
		} as Parameters<typeof POST>[0]) as Promise<Response>;

	it("drops honeypot submissions without saving", async () => {
		vi.stubEnv("GOOGLE_SPREADSHEET_ID", "fake");
		vi.mocked(appendRowsToSheet).mockClear();
		const form = unableForm("Ada Okonkwo");
		form.set(WEDDING_TRAIN_HONEYPOT_FIELD, "Acme Ltd");
		const res = await post(form);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		expect(appendRowsToSheet).not.toHaveBeenCalled();
		vi.unstubAllEnvs();
	});

	it("saves a valid submission", async () => {
		vi.stubEnv("GOOGLE_SPREADSHEET_ID", "fake");
		vi.mocked(appendRowsToSheet).mockClear();
		const res = await post(unableForm("Ada Okonkwo"));
		expect(res.status).toBe(200);
		expect(appendRowsToSheet).toHaveBeenCalledOnce();
		vi.unstubAllEnvs();
	});
});
