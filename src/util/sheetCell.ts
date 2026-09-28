/**
 * Neutralize spreadsheet formula injection: a cell whose first character is
 * one of = + - @ (or a leading tab/CR) is treated as a formula by Google
 * Sheets/Excel. Prefixing a single quote forces the value to be stored as text.
 */
const FORMULA_TRIGGER_RE = /^[=+\-@\t\r]/;

export const sanitizeSheetCell = (value: string): string =>
	FORMULA_TRIGGER_RE.test(value) ? `'${value}` : value;
