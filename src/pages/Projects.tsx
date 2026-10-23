import { useEffect, useMemo, useState } from 'react';
import { FolderPlus, Pencil, Trash2, Search, FolderKanban, DollarSign, CalendarClock } from 'lucide-react';
import { supabase, type Client, type ProjectWithClient, type ProjectStatus, PROJECT_STATUSES } from '@/lib/supabase';
import { Modal, ConfirmModal } from '@/components/Modal';
import { Field, SelectField } from '@/components/Field';
import { StatusBadge } from '@/components/StatusBadge';

const STATUS_FILTERS: ('All' | ProjectStatus)[] = ['All', ...PROJECT_STATUSES];

export function Projects() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', budget: '', deadline: '', status: 'Not Started' as ProjectStatus, client_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const [projectsRes, clientsRes] = await Promise.all([
      supabase.from('projects').select('id, title, budget, deadline, status, client_id, created_at, client:clients(id, name, email)'),
      supabase.from('clients').select('*').order('name'),
    ]);
    setProjects((projectsRes.data ?? []) as unknown as ProjectWithClient[]);
    setClients((clientsRes.data ?? []) as Client[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.client?.name.toLowerCase().includes(q) ?? false);
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  function openAdd() {
    setEditId(null);
    setForm({ title: '', budget: '', deadline: '', status: 'Not Started', client_id: '' });
    setError('');
    setModalOpen(true);
  }

  function openEdit(p: ProjectWithClient) {
    setEditId(p.id);
    setForm({
      title: p.title,
      budget: String(p.budget),
      deadline: p.deadline,
      status: p.status,
      client_id: p.client_id ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.deadline) {
      setError('Title and deadline are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      budget: parseFloat(form.budget) || 0,
      deadline: form.deadline,
      status: form.status,
      client_id: form.client_id || null,
    };
    if (editId) {
      await supabase.from('projects').update(payload).eq('id', editId);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    await load();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await supabase.from('projects').delete().eq('id', deleteId);
    setDeleteId(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your project records</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700"
        >
          <FolderPlus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project or client name..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | ProjectStatus)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="px-5 py-16 text-center text-sm text-slate-400">Loading projects...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
          <FolderKanban className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {projects.length === 0 ? 'No projects yet. Add your first project.' : 'No results found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{p.client?.name ?? 'No client assigned'}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  {p.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  {new Date(p.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-slate-50 pt-3">
                <button
                  onClick={() => openEdit(p)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Project' : 'Add Project'}>
        <div className="space-y-4">
          <Field
            id="title"
            label="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Website Redesign"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              id="budget"
              type="number"
              label="Budget ($)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="5000"
            />
            <Field
              id="deadline"
              type="date"
              label="Deadline"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
          <SelectField
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
          <SelectField
            id="client"
            label="Assigned Client"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          >
            <option value="">No client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </SelectField>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </div>
  );
}
