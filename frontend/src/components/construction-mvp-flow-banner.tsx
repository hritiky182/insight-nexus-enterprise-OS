import { Link, useLocation } from "react-router-dom";
import {
  FolderKanban, Users, ClipboardList, Activity, MessageSquare,
  ShieldCheck, FileCheck, LayoutDashboard, ChevronRight, Layers, Shield,
  CheckCircle2, HardHat, FileText, BarChart3, Eye, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export const mvpSteps = [
  {
    step: 1,
    title: "Project & Site Setup",
    to: "/projects",
    icon: FolderKanban,
    bullets: ["Project", "Entity", "Team", "Milestones"],
  },
  {
    step: 2,
    title: "Site Users & Access",
    to: "/site-users",
    icon: Users,
    bullets: ["PM", "Site Engineer", "Supervisor", "HSE/Quality"],
  },
  {
    step: 3,
    title: "Daily Site Reporting",
    to: "/daily-reporting",
    icon: ClipboardList,
    bullets: ["Progress", "Work Done", "Photos", "Notes"],
  },
  {
    step: 4,
    title: "Progress Tracking",
    to: "/progress-tracking",
    icon: Activity,
    bullets: ["% Complete", "Milestones", "Vehicle Pick/Drop", "Location", "Delays"],
  },
  {
    step: 5,
    title: "Issues / Tasks / RFIs",
    to: "/issues-rfis",
    icon: MessageSquare,
    bullets: ["Raise", "Assign", "Track", "Close"],
  },
  {
    step: 6,
    title: "Inspection / Quality / HSE",
    to: "/quality-hse",
    icon: ShieldCheck,
    bullets: ["Observations", "Actions", "Compliance"],
  },
  {
    step: 7,
    title: "Documents & Approvals",
    to: "/documents-approvals",
    icon: FileCheck,
    bullets: ["Drawings", "Submittals", "Review", "Approve"],
  },
  {
    step: 8,
    title: "Management Dashboard & Audit",
    to: "/",
    icon: LayoutDashboard,
    bullets: ["Project Status", "Alerts", "Pending Approvals", "Audit Trail"],
  },
];

export const platformFoundations = [
  { label: "Multi-Entity Setup", icon: Layers },
  { label: "Role-Based Access", icon: Shield },
  { label: "Project-Level Access", icon: Lock },
  { label: "Document Control", icon: FileText },
  { label: "Configurable Workflows", icon: BarChart3 },
  { label: "Complete Auditability", icon: CheckCircle2 },
];

export const mvpOutcomes = [
  { label: "Construction site execution visibility", icon: Eye },
  { label: "Controlled approvals & records", icon: FileCheck },
  { label: "Issue, quality & HSE tracking", icon: HardHat },
  { label: "Group-level authorised oversight", icon: Users },
  { label: "Future-ready enterprise foundation", icon: BarChart3 },
];

export function ConstructionMvpFlowBanner({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="mb-6 rounded-xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-5 py-4 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30 font-bold text-lg">
            ▲
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Enterprise Operating System
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Construction Site Operations MVP Flow
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-300 tracking-wide uppercase">
            Horizon 1 MVP
          </span>
        </div>
      </div>

      {/* 8-Step Interactive Flow Grid */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {mvpSteps.map((s, idx) => {
            const isActive =
              s.to === "/" ? currentPath === "/" : currentPath.startsWith(s.to);
            const Icon = s.icon;

            return (
              <div key={s.step} className="relative group">
                <Link
                  to={s.to}
                  className={cn(
                    "flex flex-col h-full rounded-lg border p-3 transition-all duration-200 hover:-translate-y-0.5",
                    isActive
                      ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10 ring-1 ring-primary/40"
                      : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/25"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/10 text-white group-hover:bg-white/20"
                      )}
                    >
                      {s.step}
                    </span>
                    <Icon className={cn("size-4", isActive ? "text-primary" : "text-slate-400")} />
                  </div>

                  <h3 className="text-xs font-bold leading-snug mb-2 line-clamp-2">
                    {s.title}
                  </h3>

                  {!compact && (
                    <ul className="mt-auto space-y-0.5 text-[10px] text-slate-300 border-t border-white/10 pt-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-1 truncate">
                          <span className="text-slate-400">•</span>
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>

                {/* Arrow connector between steps on large screens */}
                {idx < mvpSteps.length - 1 && (
                  <ChevronRight className="hidden xl:block absolute -right-2.5 top-1/2 -translate-y-1/2 size-4 text-white/30 z-10 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Foundations & Outcomes Bar */}
        {!compact && (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            {/* Foundations */}
            <div className="lg:col-span-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="size-3.5" /> Platform Foundations
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {platformFoundations.map((pf) => {
                  const PfIcon = pf.icon;
                  return (
                    <div
                      key={pf.label}
                      className="flex items-center gap-1.5 rounded border border-white/5 bg-black/20 px-2 py-1.5 text-[11px] text-slate-200 font-medium"
                    >
                      <PfIcon className="size-3 text-blue-400 shrink-0" />
                      <span className="truncate">{pf.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outcomes */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
              <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> MVP Outcomes
              </p>
              <ul className="space-y-1 text-[11px] text-slate-200">
                {mvpOutcomes.slice(0, 3).map((oc) => (
                  <li key={oc.label} className="flex items-center gap-1.5 truncate">
                    <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">{oc.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Tagline */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-300 font-medium">
          <span className="text-primary">🎯</span>
          <span>Focus: construction site operations first, with enterprise foundation for future expansion.</span>
        </div>
      </div>
    </div>
  );
}
