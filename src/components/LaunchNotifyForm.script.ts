import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
	buildSubmittedCookieAssignment,
	isNotifySignupCookieSet,
	LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC,
	LAUNCH_NOTIFY_COOKIE_NAME,
	LAUNCH_NOTIFY_COOKIE_VALUE,
	LAUNCH_NOTIFY_COPY,
	shouldPersistNotifyCookie,
	submitLaunchNotifyEmail,
	type NotifySubmitResult,
} from "@/util/launchNotifyForm";

const setSubmittedCookie = (): void => {
	const isHttps = typeof location !== "undefined" && location.protocol === "https:";
	document.cookie = buildSubmittedCookieAssignment(
		LAUNCH_NOTIFY_COOKIE_NAME,
		LAUNCH_NOTIFY_COOKIE_VALUE,
		LAUNCH_NOTIFY_COOKIE_MAX_AGE_SEC,
		isHttps,
	);
};

const showStatus = (el: HTMLElement, text: string, kind: "ok" | "err" | "info"): void => {
	el.hidden = false;
	el.textContent = text;
	el.dataset.kind = kind;
};

const showThanksHideForm = (signupEl: HTMLElement, thanksEl: HTMLElement): void => {
	signupEl.hidden = true;
	thanksEl.hidden = false;
};

/** Wires DOM for `LaunchNotifyForm.astro` (ids must match markup). */
export const mountLaunchNotifyForm = (): void => {
	const signupBlock = document.getElementById("launch-notify-signup");
	const thanksEl = document.getElementById("launch-notify-thanks");
	const form = document.getElementById("launch-notify-form");
	const statusEl = document.getElementById("launch-notify-status");
	const submitBtn = document.getElementById("launch-notify-submit");
	const emailInput = document.getElementById("launch-notify-email");

	if (!(signupBlock instanceof HTMLElement) || !(thanksEl instanceof HTMLElement)) {
		throw new Error("Launch notify markup missing");
	}

	if (!(form instanceof HTMLFormElement) || !statusEl || !(submitBtn instanceof HTMLButtonElement) || !(emailInput instanceof HTMLInputElement)) {
		throw new Error("Launch notify form markup missing");
	}

	if (isNotifySignupCookieSet(document.cookie)) {
		showThanksHideForm(signupBlock, thanksEl);
	}

	const supabaseClient = getSupabaseBrowser();
	if (!supabaseClient) {
		showStatus(statusEl, LAUNCH_NOTIFY_COPY.notConfigured, "info");
		for (const el of form.querySelectorAll("input, button")) {
			if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
				el.disabled = true;
			}
		}
	}

	form.addEventListener("submit", async (e: SubmitEvent) => {
		e.preventDefault();
		if (!supabaseClient) return;

		const email = emailInput.value.trim();
		if (!email || !emailInput.checkValidity()) {
			emailInput.reportValidity();
			return;
		}

		submitBtn.disabled = true;
		const prevLabel = submitBtn.textContent;
		submitBtn.textContent = LAUNCH_NOTIFY_COPY.sending;
		statusEl.hidden = true;

		const result: NotifySubmitResult = await submitLaunchNotifyEmail(email);

		submitBtn.disabled = false;
		submitBtn.textContent = prevLabel ?? LAUNCH_NOTIFY_COPY.submitLabel;

		if (shouldPersistNotifyCookie(result)) {
			setSubmittedCookie();
			showThanksHideForm(signupBlock, thanksEl);
			return;
		}

		if (result.kind === "not_configured") {
			showStatus(statusEl, LAUNCH_NOTIFY_COPY.notConfigured, "info");
			return;
		}

		if (result.kind === "rls_denied") {
			showStatus(statusEl, LAUNCH_NOTIFY_COPY.rlsDenied, "err");
			return;
		}

		showStatus(statusEl, LAUNCH_NOTIFY_COPY.submitFailed, "err");
	});
};
