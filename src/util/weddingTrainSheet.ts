import type { WeddingTrainRecord } from "@/util/weddingTrainForm";

const boolLabel = (value: boolean): string => (value ? "Yes" : "No");

const ROLE_LABELS: Record<"train" | "groomsman", string> = {
	train: "Wedding Train Guest",
	groomsman: "Groomsman",
};

const ACCOMMODATION_LABELS: Record<string, string> = {
	team_arrange: "Team arranges",
	self_arrange: "Self-arranged",
};

const OUTFIT_LABELS: Record<string, string> = {
	team_organises: "Team organises",
	self_source: "Self-sourced",
};

const FINAL_DECISION_LABELS: Record<string, string> = {
	honoured: "I would be honoured to participate",
	unable: "Unable to commit at this time",
};

export type WeddingTrainSheetRow = {
	submitted_at: string;
	full_name: string;
	role: string;
	accommodation: string;
	outfit: string;
	commit_attend: string;
	commit_outfit: string;
	commit_travel: string;
	commit_contact: string;
	commit_church: string;
	final_decision: string;
};

export type WeddingTrainSheetPayload = {
	sheet: "Groom's Train";
	secret?: string;
	rows: [WeddingTrainSheetRow];
};

export const recordToWeddingTrainSheetRow = (
	record: WeddingTrainRecord,
	opts?: { submittedAt?: string },
): WeddingTrainSheetRow => ({
	submitted_at: opts?.submittedAt ?? new Date().toISOString(),
	full_name: record.full_name,
	role: ROLE_LABELS[record.role] ?? record.role,
	accommodation: ACCOMMODATION_LABELS[record.accommodation] ?? record.accommodation,
	outfit: OUTFIT_LABELS[record.outfit] ?? record.outfit,
	commit_attend: boolLabel(record.commit_attend),
	commit_outfit: boolLabel(record.commit_outfit),
	commit_travel: boolLabel(record.commit_travel),
	commit_contact: boolLabel(record.commit_contact),
	commit_church: boolLabel(record.commit_church),
	final_decision: FINAL_DECISION_LABELS[record.final_decision] ?? record.final_decision,
});

export const recordToWeddingTrainSheetPayload = (
	record: WeddingTrainRecord,
	opts?: { submittedAt?: string; secret?: string },
): WeddingTrainSheetPayload => ({
	sheet: "Groom's Train",
	...(opts?.secret ? { secret: opts.secret } : {}),
	rows: [recordToWeddingTrainSheetRow(record, { submittedAt: opts?.submittedAt })],
});

export type ForwardWeddingTrainResult =
	| { ok: true }
	| { ok: false; reason: "upstream" | "invalid_response" };

const parseAppsScriptJson = (text: string): { ok?: boolean } | null => {
	try {
		return JSON.parse(text) as { ok?: boolean };
	} catch {
		return null;
	}
};

export const forwardWeddingTrainToGoogleSheet = async (
	webhookUrl: string,
	record: WeddingTrainRecord,
	secret?: string,
): Promise<ForwardWeddingTrainResult> => {
	const payload = recordToWeddingTrainSheetPayload(record, { secret });

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
