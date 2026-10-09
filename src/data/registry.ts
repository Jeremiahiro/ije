/** Registry destinations and page copy */

export const zolaRegistryHref =
	"https://www.zola.com/wedding/jeremiahandjane2026/registry";

/** Unique slug for the Zola embed widget (`data-registry-key`) */
export const zolaRegistryKey = "jeremiahandjane2026";

export const registryPageHref = "/registry";

/** Optional open-amount links (Wise, Stripe Payment Link). Empty until ready. */
export type ContributionLink = {
	label: string;
	href: string;
};

export const contributionLinks: ContributionLink[] = [];
