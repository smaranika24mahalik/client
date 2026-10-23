import type { ProjectStatus } from '@/lib/supabase';

const STATUS_STYLES: Record<ProjectStatus, string> = {
  'Not Started': 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 ring-blue-200',
  'On Hold': 'bg-amber-100 text-amber-700 ring-amber-200',
  Completed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

const STATUS_DOTS: Record<ProjectStatus, string> = {
  'Not Started': 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  'On Hold': 'bg-amber-500',
  Completed: 'bg-emerald-500',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
}
