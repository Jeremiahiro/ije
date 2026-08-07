import type { APIRoute } from "astro";
import { initWeddingTrainSheet } from "@/util/weddingTrainSheet";

export const prerender = false;

const json = (body: unknown, status = 200): Response =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export const POST: APIRoute = async ({ request }) => {
	const secret = import.meta.env.PUBLIC_SITE_GATE_PASSWORD?.trim();
	const auth = request.headers.get("authorization");

	if (!secret || auth !== `Bearer ${secret}`) {
		return json({ ok: false, reason: "unauthorized" }, 401);
	}

	const result = await initWeddingTrainSheet();

	if (!result.ok) {
		return json({ ok: false, reason: result.reason }, 502);
	}

	return json({ ok: true });
};
