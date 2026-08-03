export type ApiBody = {
	ok?: boolean;
	kind?: string;
	fieldErrors?: Record<string, string>;
	message?: string;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

export const parseApiBody = (value: unknown): ApiBody | null => {
	if (!isRecord(value)) return null;
	return {
		ok: typeof value.ok === "boolean" ? value.ok : undefined,
		kind: typeof value.kind === "string" ? value.kind : undefined,
		fieldErrors: isRecord(value.fieldErrors)
			? (value.fieldErrors as Record<string, string>)
			: undefined,
		message: typeof value.message === "string" ? value.message : undefined,
	};
};
