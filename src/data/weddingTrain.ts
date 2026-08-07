export interface ScheduleItem {
	time: string;
	label: string;
	desc?: string;
}

export const TRAD_SCHEDULE: ScheduleItem[] = [
  {
    time: "9:00am",
    label: "General Pictures with Bridal / Groom Train",
    desc: "Location TBC",
  },
  {
    time: "11:00am",
    label: "Depart for Okai Item",
    desc: "Okai Item, Abia State",
  },
  {
    time: "12:00pm",
    label: "Arrive Onuoha's Compound"
  },
  { time: "1:00pm", label: "Traditional Ceremony Begins", desc: "Onuoha's Compound, Okai Item" },
  {
    time: "5:00pm",
    label: "Party Continues till late",
    desc: "Head back to Umuahia",
  },
];

export const CHURCH_SCHEDULE: ScheduleItem[] = [
  {
    time: "9:00am",
    label: "General Pictures with Bridal / Groom Train",
    desc: "Location TBC",
  },
  {
    time: "11:00am",
    label: "Arrive Church",
    desc: "Rhema Chapel (MTI), Umuahia",
  },
  { time: "12:00pm", label: "Bridal Procession" },
  {
    time: "2:00pm",
    label: "Wedding Reception",
    desc: "International Conference Centre (ICC), Umuahia",
  },
  { time: "5:00pm", label: "After Party", desc: "Till late" },
];

export type OutfitTierValue = "material_only" | "material_tailoring";

export interface OutfitTier {
	label: string;
	value: OutfitTierValue;
}

export const OUTFIT_TIERS: OutfitTier[] = [
	{ label: "Full service", value: "material_tailoring" },
	{ label: "Material only", value: "material_only" },
];

export interface AccommodationNightOption {
	label: string;
	value: "3" | "4";
	desc: string;
	note?: string;
}

export const ACCOMMODATION_NIGHTS: AccommodationNightOption[] = [
  {
    label: "3 Nights",
    value: "3",
    desc: "Arrive on Saturday, 2 January, attend the Traditional Marriage (ideal for those travelling from nearby or arriving early), stay through the Church Wedding on Monday, 4 January, and depart on Tuesday, 5 January.",
    note: "This option allows you to spend New Year's Day with your family before travelling. Secure luggage storage will be available if you check out before the Church Wedding.",
  },
  {
    label: "4 Nights (Recommended)",
    value: "4",
    desc: "Arrive on Friday, 1 January, settle in ahead of the celebrations, attend both the Traditional Marriage and Church Wedding, and depart on Tuesday, 5 January.",
    note: "Recommended for guests travelling from farther away or anyone who prefers a more relaxed schedule before the wedding celebrations.",
  }
];

export const COSTS = {
	logistics: 5000,
	tradOutfitMaterial: 30000,
	tradOutfitTailoring: 20000,
	tradOutfitAccessories: 15000,
	churchOutfitFull: 200000,
	accommodationPerNightMin: 20000,
	accommodationPerNightMax: 35000,
};

export const ACCOUNT = {
	bank: "GTBank",
	name: "Jeremiah Iromaka",
	number: "0142541075",
};

export const PAYMENT_DEADLINE = "30 September 2026";

export const fmtNaira = (n: number): string =>
	n === 0 ? "₦0.00" : `₦${n.toLocaleString()}`;
