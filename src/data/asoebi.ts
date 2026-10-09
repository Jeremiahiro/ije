export type AsoEbiColor = {
	name: string;
	hex: string;
	detail?: string;
};

export type AsoEbiEvent = {
	id: string;
	name: string;
	date: string;
	accent: "purple" | "gold";
	colors: AsoEbiColor[];
	forWomen: string;
	forMen: string;
	/** Optional asoebi cap price in Naira (localized in the UI). */
	capPriceNgn?: number;
};

export type AsoEbiPrice = {
	label: string;
	/** Source-of-truth amount in Nigerian Naira. */
	amountNgn: number;
};

export type AsoEbiNextStep = {
	title: string;
	detail: string;
};

export const asoebiPageIntro =
	"Colors of the day and package options for both celebrations. Get in touch when you’re ready to order — we’ll share payment instructions and your local pickup contact.";

export const asoEbiEvents: AsoEbiEvent[] = [
	{
		id: "traditional",
		name: "Traditional Wedding",
		date: "January 2, 2027",
		accent: "purple",
		colors: [
			{ name: "Lavender", hex: "#A990CC", detail: "Onion color" },
			{ name: "Peach", hex: "#EDA27E" },
		],
		forWomen: "Lavender (onion) lace / sego headtie, or peach lace / sego headtie.",
		forMen: "Ankara asoebi.",
	},
	{
		id: "church",
		name: "White Wedding",
		date: "January 4, 2027",
		accent: "gold",
		colors: [
			{ name: "Brown", hex: "#7B5139" },
			{ name: "Gold", hex: "#C4983A" },
		],
		forWomen: "Brown lace with gold sego headtie.",
		forMen: "Brown / gold asoebi.",
		capPriceNgn: 5500,
	},
];

export const asoebiPrices: AsoEbiPrice[] = [
	{ label: "3 yards lace + 1 piece sego headtie", amountNgn: 45_500 },
	{ label: "4 yards lace + 1 piece sego headtie", amountNgn: 55_500 },
	{ label: "Trad & White combo (3 yards each)", amountNgn: 91_000 },
	{ label: "Trad & White combo (4 yards each)", amountNgn: 111_000 },
	{ label: "Ankara", amountNgn: 5_000 },
];

export const asoebiNextSteps: AsoEbiNextStep[] = [
	{
		title: "Choose your package",
		detail:
			"Decide which celebration(s) you’re dressing for, then pick the lace or ankara option that fits.",
	},
	{
		title: "Get in touch",
		detail:
			"Reach out to us and we’ll send the payment account and connect you with the point-person nearest you.",
	},
	{
		title: "Pay, confirm, collect",
		detail:
			"Use only the payment details we send you, then confirm with your point-person and arrange pickup.",
	},
];

export const asoebiPrivateNote =
	"Ready to order? Get in touch and we’ll send payment instructions and your local pickup contact.";
