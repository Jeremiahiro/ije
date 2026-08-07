export type AsoEbiColor = {
	name: string;
	hex: string;
};

export type AsoEbiEvent = {
	id: string;
	name: string;
	date: string;
	colors: AsoEbiColor[];
	notes: string;
};

export type OrderingStep = {
	step: number;
	title: string;
	detail: string;
};

export const asoebiPageIntro =
	"Dressing together as a family is one of the most beautiful parts of our celebrations. Below you'll find the confirmed color palette and fabric guide for each event.";

export const asoEbiEvents: AsoEbiEvent[] = [
	{
		id: "traditional",
		name: "Traditional Marriage — Ịgba Nkwụ",
		date: "January 2, 2027",
		colors: [
			{ name: "Lavender", hex: "#A990CC" },
			{ name: "Peach", hex: "#EDA27E" },
		],
		notes:
			"Guests may wear any style in the event colors — traditional attire is encouraged and celebrated.",
	},
	{
		id: "church",
		name: "Church Wedding & Reception",
		date: "January 4, 2027",
		colors: [
			{ name: "Brown", hex: "#7B5139" },
			{ name: "Gold", hex: "#C4983A" },
		],
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
		title: "Get in touch",
		detail:
			"Contact us with any questions about fabric sourcing.",
	},
	{
		step: 3,
		title: "Source your fabric",
		detail:
			"Fabric can be sourced locally in Nigeria. Reach out and we'll point you to the right vendors.",
	},
	{
		step: 4,
		title: "Style your look",
		detail:
			"Use your tailor of choice. The style is yours — the color ties us together.",
	},
];

export const asoebiContact: { email: string | null; note: string } = {
	email: null,
	note: "Have questions about fabric sourcing, or group ordering? Reach out — we're happy to help.",
};
