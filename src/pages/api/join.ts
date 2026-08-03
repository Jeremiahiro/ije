import type { APIRoute } from "astro";
import {
	buildWeddingTrainRecord,
	parseWeddingTrainFormData,
	validateWeddingTrainForm,
} from "@/util/weddingTrainForm";
import { forwardWeddingTrainToGoogleSheet } from "@/util/weddingTrainSheet";

export const prerender = false;

const json = (body: unknown, status = 200): Response =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export const POST: APIRoute = async ({ request }) => {
	if (!import.meta.env.GOOGLE_SPREADSHEET_ID?.trim()) {
		return json({ ok: false, kind: "not_configured" }, 503);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return json({ ok: false, kind: "invalid_body", message: "Invalid form data." }, 400);
	}

	const validation = validateWeddingTrainForm(parseWeddingTrainFormData(formData));
	if (!validation.ok) {
		return json(
			{ ok: false, kind: "validation", fieldErrors: validation.fieldErrors },
			400,
		);
	}

	const record = buildWeddingTrainRecord(validation.values);
	const forwarded = await forwardWeddingTrainToGoogleSheet(record);

	if (!forwarded.ok) {
		return json(
			{
				ok: false,
				kind: "upstream",
				message: "Could not save your response. Please try again in a moment.",
			},
			502,
		);
	}

	return json({ ok: true });
};

export const ALL: APIRoute = () => json({ ok: false, message: "Method not allowed." }, 405);
