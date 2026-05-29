import type { APIRoute } from "astro";
import { buildRsvpRecord, parseRsvpFormData, validateRsvpForm } from "@/util/rsvpForm";
import { forwardRsvpToGoogleSheet } from "@/util/rsvpSheet";

export const prerender = false;

const json = (body: unknown, status = 200): Response =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export const POST: APIRoute = async ({ request }) => {
	const webhookUrl = import.meta.env.RSVP_GOOGLE_SCRIPT_URL;
	const secret = import.meta.env.RSVP_SCRIPT_SECRET;

	if (!webhookUrl?.trim()) {
		return json({ ok: false, kind: "not_configured" }, 503);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return json({ ok: false, kind: "invalid_body", message: "Invalid form data." }, 400);
	}

	const validation = validateRsvpForm(parseRsvpFormData(formData));
	if (!validation.ok) {
		return json(
			{ ok: false, kind: "validation", fieldErrors: validation.fieldErrors },
			400,
		);
	}

	const record = buildRsvpRecord(validation.values);
	const forwarded = await forwardRsvpToGoogleSheet(webhookUrl.trim(), record, secret?.trim());

	if (!forwarded.ok) {
		return json(
			{
				ok: false,
				kind: "upstream",
				message: "Could not save your RSVP. Please try again in a moment.",
			},
			502,
		);
	}

	return json({ ok: true });
};

export const ALL: APIRoute = () =>
	json({ ok: false, message: "Method not allowed." }, 405);
