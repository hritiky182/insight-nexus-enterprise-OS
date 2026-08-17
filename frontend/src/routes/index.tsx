import { Link } from "react-router-dom";
import {
  Briefcase, DollarSign, Wallet, ShieldAlert, CheckSquare, TrendingUp,
  ArrowRight, AlertTriangle, CalendarClock, Activity,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Panel, StatCard, StatusBadge, ProgressBar, PageHeader } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import {
  projects, alerts, deadlines, activity, portfolioByEntity, projectStatusMix,
  budgetVsActual, revenueCostTrend, riskDistribution, entityFinancials,
  contracts, approvals, opportunities, fmtMoney, fmtDate, entityName,
} from "@/data/mock";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    boxShadow: "var(--shadow-raised)",
  },
};

export default function DashboardPage() {
  const { scope, label, isGroup } = useEntity();
  const visibleProjects = scope(projects);
  const visibleAlerts = alerts;
  const portfolio = visibleProjects.reduce((s, p) => s + p.budget, 0);
  const actual = visibleProjects.reduce((s, p) => s + p.actual, 0);
  const openRisks = 14;
  const pendingApprovals = scope(approvals).length;
  const pipeline = scope(opportunities)
    .filter((o) => o.stage !== "Won/Lost")
    .reduce((s, o) => s + o.value, 0);

  return (
    <>
      <PageHeader
        title="Executive Control Tower"
        description={`${label} · consolidated position as at 17 August 2026`}
        actions={
          <>
            <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-secondary">
              Export briefing
            </button>
            <Link
              to="/ai"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ask AI
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Active projects" value={String(visibleProjects.filter((p) => p.status !== "completed").length)} sub="across portfolio" icon={Briefcase} to="/projects" />
        <StatCard label="Portfolio value" value={`$${fmtMoney(portfolio)}`} delta={{ value: "+6.4%", positive: true }} sub="vs last quarter" icon={DollarSign} to="/projects" />
        <StatCard label="Budget vs actual" value={`$${fmtMoney(actual)}`} delta={{ value: "+2.1%", positive: false }} sub="above plan" icon={TrendingUp} to="/finance" />
        <StatCard label="Cash position" value="$203.0M" delta={{ value: "+19.0M", positive: true }} sub="net August" icon={Wallet} to="/finance" tone="success" />
        <StatCard label="Open risks" value={String(openRisks)} sub="3 critical" icon={ShieldAlert} to="/risks" tone="danger" />
        <StatCard label="Pending approvals" value={String(pendingApprovals)} sub="2 critical" icon={CheckSquare} to="/approvals" tone="warning" />
        <StatCard label="Opportunities" value={`$${fmtMoney(pipeline)}`} sub="weighted pipeline" icon={TrendingUp} to="/business-development" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Attention required"
          description="Critical decisions, delayed projects, contract exposure and financial exceptions"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Link to="/risks" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {visibleAlerts.map((a) => (
              <li key={a.id}>
                <Link to={a.link} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-secondary/60">
                  <AlertTriangle
                    className={
                      a.severity === "critical"
                        ? "mt-0.5 size-4 shrink-0 text-destructive"
                        : a.severity === "high"
                          ? "mt-0.5 size-4 shrink-0 text-warning"
                          : "mt-0.5 size-4 shrink-0 text-muted-foreground"
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                      <StatusBadge status={a.severity} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming deadlines" description="Next 45 days" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {deadlines.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.project} · {fmtDate(d.date)}
                  </p>
                </div>
                <span
                  className={
                    d.days <= 14
                      ? "tabular rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive"
                      : "tabular rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  }
                >
                  {d.days}d
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Portfolio by entity" description="Committed value, $M">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={portfolioByEntity} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="entity" width={92} {...axis} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
              <Bar dataKey="value" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Project status" description="Distribution across the portfolio">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={projectStatusMix} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2} stroke="var(--color-card)">
                {projectStatusMix.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ fontSize: 11, color: "var(--color-muted-foreground)" }}>{v}</span>} />
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Budget vs actual" description="Monthly spend, $M">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetVsActual}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ fontSize: 11, color: "var(--color-muted-foreground)" }}>{v}</span>} />
              <Bar dataKey="budget" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="actual" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Revenue & cost trend" description="Rolling 7 months, $M" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={revenueCostTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ fontSize: 11, color: "var(--color-muted-foreground)" }}>{v}</span>} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#rev)" />
              <Line type="monotone" dataKey="cost" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="margin" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Risk distribution" description="Open risks by category">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={riskDistribution}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="category" {...axis} interval={0} angle={-20} textAnchor="end" height={54} />
              <YAxis {...axis} allowDecimals={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
              <Bar dataKey="count" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Project health overview"
          description="Delivery status by project"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Link to="/projects" className="text-xs font-medium text-primary hover:underline">
              Open projects
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2 font-medium">Project</th>
                  <th className="px-3 py-2 font-medium">Entity</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Progress</th>
                  <th className="px-3 py-2 text-right font-medium">Budget</th>
                  <th className="px-5 py-2 text-right font-medium">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleProjects.slice(0, 7).map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/50">
                    <td className="px-5 py-2.5">
                      <Link to={`/projects/${p.id}`} className="font-medium text-foreground hover:text-primary">
                        {p.name}
                      </Link>
                      <span className="tabular block text-xs text-muted-foreground">{p.code}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{entityName(p.entity)}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={p.status} /></td>
                    <td className="w-40 px-3 py-2.5"><ProgressBar value={p.progress} /></td>
                    <td className="tabular px-3 py-2.5 text-right">${fmtMoney(p.budget)}</td>
                    <td className="tabular px-5 py-2.5 text-right font-medium">
                      <span className={p.health < 60 ? "text-destructive" : p.health < 80 ? "text-warning" : "text-success"}>
                        {p.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Recent activity" description="Across all modules" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {activity.slice(0, 7).map((a) => (
              <li key={a.id} className="flex gap-3 px-5 py-2.5">
                <Activity className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-foreground">
                    <span className="font-medium">{a.actor}</span> {a.action}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.target} · {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Entity performance"
          description={isGroup ? "Consolidated comparison — visible to group executives" : `Scoped to ${label}`}
          bodyClassName="p-0"
        >
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Entity</th>
                <th className="px-3 py-2 text-right font-medium">Revenue</th>
                <th className="px-3 py-2 text-right font-medium">Cost</th>
                <th className="px-3 py-2 text-right font-medium">Margin</th>
                <th className="px-5 py-2 text-right font-medium">Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entityFinancials.map((e) => (
                <tr key={e.entity} className="hover:bg-secondary/50">
                  <td className="px-5 py-2.5 font-medium">{e.entity}</td>
                  <td className="tabular px-3 py-2.5 text-right">${e.revenue}M</td>
                  <td className="tabular px-3 py-2.5 text-right">${e.cost}M</td>
                  <td className={`tabular px-3 py-2.5 text-right font-medium ${e.margin < 8 ? "text-warning" : "text-success"}`}>
                    {e.margin}%
                  </td>
                  <td className="tabular px-5 py-2.5 text-right">${e.cash}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel
          title="Contract exposure"
          description="Highest-value agreements requiring oversight"
          bodyClassName="p-0"
          action={
            <Link to="/contracts" className="text-xs font-medium text-primary hover:underline">
              Contract register
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {scope(contracts).slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <Link to={`/contracts/${c.id}`} className="block truncate text-sm font-medium hover:text-primary">
                    {c.title}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.counterparty} · expires {fmtDate(c.expiry)}
                  </p>
                </div>
                <span className="tabular text-sm font-medium">${fmtMoney(c.value)}</span>
                <StatusBadge status={c.risk} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
