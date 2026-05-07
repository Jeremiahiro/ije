/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_GATE_PASSWORD?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
