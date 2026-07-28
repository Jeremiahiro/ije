export interface ScheduleItem {
	time: string;
	label: string;
	desc?: string;
}

export const TRAD_SCHEDULE: ScheduleItem[] = [
	{ time: "10:00am", label: "Meet up in Umuahia", desc: "Meeting point to be communicated" },
	{
		time: "11:00am",
		label: "Commute to Bende LGA",
		desc: "Ensure you're at the meeting point on time to avoid missing out",
	},
	{
		time: "1:00pm",
		label: "Traditional Marriage",
		desc: "Onuoha's Country Home, Okai-Item, Bende LGA, Abia State",
	},
];

export const CHURCH_SCHEDULE: ScheduleItem[] = [
	{ time: "11:00am", label: "Church Ceremony", desc: "Methodist Theological Institute (MTI), Umuahia" },
	{ time: "2:00pm", label: "Wedding Reception", desc: "International Conference Centre (ICC), Umuahia" },
	{ time: "5:00pm", label: "After Party", desc: "International Conference Centre (ICC), Umuahia" },
];

export type OutfitTierValue =
	| "material_only"
	| "accessories_only"
	| "material_tailoring"
	| "material_tailoring_accessories";

export interface OutfitTier {
	label: string;
	value: OutfitTierValue;
}

export const OUTFIT_TIERS: OutfitTier[] = [
  {
    label: "All Inclusive",
    value: "material_tailoring_accessories",
  },
  { label: "Materials + Tailoring", value: "material_tailoring" },
  { label: "Materials only", value: "material_only" },
  { label: "Accessories only", value: "accessories_only" },
];

export interface AccommodationNightOption {
	label: string;
	value: "3" | "4";
	desc: string;
	note?: string;
}

export const ACCOMMODATION_NIGHTS: AccommodationNightOption[] = [
	{
		label: "3 nights",
		value: "3",
		desc: "Arrive Sat 2 Jan, rest Sun 3 Jan, attend wedding Mon 4 Jan — checkout in the morning before the ceremony",
		note: "Provision will be made for bag storage so you can enjoy the wedding without your luggage.",
	},
	{
		label: "4 nights",
		value: "4",
		desc: "As above, with one extra night after the wedding before heading home",
	},
];

// All values in Naira. 0 = TBC — renders as ₦— in the UI.
export const COSTS = {
	logistics: 5000,
	tradOutfitMaterial: 1000,
	tradOutfitTailoring: 1500,
	tradOutfitAccessories: 500,
	churchOutfitMaterial: 1000,
	churchOutfitTailoring: 1500,
	accommodationPerNight: 1000,
};

export const ACCOUNT = {
	bank: "GTBank",
	name: "Jeremiah Iromaka",
	number: "0142541075",
};

export const PAYMENT_DEADLINE = "30 September 2026";

export const fmtNaira = (n: number): string =>
	n === 0 ? "₦0.00" : `₦${n.toLocaleString()}`;
