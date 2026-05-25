export type TravelVisaLink = {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
};

export type TravelVisaPageData = {
	backgroundImage: string;
	hero: {
		eyebrow: string;
		title: string;
		ledes: string[];
	};
	basics: {
		title: string;
		lede: string;
		points: string[];
	};
	applyCard: {
		eyebrow: string;
		title: string;
		copy: string;
		links: TravelVisaLink[];
		note: string;
	};
};

export const travelVisaPage: TravelVisaPageData = {
	backgroundImage: "/assets/visa.jpg",
	hero: {
		eyebrow: "For international guests",
		title: "Visa Information",
		ledes: [
			"Most guests travelling from outside Nigeria will need a valid visa before departure. Start with the official application portal below.",
			"For wedding attendance, most guests should check the Short Visit category, especially the Visiting (Single Entry) Visa (F6A), on the Nigerian Immigration site.",
			"Always confirm current requirements with the Nigerian embassy or consulate serving your country.",
		],
	},
	basics: {
		title: "Basic Visa Checklist",
		lede: "Apply early, select the correct visa type, and make sure your details match your passport exactly.",
		points: [
			"Use the official portal and review Short Visit options, including Visiting (Single Entry) Visa (F6A), if your trip is for wedding attendance/visiting.",
			"Visa fee: USD 160. Complete payment on the official portal and keep your payment receipt.",
			"Passport checklist: valid for at least 6 months on the date you submit your application, with at least 2 blank visa pages for endorsement.",
			"Bring two recent passport photos (usually 35x40mm, white background) and make sure your name/date-of-birth details match your passport exactly.",
			"Prepare travel and stay proof: return ticket plus either hotel reservation or an invitation letter with your host address in Nigeria.",
			"Prepare financial/supporting evidence: recent bank statement (often 180 days), visa application printout, payment receipt, and acknowledgment slip.",
			"If applicable, include extra documents early, such as proof of legal residence in your country of application.",
			"Please get in touch with us before submitting, as we will be organizing a group visa application.",
			"Follow embassy instructions for your country and travel date.",
		],
	},
	applyCard: {
		eyebrow: "Official resources",
		title: "Apply Through the Official Visa Portal",
		copy: "Start your application using the official portal and confirm the exact Short Visit visa type (such as Visiting (Single Entry) Visa F6A) before submitting.",
		links: [
			{
				label: "Start Visa Application",
				href: "https://visa.immigration.gov.ng/",
				variant: "primary",
			},
			{
				label: "Visiting (Single Entry) Visa (F6A) Details",
				href: "https://immigration.gov.ng/info-center/",
				variant: "secondary",
			},
			{
				label: "Nigerian Immigration Service",
				href: "https://immigration.gov.ng/",
				variant: "secondary",
			},
		],
		note: "Current NIS guidance lists Visiting (Single Entry) Visa F6A as a short-visit option for visiting/wedding-type travel. Requirements vary by nationality and mission, so confirm final eligibility, subtype, supporting documents, and photo specs with the embassy or consulate serving your country before submission.",
	},
};
