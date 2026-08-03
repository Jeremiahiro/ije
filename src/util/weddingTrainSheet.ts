import type { WeddingTrainRecord } from "@/util/weddingTrainForm";
import { appendRowsToSheet } from "@/util/googleSheetsApi";

const SHEET_NAME = "Groom's Train";

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

const recordToWeddingTrainSheetRow = (
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

const rowToValues = (row: WeddingTrainSheetRow): string[] => [
	row.submitted_at,
	row.full_name,
	row.role,
	row.accommodation,
	row.outfit,
	row.commit_attend,
	row.commit_outfit,
	row.commit_travel,
	row.commit_contact,
	row.commit_church,
	row.final_decision,
];

export type ForwardWeddingTrainResult = { ok: true } | { ok: false; reason: "upstream" };

export const forwardWeddingTrainToGoogleSheet = async (
	record: WeddingTrainRecord,
	opts?: { submittedAt?: string },
): Promise<ForwardWeddingTrainResult> => {
	const row = recordToWeddingTrainSheetRow(record, opts);
	const result = await appendRowsToSheet(SHEET_NAME, [rowToValues(row)], {
		headers: [
			"Submitted At", "Full Name", "Role", "Accommodation", "Outfit",
			"Commit (Attend)", "Commit (Outfit)", "Commit (Travel)",
			"Commit (Contact)", "Commit (Church)", "Final Decision",
		],
	});
	if (!result.ok) return { ok: false, reason: "upstream" };
	return { ok: true };
};
