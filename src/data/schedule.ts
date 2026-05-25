export type ScheduleEvent = {
	icon?: string;
	title: string;
	timeLabel: string;
	venue: string;
	location: string;
	notes?: string;
	colorsOfTheDay?: string;
	mapHref?: string;
	calendarHref?: string;
};

export type ScheduleDay = {
	dayLabel: string;
	events: ScheduleEvent[];
};

export type SchedulePageData = {
	eyebrow: string;
	title: string;
	days: ScheduleDay[];
};

const googleCalendarBase = "https://calendar.google.com/calendar/render?action=TEMPLATE";

const makeGoogleCalendarHref = (
	title: string,
	location: string,
	startUtc: string,
	endUtc: string,
	details?: string,
): string => {
	const query = new URLSearchParams({
		text: title,
		location,
		dates: `${startUtc}/${endUtc}`,
		...(details ? { details } : {}),
	});
	return `${googleCalendarBase}&${query.toString()}`;
};

export const schedulePageData: SchedulePageData = {
	eyebrow: "Schedule",
	title: "Wedding Celebrations",
	days: [
		{
			dayLabel: "Saturday, January 2, 2027",
			events: [
				{
					icon: "♥︎♥︎",
					title: "Traditional Marriage (Ịgba Nkwụ)",
					timeLabel: "11:00 am",
					venue: "Okai Item",
					location:
						"Archbishop Sunday Onuoha's Country Home, Okai Item, Abia State, Nigeria",
					colorsOfTheDay: "Tan & Brown",
					mapHref: "https://maps.app.goo.gl/a5tYqVVXab4BL5tE9",
					calendarHref: makeGoogleCalendarHref(
						"Jane & Jeremiah's Traditional Marriage (Ịgba Nkwụ)",
						"Archbishop Sunday Onuoha's Country Home, Okai Item, Abia State, Nigeria",
						"20270102T100000Z",
						"20270102T150000Z",
						"Colors of the day: Tan & Brown",
					),
				},
			],
		},
		{
			dayLabel: "Monday, January 4, 2027",
			events: [
				{
					icon: "♥︎♥︎",
					title: "Church Wedding",
					timeLabel: "11:00 am",
					venue: "Rhema Chapel (MTI)",
					location: "Mission Hill, Umuahia, Abia State, Nigeria",
					colorsOfTheDay: "Emerald Green",
					mapHref: "https://maps.app.goo.gl/5CS31ViRC9K63Qev7",
					calendarHref: makeGoogleCalendarHref(
						"Jane & Jeremiah's Church Wedding",
						"Rhema Chapel (MTI), Mission Hill, Umuahia, Abia State, Nigeria",
						"20270104T100000Z",
						"20270104T120000Z",
						"Colors of the day: Emerald Green",
					),
				},
				{
					icon: "❦",
					title: "Wedding Reception",
					timeLabel: "2:00 pm",
					venue: "International Conference Centre",
					location: "Umuahia, Abia State, Nigeria",
					mapHref: "https://maps.app.goo.gl/xccY3nSsnxXVcPDH7",
					calendarHref: makeGoogleCalendarHref(
						"Jane & Jeremiah's Wedding Reception",
						"International Conference Centre, Umuahia, Abia State, Nigeria",
						"20270104T130000Z",
						"20270104T160000Z",
					),
				},
				{
					icon: "✶",
					title: "After Party",
					timeLabel: "6:00 pm",
					venue: "International Conference Centre",
					location: "Umuahia, Abia State, Nigeria",
					notes:
						"Drinks are on deck all night, but feel free to BYOB if you have a favorite. Come ready for good vibes, great energy, and a night to remember.",
					mapHref: "https://maps.app.goo.gl/xccY3nSsnxXVcPDH7",
					calendarHref: makeGoogleCalendarHref(
						"Jane & Jeremiah's After Party",
						"International Conference Centre, Umuahia, Abia State, Nigeria",
						"20270104T170000Z",
						"20270105T010000Z",
						"Drinks are on deck all night, but feel free to BYOB if you have a favorite.",
					),
				},
			],
		},
	],
};
