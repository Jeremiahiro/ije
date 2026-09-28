import type { APIRoute } from "astro";
import {
	createGateToken,
	GATE_COOKIE,
	GATE_TTL_SECONDS,
	getGatePassword,
	safeEqual,
	safeNextPath,
} from "@/util/siteGate";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
	const password = getGatePassword();

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return redirect("/unlock?error=1", 303);
	}

	const nextPath = safeNextPath(formData.get("next"));
	if (!password) {
		return redirect(nextPath, 303);
	}

	const attempt = String(formData.get("password") ?? "");
	if (!safeEqual(attempt, password)) {
		return redirect(`/unlock?error=1&next=${encodeURIComponent(nextPath)}`, 303);
	}

	cookies.set(GATE_COOKIE, createGateToken(password), {
		path: "/",
		httpOnly: true,
		secure: url.protocol === "https:",
		sameSite: "lax",
		maxAge: GATE_TTL_SECONDS,
	});
	return redirect(nextPath, 303);
};
