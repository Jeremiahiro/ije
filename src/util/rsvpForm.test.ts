import { describe, expect, it } from "vitest";
import {
	buildRsvpRecord,
	parseRsvpFormData,
	RSVP_EVENTS_ERROR_KEY,
	RSVP_FIELD,
	validateRsvpForm,
	type RsvpFormValues,
} from "./rsvpForm";

const fd = (extra: Record<string, string | Blob> = {}): FormData => {
	const f = new FormData();
	const base: Record<string, string> = {
		[RSVP_FIELD.fullName]: "Ada Okonkwo",
		[RSVP_FIELD.email]: "ada@example.com",
		[RSVP_FIELD.phone]: "+2348000000000",
		[RSVP_FIELD.plusOneName]: "",
		[RSVP_FIELD.countryResidence]: "nigeria",
		[RSVP_FIELD.otherCountry]: "",
		[RSVP_FIELD.expectedArrival]: "",
		[RSVP_FIELD.expectedDeparture]: "",
		[RSVP_FIELD.airportPickup]: "",
		[RSVP_FIELD.travelGroupCoordination]: "",
		[RSVP_FIELD.guestNotes]: "",
		[RSVP_FIELD.messageCouple]: "",
		[RSVP_FIELD.relationship]: "",
		[RSVP_FIELD.eventTraditional]: "yes",
	};
	for (const [k, v] of Object.entries({ ...base, ...extra })) {
		if (typeof v === "string") f.set(k, v);
		else f.set(k, v);
	}
	return f;
};

describe("validateRsvpForm", () => {
	it("accepts complete Nigeria guest with one event", () => {
		const form = fd({
			[RSVP_FIELD.eventWhite]: "yes",
		});
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.values.country_residence).toBe("nigeria");
		expect(result.values.event_traditional).toBe(true);
		expect(result.values.event_white).toBe(true);
		expect(result.values.airport_pickup).toBeNull();
	});

	it("requires at least one event", () => {
		const form = fd();
		form.delete(RSVP_FIELD.eventTraditional);
		form.delete(RSVP_FIELD.eventWhite);
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.fieldErrors[RSVP_EVENTS_ERROR_KEY]).toBeDefined();
	});

	it("requires other country when coming from Other", () => {
		const form = fd({
			[RSVP_FIELD.countryResidence]: "other",
			[RSVP_FIELD.otherCountry]: "",
		});
		form.delete(RSVP_FIELD.eventWhite);
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.fieldErrors[RSVP_FIELD.otherCountry]).toBeDefined();
	});

	it("treats Other + country as international and requires travel fields", () => {
		const form = fd({
			[RSVP_FIELD.countryResidence]: "other",
			[RSVP_FIELD.otherCountry]: "Canada",
			[RSVP_FIELD.expectedArrival]: "2027-01-01",
			[RSVP_FIELD.expectedDeparture]: "2027-01-10",
			[RSVP_FIELD.airportPickup]: "yes",
			[RSVP_FIELD.travelGroupCoordination]: "no",
		});
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.values.country_residence).toBe("other");
		expect(result.values.other_country).toBe("Canada");
	});

	it("requires plus one name when plus one is checked", () => {
		const form = fd({
			[RSVP_FIELD.hasPlusOne]: "yes",
			[RSVP_FIELD.plusOneName]: "",
		});
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.fieldErrors[RSVP_FIELD.plusOneName]).toBeDefined();
	});

	it("rejects departure before arrival for international", () => {
		const form = fd({
			[RSVP_FIELD.countryResidence]: "uk",
			[RSVP_FIELD.expectedArrival]: "2027-01-05",
			[RSVP_FIELD.expectedDeparture]: "2027-01-01",
			[RSVP_FIELD.airportPickup]: "no",
			[RSVP_FIELD.travelGroupCoordination]: "yes",
		});
		const result = validateRsvpForm(parseRsvpFormData(form));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.fieldErrors[RSVP_FIELD.expectedDeparture]).toBeDefined();
	});
});

describe("buildRsvpRecord", () => {
	it("nulls empty optionals", () => {
		const values: RsvpFormValues = {
			country_residence: "nigeria",
			other_country: "",
			full_name: "Test",
			email: "t@example.com",
			phone: "",
			party_size: 1,
			plus_one_name: "",
			event_traditional: true,
			event_white: false,
			expected_arrival: "",
			expected_departure: "",
			airport_pickup: null,
			guest_notes: "",
			relationship: null,
			message_couple: "",
			travel_group_coordination: null,
		};
		const row = buildRsvpRecord(values);
		expect(row.phone).toBeNull();
		expect(row.plus_one_name).toBeNull();
		expect(row.message_couple).toBeNull();
	});
});
