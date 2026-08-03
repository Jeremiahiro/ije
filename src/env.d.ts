/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_GATE_PASSWORD?: string;
	readonly GOOGLE_SPREADSHEET_ID?: string;
	readonly GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
	readonly GOOGLE_PRIVATE_KEY?: string;
	readonly TRAIN_NAMES?: string;
	readonly GROOMSMEN_NAMES?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
