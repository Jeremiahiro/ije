import { fmtNaira } from "@/data/weddingTrain";
import {
	parseWeddingTrainFormData,
	WEDDING_TRAIN_FIELD,
	validateWeddingTrainForm,
} from "@/util/weddingTrainForm";
import {
	WEDDING_TRAIN_SUBMIT_COPY,
	submitWeddingTrain,
	submitWeddingTrainFormData,
} from "@/util/weddingTrainSubmit";

const ERROR_IDS = Object.values(WEDDING_TRAIN_FIELD).map((name) => `wt-error-${name}`);

const inputByField: Partial<Record<string, string>> = {
	[WEDDING_TRAIN_FIELD.fullName]: "wt-field-full-name",
	[WEDDING_TRAIN_FIELD.outfitSelfConfirm]: "wt-check-outfit-self-confirm",
	[WEDDING_TRAIN_FIELD.commitAttend]: "wt-check-commit-attend",
	[WEDDING_TRAIN_FIELD.commitOutfit]: "wt-check-commit-outfit",
	[WEDDING_TRAIN_FIELD.commitTravel]: "wt-check-commit-travel",
	[WEDDING_TRAIN_FIELD.commitContact]: "wt-check-commit-contact",
	[WEDDING_TRAIN_FIELD.commitChurch]: "wt-check-commit-church",
};

const focusOrder = [
	WEDDING_TRAIN_FIELD.fullName,
	WEDDING_TRAIN_FIELD.accommodation,
	WEDDING_TRAIN_FIELD.outfit,
	WEDDING_TRAIN_FIELD.outfitScope,
	WEDDING_TRAIN_FIELD.outfitTier,
	WEDDING_TRAIN_FIELD.commitAttend,
	WEDDING_TRAIN_FIELD.commitOutfit,
	WEDDING_TRAIN_FIELD.commitTravel,
	WEDDING_TRAIN_FIELD.commitContact,
	WEDDING_TRAIN_FIELD.commitChurch,
];

const RADIO_GROUP_FIELDS = new Set<string>([
	WEDDING_TRAIN_FIELD.accommodation,
	WEDDING_TRAIN_FIELD.outfit,
	WEDDING_TRAIN_FIELD.outfitTier,
]);

const clearErrors = (form: HTMLFormElement): void => {
	const summary = form.querySelector("#wt-form-summary");
	if (summary instanceof HTMLElement) {
		summary.hidden = true;
		summary.textContent = "";
	}

	for (const id of ERROR_IDS) {
		const el = document.getElementById(id);
		if (!el) continue;
		el.hidden = true;
		el.textContent = "";
	}

	for (const el of form.querySelectorAll('[aria-invalid="true"]')) {
		el.setAttribute("aria-invalid", "false");
	}
};

const markRadioGroupInvalid = (form: HTMLFormElement, name: string): void => {
	for (const r of form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)) {
		r.setAttribute("aria-invalid", "true");
	}
};

const showErrors = (form: HTMLFormElement, fieldErrors: Record<string, string>): void => {
	for (const [field, message] of Object.entries(fieldErrors)) {
		const el = document.getElementById(`wt-error-${field}`);
		if (el) {
			el.textContent = message;
			el.hidden = false;
		}

		if (RADIO_GROUP_FIELDS.has(field)) {
			markRadioGroupInvalid(form, field);
			continue;
		}

		const inputId = inputByField[field];
		if (inputId) {
			const input = document.getElementById(inputId);
			if (input) input.setAttribute("aria-invalid", "true");
		}
	}

	const msgs = Object.values(fieldErrors);
	const summary = form.querySelector("#wt-form-summary");
	if (summary instanceof HTMLElement && msgs.length > 1) {
		summary.hidden = false;
		summary.textContent = `Please fix ${String(msgs.length)} fields — each one is marked in the form.`;
	}
};

const showSubmitError = (form: HTMLFormElement, message: string): void => {
	const summary = form.querySelector("#wt-form-summary");
	if (!(summary instanceof HTMLElement)) return;
	summary.hidden = false;
	summary.textContent = message;
	scrollIntoView(summary);
};

