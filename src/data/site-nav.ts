/** Shared nav + routes for Header and static pages */
export const siteTitleSuffix = "Jane & Jeremiah";
export const defaultPageDescription = `${siteTitleSuffix} · Wedding details coming soon.`;

const navImageSrc = "/assets/travel.jpg";

export type NavSubPage = {
	slug: string;
	title: string;
	description?: string;
	image?: string;
};

export type NavSublinksSection = {
	kind: "sublinks";
	id: string;
	label: string;
	path: string;
	sublinks: NavSubPage[];
};

export type NavTopLink = {
	kind: "link";
	href: string;
	label: string;
};

export type NavEntry = NavSublinksSection | NavTopLink;

function sub(
	slug: string,
	title: string,
	description?: string,
	image: string = navImageSrc,
): NavSubPage {
	return { slug, title, description, image };
}

export const navItems: NavEntry[] = [
	{
		kind: "sublinks",
		id: "on-the-day",
		label: "On the Day",
		path: "/on-the-day",
		sublinks: [
			sub("itinerary", "Itinerary", "Ceremony and reception details"),
			sub("attire", "Attire", "What to wear for each event"),
		],
	},
	{
		kind: "sublinks",
		id: "travel",
		label: "Travel",
		path: "/travel",
		sublinks: [
			sub("flights", "Flights", "Arrival airports and transport options", "/assets/travel.jpg"),
			sub("hotels", "Hotels", "Recommended stays and booking info", "/assets/hotel.jpg"),
			sub("visa", "Visa", "Entry requirements for Nigeria"),
			sub("local-transport", "Local Transport", "Getting around during your stay"),
		],
	},
	{
		kind: "sublinks",
		id: "about",
		label: "About",
		path: "/about",
		sublinks: [
			sub("our-story", "Our Story", "How Jane & Jeremiah met"),
			sub("wedding-party", "Wedding Party", "Bridesmaids, groomsmen, and family"),
			sub("faq", "FAQ", "Common questions answered"),
		],
	},
	{
		kind: "link",
		href: "/registry",
		label: "Registry",
	},
];

/** Section path segment (no leading slash) → sublink slugs implemented as dedicated pages */
export const dedicatedSublinkSlugsBySection: Readonly<
	Record<string, ReadonlySet<string>>
> = {
	travel: new Set(["flights", "hotels"]),
};

export function hasDedicatedSublinkPage(section: string, slug: string): boolean {
	const set = dedicatedSublinkSlugsBySection[section];
	return set?.has(slug) ?? false;
}

export function navHref(path: string, slug: string): string {
	return `${path.replace(/\/$/, "")}/${slug}`;
}
