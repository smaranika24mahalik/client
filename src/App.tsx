import { useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Sidebar, type PageId } from '@/components/Sidebar';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Clients } from '@/pages/Clients';
import { Projects } from '@/pages/Projects';
import { Reports } from '@/pages/Reports';

const TITLES: Record<PageId, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  projects: 'Projects',
  reports: 'Reports',
};

type View = 'landing' | 'app';

function App() {
  const [view, setView] = useState<View>('landing');
  const [page, setPage] = useState<PageId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  function enterApp() {
    setView('app');
  }

  function goHome() {
    setView('landing');
    setMobileOpen(false);
  }

  if (view === 'landing') {
    return <Landing onEnter={enterApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onGoHome={goHome}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-navy-900">{TITLES[page]}</h2>
            </div>
            <button
              onClick={goHome}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {page === 'dashboard' && <Dashboard />}
          {page === 'clients' && <Clients />}
          {page === 'projects' && <Projects />}
          {page === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default App;
