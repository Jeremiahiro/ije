import { rsvpLink } from "@/util/rsvpLink";

const mountTabs = (root: HTMLElement): void => {
	const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
	const select = (tab: HTMLButtonElement, focus = false) => {
		for (const t of tabs) {
			const on = t === tab;
			t.setAttribute("aria-selected", String(on));
			t.tabIndex = on ? 0 : -1;
			const panel = root.querySelector<HTMLElement>(`#${t.getAttribute("aria-controls")}`);
			if (panel) panel.hidden = !on;
		}
		if (focus) tab.focus();
	};
	for (const [i, tab] of tabs.entries()) {
		tab.addEventListener("click", () => select(tab));
		tab.addEventListener("keydown", (e) => {
			const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
			if (!step) return;
			e.preventDefault();
			select(tabs[(i + step + tabs.length) % tabs.length], true);
		});
	}
};

const syncButtons = (item: HTMLElement): void => {
	for (const btn of item.querySelectorAll<HTMLButtonElement>("[data-set-status]")) {
		btn.disabled = btn.dataset.setStatus === item.dataset.status;
	}
};

const mountStatusButtons = (root: HTMLElement): void => {
	for (const item of root.querySelectorAll<HTMLElement>(".dash__response")) {
		syncButtons(item);
		const label = item.querySelector<HTMLElement>("[data-status-label]");

		for (const btn of item.querySelectorAll<HTMLButtonElement>("[data-set-status]")) {
			btn.addEventListener("click", async () => {
				const status = btn.dataset.setStatus;
				if (!status || !label) return;
				const previous = label.textContent;
				label.textContent = "Saving…";
				for (const b of item.querySelectorAll<HTMLButtonElement>("[data-set-status]")) b.disabled = true;

				try {
					const response = await fetch("/api/admin/status", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							list: item.dataset.list,
							submittedAt: item.dataset.submittedAt,
							code: item.dataset.code,
							status,
						}),
					});
					if (response.status === 401) {
						window.location.reload();
						return;
					}
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					item.dataset.status = status;
					label.textContent = status;
				} catch {
					label.textContent = previous;
					window.alert("Couldn't update the sheet. Please try again.");
				} finally {
					syncButtons(item);
				}
			});
		}
	}
};

/** "RSVP link" dialog: type a name, copy or share the personal link. */
const mountRsvpLinkDialog = (root: HTMLElement): void => {
	const dialog = root.querySelector<HTMLDialogElement>("[data-rsvp-link-dialog]");
	const form = dialog?.querySelector<HTMLFormElement>("[data-rsvp-link-form]");
	const name = dialog?.querySelector<HTMLInputElement>("[data-rsvp-link-name]");
	const output = dialog?.querySelector<HTMLInputElement>("[data-rsvp-link-output]");
	const copy = dialog?.querySelector<HTMLButtonElement>("[data-copy-rsvp-link]");
	const share = dialog?.querySelector<HTMLAnchorElement>("[data-share-rsvp-link]");
	const status = dialog?.querySelector<HTMLElement>("[data-rsvp-link-status]");
	// Links point at whichever site the admin is open on (localhost, a preview, or live).
	const siteUrl = window.location.origin;
	if (!dialog || !form || !name || !output || !copy || !share || !status) return;

	const update = () => {
		const hasName = name.value.trim() !== "";
		output.value = hasName ? rsvpLink(siteUrl, name.value) : "";
		copy.disabled = !hasName;
		share.setAttribute("aria-disabled", String(!hasName));
		share.tabIndex = hasName ? 0 : -1;
		share.href = hasName ? `https://wa.me/?text=${encodeURIComponent(output.value)}` : "#";
		status.textContent = "";
	};

	root.querySelector("[data-open-rsvp-link]")?.addEventListener("click", () => {
		name.value = "";
		update();
		dialog.showModal();
		name.focus();
	});
	name.addEventListener("input", update);
	output.addEventListener("focus", () => output.select());

	// Enter in the name field (or the button) copies the link.
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!output.value) return;
		try {
			await navigator.clipboard.writeText(output.value);
			status.textContent = "Link copied.";
		} catch {
			output.select();
			status.textContent = "Couldn't copy. The link is selected; copy it manually.";
		}
	});

	dialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
	dialog.addEventListener("click", (e) => {
		if (e.target === dialog) dialog.close();
	});
};

export const mountAdminDashboard = (): void => {
	const root = document.querySelector<HTMLElement>("[data-admin-dashboard]");
	if (!root) return;
	mountTabs(root);
	mountStatusButtons(root);
	mountRsvpLinkDialog(root);
};
