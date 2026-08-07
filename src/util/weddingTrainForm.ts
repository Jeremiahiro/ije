export const WEDDING_TRAIN_FIELD = {
	fullName: "full_name",
	role: "role",
	accommodation: "accommodation",
	accommodationNights: "accommodation_nights",
	outfit: "outfit",
	outfitTier: "outfit_tier",
	outfitSelfConfirm: "outfit_self_confirm",
	commitAttend: "commit_attend",
	commitOutfit: "commit_outfit",
	commitTravel: "commit_travel",
	commitContact: "commit_contact",
	commitChurch: "commit_church",
	finalDecision: "final_decision",
} as const;

export type WeddingTrainRole = "train" | "groomsman" | "both" | "unknown";
export type AccommodationChoice = "team_arrange" | "self_arrange";
export type AccommodationNightsChoice = "3" | "4";
export type OutfitChoice = "team_organises" | "self_source";
export type OutfitTierChoice = "material_only" | "material_tailoring";
export type FinalDecision = "honoured" | "unable";

export type WeddingTrainFormValues = {
	full_name: string;
	role: "train" | "groomsman";
	accommodation: AccommodationChoice;
	accommodation_nights: AccommodationNightsChoice | "";
	outfit: OutfitChoice;
	outfit_tier: OutfitTierChoice | "";
	outfit_self_confirm: boolean;
	commit_attend: boolean;
	commit_outfit: boolean;
	commit_travel: boolean;
	commit_contact: boolean;
	commit_church: boolean;
	final_decision: FinalDecision;
};

export type WeddingTrainRecord = WeddingTrainFormValues;

const ACCOMMODATION_VALUES: ReadonlySet<string> = new Set(["team_arrange", "self_arrange"]);
const ACCOMMODATION_NIGHTS_VALUES: ReadonlySet<string> = new Set(["3", "4"]);
const OUTFIT_VALUES: ReadonlySet<string> = new Set(["team_organises", "self_source"]);
const OUTFIT_TIER_VALUES: ReadonlySet<string> = new Set(["material_only", "material_tailoring"]);
const FINAL_DECISION_VALUES: ReadonlySet<string> = new Set(["honoured", "unable"]);
const ROLE_VALUES: ReadonlySet<string> = new Set(["train", "groomsman"]);

const checkboxOn = (fd: FormData, name: string): boolean =>
	String(fd.get(name) ?? "").toLowerCase() === "yes" || fd.get(name) === "on";

export type WeddingTrainRawFields = {
	full_name: string;
	role: string;
	accommodation: string;
	accommodation_nights: string;
	outfit: string;
	outfit_tier: string;
	outfit_self_confirm: boolean;
	commit_attend: boolean;
	commit_outfit: boolean;
	commit_travel: boolean;
	commit_contact: boolean;
	commit_church: boolean;
	final_decision: string;
};

export const parseWeddingTrainFormData = (fd: FormData): WeddingTrainRawFields => ({
	full_name: String(fd.get(WEDDING_TRAIN_FIELD.fullName) ?? "").trim(),
	role: String(fd.get(WEDDING_TRAIN_FIELD.role) ?? "").trim(),
	accommodation: String(fd.get(WEDDING_TRAIN_FIELD.accommodation) ?? "").trim(),
	accommodation_nights: String(fd.get(WEDDING_TRAIN_FIELD.accommodationNights) ?? "").trim(),
	outfit: String(fd.get(WEDDING_TRAIN_FIELD.outfit) ?? "").trim(),
	outfit_tier: String(fd.get(WEDDING_TRAIN_FIELD.outfitTier) ?? "").trim(),
	outfit_self_confirm: checkboxOn(fd, WEDDING_TRAIN_FIELD.outfitSelfConfirm),
	commit_attend: checkboxOn(fd, WEDDING_TRAIN_FIELD.commitAttend),
	commit_outfit: checkboxOn(fd, WEDDING_TRAIN_FIELD.commitOutfit),
	commit_travel: checkboxOn(fd, WEDDING_TRAIN_FIELD.commitTravel),
	commit_contact: checkboxOn(fd, WEDDING_TRAIN_FIELD.commitContact),
	commit_church: checkboxOn(fd, WEDDING_TRAIN_FIELD.commitChurch),
	final_decision: String(fd.get(WEDDING_TRAIN_FIELD.finalDecision) ?? "").trim(),
});

