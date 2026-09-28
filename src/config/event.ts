/**
 * Single source of truth for the couple and event this site is built for.
 * When repurposing the site for a new couple, start here — then work through
 * the content files in `src/data/` and the images in `public/assets/`.
 *
 * Keep this file free of imports: `astro.config.mjs` reads it too.
 */

export type PageKey =
  | "schedule"
  | "travel"
  | "faq"
  | "thingsToDo"
  | "asoebi"
  | "rsvp"
  | "join";

type Person = {
  /** Shown in the hero, page titles and the footer brand. */
  firstName: string;
  fullName: string;
};

export const event = {
  partnerOne: {
    firstName: "Cynthia",
    fullName: "Cynthia Ibekwe",
  } satisfies Person,
  partnerTwo: {
    firstName: "Kelechi",
    fullName: "Kelechi Apugo",
  } satisfies Person,

  /** Production URL, used for canonical links and the sitemap. No trailing slash. */
  siteUrl: "https://cynthiaandkelechi.com",

  /** Hero eyebrow on the home page. */
  dateLabel: "December 23 & 26, 2026",
  locationLabel: "Owerri, Imo State, Nigeria",

  /** The footer counts down to this moment (ISO 8601 with UTC offset). */
  countdownTarget: "2027-01-04T10:00:00+01:00",
  countdownLabel: "January 4, 2027",

  rsvpDeadline: {
    iso: "2026-10-01",
    label: "October 1, 2026",
  },

  /** Leave empty to hide the Registry link. */
  registryHref: "https://www.zola.com/wedding/cynthiaandkelechi2026/registry",

  /** Tab names in the Google Sheet. The tabs are created on first write. */
  sheets: {
    rsvp: "RSVPs",
    weddingTrain: "Groom's Train",
  },

  /** Turn off pages this couple doesn't need. Disabled pages return 404 and leave the nav. */
  pages: {
    schedule: true,
    travel: true,
    faq: true,
    thingsToDo: true,
    asoebi: true,
    rsvp: true,
    join: true,
  } satisfies Record<PageKey, boolean>,
};

export const pagePaths: Record<PageKey, string> = {
  schedule: "/schedule",
  travel: "/travel",
  faq: "/faq",
  thingsToDo: "/things-to-do",
  asoebi: "/asoebi",
  rsvp: "/rsvp",
  join: "/join",
};

/** API routes that only exist to serve a page; they are switched off with it. */
const pageApiPaths: Partial<Record<PageKey, string[]>> = {
  rsvp: ["/api/rsvp"],
  join: ["/api/join", "/api/init-train-sheet"],
};

/** "Cynthia & Kelechi" */
export const coupleNames = `${event.partnerOne.firstName} & ${event.partnerTwo.firstName}`;

/** "Cynthia Ibekwe and Kelechi Apugo" */
export const coupleFullNames = `${event.partnerOne.fullName} and ${event.partnerTwo.fullName}`;

/** "C & K" */
export const coupleInitials = `${event.partnerOne.firstName[0]} & ${event.partnerTwo.firstName[0]}`;

export const isPageEnabled = (page: PageKey): boolean => event.pages[page];

/** True when `pathname` belongs to a page that is switched off in `event.pages`. */
export const isDisabledPath = (pathname: string): boolean => {
  const path = pathname.replace(/\/+$/, "") || "/";
  return (Object.keys(pagePaths) as PageKey[]).some(
    (page) =>
      !isPageEnabled(page) &&
      [pagePaths[page], ...(pageApiPaths[page] ?? [])].some(
        (base) => path === base || path.startsWith(`${base}/`),
      ),
  );
};
