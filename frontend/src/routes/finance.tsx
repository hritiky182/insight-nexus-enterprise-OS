import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, StatCard } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { cashFlow, entityFinancials, projectProfitability, transactions, receivables, payables, budgetVsActual, entityName, fmtMoney, fmtCurrency, fmtDate } from "@/data/mock";

const axis = { stroke: "var(--color-muted-foreground)", fontSize: 11, tickLine: false, axisLine: false };
const tt = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" } };

export default function FinancePage() {
  const { scope, label } = useEntity();
  const rows = scope(transactions);

  return (
    <>
      <PageHeader title="Finance" description={`Financial control · ${label}`} breadcrumbs={[{ label: "Home", to: "/" }, { label: "Finance" }]} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatCard label="Revenue YTD" value="$960M" delta={{ value: "+8.1%", positive: true }} sub="vs prior year" />
        <StatCard label="Expenses YTD" value="$832M" delta={{ value: "+6.4%", positive: false }} sub="vs prior year" />
        <StatCard label="Cash position" value="$203M" sub="incl. 61M facility" tone="success" />
        <StatCard label="Receivables" value="$41.2M" sub="8.1M over 90 days" tone="warning" />
        <StatCard label="Payables" value="$17.1M" sub="1.4M overdue" />
        <StatCard label="EBIT margin" value="13.3%" delta={{ value: "+0.7pp", positive: true }} sub="rolling 12m" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Cash flow" description="Inflow, outflow and net, $M" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cashFlow}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" {...axis} /><YAxis {...axis} />
              <Tooltip {...tt} /><Legend iconType="circle" iconSize={7} />
              <Area type="monotone" dataKey="inflow" stroke="var(--color-chart-3)" fill="var(--color-chart-3)" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="outflow" stroke="var(--color-chart-5)" fill="var(--color-chart-5)" fillOpacity={0.12} strokeWidth={2} />
              <Area type="monotone" dataKey="net" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Budget vs actual" description="Monthly, $M">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetVsActual}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" {...axis} /><YAxis {...axis} />
              <Tooltip {...tt} cursor={{ fill: "var(--color-secondary)" }} />
              <Bar dataKey="budget" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} barSize={10} />
              <Bar dataKey="actual" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Entity financial comparison" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-2 font-medium">Entity</th><th className="px-3 py-2 text-right font-medium">Revenue</th><th className="px-3 py-2 text-right font-medium">Cost</th><th className="px-3 py-2 text-right font-medium">Margin</th><th className="px-5 py-2 text-right font-medium">Cash</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entityFinancials.map((e) => (
                <tr key={e.entity} className="hover:bg-secondary/50">
                  <td className="px-5 py-2.5 font-medium">{e.entity}</td>
                  <td className="tabular px-3 py-2.5 text-right">${e.revenue}M</td>
                  <td className="tabular px-3 py-2.5 text-right">${e.cost}M</td>
                  <td className={`tabular px-3 py-2.5 text-right font-medium ${e.margin < 8 ? "text-warning" : "text-success"}`}>{e.margin}%</td>
                  <td className="tabular px-5 py-2.5 text-right">${e.cash}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Project profitability" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-2 font-medium">Project</th><th className="px-3 py-2 text-right font-medium">Revenue</th><th className="px-3 py-2 text-right font-medium">Cost</th><th className="px-5 py-2 text-right font-medium">Margin</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projectProfitability.map((p) => (
                <tr key={p.project} className="hover:bg-secondary/50">
                  <td className="tabular px-5 py-2.5 font-medium">{p.project}</td>
                  <td className="tabular px-3 py-2.5 text-right">${p.revenue}M</td>
                  <td className="tabular px-3 py-2.5 text-right">${p.cost}M</td>
                  <td className={`tabular px-5 py-2.5 text-right font-medium ${p.margin < 0 ? "text-destructive" : "text-success"}`}>{p.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Receivables ageing" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-2 font-medium">Client</th><th className="px-3 py-2 text-right font-medium">Current</th><th className="px-3 py-2 text-right font-medium">30d</th><th className="px-3 py-2 text-right font-medium">60d</th><th className="px-5 py-2 text-right font-medium">90d+</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {receivables.map((r) => (
                <tr key={r.client} className="hover:bg-secondary/50">
                  <td className="px-5 py-2.5">{r.client}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.current)}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.d30)}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.d60)}</td>
                  <td className={`tabular px-5 py-2.5 text-right ${r.d90 > 0 ? "font-medium text-destructive" : ""}`}>${fmtMoney(r.d90)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Payables ageing" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-2 font-medium">Supplier</th><th className="px-3 py-2 text-right font-medium">Current</th><th className="px-3 py-2 text-right font-medium">30d</th><th className="px-3 py-2 text-right font-medium">60d</th><th className="px-5 py-2 text-right font-medium">90d+</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payables.map((r) => (
                <tr key={r.supplier} className="hover:bg-secondary/50">
                  <td className="px-5 py-2.5">{r.supplier}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.current)}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.d30)}</td>
                  <td className="tabular px-3 py-2.5 text-right">${fmtMoney(r.d60)}</td>
                  <td className="tabular px-5 py-2.5 text-right">${fmtMoney(r.d90)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel className="mt-4" title="Recent transactions" description={`${rows.length} records in scope`} bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-2.5 font-medium">Reference</th><th className="px-3 py-2.5 font-medium">Date</th><th className="px-3 py-2.5 font-medium">Description</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Project</th><th className="px-3 py-2.5 text-right font-medium">Amount</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/50">
                  <td className="tabular px-5 py-2.5 font-medium">{t.id}</td>
                  <td className="px-3 py-2.5 text-xs">{fmtDate(t.date)}</td>
                  <td className="px-3 py-2.5 text-xs">{t.description}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{entityName(t.entity)}</td>
                  <td className="tabular px-3 py-2.5 text-xs">{t.project}</td>
                  <td className={`tabular px-3 py-2.5 text-right ${t.amount < 0 ? "text-destructive" : "text-success"}`}>{fmtCurrency(t.amount)}</td>
                  <td className="px-5 py-2.5 text-xs">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
