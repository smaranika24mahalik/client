import { LayoutDashboard, Users, FolderKanban, BarChart3, Briefcase, Home } from 'lucide-react';

export type PageId = 'dashboard' | 'clients' | 'projects' | 'reports';

type NavItem = {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

type SidebarProps = {
  current: PageId;
  onNavigate: (id: PageId) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onGoHome: () => void;
};

export function Sidebar({ current, onNavigate, mobileOpen, onMobileClose, onGoHome }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">SmartCPM</h1>
            <p className="text-xs text-navy-300">Client & Project</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onMobileClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-navy-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <button
            onClick={onGoHome}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 transition hover:bg-white/5 hover:text-white"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </button>
        </div>
        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-xs text-navy-400">College OOP Project</p>
          <p className="text-xs text-navy-500">C++17 + Supabase</p>
        </div>
      </aside>
    </>
  );
}
