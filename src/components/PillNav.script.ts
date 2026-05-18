import { setSegmentedHighlightGeometry } from "@/lib/segmentedNavHighlightGeometry";

const readIndexFromHash = (links: HTMLAnchorElement[]): number => {
	const raw = location.hash.replace(/^#/, "");
	if (!raw) {
		return 0;
	}
	const i = links.findIndex((a) => a.hash === `#${raw}`);
	return i >= 0 ? i : 0;
};

const setActiveNavState = (
	links: HTMLAnchorElement[],
	pinnedIndex: number,
): void => {
	links.forEach((a, i) => {
		const on = i === pinnedIndex;
		a.classList.toggle("is-active", on);
		if (on) {
			a.setAttribute("aria-current", "location");
		} else {
			a.removeAttribute("aria-current");
		}
	});
};

const initRoot = (root: HTMLElement): void => {
	const track = root.querySelector<HTMLElement>(".pill-nav__track");
	const highlight = root.querySelector<HTMLElement>(".pill-nav__highlight");
	const links = [...root.querySelectorAll<HTMLAnchorElement>(".pill-nav__link")];
	if (!track || !highlight || links.length === 0) {
		return;
	}

	let hoverIndex: number | null = null;
	let focusIndex: number | null = null;

	const apply = (): void => {
		const pinned = readIndexFromHash(links);
		const visual = hoverIndex ?? focusIndex ?? pinned;
		const link = links[visual];
		if (link) {
			setSegmentedHighlightGeometry(track, highlight, link);
		}
		setActiveNavState(links, pinned);
	};

	apply();
	root.classList.add("pill-nav--ready");

	for (const [i, a] of links.entries()) {
		a.addEventListener("pointerenter", () => {
			hoverIndex = i;
			apply();
		});
	}

	track.addEventListener("pointerleave", () => {
		hoverIndex = null;
		apply();
	});

	track.addEventListener("focusin", (e) => {
		const t = e.target;
		if (t instanceof HTMLAnchorElement) {
			const i = links.indexOf(t);
			if (i >= 0) {
				focusIndex = i;
				apply();
			}
		}
	});

	track.addEventListener("focusout", (e) => {
		const rt = e.relatedTarget;
		if (rt instanceof Node && track.contains(rt)) {
			return;
		}
		focusIndex = null;
		apply();
	});

	const syncFromHash = (): void => {
		apply();
	};
	window.addEventListener("hashchange", syncFromHash);

	let raf = 0;
	const onResize = (): void => {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(apply);
	};
	window.addEventListener("resize", onResize);

	if (window.ResizeObserver) {
		const ro = new ResizeObserver(onResize);
		ro.observe(track);
	}
};

export function mountPillNav(): void {
	document.querySelectorAll<HTMLElement>("[data-pill-nav]").forEach(initRoot);
}
