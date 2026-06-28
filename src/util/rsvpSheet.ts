import type { CountryResidence, RsvpRecord } from "@/util/rsvpForm";

const COUNTRY_LABELS: Record<CountryResidence, string> = {
	nigeria: "Nigeria",
	uk: "United Kingdom",
	usa: "United States",
	other: "Other",
};

const boolLabel = (value: boolean): string => (value ? "Yes" : "No");

/**
 * Neutralize spreadsheet formula injection: a cell whose first character is
 * one of = + - @ (or a leading tab/CR) is treated as a formula by Google
 * Sheets/Excel. Prefixing a single quote forces the value to be stored as text.
 */
const FORMULA_TRIGGER_RE = /^[=+\-@\t\r]/;

export const sanitizeSheetCell = (value: string): string =>
	FORMULA_TRIGGER_RE.test(value) ? `'${value}` : value;

const sanitizeRow = (row: RsvpSheetGuestRow): RsvpSheetGuestRow => {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(row)) {
		out[key] = sanitizeSheetCell(value);
	}
	return out as RsvpSheetGuestRow;
};

/** One spreadsheet row = one attending guest. */
export type RsvpSheetGuestRow = {
	submitted_at: string;
	full_name: string;
	guest_role: "Primary" | "Plus one";
	primary_guest: string;
	email: string;
	phone: string;
	country: string;
	other_country: string;
	event_traditional: string;
	event_white: string;
	expected_arrival: string;
	expected_departure: string;
	guest_notes: string;
	relationship: string;
	message_couple: string;
};

/** Flat JSON body sent to the Google Apps Script web app. */
export type RsvpSheetPayload = {
	secret?: string;
	rows: RsvpSheetGuestRow[];
};

const countryLabelForRecord = (record: RsvpRecord): { country: string; other_country: string } => {
	const countryLabel = COUNTRY_LABELS[record.country_residence];
	const country =
		record.country_residence === "other" && record.other_country
			? `${countryLabel} (${record.other_country})`
			: countryLabel;
	return {
		country,
		other_country: record.other_country ?? "",
	};
};

/** Plus-one row: shared trip/event fields only — no email, phone, or free-text duplicates. */
const plusOneRowFields = (
	record: RsvpRecord,
	submittedAt: string,
): Omit<RsvpSheetGuestRow, "full_name" | "guest_role" | "primary_guest"> => {
	const primary = primaryGuestFields(record, submittedAt);
	return {
		submitted_at: primary.submitted_at,
		email: "",
		phone: "",
		country: primary.country,
		other_country: primary.other_country,
		event_traditional: primary.event_traditional,
		event_white: primary.event_white,
		expected_arrival: primary.expected_arrival,
		expected_departure: primary.expected_departure,
		guest_notes: "",
		relationship: primary.relationship,
		message_couple: "",
	};
};

const primaryGuestFields = (
	record: RsvpRecord,
	submittedAt: string,
): Omit<RsvpSheetGuestRow, "full_name" | "guest_role" | "primary_guest"> => {
	const { country, other_country } = countryLabelForRecord(record);
	return {
		submitted_at: submittedAt,
		email: record.email,
		phone: record.phone ?? "",
		country,
		other_country,
		event_traditional: boolLabel(record.event_traditional),
		event_white: boolLabel(record.event_white),
		expected_arrival: record.expected_arrival ?? "",
		expected_departure: record.expected_departure ?? "",
		guest_notes: record.guest_notes ?? "",
		relationship: record.relationship ?? "",
		message_couple: record.message_couple ?? "",
	};
};

/** Build one sheet row per guest (plus one gets their own row). */
export const recordToSheetRows = (
	record: RsvpRecord,
	opts?: { submittedAt?: string },
): RsvpSheetGuestRow[] => {
	const submittedAt = opts?.submittedAt ?? new Date().toISOString();
	const primaryFields = primaryGuestFields(record, submittedAt);

	const rows: RsvpSheetGuestRow[] = [
		{
			...primaryFields,
			full_name: record.full_name,
			guest_role: "Primary",
			primary_guest: "",
		},
	];

	const plusOne = record.plus_one_name?.trim();
	if (record.party_size > 1 && plusOne) {
		rows.push({
			...plusOneRowFields(record, submittedAt),
			full_name: plusOne,
			guest_role: "Plus one",
			primary_guest: record.full_name,
		});
	}

	return rows.map(sanitizeRow);
};

export const recordToSheetPayload = (
	record: RsvpRecord,
	opts?: { submittedAt?: string; secret?: string },
): RsvpSheetPayload => ({
	...(opts?.secret ? { secret: opts.secret } : {}),
	rows: recordToSheetRows(record, { submittedAt: opts?.submittedAt }),
});

export type ForwardRsvpResult = { ok: true } | { ok: false; reason: "upstream" | "invalid_response" };

const parseAppsScriptJson = (text: string): { ok?: boolean } | null => {
	try {
		return JSON.parse(text) as { ok?: boolean };
	} catch {
		return null;
	}
};

/** POST validated RSVP row to a deployed Google Apps Script web app URL. */
export const forwardRsvpToGoogleSheet = async (
	webhookUrl: string,
	record: RsvpRecord,
	secret?: string,
): Promise<ForwardRsvpResult> => {
	const payload = recordToSheetPayload(record, { secret });

	let response: Response;
	try {
		response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			redirect: "follow",
		});
	} catch {
		return { ok: false, reason: "upstream" };
	}

	const text = await response.text();
	const parsed = parseAppsScriptJson(text);

	if (!response.ok || parsed?.ok === false) {
		return { ok: false, reason: "upstream" };
	}

	if (parsed?.ok === true) {
		return { ok: true };
	}

	if (response.ok && text.trim().length === 0) {
		return { ok: true };
	}

	return parsed == null && response.ok ? { ok: true } : { ok: false, reason: "invalid_response" };
};
