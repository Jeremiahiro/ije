export type ScheduleEvent = {
  icon?: string;
  title: string;
  timeLabel?: string;
  venue: string;
  location: string;
  notes?: string;
  colorsOfTheDay?: string;
  mapHref?: string;
  googleCalendarHref?: string;
  appleCalendarHref?: string;
};

export type ScheduleDay = {
  id: string;
  dayLabel: string;
  events: ScheduleEvent[];
};

export type SchedulePageData = {
  eyebrow: string;
  title: string;
  days: ScheduleDay[];
};

const googleCalendarBase =
  "https://calendar.google.com/calendar/render?action=TEMPLATE";

const makeGoogleCalendarHref = (
  title: string,
  startUtc: string,
  endUtc: string,
  location?: string | undefined,
  details?: string,
): string => {
  const query = new URLSearchParams({
    text: title,
    dates: `${startUtc}/${endUtc}`,
    ...(location ? { location } : {}),
    ...(details ? { details } : {}),
  });
  return `${googleCalendarBase}&${query.toString()}`;
};

const escapeIcsText = (value: string): string =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

const makeAppleCalendarHref = (
  title: string,
  startUtc: string,
  endUtc: string,
  location?: string | undefined,
  details?: string,
): string => {
  const uidBase = `${title}-${startUtc}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const uid = `${uidBase}@jane-jeremiah-wedding`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jane & Jeremiah Wedding//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${startUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${escapeIcsText(title)}`,
    ...(location ? [`LOCATION:${escapeIcsText(location)}`] : []),
    ...(details ? [`DESCRIPTION:${escapeIcsText(details)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const ics = `${lines.join("\r\n")}\r\n`;
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};

export const schedulePageData: SchedulePageData = {
  eyebrow: "Schedule",
  title: "Wedding Celebrations",
  days: [
    {
      id: "traditional-marriage",
      dayLabel: "Saturday, January 2, 2027",
      events: [
        {
          icon: "♥︎♥︎",
          title: "Traditional Marriage (Ịgba Nkwụ)",
          timeLabel: "1:00 pm",
          venue: "Okai Item, Bende Local Government Area",
          location: "Onuoha's Country Home, Okai Item, Abia State, Nigeria",
          // colorsOfTheDay: "Tan & Brown",
          mapHref: "https://maps.app.goo.gl/a5tYqVVXab4BL5tE9",
          googleCalendarHref: makeGoogleCalendarHref(
            "Jane & Jeremiah's Traditional Marriage (Ịgba Nkwụ)",
            "20270102T100000Z",
            "20270102T150000Z",
            "Onuoha's Country Home, Okai Item, Abia State, Nigeria",
            // "Colors of the day: Tan & Brown",
          ),
          appleCalendarHref: makeAppleCalendarHref(
            "Jane & Jeremiah's Traditional Marriage (Ịgba Nkwụ)",
            "20270102T100000Z",
            "20270102T150000Z",
            "Onuoha's Country Home, Okai Item, Abia State, Nigeria",
            // "Colors of the day: Tan & Brown",
          ),
        },
      ],
    },
    {
      id: "church-wedding",
      dayLabel: "Monday, January 4, 2027",
      events: [
        {
          icon: "♥︎♥︎",
          title: "Church Wedding",
          timeLabel: "11:00 am",
          venue: "Methodist Theological Institute (MTI)",
          location: "Michael Okpara Boulevard, Umuahia, Abia State, Nigeria",
          // colorsOfTheDay: "Emerald Green",
          mapHref: "https://maps.app.goo.gl/5CS31ViRC9K63Qev7",
          googleCalendarHref: makeGoogleCalendarHref(
            "Jane & Jeremiah's Church Wedding",
            "20270104T100000Z",
            "20270104T120000Z",
            "Methodist Theological Institute (MTI), Michael Okpara Boulevard, Umuahia, Abia State, Nigeria",
            // "Colors of the day: Emerald Green",
          ),
          appleCalendarHref: makeAppleCalendarHref(
            "Jane & Jeremiah's Church Wedding",
            "20270104T100000Z",
            "20270104T120000Z",
            "Methodist Theological Institute (MTI), Michael Okpara Boulevard, Umuahia, Abia State, Nigeria",
            // "Colors of the day: Emerald Green",
          ),
        },
        {
          icon: "❦",
          title: "Wedding Reception",
          timeLabel: "2:00 pm",
          venue: "TBA",
          location: "Umuahia, Abia State, Nigeria",
          //   mapHref: "https://maps.app.goo.gl/xccY3nSsnxXVcPDH7",
          googleCalendarHref: makeGoogleCalendarHref(
            "Jane & Jeremiah's Wedding Reception",
            "20270104T130000Z",
            "20270104T160000Z",
            // "International Conference Centre, Umuahia, Abia State, Nigeria",
          ),
          appleCalendarHref: makeAppleCalendarHref(
            "Jane & Jeremiah's Wedding Reception",
            "20270104T130000Z",
            "20270104T160000Z",
            // "International Conference Centre, Umuahia, Abia State, Nigeria",
          ),
        },
        {
          icon: "✶",
          title: "After Party",
          venue: "TBA",
          location: "Umuahia, Abia State, Nigeria",
          // mapHref: "https://maps.app.goo.gl/xccY3nSsnxXVcPDH7",
          googleCalendarHref: makeGoogleCalendarHref(
            "Jane & Jeremiah's After Party",
            "20270104T170000Z",
            "20270105T010000Z",
            // "International Conference Centre, Umuahia, Abia State, Nigeria",
          ),
          appleCalendarHref: makeAppleCalendarHref(
            "Jane & Jeremiah's After Party",
            "20270104T170000Z",
            "20270105T010000Z",
            // "International Conference Centre, Umuahia, Abia State, Nigeria",
          ),
        },
      ],
    },
  ],
};
