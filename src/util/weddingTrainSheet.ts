import type { WeddingTrainRecord } from "@/util/weddingTrainForm";
import { appendRowsToSheet } from "@/util/googleSheetsApi";

const SHEET_NAME = "Groom's Train";


const ROLE_LABELS: Record<"train" | "groomsman" | "both", string> = {
	train: "Wedding Train Guest",
	groomsman: "Groomsman",
	both: "Groomsman & Wedding Train",
};


const OUTFIT_SCOPE_LABELS: Record<string, string> = {
	both: "Both (Trad & Church)",
	trad_only: "Traditional only",
	church_only: "Church only",
};

const OUTFIT_TIER_LABELS: Record<string, string> = {
	material_only: "Material only",
	material_tailoring: "Full service",
};

const outfitLabel = (outfit: string, scope: string, tier: string): string => {
	if (outfit === "self_source") return "Self-sourced";
	const scopeLabel = OUTFIT_SCOPE_LABELS[scope] ?? scope;
	const tierLabel = OUTFIT_TIER_LABELS[tier];
	return tierLabel ? `${scopeLabel} — ${tierLabel}` : scopeLabel;
};

const FINAL_DECISION_LABELS: Record<string, string> = {
	honoured: "I would be honoured to participate",
	unable: "Unable to commit at this time",
};

export type WeddingTrainSheetRow = {
	submitted_at: string;
	full_name: string;
	role: string;
	accommodation_nights: string;
	outfit: string;
	final_decision: string;
};

const recordToWeddingTrainSheetRow = (
	record: WeddingTrainRecord,
	opts?: { submittedAt?: string },
): WeddingTrainSheetRow => ({
	submitted_at: opts?.submittedAt ?? new Date().toISOString(),
	full_name: record.full_name,
	role: ROLE_LABELS[record.role] ?? record.role,
	accommodation_nights: record.accommodation_nights ? `${record.accommodation_nights} nights` : "",
	outfit: outfitLabel(record.outfit, record.outfit_scope, record.outfit_tier),
	final_decision: FINAL_DECISION_LABELS[record.final_decision] ?? record.final_decision,
});

const rowToValues = (row: WeddingTrainSheetRow): string[] => [
	row.submitted_at,
	row.full_name,
	row.role,
	row.accommodation_nights,
	row.outfit,
	row.final_decision,
];

export type ForwardWeddingTrainResult = { ok: true } | { ok: false; reason: "upstream" };

const SHEET_HEADERS = [
	"Submitted At", "Full Name", "Role", "Accommodation", "Outfit", "Final Decision",
];

export const initWeddingTrainSheet = async (): Promise<ForwardWeddingTrainResult> => {
	const result = await appendRowsToSheet(SHEET_NAME, [], { headers: SHEET_HEADERS });
	if (!result.ok) return { ok: false, reason: "upstream" };
	return { ok: true };
};

export const forwardWeddingTrainToGoogleSheet = async (
	record: WeddingTrainRecord,
	opts?: { submittedAt?: string },
): Promise<ForwardWeddingTrainResult> => {
	const row = recordToWeddingTrainSheetRow(record, opts);
	const result = await appendRowsToSheet(SHEET_NAME, [rowToValues(row)], {
		headers: SHEET_HEADERS,
	});
	if (!result.ok) return { ok: false, reason: "upstream" };
	return { ok: true };
};
