export type RegistryLink = {
	label: string;
	href?: string;
	variant?: "primary" | "secondary";
};

export type RegistryOption = {
	id: string;
	title: string;
	copy: string;
	currency: "USD" | "GBP" | "NGN" | "Mixed";
	tags?: string[];
	links: RegistryLink[];
};

export type RegistryPageData = {
	backgroundImage: string;
	hero: {
		eyebrow: string;
		title: string;
		ledes: string[];
	};
	introNote: string;
	fundOptions: RegistryOption[];
	traditionalOptions: RegistryOption[];
	physicalGiftOptions: RegistryOption[];
	closingNote: string;
};

export const registryPage: RegistryPageData = {
	backgroundImage: "/assets/rsvp.jpg",
	hero: {
		eyebrow: "Registry",
		title: "Gift Options for Nigeria, UK, and US Guests",
		ledes: [
			"Your presence is the greatest gift to us. For family and friends who have asked about gifting, we have shared a few options below.",
			"We are blending traditions from home in Nigeria with practical options for loved ones in the UK and US.",
		],
	},
	introNote:
		"We have listed all planned options so we can decide together which ones to keep before final publishing.",
	fundOptions: [
		{
			id: "honeymoon-usd",
			title: "Honeymoon Fund (USD)",
			copy: "Support our honeymoon experiences and travel memories in USD.",
			currency: "USD",
			tags: ["US-friendly", "Cash fund"],
			links: [{ label: "Add USD Fund Link", variant: "primary" }],
		},
		{
			id: "honeymoon-gbp",
			title: "Honeymoon Fund (GBP)",
			copy: "A GBP option for family and friends gifting from the UK.",
			currency: "GBP",
			tags: ["UK-friendly", "Cash fund"],
			links: [{ label: "Add GBP Fund Link", variant: "secondary" }],
		},
		{
			id: "celebration-ngn",
			title: "Wedding Celebration Support (NGN)",
			copy: "A Nigerian Naira option for guests who prefer local gifting.",
			currency: "NGN",
			tags: ["Nigeria-friendly", "Cash contribution"],
			links: [{ label: "Add NGN Option", variant: "secondary" }],
		},
	],
	traditionalOptions: [
		{
			id: "traditional-blessing",
			title: "Traditional Blessings and Family Contributions",
			copy: "For elders and family members who prefer customary giving.",
			currency: "Mixed",
			tags: ["Traditional", "Family route"],
			links: [{ label: "Add Traditional Gift Details", variant: "secondary" }],
		},
	],
	physicalGiftOptions: [
		{
			id: "us-registry",
			title: "US Physical Gifts",
			copy: "For guests who prefer sending practical household gifts from US stores.",
			currency: "USD",
			tags: ["US registry"],
			links: [
				{ label: "Add US Registry Link", variant: "secondary" },
				{ label: "Add Alternate US Store", variant: "secondary" },
			],
		},
		{
			id: "uk-registry",
			title: "UK Physical Gifts",
			copy: "For guests in the UK who prefer purchasing from local retailers.",
			currency: "GBP",
			tags: ["UK registry"],
			links: [
				{ label: "Add UK Registry Link", variant: "secondary" },
				{ label: "Add Alternate UK Store", variant: "secondary" },
			],
		},
	],
	closingNote:
		"Thank you for celebrating with us and for every thoughtful way you choose to support our next chapter.",
};
