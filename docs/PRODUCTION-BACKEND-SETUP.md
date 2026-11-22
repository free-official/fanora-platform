# FANORA production backend setup

## Current deployment boundary
The public GitHub Pages site is a static frontend. Creator Studio is a browser-only prototype using localStorage. It is not authentication, not a shared database, and not safe for real private/member content.

## Supabase project required
1. Create a Supabase project at https://supabase.com/dashboard.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Configure Auth email confirmation and allowed redirect URLs for the deployed GitHub Pages origin.
4. Create a public storage bucket only for intentionally public media; use a separate private bucket with authenticated owner policies for private uploads.
5. Add the project's public anon/publishable key and URL to a future frontend build configuration. Never expose the service_role key in browser code or commit secrets to GitHub.
6. Test signup, email confirmation, login, logout, profile ownership, post visibility, and cross-user access before calling the backend production-ready.

## Still not implemented
- Live authentication and account recovery
- Cloud profile/post persistence and media uploads
- Paid memberships, checkout, payouts, refunds, tax and creator verification
- Moderation, reporting, abuse prevention, privacy policy and terms
- Production monitoring, backups and security review

Payment activation requires a supported merchant/payment provider account and compliance checks. Do not accept real payments until these are complete.
