import { Briefcase, Users, FolderKanban, BarChart3, ArrowRight, Database, Shield, Code2 } from 'lucide-react';

type LandingProps = {
  onEnter: () => void;
};

export function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold text-navy-900">SmartCPM</span>
          </div>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Enter Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50/60 to-white" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-navy-100/40 blur-3xl" />
        <div className="absolute left-1/3 top-40 h-48 w-48 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3.5 py-1.5 text-xs font-medium text-navy-700">
              <Code2 className="h-3.5 w-3.5" />
              College OOP Project
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Smart Client &amp; Project Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              A clean, professional system to manage clients, track projects, and visualize reports —
              built for OOP coursework with Supabase and a C++17 console companion.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onEnter}
                className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition hover:bg-navy-800"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-slate-50"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-200 bg-navy-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6">
          {[
            { label: 'Clients', icon: Users },
            { label: 'Projects', icon: FolderKanban },
            { label: 'Reports', icon: BarChart3 },
            { label: 'Supabase DB', icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-center gap-2.5 py-7">
                <Icon className="h-5 w-5 text-navy-300" />
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900">Everything you need in one dashboard</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Four fully featured pages designed for managing clients and projects end to end.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BarChart3,
              title: 'Dashboard',
              desc: 'Total clients, projects, active and completed counts, plus upcoming deadlines at a glance.',
            },
            {
              icon: Users,
              title: 'Clients',
              desc: 'Add, search, edit, and delete client records with name, email, and phone fields.',
            },
            {
              icon: FolderKanban,
              title: 'Projects',
              desc: 'Manage projects with title, budget, deadline, client assignment, and status tracking.',
            },
            {
              icon: BarChart3,
              title: 'Reports',
              desc: 'Visual statistics on project status, budget breakdowns, and per-client summaries.',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 transition group-hover:scale-110">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Status badges showcase */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">Track every project status</h2>
              <p className="mt-3 text-slate-600">
                Each project moves through four clearly defined stages, color-coded throughout the app for instant visual clarity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: 'Not Started', dot: 'bg-slate-400', pill: 'bg-slate-100 text-slate-700' },
                  { label: 'In Progress', dot: 'bg-blue-500', pill: 'bg-blue-100 text-blue-700' },
                  { label: 'On Hold', dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700' },
                  { label: 'Completed', dot: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700' },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${s.pill}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                {[
                  { name: 'Website Redesign', status: 'In Progress', budget: '$8,500', dot: 'bg-blue-500', bar: 'w-3/4 bg-blue-500' },
                  { name: 'Mobile App MVP', status: 'Completed', budget: '$15,000', dot: 'bg-emerald-500', bar: 'w-full bg-emerald-500' },
                  { name: 'Brand Identity', status: 'On Hold', budget: '$4,200', dot: 'bg-amber-500', bar: 'w-2/5 bg-amber-500' },
                  { name: 'API Integration', status: 'Not Started', budget: '$6,000', dot: 'bg-slate-400', bar: 'w-0 bg-slate-400' },
                ].map((p) => (
                  <div key={p.name} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} />
                        <span className="text-sm font-medium text-navy-900">{p.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">{p.budget}</span>
                    </div>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${p.bar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {[
            {
              icon: Database,
              title: 'Supabase Database',
              desc: 'Clients and projects are stored in Supabase with row-level security, keeping data persistent and accessible from both the web app and the C++ console companion.',
            },
            {
              icon: Shield,
              title: 'Secure API Ready',
              desc: 'The same client and project records can be accessed by a C++17 console application through the Supabase REST API, keeping the OOP implementation as a separate required part.',
            },
            {
              icon: Code2,
              title: 'C++17 OOP Companion',
              desc: 'A separate C++17 console app maps Client and Project to encapsulated classes, reading the same database records through the secure API endpoint.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to manage your projects?</h2>
          <p className="mx-auto mt-4 max-w-lg text-navy-300">
            Jump into the dashboard to start adding clients and tracking your projects today.
          </p>
          <button
            onClick={onEnter}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-lg transition hover:bg-navy-50"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-navy-900">SmartCPM</span>
          </div>
          <p className="text-sm text-slate-500">
            Smart Client &amp; Project Management System — College OOP Project
          </p>
          <p className="text-xs text-slate-400">React + Supabase + C++17</p>
        </div>
      </footer>
    </div>
  );
}