const scrollIntoView = (el: HTMLElement | null | undefined): void => {
	if (!el) return;
	const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		? "auto"
		: "smooth";
	el.scrollIntoView({ behavior, block: "center" });
};

const focusFirstInvalid = (form: HTMLFormElement, fieldErrors: Record<string, string>): void => {
	for (const field of focusOrder) {
		if (!(field in fieldErrors)) continue;

		let target: HTMLElement | null | undefined;

		if (RADIO_GROUP_FIELDS.has(field)) {
			target = form.querySelector<HTMLInputElement>(`input[name="${field}"]:not([disabled])`);
		} else {
			const inputId = inputByField[field];
			target = inputId ? document.getElementById(inputId) : null;
		}

		target?.focus({ preventScroll: true });
		scrollIntoView(target);
		return;
	}
};

const scrollSuccessBelowHeader = (el: HTMLElement): void => {
	const scrollBehavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)")
		.matches
		? "auto"
		: "smooth";
	const gapPx = 400;

	const run = (): void => {
		const header = document.querySelector("[data-app-header]");
		const headerBottom =
			header instanceof HTMLElement ? header.getBoundingClientRect().bottom : 0;
		const elTop = el.getBoundingClientRect().top;
		const delta = elTop - headerBottom - gapPx;
		if (Math.abs(delta) > 1) {
			window.scrollBy({ top: delta, behavior: scrollBehavior });
		}
	};

	requestAnimationFrame(() => {
		requestAnimationFrame(run);
	});
};

const tierIncludes = (tier: string) => ({
	material: ["material_only", "material_tailoring"].includes(tier),
	tailoring: tier === "material_tailoring",
});

const makeOutfitRows = (
	label: string,
	tier: string,
	matCost: number,
	tailCost: number,
): { html: string; total: number } => {
	const inc = tierIncludes(tier);
	const total = (inc.material ? matCost : 0) + (inc.tailoring ? tailCost : 0);
	let html =
		`<tr class="wt__cost-row">` +
		`<td class="wt__cost-row-label">${label}</td>` +
		`<td class="wt__cost-row-amount">${fmtNaira(total)}</td>` +
		`</tr>`;
	if (inc.material)
		html +=
			`<tr class="wt__cost-sub-row">` +
			`<td class="wt__cost-sub-label">Material</td>` +
			`<td class="wt__cost-sub-amount">${fmtNaira(matCost)}</td>` +
			`</tr>`;
	if (inc.tailoring)
		html +=
			`<tr class="wt__cost-sub-row">` +
			`<td class="wt__cost-sub-label">Sewing & monogram</td>` +
			`<td class="wt__cost-sub-amount">${fmtNaira(tailCost)}</td>` +
			`</tr>`;
	return { html, total };
};

