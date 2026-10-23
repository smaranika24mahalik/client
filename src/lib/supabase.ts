import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type ProjectStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';

export type Project = {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  client_id: string | null;
  created_at: string;
};

export type ProjectWithClient = Project & {
  client: Pick<Client, 'id' | 'name' | 'email'> | null;
};

export const PROJECT_STATUSES: ProjectStatus[] = ['Not Started', 'In Progress', 'On Hold', 'Completed'];