export type WeddingTrainValidationOk = { ok: true; values: WeddingTrainFormValues };
export type WeddingTrainValidationErr = { ok: false; fieldErrors: Record<string, string> };
export type WeddingTrainValidationResult = WeddingTrainValidationOk | WeddingTrainValidationErr;

export const validateWeddingTrainForm = (
	raw: WeddingTrainRawFields,
): WeddingTrainValidationResult => {
	const fieldErrors: Record<string, string> = {};

	if (!raw.full_name) {
		fieldErrors[WEDDING_TRAIN_FIELD.fullName] = "Enter your full name.";
	} else if (raw.full_name.length < 2) {
		fieldErrors[WEDDING_TRAIN_FIELD.fullName] = "Name looks too short.";
	}

	if (!ROLE_VALUES.has(raw.role)) {
		fieldErrors[WEDDING_TRAIN_FIELD.role] = "Please use your personal link provided.";
	}

	if (raw.final_decision !== "unable") {
		if (!ACCOMMODATION_VALUES.has(raw.accommodation)) {
			fieldErrors[WEDDING_TRAIN_FIELD.accommodation] = "Please select an accommodation preference.";
		} else if (
			raw.accommodation === "team_arrange" &&
			!ACCOMMODATION_NIGHTS_VALUES.has(raw.accommodation_nights)
		) {
			fieldErrors[WEDDING_TRAIN_FIELD.accommodationNights] =
				"Please select the number of nights.";
		}

		if (!OUTFIT_VALUES.has(raw.outfit)) {
			fieldErrors[WEDDING_TRAIN_FIELD.outfit] = "Please select an outfit preference.";
		} else if (raw.outfit === "team_organises" && !OUTFIT_TIER_VALUES.has(raw.outfit_tier)) {
			fieldErrors[WEDDING_TRAIN_FIELD.outfitTier] = "Please select an outfit option.";
		} else if (raw.outfit === "self_source" && !raw.outfit_self_confirm) {
			fieldErrors[WEDDING_TRAIN_FIELD.outfitSelfConfirm] = "Please confirm you will follow the outfit guidelines.";
		}
	}

	if (!FINAL_DECISION_VALUES.has(raw.final_decision)) {
		fieldErrors[WEDDING_TRAIN_FIELD.finalDecision] = "Please let us know your decision.";
	}

	if (Object.keys(fieldErrors).length) {
		return { ok: false, fieldErrors };
	}

	return {
		ok: true,
		values: {
			full_name: raw.full_name,
			role: raw.role as "train" | "groomsman",
			accommodation: raw.accommodation as AccommodationChoice,
			accommodation_nights: ACCOMMODATION_NIGHTS_VALUES.has(raw.accommodation_nights)
				? (raw.accommodation_nights as AccommodationNightsChoice)
				: "",
			outfit: raw.outfit as OutfitChoice,
			outfit_tier: OUTFIT_TIER_VALUES.has(raw.outfit_tier)
				? (raw.outfit_tier as OutfitTierChoice)
				: "",
			outfit_self_confirm: raw.outfit_self_confirm,
			commit_attend: raw.commit_attend,
			commit_outfit: raw.commit_outfit,
			commit_travel: raw.commit_travel,
			commit_contact: raw.commit_contact,
			commit_church: raw.commit_church,
			final_decision: raw.final_decision as FinalDecision,
		},
	};
};

export const buildWeddingTrainRecord = (values: WeddingTrainFormValues): WeddingTrainRecord =>
	values;
