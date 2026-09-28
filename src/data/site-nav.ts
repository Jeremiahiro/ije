import { coupleNames, event, isPageEnabled, type PageKey } from "@/config/event";

/** Shared nav + routes for Header and static pages */
export const siteTitleSuffix = coupleNames;
export const defaultPageDescription = `${siteTitleSuffix} · Wedding details coming soon.`;

export const registryHref = event.registryHref;

export type HomeEventPreview = {
	title: string;
	dateLabel: string;
	location: string;
	href: string;
};

export const homePageContent = {
	subheading:
		"We are so grateful to celebrate with you. Here are the key details for our wedding celebrations in Abia State, Nigeria.",
	primaryCta: {
		label: "RSVP",
		href: "/rsvp",
	},
	events: [
		{
			title: "Traditional Marriage (Ịgba Nkwụ)",
			dateLabel: "January 2, 2027",
			location:
				"Onuoha's Country Home, Okai-Item, Bende Local Government Area in Abia State, Nigeria.",
			href: "/schedule#traditional-marriage",
		},
		{
			title: "Church Wedding",
			dateLabel: "January 4, 2027",
			location: "Methodist Theological Institute (MTI), Michael Okpara Boulevard, Umuahia, Abia State.",
			href: "/schedule#church-wedding",
		},
	] as HomeEventPreview[],
};

export type NavTopLink = {
	kind: "link";
	href: string;
	label: string;
	target: "_self" | "_blank";
};

type NavEntry = NavTopLink & { page?: PageKey };

const allNavItems: NavEntry[] = [
	{
		kind: "link",
		label: "Schedule",
		href: "/schedule",
		target: "_self",
		page: "schedule",
	},
	{
		kind: "link",
		label: "Travel",
		href: "/travel",
		target: "_self",
		page: "travel",
	},
	{
		kind: "link",
		label: "Registry",
		href: registryHref,
		target: "_blank",
	},
	{
		kind: "link",
		label: "FAQs",
		href: "/faq",
		target: "_self",
		page: "faq",
	},
	{
		kind: "link",
		label: "Things to Do",
		href: "/things-to-do",
		target: "_self",
		page: "thingsToDo",
	},
	{
		kind: "link",
		label: "Asoebi",
		href: "/asoebi",
		target: "_self",
		page: "asoebi",
	},
];

/** Nav links, minus pages switched off in `src/config/event.ts` and an empty registry. */
export const navItems: NavTopLink[] = allNavItems
	.filter(({ page, href }) => (page ? isPageEnabled(page) : href !== ""))
	.map(({ page: _page, ...link }) => link);

export function navHref(path: string, slug: string): string {
	return `${path.replace(/\/$/, "")}/${slug}`;
}
