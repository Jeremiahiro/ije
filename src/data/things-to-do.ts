export type ThingsToDoItem = {
	title: string;
	location: string;
};

export type ThingsToDoRegion = {
	id: string;
	region: string;
	items: ThingsToDoItem[];
};

export const thingsToDoRegions: ThingsToDoRegion[] = [
	{
		id: "lagos",
		region: "Lagos",
		items: [
			{
				title: "Nike Art Gallery",
				location: "2 Nike Art Gallery Road, Lekki, Lagos, Nigeria",
			},
			{
				title: "Lekki Conservation Centre",
				location: "Km 19 Lekki - Epe Expressway, Lekki, Lagos, Nigeria",
			},
		],
	},
	{
		id: "umuahia",
		region: "Umuahia",
		items: [
			{
				title: "De Latinos Lounge, Bar & Events Center",
				location: "BCA Road, Umuahia, Abia State, Nigeria",
			},
			{
				title: "National War Museum, Umuahia",
				location: "Road, Umuahia, Abia State, Nigeria",
			},
		],
	},
];
