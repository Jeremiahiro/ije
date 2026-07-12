export type AsoEbiColor = {
	name: string;
	hex: string;
	description: string;
};

export type AsoEbiEvent = {
	id: string;
	name: string;
	date: string;
	colors: AsoEbiColor[];
	fabrics: string[];
	notes: string;
};

export type OrderingStep = {
	step: number;
	title: string;
	detail: string;
};

export const asoebiPageIntro =
	"Dressing together as a family is one of the most beautiful parts of our celebrations. Below you'll find the color palette and fabric guide for each event. Full details and ordering information will be confirmed by August 15, 2026.";

export const asoEbiEvents: AsoEbiEvent[] = [
	{
		id: "traditional",
		name: "Traditional Marriage — Ịgba Nkwụ",
		date: "January 2, 2027",
		colors: [
			{
				name: "Gold",
				hex: "#C4983A",
				description: "Primary family color · George wrapper & Aso-Oke",
			},
			{
				name: "Burgundy",
				hex: "#7B1D3C",
				description: "Complementary accent · Headwrap & accessories",
			},
		],
		fabrics: ["George fabric", "Aso-Oke", "Ankara"],
		notes:
			"George fabric is the preferred choice for wrappers. Guests may wear any style in the event colors — traditional attire is encouraged and celebrated.",
	},
	{
		id: "church",
		name: "Church Wedding & Reception",
		date: "January 4, 2027",
		colors: [
			{
				name: "Forest Green",
				hex: "#2C5F3E",
				description: "Primary family color · Lace & Ankara",
			},
			{
				name: "Champagne",
				hex: "#C8AC7A",
				description: "Accent · Accessories, trim & headwear",
			},
		],
		fabrics: ["Lace", "Ankara", "French lace"],
		notes:
			"Guests are welcome in any elegant attire in the event colors. Both traditional and western styles are embraced.",
	},
];

export const orderingSteps: OrderingStep[] = [
	{
		step: 1,
		title: "Confirm your attendance",
		detail: "RSVP first so we can note which events you'll be joining.",
	},
	{
		step: 2,
		title: "Reach out by August 15",
		detail:
			"Contact us at the email below once full color and fabric codes are published.",
	},
	{
		step: 3,
		title: "Source your fabric",
		detail:
			"Fabric can be sourced locally in Nigeria or internationally — we'll share recommended vendors when details are confirmed.",
	},
	{
		step: 4,
		title: "Style your look",
		detail:
			"Use your tailor of choice. The style is yours — the color ties us together.",
	},
];

export const asoebiContact = {
	email: "janeandjeremiah2027@gmail.com",
	note: "Full fabric codes, vendor recommendations, and any group ordering options will be shared here and by email by August 15, 2026.",
};
