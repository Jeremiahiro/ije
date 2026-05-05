import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/** PostgREST / Supabase table for notify signups; must match RLS (see .env.example). */
export const LAUNCH_NOTIFY_TABLE = "jj-interest";

export const LAUNCH_NOTIFY_COOKIE_NAME = "jj_launch_notify";
export const LAUNCH_NOTIFY_COOKIE_VALUE = "1";
export const LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 400;

export const LAUNCH_NOTIFY_COPY = {
	notConfigured: "Email signup isn’t configured yet. Check back soon.",
	rlsDenied: "Sign-up isn’t available yet. Please try again later.",
	submitFailed: "Couldn’t save your email. Please try again in a moment.",
	sending: "Sending…",
	submitLabel: "Notify me",
} as const;

const isUniqueViolation = (error: {
	code?: string | number;
	message?: string;
	details?: string | null;
}): boolean => {
	if (error.code != null && String(error.code) === "23505") return true;
	const text = [error.message, error.details].filter(Boolean).join(" ").toLowerCase();
	return (
		text.includes("duplicate key") ||
		text.includes("unique constraint") ||
		text.includes("already exists")
	);
};

export type NotifySubmitResult =
	| { kind: "success" }
	| { kind: "already_registered" }
	| { kind: "rls_denied" }
	| { kind: "error" }
	| { kind: "not_configured" };

/** Maps Supabase insert outcome for this form only (client + table are fixed in app). */
export const submitLaunchNotifyEmail = async (email: string): Promise<NotifySubmitResult> => {
	const client = getSupabaseBrowser();
	if (!client) return { kind: "not_configured" };

	try {
		const { error } = await client.from(LAUNCH_NOTIFY_TABLE).insert({ email });
		if (error) {
			if (isUniqueViolation(error)) return { kind: "already_registered" };
			if (error.code != null && String(error.code) === "42501") return { kind: "rls_denied" };
			return { kind: "error" };
		}
		return { kind: "success" };
	} catch (err: unknown) {
		const o = err && typeof err === "object" ? (err as { code?: string | number; message?: string; details?: string | null }) : {};
		if (isUniqueViolation(o)) return { kind: "already_registered" };
		return { kind: "error" };
	}
};

export const shouldPersistNotifyCookie = (result: NotifySubmitResult): boolean =>
	result.kind === "success" || result.kind === "already_registered";

/** Parse `document.cookie` for a single name (matches browser encoding rules we set). */
export const readCookieFromDocumentCookie = (documentCookie: string, name: string): string | null => {
	const needle = `${encodeURIComponent(name)}=`;
	for (const part of documentCookie.split(";")) {
		const s = part.trim();
		if (s.startsWith(needle)) return decodeURIComponent(s.slice(needle.length));
	}
	return null;
};

export const isNotifySignupCookieSet = (documentCookie: string): boolean =>
	readCookieFromDocumentCookie(documentCookie, LAUNCH_NOTIFY_COOKIE_NAME) === LAUNCH_NOTIFY_COOKIE_VALUE;

/** RHS string assigned to `document.cookie` for the notify flag. */
export const buildSubmittedCookieAssignment = (
	name: string,
	value: string,
	maxAgeSec: number,
	isHttps: boolean,
): string => {
	const secure = isHttps ? "; Secure" : "";
	return `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${String(maxAgeSec)}; SameSite=Lax${secure}`;
};
