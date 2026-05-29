import { describe, expect, it } from "vitest";
import { buildRsvpRecord, type RsvpFormValues } from "./rsvpForm";
import { recordToSheetPayload, recordToSheetRows } from "./rsvpSheet";

const baseValues = (): RsvpFormValues => ({
	country_residence: "nigeria",
	other_country: "",
	full_name: "Ada Okonkwo",
	email: "ada@example.com",
	phone: "+2348000000000",
	party_size: 1,
	plus_one_name: "",
	event_traditional: true,
	event_white: false,
	expected_arrival: "",
	expected_departure: "",
	guest_notes: "",
	relationship: "friend",
	message_couple: "See you soon!",
});

describe("recordToSheetRows", () => {
	it("maps Nigeria guest to one sheet row", () => {
		const rows = recordToSheetRows(buildRsvpRecord(baseValues()), {
			submittedAt: "2026-05-29T12:00:00.000Z",
		});
		expect(rows).toHaveLength(1);
		expect(rows[0]?.full_name).toBe("Ada Okonkwo");
		expect(rows[0]?.guest_role).toBe("Primary");
		expect(rows[0]?.primary_guest).toBe("");
		expect(rows[0]?.country).toBe("Nigeria");
	});

	it("adds a second row for plus one so row count equals headcount", () => {
		const values = baseValues();
		values.party_size = 2;
		values.plus_one_name = "Jordan Lee";
		const rows = recordToSheetRows(buildRsvpRecord(values));
		expect(rows).toHaveLength(2);
		expect(rows[0]?.full_name).toBe("Ada Okonkwo");
		expect(rows[0]?.guest_role).toBe("Primary");
		expect(rows[1]?.full_name).toBe("Jordan Lee");
		expect(rows[1]?.guest_role).toBe("Plus one");
		expect(rows[1]?.primary_guest).toBe("Ada Okonkwo");
		expect(rows[1]?.email).toBe("");
		expect(rows[1]?.phone).toBe("");
		expect(rows[1]?.guest_notes).toBe("");
		expect(rows[1]?.message_couple).toBe("");
		expect(rows[1]?.country).toBe("Nigeria");
		expect(rows[1]?.relationship).toBe("friend");
		expect(rows[1]?.event_traditional).toBe("Yes");
		expect(rows[1]?.event_white).toBe("No");
		expect(rows[0]?.email).toBe("ada@example.com");
	});

	it("copies international travel dates onto the plus-one row", () => {
		const values = baseValues();
		values.country_residence = "uk";
		values.party_size = 2;
		values.plus_one_name = "Jordan Lee";
		values.expected_arrival = "2027-01-02";
		values.expected_departure = "2027-01-10";
		const rows = recordToSheetRows(buildRsvpRecord(values));
		expect(rows[1]?.expected_arrival).toBe("2027-01-02");
		expect(rows[1]?.expected_departure).toBe("2027-01-10");
		expect(rows[1]?.country).toBe("United Kingdom");
	});

	it("includes other country in country label when applicable", () => {
		const values = baseValues();
		values.country_residence = "other";
		values.other_country = "Canada";
		const payload = recordToSheetPayload(buildRsvpRecord(values));
		expect(payload.rows[0]?.country).toBe("Other (Canada)");
	});
});
