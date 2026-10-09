export type AsoEbiCurrency = "NGN" | "GBP" | "USD";

/** Approximate Naira rates for display — edit when you want to refresh conversions. */
export const asoebiFx = {
	ngnPerUsd: 1600,
	ngnPerGbp: 2000,
} as const;

export const detectAsoebiCurrency = (): AsoEbiCurrency => {
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
	const languages = navigator.languages?.length
		? [...navigator.languages]
		: [navigator.language];

	if (timeZone.startsWith("Africa/")) return "NGN";

	const isUk =
		timeZone === "Europe/London" ||
		languages.some((lang) => {
			const locale = lang.toLowerCase();
			return locale === "en-gb" || locale.endsWith("-gb");
		});
	if (isUk) return "GBP";

	return "USD";
};

const convertFromNgn = (amountNgn: number, currency: AsoEbiCurrency): number => {
	if (currency === "NGN") return amountNgn;
	if (currency === "GBP") {
		return Math.max(1, Math.round(amountNgn / asoebiFx.ngnPerGbp));
	}
	return Math.max(1, Math.round(amountNgn / asoebiFx.ngnPerUsd));
};

const localeForCurrency = (currency: AsoEbiCurrency): string => {
	if (currency === "NGN") return "en-NG";
	if (currency === "GBP") return "en-GB";
	return "en-US";
};

export const formatAsoebiPrice = (
	amountNgn: number,
	currency: AsoEbiCurrency = detectAsoebiCurrency(),
): string => {
	const amount = convertFromNgn(amountNgn, currency);
	return new Intl.NumberFormat(localeForCurrency(currency), {
		style: "currency",
		currency,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 0,
	}).format(amount);
};

export const asoebiCurrencyLabel = (currency: AsoEbiCurrency): string => {
	if (currency === "NGN") return "Naira";
	if (currency === "GBP") return "Pounds";
	return "US Dollars";
};
