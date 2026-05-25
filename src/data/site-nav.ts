/** Shared nav + routes for Header and static pages */
export const siteTitleSuffix = "Jane & Jeremiah";
export const bride = "Jane Onuoha";
export const groom = "Jeremiah Iromaka";
export const defaultPageDescription = `${siteTitleSuffix} · Wedding details coming soon.`;

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
				"Archbishop Onuoha's Country Home, Okai-Item, Bende LGA in Abia State, Nigeria.",
			href: "/schedule",
		},
		{
			title: "Church Wedding",
			dateLabel: "January 4, 2027",
			location: "Rhema Chapel, Mission Hill, Eziama Ossah, Umuahia, Abia State.",
			href: "/schedule",
		},
	] as HomeEventPreview[],
};

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
		label: "Registry",
		href: "https://www.zola.com/wedding/jeremiahandjane2026/registry",
		target: "_blank",
	},
	{
		kind: "link",
		label: "FAQs",
		href: "/about/faq",
		target: "_self",
	},
	{
		kind: "link",
		label: "RSVP",
		href: "/rsvp",
		target: "_self",
	},
	{
		kind: "link",
		label: "Asoebi",
		href: "/asoebi",
		target: "_self",
	},
];

export function navHref(path: string, slug: string): string {
	return `${path.replace(/\/$/, "")}/${slug}`;
}
