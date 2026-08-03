export function initScrollReveal(): void {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

	if (prefersReducedMotion) {
		elements.forEach((el) => {
			el.dataset.visible = "";
		});
		return;
	}

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

	elements.forEach((el) => observer.observe(el));
}
