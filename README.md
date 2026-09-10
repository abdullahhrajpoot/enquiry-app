# Enquiries

A lightweight enquiry tracker for sales/ops teams. Capture inbound leads, assign owners, move them through status, and keep a clear activity history — without a bloated CRM.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (custom design tokens, no UI kit)
- **Supabase** Auth + Postgres (`@supabase/ssr`, `@supabase/supabase-js`)
- **lucide-react** for a few icons

## Database schema

Three tables (see `supabase/schema.sql`):

| Table | Purpose |
| --- | --- |
| `profiles` | Staff identity (`id` → `auth.users`), `full_name`, `email`. Used for TopBar, owner dropdown, and activity attribution. |
| `leads` | Enquiries: contact fields, `status`, optional `owner_id`, `created_by`, timestamps. |
| `lead_activity` | Audit trail of meaningful changes (`created`, `status`, `owner_id`) so the team can see who did what. |

`lead_activity` exists so status/owner changes stay attributable even after later edits. Inserts for status/owner are written by the app (with `changed_by`); a DB trigger logs the initial `created` event.

## Setup

### 1. Environment

Copy `.env.local` (or create it) with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database

In the Supabase SQL Editor, run the full script in `supabase/schema.sql`. That creates tables, RLS policies, the `updated_at` trigger, and the `created` activity trigger.

### 3. Auth setting

In Supabase → **Authentication** → **Providers** → **Email**:

- Disable **Confirm email** (or “Confirm email” / email verification) so signup can land on the dashboard immediately with a session.

Without this, `signUp` may return no session until the user clicks a confirmation link.

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm start
```

## What I'd do next

- Role-based permissions
- Email notifications on assignment/status change
- Bulk actions
- CSV export
- Soft-delete with undo
