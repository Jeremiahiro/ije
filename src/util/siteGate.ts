import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const GATE_COOKIE = "site_gate";
export const GATE_TTL_SECONDS = 36 * 60 * 60;

/** The gate is on only when SITE_GATE_PASSWORD is set. Never expose this to the client. */
export const getGatePassword = (): string =>
	import.meta.env.SITE_GATE_PASSWORD?.trim() ?? "";

const sha256 = (value: string): Buffer => createHash("sha256").update(value).digest();

/** Constant-time string comparison (hashing first makes the lengths equal). */
export const safeEqual = (a: string, b: string): boolean =>
	timingSafeEqual(sha256(a), sha256(b));

const sign = (expiresAt: number, password: string): string =>
	createHmac("sha256", password).update(`site-gate:${expiresAt}`).digest("base64url");

/**
 * Cookie value proving the visitor entered the password: `<expiresAt>.<hmac>`.
 * Keyed on the password itself, so changing the password logs everyone out.
 */
export const createGateToken = (password: string, now = Date.now()): string => {
	const expiresAt = Math.floor(now / 1000) + GATE_TTL_SECONDS;
	return `${expiresAt}.${sign(expiresAt, password)}`;
};

export const verifyGateToken = (token: string, password: string, now = Date.now()): boolean => {
	const [expiresRaw, signature, ...rest] = token.split(".");
	if (!expiresRaw || !signature || rest.length > 0) return false;
	const expiresAt = Number(expiresRaw);
	if (!Number.isInteger(expiresAt) || expiresAt * 1000 <= now) return false;
	return safeEqual(signature, sign(expiresAt, password));
};

/** Only allow same-site relative redirects after unlocking. */
export const safeNextPath = (value: unknown): string => {
	if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
		return "/";
	}
	return value;
};
