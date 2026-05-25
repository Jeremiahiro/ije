export type Hotel = {
	name: string;
	description: string;
	location: string;
	distance: string;
	distanceKind: "airport" | "venue";
	website?: string;
	mapUrl?: string;
};

/** URL fragment / anchor id — use lowercase letters, digits, hyphen only */
export type HotelRegion = {
	id: string;
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

/** Full hotels page copy and listings. */
const data: TravelHotelsPageData = {
	introLede:
		"A curated list of comfortable options in Lagos and Umuahia (wedding location).",
	regions: [
		{
			id: "lagos",
			eyebrow: "✈️ Lagos — recommended hotels (arrival)",
			title: "For guests arriving into Lagos before travelling onward",
			lede: "Short listings focused on airport access, transit comfort, and a smooth first night in Nigeria.",
			hotels: [
				{
					name: "Shoregate Hotels",
					description:
						"Ikeja GRA property with a rooftop terrace, pool, and 24-hour restaurant (African and continental). A strong pick for a comfortable first night after you land.",
					location: "29 Joel Ogunnaike St, Ikeja GRA, Ikeja",
					distance:
						"~15–30 mins to Murtala Muhammed International (traffic dependent)",
					distanceKind: "airport",
					website: "https://shoregatehotels.com/",
					mapUrl:
						"https://www.google.com/maps/search/?api=1&query=Shoregate+Hotels+Ikeja+GRA+Lagos",
				},
				{
					name: "Lagos Marriott Hotel Ikeja",
					description:
						"Full-service Marriott in Ikeja GRA with several restaurants and bars, an outdoor pool, fitness centre, and spa—polished comfort for a first night after landing.",
					location: "122 Joel Ogunnaike St, Ikeja GRA, Ikeja",
					distance:
						"~15–30 mins to Murtala Muhammed International (traffic dependent)",
					distanceKind: "airport",
					website:
						"https://www.marriott.com/en-us/hotels/loslg-lagos-marriott-hotel-ikeja/",
					mapUrl:
						"https://www.google.com/maps/search/?api=1&query=Lagos+Marriott+Hotel+Ikeja+122+Joel+Ogunnaike",
				},
			],
		},
		{
			id: "umuahia",
			eyebrow: "🌿 Umuahia",
			title: "For the ceremony and local events",
			lede: "Stays centred on convenience, security, and proximity to weekend gatherings. We’ll keep refreshing this list as details are confirmed.",
			hotels: [
				{
					name: "Hotel Royal Damgrete",
					description:
						"Upscale GRA hotel with spacious rooms, strong security, and poolside dining—a well-established choice for wedding guests.",
					location: "Factory Road, GRA, Umuahia",
					distance: "~10–20 mins to wedding venue",
					distanceKind: "venue",
					website: "https://hotelroyaldamgrete.com/",
					mapUrl:
						"https://www.google.com/maps/search/?api=1&query=Hotel+Royal+Damgrete+Factory+Road+GRA+Umuahia",
				},
				{
					name: "Rixos Continental Resort",
					description:
						"Large full-service hotel near major government offices in Umuahia, with conference facilities and multiple on-site dining options.",
					location: "No 1A Rixos Avenue, by CBN Junction, off Bende Rd, Umuahia",
					distance:
						"Very close to International Conference Center (ICC) Umuahia",
					distanceKind: "venue",
					website: "https://hotels.ng/hotel/1448253-rixos-continental-hotel",
					mapUrl:
						"https://www.google.com/maps/search/?api=1&query=Rixos+Continental+Resort+No+1A+Rixos+Avenue+CBN+Junction+off+Bende+Road+Umuahia",
				},
			],
		},
	],
	pageTip: {
		eyebrow: "💡 Travel tip",
		title: "If you're flying internationally, stay one night in Lagos first",
		body: "It gives you breathing room for connections, luggage, and rest before the journey to Umuahia—especially after a long-haul flight.",
	},
};

function assertRegionIds(regions: readonly HotelRegion[]) {
	const seen = new Set<string>();
	for (const r of regions) {
		if (!/^[a-z0-9-]+$/i.test(r.id)) {
			throw new Error(
				`travel-hotels.ts: invalid region id "${r.id}" (use a-z, 0-9, hyphen only).`,
			);
		}
		if (seen.has(r.id)) {
			throw new Error(`travel-hotels.ts: duplicate region id "${r.id}".`);
		}
		seen.add(r.id);
	}
}

assertRegionIds(data.regions);

export const travelHotelsPage = data;
