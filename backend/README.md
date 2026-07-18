# Aura Spaces — Backend

This directory contains database schemas, Supabase PostgreSQL configuration scripts, triggers, and Row Level Security (RLS) policies for **Aura Spaces**.

---

## 🗄️ Database Setup Instructions

1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Create a new project or select an existing project.
3. Open the **SQL Editor** from the left navigation menu.
4. Copy the entire contents of [`supabase_setup.sql`](./supabase_setup.sql).
5. Paste it into the SQL Editor and click **Run**.

### What `supabase_setup.sql` Configures:
- **Tables**: `profiles`, `agents`, `properties`, `favorites`, `inquiries`, and `tours`.
- **Row Level Security (RLS)**: Public read permissions for listings, authenticated permissions for user favorites, inquiries, and tours.
- **Triggers**: Automatic creation of user profiles and agent records upon user signup.
- **Seed Data**: Initial mock properties and agent profiles.

---

## 🔑 Environment Variables

To connect your frontend application to this Supabase backend, set the following environment variables in `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
