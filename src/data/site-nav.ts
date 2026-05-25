/** Shared nav + routes for Header and static pages */
export const siteTitleSuffix = "Jane & Jeremiah";
export const defaultPageDescription = `${siteTitleSuffix} · Wedding details coming soon.`;

export type NavTopLink = {
	kind: "link";
	href: string;
	label: string;
	target: "_self" | "_blank";
};

export const navItems: NavTopLink[] = [
	{
		kind: "link",
		label: "Schedule",
		href: "/schedule",
		target: "_self",
	},
	{
		kind: "link",
		label: "Travel",
		href: "/travel",
		target: "_self",
	},
	{
		kind: "link",
		label: "Visa",
		href: "/visa",
		target: "_self",
	},
	{
		kind: "link",
		label: "Things To Do",
		href: "/things-to-do",
		target: "_self",
	},
	{
		kind: "link",
		label: "Asoebi",
		href: "/asoebi",
		target: "_self",
	},
	{
		kind: "link",
		label: "Registry",
		href: "/registry",
		target: "_blank",
	},
];

export function navHref(path: string, slug: string): string {
	return `${path.replace(/\/$/, "")}/${slug}`;
}
