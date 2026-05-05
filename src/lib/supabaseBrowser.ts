import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client only. Astro/Vite exposes env to the client when names start with `PUBLIC_`.
 * Use PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in `.env`.
 */
export const getSupabaseBrowser = (): SupabaseClient | null => {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key);
};
