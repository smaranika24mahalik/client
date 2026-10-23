import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { supabase, type ProjectWithClient, type ProjectStatus, PROJECT_STATUSES } from '@/lib/supabase';
import { StatusBadge } from '@/components/StatusBadge';

const STATUS_COLORS: Record<ProjectStatus, string> = {
  'Not Started': 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  'On Hold': 'bg-amber-500',
  Completed: 'bg-emerald-500',
};

export function Reports() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('projects').select('id, title, budget, deadline, status, client_id, created_at, client:clients(id, name, email)');
      setProjects((data ?? []) as unknown as ProjectWithClient[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400">Loading reports...</div>;
  }

  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);
  const avgBudget = projects.length > 0 ? totalBudget / projects.length : 0;

  const statusCounts = PROJECT_STATUSES.map((status) => ({
    status,
    count: projects.filter((p) => p.status === status).length,
    budget: projects.filter((p) => p.status === status).reduce((sum, p) => sum + Number(p.budget), 0),
  }));

  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);
  const maxBudgetStatus = Math.max(...statusCounts.map((s) => s.budget), 1);

  const completionRate = projects.length > 0
    ? Math.round((projects.filter((p) => p.status === 'Completed').length / projects.length) * 100)
    : 0;

  const perClient = projects.reduce((acc, p) => {
    const name = p.client?.name ?? 'Unassigned';
    if (!acc[name]) acc[name] = { count: 0, budget: 0 };
    acc[name].count++;
    acc[name].budget += Number(p.budget);
    return acc;
  }, {} as Record<string, { count: number; budget: number }>);
  const clientRows = Object.entries(perClient).sort((a, b) => b[1].budget - a[1].budget);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Project statistics, budgets and completion</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Budget</p>
              <p className="text-xl font-bold text-navy-900">
                {totalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Budget / Project</p>
              <p className="text-xl font-bold text-navy-900">
                {avgBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completion Rate</p>
              <p className="text-xl font-bold text-navy-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-navy-600" />
          <h3 className="font-semibold text-navy-900">Projects by Status</h3>
        </div>
        <div className="mt-6 space-y-4">
          {statusCounts.map((s) => (
            <div key={s.status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[s.status]}`} />
                  {s.status}
                </span>
                <span className="text-slate-500">{s.count} project{s.count !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${STATUS_COLORS[s.status]}`}
                  style={{ width: `${(s.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget by status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-navy-600" />
          <h3 className="font-semibold text-navy-900">Budget Breakdown by Status</h3>
        </div>
        <div className="mt-6 space-y-4">
          {statusCounts.map((s) => (
            <div key={s.status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{s.status}</span>
                <span className="text-slate-500">
                  {s.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-navy-500 transition-all duration-700"
                  style={{ width: `${(s.budget / maxBudgetStatus) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-client table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-navy-900">Projects & Budget per Client</h3>
        </div>
        {clientRows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-400">No data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Client</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Total Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clientRows.map(([name, data]) => (
                  <tr key={name} className="transition hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-sm font-medium text-navy-900">{name}</td>
                    <td className="px-5 py-3.5 text-right text-sm text-slate-600">{data.count}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-medium text-navy-900">
                      {data.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