const mountCostSummary = (form: HTMLFormElement): void => {
	const scopeGroup = document.getElementById("wt-outfit-scope");
	const tierGroup = document.getElementById("wt-outfit-tier");
	const selfSourceGroup = document.getElementById("wt-outfit-self-source");
	const nightsGroup = document.getElementById("wt-accommodation-nights");
	const costSummary = document.getElementById("wt-cost-summary");
	const costRowsEl = document.getElementById("wt-cost-rows");
	const costTotalEl = document.getElementById("wt-cost-total");

	const getVal = (name: string): string =>
		form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? "";

	const updateAll = (): void => {
		const role = form.dataset.role ?? "";
		const outfit = getVal(WEDDING_TRAIN_FIELD.outfit);
		const scope = getVal(WEDDING_TRAIN_FIELD.outfitScope);
		const tier = getVal(WEDDING_TRAIN_FIELD.outfitTier);
		const accommodation = getVal(WEDDING_TRAIN_FIELD.accommodation);
		const nights = getVal(WEDDING_TRAIN_FIELD.accommodationNights);

		const isGroomsmanRole = role === "groomsman" || role === "both";
		const teamSourcing = outfit === "team_organises";

		// Show / hide scope sub-group (groomsman/both only)
		if (scopeGroup) {
			const showScope = teamSourcing && isGroomsmanRole;
			scopeGroup.hidden = !showScope;
			if (!showScope) {
				for (const r of form.querySelectorAll<HTMLInputElement>(
					`input[name="${WEDDING_TRAIN_FIELD.outfitScope}"]`,
				)) {
					r.checked = false;
				}
			}
		}

		// Effective scope: groomsman/both reads the radio; train-only implies trad_only
		const effectiveScope = isGroomsmanRole ? scope : "trad_only";
		const includesTrad = effectiveScope === "both" || effectiveScope === "trad_only";

		// Show / hide tier sub-group (only when trad is being sourced)
		if (tierGroup) {
			const showTier = teamSourcing && includesTrad && (!isGroomsmanRole || scope !== "");
			tierGroup.hidden = !showTier;
			if (!showTier) {
				for (const r of form.querySelectorAll<HTMLInputElement>(
					`input[name="${WEDDING_TRAIN_FIELD.outfitTier}"]`,
				)) {
					r.checked = false;
				}
			}
		}

		// Show / hide self-source confirmation
		if (selfSourceGroup) {
			const showSelfSource = outfit === "self_source";
			selfSourceGroup.hidden = !showSelfSource;
			if (!showSelfSource) {
				const cb = form.querySelector<HTMLInputElement>(
					`input[name="${WEDDING_TRAIN_FIELD.outfitSelfConfirm}"]`,
				);
				if (cb) cb.checked = false;
			}
		}

		// Show / hide accommodation nights sub-group
		if (nightsGroup) {
			const showNights = accommodation === "team_arrange";
			nightsGroup.hidden = !showNights;
			if (!showNights) {
				for (const r of form.querySelectorAll<HTMLInputElement>(
					`input[name="${WEDDING_TRAIN_FIELD.accommodationNights}"]`,
				)) {
					r.checked = false;
				}
			}
		}

		if (!costSummary || !costRowsEl || !costTotalEl) return;

		const costs = {
			logistics: Number(form.dataset.costLogistics ?? 0),
			accommodationMin: Number(form.dataset.costAccommodationPerNightMin ?? 0),
			accommodationMax: Number(form.dataset.costAccommodationPerNightMax ?? 0),
			tradMaterial: Number(form.dataset.costTradOutfitMaterial ?? 0),
			tradTailoring: Number(form.dataset.costTradOutfitTailoring ?? 0),
			tradAccessories: Number(form.dataset.costTradOutfitAccessories ?? 0),
			churchFull: Number(form.dataset.costChurchOutfitFull ?? 0),
		};

		let html =
			`<tr class="wt__cost-row">` +
			`<td class="wt__cost-row-label">Logistics</td>` +
			`<td class="wt__cost-row-amount">${fmtNaira(costs.logistics)}</td>` +
			`</tr>`;
		let total = costs.logistics;

		html +=
			`<tr class="wt__cost-row">` +
			`<td class="wt__cost-row-label">Traditional accessories</td>` +
			`<td class="wt__cost-row-amount">${fmtNaira(costs.tradAccessories)}</td>` +
			`</tr>` +
			`<tr class="wt__cost-sub-row">` +
			`<td class="wt__cost-sub-label">Mandatory for all attendees</td>` +
			`<td class="wt__cost-sub-amount"></td>` +
			`</tr>`;
		total += costs.tradAccessories;

		if (teamSourcing) {
			const includesChurch = effectiveScope === "both" || effectiveScope === "church_only";

			if (includesTrad && tier) {
				const trad = makeOutfitRows(
					"Traditional outfit",
					tier,
					costs.tradMaterial,
					costs.tradTailoring,
				);
				html += trad.html;
				total += trad.total;
			}

			if (includesChurch) {
				html +=
					`<tr class="wt__cost-row">` +
					`<td class="wt__cost-row-label">Church outfit (Tux)</td>` +
					`<td class="wt__cost-row-amount">${fmtNaira(costs.churchFull)}</td>` +
					`</tr>` +
					`<tr class="wt__cost-sub-row">` +
					`<td class="wt__cost-sub-label">Made with vendor</td>` +
					`<td class="wt__cost-sub-amount"></td>` +
					`</tr>`;
				total += costs.churchFull;
			}
		}

		if (accommodation === "team_arrange") {
			const nightsCount = Number(nights || 0);
			const rangeLabel = nightsCount > 0
				? `${fmtNaira(costs.accommodationMin * nightsCount)} – ${fmtNaira(costs.accommodationMax * nightsCount)}`
				: `${fmtNaira(costs.accommodationMin)} – ${fmtNaira(costs.accommodationMax)} / night`;
			html +=
				`<tr class="wt__cost-row">` +
				`<td class="wt__cost-row-label">Accommodation</td>` +
				`<td class="wt__cost-row-amount wt__cost-tbc">${rangeLabel}</td>` +
				`</tr>` +
				`<tr class="wt__cost-sub-row">` +
				`<td class="wt__cost-sub-label">${nightsCount > 0 ? `${nightsCount} nights · ` : ""}not required now — paid separately</td>` +
				`<td class="wt__cost-sub-amount"></td>` +
				`</tr>`;
		}

		costSummary.hidden = false;
		costRowsEl.innerHTML = html;
		costTotalEl.textContent = fmtNaira(total);
	};

	for (const name of [
		WEDDING_TRAIN_FIELD.outfit,
		WEDDING_TRAIN_FIELD.outfitScope,
		WEDDING_TRAIN_FIELD.outfitTier,
		WEDDING_TRAIN_FIELD.outfitSelfConfirm,
		WEDDING_TRAIN_FIELD.accommodation,
		WEDDING_TRAIN_FIELD.accommodationNights,
	]) {
		for (const r of form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)) {
			r.addEventListener("change", updateAll);
		}
	}

	updateAll();
};

