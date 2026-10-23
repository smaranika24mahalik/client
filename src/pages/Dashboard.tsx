import { useEffect, useState } from 'react';
import { Users, FolderKanban, PlayCircle, CheckCircle2, CalendarClock, TrendingUp } from 'lucide-react';
import { supabase, type ProjectWithClient } from '@/lib/supabase';
import { StatusBadge } from '@/components/StatusBadge';

type Stats = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  return Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalClients: 0, totalProjects: 0, activeProjects: 0, completedProjects: 0 });
  const [deadlines, setDeadlines] = useState<ProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [clientsRes, projectsRes] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id, title, deadline, status, client_id, budget, created_at, client:clients(id, name, email)'),
      ]);

      const clientCount = clientsRes.count ?? 0;
      const projects = (projectsRes.data ?? []) as unknown as ProjectWithClient[];
      setStats({
        totalClients: clientCount,
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === 'In Progress').length,
        completedProjects: projects.filter((p) => p.status === 'Completed').length,
      });

      const upcoming = projects
        .filter((p) => p.status !== 'Completed')
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5);
      setDeadlines(upcoming);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, accent: 'bg-blue-50 text-blue-600' },
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, accent: 'bg-navy-50 text-navy-600' },
    { label: 'Active Projects', value: stats.activeProjects, icon: PlayCircle, accent: 'bg-indigo-50 text-indigo-600' },
    { label: 'Completed', value: stats.completedProjects, icon: CheckCircle2, accent: 'bg-emerald-50 text-emerald-600' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your clients and projects</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-navy-900">{card.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <CalendarClock className="h-5 w-5 text-navy-600" />
          <h3 className="font-semibold text-navy-900">Upcoming Deadlines</h3>
        </div>
        {deadlines.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">No upcoming deadlines.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {deadlines.map((p) => {
              const days = daysUntil(p.deadline);
              const overdue = days < 0;
              const soon = days >= 0 && days <= 3;
              return (
                <div key={p.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.client?.name ?? 'No client'}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{new Date(p.deadline).toLocaleDateString()}</span>
                    {overdue ? (
                      <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                        {Math.abs(days)} days overdue
                      </span>
                    ) : soon ? (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                        {days === 0 ? 'Today' : `${days} days left`}
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {days} days left
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
