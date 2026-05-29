const nbsp = "\u00A0";

export type TravelFlightStepVideoSource = {
	src: string;
	type?: string;
	media?: string;
};

export type TravelFlightStepVisual =
	| string
	| {
			kind: "video";
			poster: string;
			posterSrcset?: string;
			posterSizes?: string;
			sources: TravelFlightStepVideoSource[];
	  };

export type TravelFlightStepCard = {
	tag: string;
	title: string;
	visual: TravelFlightStepVisual;
	footer: string;
	detailDescription: string;
	actionLabel?: string;
	actionHref?: string;
};

export type TravelFlightsRecommendedDates = {
	eyebrowIcon?: string;
	eyebrow: string;
	title: string;
	copy: string;
	note: string;
};

export type TravelFlightsSection = {
	title: string;
	lede?: string;
	stepsAriaLabel: string;
	recommendedDates?: TravelFlightsRecommendedDates;
	steps: TravelFlightStepCard[];
};

export type TravelFlightsPageData = {
	hero: {
		eyebrow: string;
		title: string;
		ledes: string[];
	};
	backgroundImage: string;
	international: TravelFlightsSection;
	domestic: TravelFlightsSection;
};

export const isVideoVisual = (
	visual: TravelFlightStepVisual,
): visual is Extract<TravelFlightStepVisual, { kind: "video" }> =>
	typeof visual === "object" && visual.kind === "video";

/** Full flights page copy and step cards. */
export const travelFlightsPage: TravelFlightsPageData = {
	hero: {
		eyebrow: "Everything you need to plan your trip",
		title: "Travel Information",
		ledes: [
			"We want to help in making this trip as seamless as Nigeria can be! Please read this information carefully for travel recommendations and dates.",
			"Take special note of the days that we are able to assist with ground transport. Feel free to come in on any other day, but if you fly in outside of our recommended days then we will not be able to provide ground transport support.",
		],
	},
	backgroundImage: "/assets/travel.jpg",
	international: {
		title: "For Guests Arriving from Outside Nigeria",
		lede: "Fly into Lagos, connect through Owerri, then travel onward to Abia State.",
		stepsAriaLabel: "Trip steps",
		recommendedDates: {
			eyebrowIcon: "📅",
			eyebrow: "Recommended arrival dates",
			title: "Plan to arrive in Lagos between December 29–31, 2026 or January 2, 2027",
			copy: "These are the only days we coordinate airport assistance, ground transportation, and overall travel coordination for international guests.",
			note: `Guests arriving outside those dates will need to arrange their own local transport to${nbsp}Abia${nbsp}State.`,
		},
		steps: [
			{
				tag: "International",
				title: "Arrive in Lagos",
				visual: {
					kind: "video",
					poster: "/assets/lagos.png",
					sources: [
						{ src: "/assets/lagos.mp4", type: "video/mp4" },
					],
				},
				footer: "Murtala Muhammed International Airport",
				detailDescription: `Fly into Lagos on your international flight. Plan to arrive between December 29 and 31, 2026 for the Traditional Marriage or January 2, 2027 for the Church Wedding — these are the only days we will coordinate airport assistance and ground transportation for guests traveling from outside${nbsp}Nigeria.`,
			},
			{
				tag: "Domestic",
				title: "Connect to Owerri, Imo State",
				visual: "/assets/owerri.png",
				footer: "Sam Mbakwe International Cargo Airport",
				detailDescription: `Take a local flight from Lagos to Owerri. This domestic connection brings you closer to Abia${nbsp}State and the celebration.`,
			},
			{
				tag: "Domestic",
				title: "Ground to Abia State",
				visual: "/assets/umuahia.png",
				footer: "Onward to the venue",
				detailDescription: `Transportation from Owerri to Abia State will be arranged for guests traveling from outside${nbsp}Nigeria.`,
			},
		],
	},
	domestic: {
		title: "Getting to the Venues",
		lede: "Both Ceremonies will be held in Umuahia, Abia State.",
		stepsAriaLabel: "Domestic travel steps",
		steps: [
			{
				tag: "January 2, 2027",
				title: "Traditional Marriage",
				visual: "/assets/item.png",
				footer: "Onuoha's Country Home, Okai-Item, Bende LGA, Abia State",
				detailDescription:
					"The traditional marriage ceremony takes place at Onuoha's Country Home in Okai Item, Bende LGA, Abia State.",
				actionLabel: "View map",
				actionHref: "https://maps.app.goo.gl/a5tYqVVXab4BL5tE9",
			},
			{
				tag: "January 4, 2027",
				title: "Church Wedding",
				visual: "/assets/mti.png",
				footer: "Methodist Theological Institute Umuahia",
				detailDescription:
					"The church wedding takes place at Methodist Theological Institute in Umuahia while reception follows at the International Conference Centre Umuahia.",
				actionLabel: "View map",
				actionHref: "https://maps.app.goo.gl/5CS31ViRC9K63Qev7",
			},
		],
	},
};

export const internationalFlightStepCards = travelFlightsPage.international.steps;
export const domesticFlightStepCards = travelFlightsPage?.domestic.steps;
