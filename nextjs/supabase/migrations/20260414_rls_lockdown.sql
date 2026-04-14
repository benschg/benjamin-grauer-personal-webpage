-- RLS lockdown: remove over-permissive policies on admin-owned tables.
--
-- Previous policies used auth.role() = 'authenticated' as a proxy for "admin",
-- which is only safe if no one else can ever authenticate. With Supabase email
-- signup enabled (default), any signed-in user could write whitelisted_emails,
-- site_settings, cv_references and cv_styles. audit_logs had USING (true)
-- which made it world-readable via the anon key.
--
-- Approach: drop every policy that granted write or admin-read access through
-- the anon/authenticated roles. All admin operations go through API routes
-- that use the SUPABASE_SERVICE_ROLE_KEY, and service_role bypasses RLS, so
-- no replacement policies are needed for admin writes.
--
-- SELECT policies that legitimate public API routes (now switched to service
-- role) used to rely on are also dropped.

-- audit_logs: "Admin can view audit logs" was USING (true) → world-readable.
-- INSERT policy was WITH CHECK (true) → any anon client could forge entries.
DROP POLICY IF EXISTS "Admin can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;

-- whitelisted_emails: authenticated users could add themselves (priv esc into
-- the whitelist) and enumerate existing whitelist members.
DROP POLICY IF EXISTS "Authenticated users can view whitelisted emails" ON whitelisted_emails;
DROP POLICY IF EXISTS "Authenticated users can insert whitelisted emails" ON whitelisted_emails;
DROP POLICY IF EXISTS "Authenticated users can delete whitelisted emails" ON whitelisted_emails;

-- cv_references: authenticated users could tamper with real people's contact
-- details. Public SELECT is also dropped — /api/cv-references now reads via
-- the service role.
DROP POLICY IF EXISTS "Anyone can view active references" ON cv_references;
DROP POLICY IF EXISTS "Authenticated users can insert references" ON cv_references;
DROP POLICY IF EXISTS "Authenticated users can update references" ON cv_references;
DROP POLICY IF EXISTS "Authenticated users can delete references" ON cv_references;

-- site_settings: authenticated users could overwrite contact info. Public
-- SELECT is also dropped — /api/public-contact and /api/site-settings now
-- read via the service role and gate private fields behind auth in the route.
DROP POLICY IF EXISTS "Anyone can view settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON site_settings;

-- cv_styles: authenticated INSERT was unused by the app.
DROP POLICY IF EXISTS "Authenticated users can insert cv_styles" ON cv_styles;

-- rate_limits: "Service role has full access" was FOR ALL USING (true) WITH
-- CHECK (true), which actually gave anon clients read/write to rate-limit
-- state. Dropping the policy leaves RLS enabled with no policies, i.e. deny
-- all for non-service-role; rate-limiter.ts uses the service role and keeps
-- working.
DROP POLICY IF EXISTS "Service role has full access" ON rate_limits;
