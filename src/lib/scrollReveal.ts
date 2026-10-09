export function initScrollReveal(): void {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

	if (prefersReducedMotion || elements.length === 0) {
		elements.forEach((el) => {
			el.dataset.visible = "";
		});
		return;
	}

	// Reveal anything already in view before enabling hide styles (avoids blank FOUC).
	const viewportBottom = window.innerHeight * 0.92;
	elements.forEach((el) => {
		if (el.getBoundingClientRect().top < viewportBottom) {
			el.dataset.visible = "";
		}
	});

	document.documentElement.classList.add("reveal-enabled");

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const el = entry.target as HTMLElement;
					el.dataset.visible = "";
					observer.unobserve(el);
				}
			});
		},
		{ threshold: 0.12 },
	);

	elements.forEach((el) => {
		if (!el.hasAttribute("data-visible")) {
			observer.observe(el);
		}
	});
}
