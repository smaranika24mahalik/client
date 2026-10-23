import { useEffect, useMemo, useState } from 'react';
import { UserPlus, Search, Pencil, Trash2, Mail, Phone, Users } from 'lucide-react';
import { supabase, type Client } from '@/lib/supabase';
import { Modal, ConfirmModal } from '@/components/Modal';
import { Field } from '@/components/Field';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients((data ?? []) as Client[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.email, c.phone].some((v) => v.toLowerCase().includes(q)),
    );
  }, [clients, search]);

  function openAdd() {
    setEditId(null);
    setForm({ name: '', email: '', phone: '' });
    setError('');
    setModalOpen(true);
  }

  function openEdit(c: Client) {
    setEditId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError('');
    if (editId) {
      await supabase.from('clients').update(form).eq('id', editId);
    } else {
      await supabase.from('clients').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    await load();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await supabase.from('clients').delete().eq('id', deleteId);
    setDeleteId(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your client records</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700"
        >
          <UserPlus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-5 py-16 text-center text-sm text-slate-400">Loading clients...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <Users className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              {clients.length === 0 ? 'No clients yet. Add your first client.' : 'No results found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-700">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-navy-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-navy-600">
                        <Mail className="h-3.5 w-3.5" />
                        {c.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <Phone className="h-3.5 w-3.5" />
                        {c.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Client' : 'Add Client'}>
        <div className="space-y-4">
          <Field
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
          />
          <Field
            id="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@example.com"
          />
          <Field
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 555 0100"
          />
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
              {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? All their projects will also be removed."
      />
    </div>
  );
}
