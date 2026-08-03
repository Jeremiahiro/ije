export const WEDDING_TRAIN_SUBMIT_COPY = {
	submitting: "Submitting…",
	submitLabel: "Submit",
	networkError: "We couldn't reach the server. Check your connection and try again.",
	serverError: "Something went wrong saving your response. Please try again in a moment.",
	notConfigured:
		"We couldn't save your response right now. Please try again in a little while, or contact us if it keeps happening.",
} as const;

import { parseApiBody } from "@/util/apiResponse";

export type WeddingTrainClientSubmitResult =
	| { ok: true }
	| { ok: false; kind: "validation"; fieldErrors: Record<string, string> }
	| { ok: false; kind: "network" | "server" | "not_configured"; message: string };

export const submitWeddingTrainFormData = async (
	formData: FormData,
): Promise<WeddingTrainClientSubmitResult> => {
	let response: Response;
	try {
		response = await fetch("/api/join", {
			method: "POST",
			body: formData,
		});
	} catch {
		return { ok: false, kind: "network", message: WEDDING_TRAIN_SUBMIT_COPY.networkError };
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		return { ok: false, kind: "server", message: WEDDING_TRAIN_SUBMIT_COPY.serverError };
	}

	const data = parseApiBody(body);

	if (response.status === 503 && data?.kind === "not_configured") {
		if (import.meta.env.DEV) {
			console.warn(
				"[Wedding Train] GOOGLE_SPREADSHEET_ID is not set — submissions will fail until it is configured (see .env.example).",
			);
		}
		return {
			ok: false,
			kind: "not_configured",
			message: WEDDING_TRAIN_SUBMIT_COPY.notConfigured,
		};
	}

	if (response.status === 400 && data?.kind === "validation" && data.fieldErrors) {
		return { ok: false, kind: "validation", fieldErrors: data.fieldErrors };
	}

	if (!response.ok || data?.ok === false) {
		return {
			ok: false,
			kind: "server",
			message: data?.message ?? WEDDING_TRAIN_SUBMIT_COPY.serverError,
		};
	}

	return { ok: true };
};

export const submitWeddingTrain = (
	form: HTMLFormElement,
): Promise<WeddingTrainClientSubmitResult> => submitWeddingTrainFormData(new FormData(form));
