import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
	buildSubmittedCookieAssignment,
	isNotifySignupCookieSet,
	LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC,
	LAUNCH_NOTIFY_COOKIE_NAME,
	LAUNCH_NOTIFY_COOKIE_VALUE,
	LAUNCH_NOTIFY_TABLE,
	readCookieFromDocumentCookie,
	shouldPersistNotifyCookie,
	submitLaunchNotifyEmail,
	type NotifySubmitResult,
} from "./launchNotifyForm";

vi.mock("@/lib/supabaseBrowser", () => ({
	getSupabaseBrowser: vi.fn(),
}));

const mockGetSupabase = vi.mocked(getSupabaseBrowser);

describe("readCookieFromDocumentCookie", () => {
	it("returns decoded value when present", () => {
		const raw = `${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_NAME)}=${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_VALUE)}`;
		expect(readCookieFromDocumentCookie(raw, LAUNCH_NOTIFY_COOKIE_NAME)).toBe(LAUNCH_NOTIFY_COOKIE_VALUE);
	});

	it("returns null when missing", () => {
		expect(readCookieFromDocumentCookie("other=1", LAUNCH_NOTIFY_COOKIE_NAME)).toBeNull();
	});

	it("handles multiple cookies", () => {
		const raw = `a=1; ${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_NAME)}=${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_VALUE)}; b=2`;
		expect(readCookieFromDocumentCookie(raw, LAUNCH_NOTIFY_COOKIE_NAME)).toBe(LAUNCH_NOTIFY_COOKIE_VALUE);
	});
});

describe("isNotifySignupCookieSet", () => {
	it("is true when flag cookie matches", () => {
		const raw = `${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_NAME)}=${encodeURIComponent(LAUNCH_NOTIFY_COOKIE_VALUE)}`;
		expect(isNotifySignupCookieSet(raw)).toBe(true);
	});

	it("is false otherwise", () => {
		expect(isNotifySignupCookieSet("")).toBe(false);
	});
});

describe("buildSubmittedCookieAssignment", () => {
	it("includes Path, Max-Age, SameSite", () => {
		const s = buildSubmittedCookieAssignment(
			LAUNCH_NOTIFY_COOKIE_NAME,
			LAUNCH_NOTIFY_COOKIE_VALUE,
			LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC,
			false,
		);
		expect(s).toContain("Path=/");
		expect(s).toContain(`Max-Age=${LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC}`);
		expect(s).toContain("SameSite=Lax");
		expect(s).not.toContain("Secure");
	});

	it("adds Secure when HTTPS", () => {
		const s = buildSubmittedCookieAssignment("n", "v", 60, true);
		expect(s).toContain("; Secure");
	});
});

describe("shouldPersistNotifyCookie", () => {
	it("is true for success and duplicate", () => {
		expect(shouldPersistNotifyCookie({ kind: "success" })).toBe(true);
		expect(shouldPersistNotifyCookie({ kind: "already_registered" })).toBe(true);
	});

	it("is false for failures and not_configured", () => {
		expect(shouldPersistNotifyCookie({ kind: "rls_denied" })).toBe(false);
		expect(shouldPersistNotifyCookie({ kind: "error" })).toBe(false);
		expect(shouldPersistNotifyCookie({ kind: "not_configured" })).toBe(false);
	});
});

describe("submitLaunchNotifyEmail", () => {
	const email = "guest@example.com";

	type Client = NonNullable<ReturnType<typeof getSupabaseBrowser>>;

	const mockClient = (error: { code?: string } | null) => {
		const insert = vi.fn().mockResolvedValue({ error });
		return { from: vi.fn().mockReturnValue({ insert }) } as unknown as Client;
	};

	beforeEach(() => {
		mockGetSupabase.mockReset();
	});

	it("returns not_configured when client is missing", async () => {
		mockGetSupabase.mockReturnValue(null);
		await expect(submitLaunchNotifyEmail(email)).resolves.toEqual({ kind: "not_configured" });
	});

	it("returns success when insert has no error", async () => {
		const client = mockClient(null);
		mockGetSupabase.mockReturnValue(client);
		await expect(submitLaunchNotifyEmail(email)).resolves.toEqual({ kind: "success" });
		expect(client.from).toHaveBeenCalledWith(LAUNCH_NOTIFY_TABLE);
		expect(client.from(LAUNCH_NOTIFY_TABLE).insert).toHaveBeenCalledWith({ email });
	});

	it("maps 23505 to already_registered", async () => {
		mockGetSupabase.mockReturnValue(mockClient({ code: "23505" }));
		await expect(submitLaunchNotifyEmail(email)).resolves.toEqual({
			kind: "already_registered",
		} satisfies NotifySubmitResult);
	});

	it("maps 42501 to rls_denied", async () => {
		mockGetSupabase.mockReturnValue(mockClient({ code: "42501" }));
		await expect(submitLaunchNotifyEmail(email)).resolves.toEqual({
			kind: "rls_denied",
		} satisfies NotifySubmitResult);
	});

	it("returns error for other codes", async () => {
		mockGetSupabase.mockReturnValue(mockClient({ code: "99999" }));
		await expect(submitLaunchNotifyEmail(email)).resolves.toEqual({ kind: "error" });
	});
});
