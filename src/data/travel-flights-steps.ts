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

export const isVideoVisual = (
	visual: TravelFlightStepVisual,
): visual is Extract<TravelFlightStepVisual, { kind: "video" }> =>
	typeof visual === "object" && visual.kind === "video";

export const internationalFlightStepCards: TravelFlightStepCard[] = [
	{
		tag: "International",
		title: "Arrive in Lagos",
		visual: {
			kind: "video",
			poster: "/assets/lagos-map.png",
			posterSrcset:
				"/assets/lagos-map-480.png 480w, /assets/lagos-map-768.png 768w, /assets/lagos-map.png 1536w",
			posterSizes: "(max-width: 599px) 480px, (max-width: 899px) 768px, 1536px",
			sources: [
				{
					src: "/assets/vide1-480.mp4",
					type: "video/mp4",
					media: "(max-width: 599px)",
				},
				{
					src: "/assets/vide1-720.mp4",
					type: "video/mp4",
					media: "(min-width: 600px) and (max-width: 899px)",
				},
				{ src: "/assets/vide1.mp4", type: "video/mp4" },
			],
		},
		footer: "Murtala Muhammed International Airport",
		detailDescription: `Fly into Lagos on your international flight. Plan to arrive on December 30th or 31st — these are the only days we will coordinate airport assistance and ground transportation for guests travelling from outside${nbsp}Nigeria.`,
	},
	{
		tag: "Domestic",
		title: "Connect to Owerri, Imo State",
		visual: "/assets/map.png",
		footer: "Sam Mbakwe International Cargo Airport",
		detailDescription: `Take a local flight from Lagos to Owerri. This domestic connection brings you closer to Abia${nbsp}State and the celebration.`,
	},
	{
		tag: "Domestic",
		title: "Ground to Abia State",
		visual: "/assets/map.png",
		footer: "Onward to the venue",
		detailDescription: `Transportation from Owerri to Abia State will be arranged for guests travelling from outside${nbsp}Nigeria.`,
	},
];

export const domesticFlightStepCard: TravelFlightStepCard = {
	tag: "Domestic",
	title: "Fly directly to Owerri",
	visual: "/assets/map.png",
	footer: "Sam Mbakwe International Cargo Airport",
	detailDescription:
		"Travelling within Nigeria? Fly directly to Owerri.",
};
