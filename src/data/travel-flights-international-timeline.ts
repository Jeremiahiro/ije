const nbsp = "\u00A0";

export type InternationalFlightTimelineStep =
	| {
			stepLabel: string;
			eyebrow: string;
			title: string;
			variant: "airport";
			airport: string;
	  }
	| {
			stepLabel: string;
			eyebrow: string;
			title: string;
			variant: "ground";
			body: string;
	  };

export const internationalFlightTimelineSteps: InternationalFlightTimelineStep[] = [
	{
		stepLabel: "Arrive in Lagos",
		eyebrow: "International flight",
		title: "Fly into",
		variant: "airport",
		airport: "Murtala Muhammed International Airport",
	},
	{
		stepLabel: "Domestic flight to Owerri",
		eyebrow: "Domestic connection",
		title: "Take a local flight to",
		variant: "airport",
		airport: "Sam Mbakwe International Cargo Airport",
	},
	{
		stepLabel: "Ground transportation",
		eyebrow: "Onward to venue",
		title: `Comfort in Abia${nbsp}State`,
		variant: "ground",
		body: `Transportation from Owerri to Abia State will be arranged for guests travelling from outside${nbsp}Nigeria.`,
	},
];
