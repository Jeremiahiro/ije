import { defineMiddleware } from "astro:middleware";
import { isDisabledPath } from "@/config/event";
import { GATE_COOKIE, getGatePassword, verifyGateToken } from "@/util/siteGate";

/** Reachable without the site password. The admin route has its own secret. */
const UNGATED_PATHS = new Set(["/unlock", "/api/unlock", "/api/init-train-sheet"]);

export const onRequest = defineMiddleware((context, next) => {
	const pathname = context.url.pathname.replace(/\/+$/, "") || "/";

	if (isDisabledPath(pathname)) {
		return new Response("Not found", { status: 404 });
	}

	const password = getGatePassword();
	if (!password || UNGATED_PATHS.has(pathname)) {
		return next();
	}

	const token = context.cookies.get(GATE_COOKIE)?.value;
	if (token && verifyGateToken(token, password)) {
		return next();
	}

	if (pathname.startsWith("/api/")) {
		return new Response(JSON.stringify({ ok: false, kind: "locked" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const nextPath = `${context.url.pathname}${context.url.search}`;
	return context.redirect(`/unlock?next=${encodeURIComponent(nextPath)}`, 303);
});
