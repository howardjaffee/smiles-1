import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses RLS entirely — this must NEVER
 * be imported from a Client Component, and the `server-only` import
 * above will throw a build error if it accidentally is.
 *
 * Use this only for:
 *   - the scheduled-publishing cron route (app/api/cron/publish-scheduled)
 *   - the automation blog-draft endpoint (app/api/automation/blog-draft)
 *   - other trusted server-to-server operations that intentionally need
 *     to bypass RLS (e.g. reading appointment data for an admin-only
 *     server action after the caller's session has already been checked)
 *
 * Everywhere else, prefer lib/supabase/server.ts so RLS stays the one
 * source of truth for access control.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Set these in your environment before using the admin client."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