type StoredSubmission = { decision: "honoured" | "unable"; needsMeasurement: boolean };

const submissionKey = (): string => {
	const n = new URLSearchParams(window.location.search).get("n") ?? "";
	return `wt_submitted_${n}`;
};

const saveSubmission = (decision: "honoured" | "unable", needsMeasurement = false): void => {
	try { localStorage.setItem(submissionKey(), JSON.stringify({ decision, needsMeasurement })); } catch { /* storage unavailable */ }
};

const loadSubmission = (): StoredSubmission | null => {
	try {
		const raw = localStorage.getItem(submissionKey());
		return raw ? (JSON.parse(raw) as StoredSubmission) : null;
	} catch { return null; }
};

const restoreSuccessState = (stored: StoredSubmission, success: HTMLElement): void => {
	const copyHonour = document.getElementById("wt-success-copy-honour");
	const copyUnable = document.getElementById("wt-success-copy-unable");
	const honourDetails = document.getElementById("wt-success-honour-details");
	const measurementNote = document.getElementById("wt-success-measurement");

	if (stored.decision === "unable") {
		if (copyHonour) copyHonour.hidden = true;
		if (copyUnable) copyUnable.hidden = false;
		if (honourDetails) honourDetails.hidden = true;
	}

	if (measurementNote) measurementNote.hidden = !stored.needsMeasurement;
	success.hidden = false;
};

