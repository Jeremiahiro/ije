/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_GATE_PASSWORD?: string;
	readonly RSVP_GOOGLE_SCRIPT_URL?: string;
	readonly RSVP_SCRIPT_SECRET?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
