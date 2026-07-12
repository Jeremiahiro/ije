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
					(entry.target as HTMLElement).dataset.visible = "";
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12 },
	);

	elements.forEach((el) => observer.observe(el));
}
