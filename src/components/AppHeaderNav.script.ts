import { setSegmentedHighlightGeometry } from "@/lib/segmentedNavHighlightGeometry";

const ACTIVE_CLASS = "app-header__nav-link--active";

const readPinnedIndex = (items: HTMLElement[]): number =>
	items.findIndex((el) => el.classList.contains(ACTIVE_CLASS));

const usePointerHoverPreview = (): boolean =>
	matchMedia("(hover: hover) and (pointer: fine)").matches;

const initTrack = (track: HTMLElement): void => {
	const highlight = track.querySelector<HTMLElement>(".app-header__nav-highlight");
	const items = [
		...track.querySelectorAll<HTMLElement>(
			".app-header__nav-link",
		),
	];
	if (!highlight || items.length === 0) {
		return;
	}

	const pointerHover = usePointerHoverPreview();

	let hoverIndex: number | null = null;
	let focusIndex: number | null = null;

	const apply = (): void => {
		const pinned = readPinnedIndex(items);
		const visual =
			hoverIndex ?? focusIndex ?? (pinned >= 0 ? pinned : undefined);
		const target = typeof visual === "number" ? items[visual] : undefined;
		if (target) {
			const tr = track.getBoundingClientRect();
			if (tr.width > 0) {
				setSegmentedHighlightGeometry(track, highlight, target);
			}
		} else {
			highlight.style.width = "0px";
			highlight.style.transform = "translate3d(0, 0, 0)";
		}
	};

	apply();
	track.classList.add("app-header__nav-track--ready");

	if (pointerHover) {
		for (const [i, item] of items.entries()) {
			item.addEventListener("pointerenter", () => {
				hoverIndex = i;
				apply();
			});
		}

		track.addEventListener("pointerleave", () => {
			hoverIndex = null;
			apply();
		});
	}

	track.addEventListener("focusin", (e) => {
		const t = e.target;
		if (t instanceof HTMLElement && items.includes(t)) {
			focusIndex = items.indexOf(t);
			apply();
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

	const headerRoot = track.closest("[data-app-header]");
	if (headerRoot) {
		const mo = new MutationObserver(onResize);
		mo.observe(headerRoot, {
			attributes: true,
			attributeFilter: ["data-menu-open", "data-menu-exit"],
		});
	}
};

export function mountAppHeaderNavHighlight(): void {
	document
		.querySelectorAll<HTMLElement>("[data-app-header-nav-track]")
		.forEach(initTrack);
}
