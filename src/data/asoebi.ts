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
	},
];

/** Shared men note — shown once, not per event. */
export const asoebiMenNote = "We trust you to look your best.";

export const asoebiCapPriceNgn = 5500;

export const asoebiPrices: AsoEbiPrice[] = [
	{ label: "3 yards lace + 1 piece sego headtie", amountNgn: 45_500 },
	{ label: "4 yards lace + 1 piece sego headtie", amountNgn: 55_500 },
	{ label: "Trad & White combo (3 yards each)", amountNgn: 91_000 },
	{ label: "Trad & White combo (4 yards each)", amountNgn: 111_000 },
	{ label: "Ankara (Traditional only)", amountNgn: 5_000 },
	{ label: "Asoebi cap", amountNgn: asoebiCapPriceNgn },
];

export const asoebiPriceNote =
	"Ankara is for the Traditional wedding only — a more accessible option open to all.";

export const asoebiNextSteps: AsoEbiNextStep[] = [
	{
		title: "Choose your package",
		detail:
			"Decide which celebration(s) you’re dressing for, then pick a lace package. For Traditional, Ankara is also available.",
	},
	{
		title: "Get in touch",
		detail:
			"Reach out and we’ll connect you to the point-person closest to you.",
	},
	{
		title: "Confirm & collect",
		detail: "Confirm with your point-person and arrange pickup.",
	},
];
