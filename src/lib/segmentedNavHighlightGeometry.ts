/** Position a sliding highlight under a control, relative to a track (same as PillNav). */
export function setSegmentedHighlightGeometry(
	track: HTMLElement,
	highlight: HTMLElement,
	target: HTMLElement,
): void {
	const tr = track.getBoundingClientRect();
	const lr = target.getBoundingClientRect();
	const x = lr.left - tr.left + track.scrollLeft;
	const w = lr.width;

	highlight.style.width = `${w}px`;
	highlight.style.transform = `translate3d(${x}px, 0, 0)`;
}
