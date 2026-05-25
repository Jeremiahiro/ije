export type WeddingPartyQuickTip = {
	label: string;
	value: string;
};

export const aboutWeddingPartyPage = {
	backgroundImage: "/assets/party.JPG",
	hero: {
		eyebrow: "After Party",
		title: "Wedding Party",
		ledes: [
			"After the reception, we keep the celebration going with music, dancing, and good vibes.",
		],
	},
	highlight:
		"Same venue. Later on. Bigger dance-floor energy.",
	quickTips: [
		{ label: "Vibe", value: "Elegant, playful, and dance-forward." },
		{ label: "Entry", value: "For invited wedding guests." },
		{ label: "Sound", value: "Afrobeats, Amapiano, and classics." },
	] satisfies WeddingPartyQuickTip[],
	note: "Final time cue will be shared with guests on the day.",
};