export const mountWeddingTrainPage = (): void => {
	const decisionPrompt = document.getElementById("wt-decision-prompt");
	const triggerHonour = document.getElementById("wt-trigger-honour");
	const triggerUnable = document.getElementById("wt-trigger-unable");
	const formBody = document.getElementById("wt-form-body");
	const form = document.getElementById("wt-form");
	const success = document.getElementById("wt-success");

	// Already submitted — skip straight to success screen
	const stored = loadSubmission();
	if (stored && success instanceof HTMLElement) {
		if (decisionPrompt) decisionPrompt.hidden = true;
		if (formBody) formBody.hidden = true;
		restoreSuccessState(stored, success);
		return;
	}

	if (decisionPrompt && formBody && form instanceof HTMLFormElement && success) {
		triggerHonour?.addEventListener("click", () => {
			decisionPrompt.hidden = true;
			formBody.hidden = false;
			const firstInput = formBody.querySelector<HTMLElement>("input:not([type=hidden])");
			firstInput?.focus();
		});

		triggerUnable?.addEventListener("click", async () => {
			if (triggerUnable instanceof HTMLButtonElement) {
				triggerUnable.disabled = true;
				triggerUnable.textContent = WEDDING_TRAIN_SUBMIT_COPY.submitting;
			}

			const nameInput = form.querySelector<HTMLInputElement>(
				`input[name="${WEDDING_TRAIN_FIELD.fullName}"]`,
			);
			const fd = new FormData();
			fd.set(WEDDING_TRAIN_FIELD.fullName, nameInput?.value.trim() ?? "");
			fd.set(WEDDING_TRAIN_FIELD.role, form.dataset.role ?? "");
			fd.set(WEDDING_TRAIN_FIELD.finalDecision, "unable");

			const result = await submitWeddingTrainFormData(fd);

			if (!result.ok) {
				if (triggerUnable instanceof HTMLButtonElement) {
					triggerUnable.disabled = false;
					triggerUnable.textContent = "I'm unable to commit at this time";
				}
				showSubmitError(form, result.kind !== "validation" ? result.message : WEDDING_TRAIN_SUBMIT_COPY.serverError);
				return;
			}

			const copyHonour = document.getElementById("wt-success-copy-honour");
			const copyUnable = document.getElementById("wt-success-copy-unable");
			const honourDetails = document.getElementById("wt-success-honour-details");
			if (copyHonour) copyHonour.hidden = true;
			if (copyUnable) copyUnable.hidden = false;
			if (honourDetails) honourDetails.hidden = true;

			saveSubmission("unable");
			decisionPrompt.hidden = true;
			success.hidden = false;
			scrollSuccessBelowHeader(success);
			success.focus({ preventScroll: true });
		});
	}

	const submitBtn = document.getElementById("wt-submit");

	if (!(form instanceof HTMLFormElement) || !success) return;

	mountCostSummary(form);

	form.addEventListener("submit", async (e: SubmitEvent) => {
		e.preventDefault();
		clearErrors(form);

		const result = validateWeddingTrainForm(parseWeddingTrainFormData(new FormData(form)));
		if (!result.ok) {
			showErrors(form, result.fieldErrors);
			focusFirstInvalid(form, result.fieldErrors);

			const summary = form.querySelector("#wt-form-summary");
			if (summary instanceof HTMLElement && !summary.hidden) {
				scrollIntoView(summary);
			}
			return;
		}

		if (submitBtn instanceof HTMLButtonElement) {
			submitBtn.disabled = true;
			submitBtn.textContent = WEDDING_TRAIN_SUBMIT_COPY.submitting;
		}

		const saved = await submitWeddingTrain(form);

		if (submitBtn instanceof HTMLButtonElement) {
			submitBtn.disabled = false;
			submitBtn.textContent = WEDDING_TRAIN_SUBMIT_COPY.submitLabel;
		}

		if (!saved.ok) {
			if (saved.kind === "validation") {
				showErrors(form, saved.fieldErrors);
				focusFirstInvalid(form, saved.fieldErrors);
				return;
			}
			showSubmitError(form, saved.message);
			return;
		}

		const outfitVal = form.querySelector<HTMLInputElement>(
			`input[name="${WEDDING_TRAIN_FIELD.outfit}"]:checked`,
		)?.value;
		const needsMeasurement = outfitVal === "team_organises";

		saveSubmission("honoured", needsMeasurement);

		form.hidden = true;
		success.hidden = false;
		scrollSuccessBelowHeader(success);
		success.focus({ preventScroll: true });

		const measurementNote = document.getElementById("wt-success-measurement");
		if (measurementNote) measurementNote.hidden = !needsMeasurement;
	});
};
