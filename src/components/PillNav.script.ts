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
	let activeIndex: number = readIndexFromHash(links);
	// Suppress IntersectionObserver updates briefly after a hash-driven scroll
	let suppressObserver = false;
	let suppressTimer = 0;

	const apply = (): void => {
		const visual = hoverIndex ?? focusIndex ?? activeIndex;
		const link = links[visual];
		if (link) {
			setSegmentedHighlightGeometry(track, highlight, link);
		}
		setActiveNavState(links, activeIndex);
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

	window.addEventListener("hashchange", () => {
		activeIndex = readIndexFromHash(links);
		// Briefly lock out observer so smooth-scroll intermediate frames don't flicker
		suppressObserver = true;
		clearTimeout(suppressTimer);
		suppressTimer = window.setTimeout(() => {
			suppressObserver = false;
		}, 800);
		apply();
	});

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

	// IntersectionObserver: update active pill as user scrolls through sections
	const sectionIds = links
		.map((a) => a.hash.replace(/^#/, ""))
		.filter(Boolean);
	const sections = sectionIds
		.map((id) => document.getElementById(id))
		.filter((el): el is HTMLElement => el !== null);

	if (sections.length > 0 && sections.length === sectionIds.length) {
		const intersecting = new Map<string, boolean>(
			sectionIds.map((id) => [id, false]),
		);

		const observer = new IntersectionObserver(
			(entries) => {
				if (suppressObserver) return;
				for (const entry of entries) {
					intersecting.set(entry.target.id, entry.isIntersecting);
				}
				// Activate the topmost intersecting section
				for (const [i, id] of sectionIds.entries()) {
					if (intersecting.get(id)) {
						if (i !== activeIndex) {
							activeIndex = i;
							apply();
						}
						break;
					}
				}
			},
			// Top 45% of viewport is the "active zone" — works well with bottom-docked nav
			{ rootMargin: "0px 0px -55% 0px" },
		);

		sections.forEach((section) => observer.observe(section));
	}
};

export function mountPillNav(): void {
	document.querySelectorAll<HTMLElement>("[data-pill-nav]").forEach(initRoot);
}
