import { Link } from "react-router-dom";
import {
  FolderKanban, Activity, ClipboardList, MessageSquare, ShieldCheck, FileCheck,
  AlertTriangle, CalendarClock, Shield, ArrowRight, UserCheck, CheckCircle2
} from "lucide-react";
import { Panel, StatCard, StatusBadge, ProgressBar, PageHeader } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { useEntity } from "@/components/entity-context";
import {
  projects, alerts, deadlines, approvals, auditTrail, dailySiteLogs,
  rfisAndIssues, hseInspections, fmtMoney, fmtDate, entityName
} from "@/data/mock";

export default function DashboardPage() {
  const { scope, label } = useEntity();
  const visibleProjects = scope(projects).filter((p) => p.entity === "construction" || p.entity === "all");
  const visibleAlerts = alerts;

  const totalProgress = Math.round(
    visibleProjects.reduce((acc, p) => acc + p.progress, 0) / (visibleProjects.length || 1)
  );

  return (
    <>
      {/* 8-Step Construction MVP Flow Interactive Banner */}
      <ConstructionMvpFlowBanner />

      <PageHeader
        title="Management Dashboard & Audit"
        description="Construction Site Execution Visibility, Real-Time Alerts, Controlled Approvals & Complete Auditability"
        actions={
          <div className="flex gap-2">
            <Link
              to="/daily-reporting"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + File Daily Site Log
            </Link>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active Site Projects" value={String(visibleProjects.length)} sub="site operations scope" icon={FolderKanban} to="/projects" />
        <StatCard label="Physical Progress" value={`${totalProgress}%`} delta={{ value: "+4.2%", positive: true }} sub="site execution average" icon={Activity} to="/progress-tracking" tone="neutral" />
        <StatCard label="Daily Site Logs" value={String(dailySiteLogs.length)} sub="filed this week" icon={ClipboardList} to="/daily-reporting" tone="success" />
        <StatCard label="Active RFIs & Issues" value={String(rfisAndIssues.filter(i => i.status !== "Closed").length)} sub="1 critical RFI pending" icon={MessageSquare} to="/issues-rfis" tone="danger" />
        <StatCard label="HSE Compliance" value="94%" sub="ISO 45001 compliant" icon={ShieldCheck} to="/quality-hse" tone="success" />
        <StatCard label="Pending Approvals" value={String(approvals.length)} sub="2 critical sign-offs" icon={FileCheck} to="/documents-approvals" tone="warning" />
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Left Column: Construction Site Execution Visibility */}
        <div className="xl:col-span-2 space-y-6">
          <Panel
            title="Construction Site Execution Visibility"
            description="Live project status, physical progress, site location, and health index"
            bodyClassName="p-0"
            action={
              <Link to="/projects" className="text-xs font-medium text-primary hover:underline">
                View all site projects
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Project Name</th>
                    <th className="px-3 py-2.5 font-medium">Site Manager</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Physical Progress</th>
                    <th className="px-5 py-2.5 text-right font-medium">Site Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <Link to={`/projects/${p.id}`} className="font-semibold text-foreground hover:text-primary">
                          {p.name}
                        </Link>
                        <span className="block text-xs text-muted-foreground">{p.code} • {p.location}</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-foreground font-medium">{p.manager}</td>
                      <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                      <td className="w-44 px-3 py-3"><ProgressBar value={p.progress} /></td>
                      <td className="px-5 py-3 text-right font-bold tabular">
                        <span className={p.health < 60 ? "text-destructive" : p.health < 80 ? "text-amber-500" : "text-emerald-500"}>
                          {p.health}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Audit Trail Log */}
          <Panel
            title="Complete System Auditability (Audit Trail)"
            description="Immutable logs of user actions, approvals, site report submissions, and HSE observations"
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Timestamp</th>
                    <th className="px-3 py-2.5 font-medium">User Actor</th>
                    <th className="px-3 py-2.5 font-medium">Site Role</th>
                    <th className="px-3 py-2.5 font-medium">Action Event</th>
                    <th className="px-5 py-2.5 text-right font-medium">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditTrail.map((aud) => (
                    <tr key={aud.id} className="hover:bg-secondary/30">
                      <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{aud.timestamp}</td>
                      <td className="px-3 py-3 font-semibold text-foreground text-xs">{aud.actor}</td>
                      <td className="px-3 py-3 text-xs">
                        <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
                          {aud.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-foreground">
                        <p className="font-medium">{aud.action}</p>
                        <p className="text-[11px] text-muted-foreground">{aud.details}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                          <CheckCircle2 className="size-3.5" /> Audited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right Column: Attention Required Alerts & Deadlines */}
        <div className="space-y-6">
          <Panel
            title="Site Attention Required"
            description="Critical site delays, permit expiries, and pending approval items"
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {visibleAlerts.map((a) => (
                <li key={a.id}>
                  <Link to="/issues-rfis" className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/60">
                    <AlertTriangle
                      className={
                        a.severity === "critical"
                          ? "mt-0.5 size-4 shrink-0 text-destructive"
                          : "mt-0.5 size-4 shrink-0 text-amber-500"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground">{a.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{a.detail}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Upcoming Site Milestones & Expiries" description="Next 30 days critical dates" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {deadlines.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                  <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{d.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.project} • {fmtDate(d.date)}
                    </p>
                  </div>
                  <span className="tabular rounded bg-secondary px-2 py-0.5 text-[11px] font-bold text-foreground">
                    {d.days}d left
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
