import { useState } from "react";
import { PageHeader, Panel, StatusBadge, StatCard } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntity } from "@/components/entity-context";
import { risks, compliance, correctiveActions, alerts, entityName, fmtDate, entities, type EntityId } from "@/data/mock";
import { Plus, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function RisksPage() {
  const { scope, label } = useEntity();
  const [riskList, setRiskList] = useState(risks);
  const [tab, setTab] = useState("register");
  const rows = scope(riskList);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project: "PRJ-2026-01",
    category: "Commercial",
    entity: "construction" as EntityId,
    probability: 3,
    impact: 4,
    mitigation: "Establish liquidated damages cap & escrow reserve.",
    owner: "Risk Manager",
  });

  const handleLogRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter risk title");
      return;
    }

    const newRisk = {
      id: `RSK-2026-${String(riskList.length + 1).padStart(2, "0")}`,
      title: formData.title,
      project: formData.project,
      category: formData.category,
      entity: formData.entity,
      probability: Number(formData.probability),
      impact: Number(formData.impact),
      mitigation: formData.mitigation,
      owner: formData.owner,
      due: "2026-10-15",
      status: "open" as any,
    };

    setRiskList((prev) => [newRisk, ...prev]);
    toast.success(`Risk Logged: ${newRisk.id}`, {
      description: `${newRisk.title} · Score: ${newRisk.probability * newRisk.impact}`,
    });
    setIsModalOpen(false);
    setFormData({
      title: "",
      project: "PRJ-2026-01",
      category: "Commercial",
      entity: "construction" as EntityId,
      probability: 3,
      impact: 4,
      mitigation: "Establish liquidated damages cap & escrow reserve.",
      owner: "Risk Manager",
    });
  };

  return (
    <>
      <PageHeader
        title="Risks & Compliance"
        description={`Assurance overview · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Risks & Compliance" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            Log new risk
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open risks" value={String(rows.filter((r) => r.status !== "closed").length)} sub="under management" />
        <StatCard label="High exposure" value={String(rows.filter((r) => r.probability * r.impact >= 12).length)} sub="score 12 or above" tone="danger" />
        <StatCard label="Expiring permits" value={String(compliance.filter((c) => c.status !== "valid").length)} sub="within 90 days" tone="warning" />
        <StatCard label="Corrective actions" value={String(correctiveActions.length)} sub="open items" />
      </div>

      <div className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="register">Risk register</TabsTrigger>
            <TabsTrigger value="matrix">Risk matrix</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="actions">Corrective actions</TabsTrigger>
            <TabsTrigger value="alerts">Critical alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-4">
            <Panel bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                    <tr><th className="px-5 py-2.5 font-medium">Risk</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 text-center font-medium">P</th><th className="px-3 py-2.5 text-center font-medium">I</th><th className="px-3 py-2.5 text-center font-medium">Score</th><th className="px-3 py-2.5 font-medium">Owner</th><th className="px-3 py-2.5 font-medium">Due</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((r) => {
                      const score = r.probability * r.impact;
                      return (
                        <tr key={r.id} className="hover:bg-secondary/50">
                          <td className="px-5 py-3"><p className="font-medium">{r.title}</p><p className="text-xs text-muted-foreground">{r.id} · {r.project} · {r.mitigation}</p></td>
                          <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(r.entity)}</td>
                          <td className="px-3 py-3 text-xs">{r.category}</td>
                          <td className="tabular px-3 py-3 text-center">{r.probability}</td>
                          <td className="tabular px-3 py-3 text-center">{r.impact}</td>
                          <td className="px-3 py-3 text-center"><span className={`tabular rounded px-1.5 py-0.5 text-xs font-semibold ${score >= 16 ? "bg-destructive/10 text-destructive" : score >= 9 ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success"}`}>{score}</span></td>
                          <td className="px-3 py-3 text-xs">{r.owner}</td>
                          <td className="px-3 py-3 text-xs">{fmtDate(r.due)}</td>
                          <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="matrix" className="mt-4">
            <Panel title="Probability / impact matrix" description="Count of open risks by cell">
              <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1 text-xs">
                <div />
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="pb-1 text-center text-muted-foreground">Impact {i}</div>)}
                {[5, 4, 3, 2, 1].map((p) => (
                  <div key={`row-${p}`} className="contents">
                    <div className="pr-2 text-right leading-[3.5rem] text-muted-foreground">Prob {p}</div>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const cell = rows.filter((r) => r.probability === p && r.impact === i && r.status !== "closed");
                      const score = p * i;
                      return (
                        <div key={`${p}-${i}`} className={`flex h-14 items-center justify-center rounded border border-border font-semibold ${score >= 16 ? "bg-destructive/15 text-destructive" : score >= 9 ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success"}`}>
                          {cell.length || ""}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="compliance" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Obligation</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Authority</th><th className="px-3 py-2.5 font-medium">Expiry</th><th className="px-3 py-2.5 font-medium">Owner</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scope(compliance).map((c) => (
                    <tr key={c.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3"><p className="font-medium">{c.title}</p><p className="tabular text-xs text-muted-foreground">{c.id}</p></td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(c.entity)}</td>
                      <td className="px-3 py-3 text-xs">{c.authority}</td>
                      <td className="px-3 py-3 text-xs">{fmtDate(c.expiry)}</td>
                      <td className="px-3 py-3 text-xs">{c.owner}</td>
                      <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <Panel bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {correctiveActions.map((a) => (
                  <li key={a.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium">{a.title}</p><p className="tabular text-xs text-muted-foreground">{a.id} · {a.owner} · due {fmtDate(a.due)}</p></div>
                    <StatusBadge status={a.severity} /><StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            </Panel>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <Panel bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {alerts.map((a) => (
                  <li key={a.id} className="px-5 py-3">
                    <div className="flex items-center gap-2"><p className="text-sm font-medium">{a.title}</p><StatusBadge status={a.severity} /></div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>

      {/* LOG RISK MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <ShieldAlert className="size-5 text-primary" /> Log Enterprise Risk Event
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register risk item, probability/impact rating, and mitigation controls.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogRisk} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Risk Title / Threat Event</label>
              <input
                type="text"
                placeholder="e.g. Foreign Exchange Volatility Risk"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Risk Category</label>
                <input
                  type="text"
                  placeholder="Commercial / Geo-technical"
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Owning Entity</label>
                <select
                  value={formData.entity}
                  onChange={(e) => setFormData((f) => ({ ...f, entity: e.target.value as EntityId }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Probability Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.probability}
                  onChange={(e) => setFormData((f) => ({ ...f, probability: Number(e.target.value) }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Impact Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.impact}
                  onChange={(e) => setFormData((f) => ({ ...f, impact: Number(e.target.value) }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Mitigation Strategy / Control</label>
              <textarea
                rows={2}
                placeholder="Describe key mitigation controls and risk transfer strategy…"
                value={formData.mitigation}
                onChange={(e) => setFormData((f) => ({ ...f, mitigation: e.target.value }))}
                className="w-full rounded-md border border-border bg-background p-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Log Risk Item
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
