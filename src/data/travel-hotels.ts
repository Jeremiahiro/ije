import raw from "./travel-hotels.json";

export type GuestIntelKind = "discount" | "tip" | "transport";

export type GuestIntel = {
	title: string;
	body: string;
	kind?: GuestIntelKind;
};

export type Hotel = {
	name: string;
	description: string;
	location: string;
	distance: string;
	distanceKind: "airport" | "venue";
	bestFor: string;
	website?: string;
	mapUrl?: string;
	offers?: string[];
	guestIntel?: GuestIntel[];
};

/** URL fragment / anchor id — use lowercase letters, digits, hyphen only */
export type HotelRegion = {
	id: string;
	jumpLabel: string;
	eyebrow: string;
	title: string;
	lede: string;
	hotels: Hotel[];
};

export type TravelHotelsPageData = {
	introLede: string;
	regions: HotelRegion[];
	pageTip: {
		eyebrow: string;
		title: string;
		body: string;
	};
};

const data = raw as TravelHotelsPageData;

function assertRegionIds(regions: readonly HotelRegion[]) {
	const seen = new Set<string>();
	for (const r of regions) {
		if (!/^[a-z0-9-]+$/i.test(r.id)) {
			throw new Error(
				`travel-hotels.json: invalid region id "${r.id}" (use a–z, 0–9, hyphen only).`,
			);
		}
		if (seen.has(r.id)) {
			throw new Error(`travel-hotels.json: duplicate region id "${r.id}".`);
		}
		seen.add(r.id);
	}
}

assertRegionIds(data.regions);

/** Full hotels page copy and listings — edit `travel-hotels.json`. */
export const travelHotelsPage = data;
