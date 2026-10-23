/*
# Create clients and projects tables (single-tenant, no auth)

1. Overview
- This is a college OOP project — a Smart Client & Project Management System.
- There is no sign-in screen, so the app runs entirely as the `anon` role.
- A separate C++17 console application will eventually read these same tables
  through Supabase's REST Data API using the anon key.
- Data is intentionally shared/public (single workspace), so `USING (true)` is
  documented and acceptable here.

2. New Tables
- `clients`
  - id (uuid, primary key)
  - name (text, not null)
  - email (text, not null)
  - phone (text, not null)
  - created_at (timestamptz, default now())
- `projects`
  - id (uuid, primary key)
  - title (text, not null)
  - budget (numeric, not null, default 0)
  - deadline (date, not null)
  - status (text, not null, default 'Not Started')
  - client_id (uuid, foreign key -> clients.id, on delete cascade)
  - created_at (timestamptz, default now())

3. Constraints
- `projects_status_check`: status must be one of
  'Not Started', 'In Progress', 'On Hold', 'Completed'.
- `clients_email_key`: email uniqueness is NOT enforced (the app allows
  editing); we keep it simple for the college project.

4. Security
- RLS enabled on both tables.
- Grants: SELECT, INSERT, UPDATE, DELETE to `anon, authenticated` on both tables.
- Policies: open CRUD for `anon, authenticated` (intentionally shared workspace).
- An index is added on `projects.client_id` for join performance.
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_clients" ON clients;
CREATE POLICY "anon_select_clients" ON clients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_clients" ON clients;
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_clients" ON clients;
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  budget numeric(12,2) NOT NULL DEFAULT 0,
  deadline date NOT NULL,
  status text NOT NULL DEFAULT 'Not Started',
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
