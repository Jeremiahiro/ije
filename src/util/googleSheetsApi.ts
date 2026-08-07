import { google } from "googleapis";

export type SheetAppendResult =
	| { ok: true }
	| { ok: false; reason: "upstream" | "not_configured" };

export const appendRowsToSheet = async (
	sheetName: string,
	rows: string[][],
	opts?: { headers?: string[] },
): Promise<SheetAppendResult> => {
	const spreadsheetId = import.meta.env.GOOGLE_SPREADSHEET_ID?.trim();
	const email = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
	const key = import.meta.env.GOOGLE_PRIVATE_KEY?.trim().replace(/\\n/g, "\n");

	if (!spreadsheetId || !email || !key) {
		return { ok: false, reason: "not_configured" };
	}

	try {
		const auth = new google.auth.JWT({
			email,
			key,
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});
		const sheets = google.sheets({ version: "v4", auth });

		// Resolve sheet name → numeric sheetId so we never need A1 notation with apostrophes.
		// includeGridData lets us check whether the sheet already has content.
		const meta = await sheets.spreadsheets.get({
			spreadsheetId,
			includeGridData: true,
			fields: "sheets.properties,sheets.data.rowData",
		});
		const existingSheet = meta.data.sheets?.find((s) => s.properties?.title === sheetName);
		const existingSheetId = existingSheet?.properties?.sheetId;
		const sheetIsEmpty = (existingSheet?.data?.[0]?.rowData?.length ?? 0) === 0;

		let sheetId = existingSheetId;

		if (sheetId === undefined || sheetId === null) {
			const created = await sheets.spreadsheets.batchUpdate({
				spreadsheetId,
				requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
			});
			sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId ?? null;
			if (sheetId === null || sheetId === undefined) {
				console.error(`[googleSheetsApi] failed to create sheet "${sheetName}"`);
				return { ok: false, reason: "upstream" };
			}
		}

		// Write headers when the sheet has no rows yet (new or manually cleared).
		const allRows = sheetIsEmpty && opts?.headers ? [opts.headers, ...rows] : rows;

		if (allRows.length === 0) return { ok: true };

		await sheets.spreadsheets.batchUpdate({
			spreadsheetId,
			requestBody: {
				requests: [
					{
						appendCells: {
							sheetId,
							rows: allRows.map((row) => ({
								values: row.map((cell) => ({
									userEnteredValue: { stringValue: cell },
								})),
							})),
							fields: "userEnteredValue",
						},
					},
				],
			},
		});

		return { ok: true };
	} catch (err) {
		console.error("[googleSheetsApi] append failed:", err);
		return { ok: false, reason: "upstream" };
	}
};
