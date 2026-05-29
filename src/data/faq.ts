import { registryHref } from "@/data/site-nav";

export type FaqAnswerPart =
	| { type: "text"; value: string }
	| { type: "link"; label: string; href: string; external?: boolean };

export type FaqItem = {
	question: string;
	answer: FaqAnswerPart[];
};

export const weddingFaq: FaqItem[] = [
  {
    question: "What's the dress code?",
    answer: [
      {
        type: "text",
        value:
          "We're having two events: Traditional Ceremony and White Wedding. For the Traditional Ceremony, come in Nigerian traditional attire (Ankara, Brocade, Atiku Lace, and more). If you're part of our Aso Ebi group, see our ",
      },
      { type: "link", label: "Asoebi", href: "/asoebi" },
      {
        type: "text",
        value:
          " page for details. For the White Wedding, formal or semi-formal church-appropriate attire is perfect: suits, dresses, and your best dance shoes. See the ",
      },
      { type: "link", label: "Schedule", href: "/schedule" },
      { type: "text", value: " for ceremony dates and times." },
    ],
  },
  {
    question: "What is Aso Ebi? Do I need to buy it?",
    answer: [
      {
        type: "text",
        value:
          "Aso Ebi is a matching fabric chosen for family and close friends during the Traditional Ceremony to symbolize unity and support. Participation is optional. Visit our ",
      },
      { type: "link", label: "Asoebi", href: "/asoebi" },
      {
        type: "text",
        value: " page for details.",
      },
    ],
  },
  {
    question: "Do you have a gift registry?",
    answer: [
      { type: "text", value: "Yes. Please visit our " },
      {
        type: "link",
        label: "Registry",
        href: registryHref,
        external: true,
      },
      { type: "text", value: " on Zola for gift options." },
    ],
  },
  {
    question: "What are the colors of the day?",
    answer: [
      {
        type: "text",
        value: "Colors vary by event. See the ",
      },
      { type: "link", label: "Schedule", href: "/schedule" },
      { type: "text", value: " for each ceremony's colors of the day." },
    ],
  },
  {
    question: "When should I RSVP by?",
    answer: [
      { type: "text", value: "Please RSVP by October 1, 2026 on our " },
      { type: "link", label: "RSVP", href: "/rsvp" },
      { type: "text", value: " page." },
    ],
  },
  {
    question: "Should I get my Visa now? ",
    answer: [
      {
        type: "text",
        value:
          "We recommend starting on your Nigerian visa sooner rather than later. We want to help you with those logistics, so please contact us before you book your flight so we can decide the best visa option for your circumstances.",
      },
    ],
  },
  {
    question: "Are the traditional wedding and white wedding on separate days?",
    answer: [
      {
        type: "text",
        value:
          "Yes, they are on separate days. The Traditional Wedding is on January 2, 2027, and the White Wedding is on January 4, 2027. See the full ",
      },
      { type: "link", label: "Schedule", href: "/schedule" },
      { type: "text", value: " for venues and times." },
    ],
  },
  {
    question: "Can I attend both ceremonies?",
    answer: [
      {
        type: "text",
        value:
          "Absolutely. You are welcome to join us for both the Traditional Wedding and the White Wedding, and celebrate with us all day long. Check the ",
      },
      { type: "link", label: "Schedule", href: "/schedule" },
      { type: "text", value: " for details on each event." },
    ],
  },
  {
    question: "Will food be served?",
    answer: [
      {
        type: "text",
        value:
          "Yes. Expect a delicious mix of Nigerian traditional dishes and continental cuisine, along with drinks, desserts, and more.",
      },
    ],
  },
  {
    question: "Do you have any hotel recommendations?",
    answer: [
      {
        type: "text",
        value: "Yes. We have listed nearby hotel recommendations on our ",
      },
      { type: "link", label: "Travel", href: "/travel#hotels" },
      { type: "text", value: " page." },
    ],
  },
];
