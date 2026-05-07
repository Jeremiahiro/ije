import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		environment: "node",
	},
	server: {
		allowedHosts: [".trycloudflare.com"],
	},
	resolve: {
		alias: {
			"@": path.resolve(dir, "src"),
		},
	},
});
