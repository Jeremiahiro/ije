export type ThingsToDoItem = {
	title: string;
	location: string;
	description: string;
	tag: string;
	mapHref?: string;
};

export type ThingsToDoRegion = {
	id: string;
	region: string;
	regionNote: string;
	items: ThingsToDoItem[];
};

export const thingsToDoRegions: ThingsToDoRegion[] = [
	{
		id: "lagos",
		region: "Lagos",
		regionNote:
			"Many guests will pass through Lagos — here are a few spots worth a stop.",
		items: [
			{
				title: "Nike Art Gallery",
				location: "2 Nike Art Gallery Road, Lekki, Lagos",
				description:
					"Five floors of vibrant contemporary and traditional Nigerian art — one of the largest art galleries on the continent. A must for first-time visitors.",
				tag: "Art & Culture",
				mapHref:
					"https://maps.google.com/?q=Nike+Art+Gallery+Lekki+Lagos",
			},
			{
				title: "Lekki Conservation Centre",
				location: "Km 19 Lekki–Epe Expressway, Lekki, Lagos",
				description:
					"Home to West Africa's longest canopy walkway — a lush, elevated trail through mangrove forest. A peaceful escape from the city, ideal for morning visits.",
				tag: "Nature & Outdoors",
				mapHref:
					"https://maps.google.com/?q=Lekki+Conservation+Centre+Lagos",
			},
		],
	},
	{
		id: "umuahia",
		region: "Umuahia",
		regionNote:
			"Our wedding takes place in Abia State. Here are local highlights worth exploring between celebrations.",
		items: [
			{
				title: "National War Museum",
				location: "Umuahia, Abia State",
				description:
					"A moving tribute to the Nigerian Civil War, housing artifacts, vehicles, and memorials. An important and deeply resonant piece of Igbo history.",
				tag: "History",
				mapHref:
					"https://maps.google.com/?q=National+War+Museum+Umuahia",
			},
			{
				title: "De Latinos Lounge, Bar & Events Center",
				location: "BCA Road, Umuahia, Abia State",
				description:
					"A lively spot for cocktails, dining, and live entertainment — ideal for unwinding after a long journey or catching up with fellow guests.",
				tag: "Food & Drinks",
				mapHref: "https://maps.google.com/?q=De+Latinos+Umuahia",
			},
		],
	},
];
