import { useMemo, useState } from "react";
import { Search, Plus, TrendingUp } from "lucide-react";
import { PageHeader, Panel, StatusBadge, StatCard } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { opportunities, pipelineStages, entityName, fmtMoney, fmtDate, entities, type EntityId } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function BusinessDevelopmentPage() {
  const { scope, label } = useEntity();
  const [opportunityList, setOpportunityList] = useState(opportunities);
  const [q, setQ] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    sector: "Infrastructure",
    entity: "bizdev" as EntityId,
    value: "25000000",
    probability: 65,
    stage: "Proposal",
    owner: "K. Addo",
  });

  const rows = useMemo(
    () => scope(opportunityList).filter((o) => `${o.name} ${o.client} ${o.owner}`.toLowerCase().includes(q.toLowerCase())),
    [scope, opportunityList, q],
  );

  const open = rows.filter((o) => o.stage !== "Won/Lost");
  const total = open.reduce((s, o) => s + o.value, 0);
  const weighted = open.reduce((s, o) => s + (o.value * o.probability) / 100, 0);

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter opportunity name");
      return;
    }

    const newOpp = {
      id: `opp-${Date.now()}`,
      name: formData.name,
      client: formData.client || "Global Infrastructure Authority",
      sector: formData.sector,
      entity: formData.entity,
      value: Number(formData.value) || 10_000_000,
      probability: Number(formData.probability) || 50,
      stage: formData.stage,
      close: "2026-11-30",
      owner: formData.owner || "Business Development Lead",
    };

    setOpportunityList((prev) => [newOpp, ...prev]);
    toast.success(`Opportunity Created: ${newOpp.name}`, {
      description: `Value: $${fmtMoney(newOpp.value)} · Stage: ${newOpp.stage}`,
    });
    setIsModalOpen(false);
    setFormData({
      name: "",
      client: "",
      sector: "Infrastructure",
      entity: "bizdev" as EntityId,
      value: "25000000",
      probability: 65,
      stage: "Proposal",
      owner: "K. Addo",
    });
  };

  return (
    <>
      <PageHeader
        title="Business Development"
        description={`Opportunity pipeline · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Business Development" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            New opportunity
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open opportunities" value={String(open.length)} sub="active pursuits" />
        <StatCard label="Pipeline value" value={`$${fmtMoney(total)}`} sub="unweighted" />
        <StatCard label="Weighted value" value={`$${fmtMoney(weighted)}`} delta={{ value: "+9.2%", positive: true }} sub="vs last quarter" />
        <StatCard label="Win rate (12m)" value="43%" sub="18 of 42 pursuits" tone="success" />
      </div>

      <div className="mt-4 grid gap-3 overflow-x-auto lg:grid-cols-6">
        {pipelineStages.map((stage) => {
          const items = rows.filter((o) => o.stage === stage);
          return (
            <div key={stage} className="min-w-56 rounded-lg border border-border bg-secondary/40 p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-xs font-semibold text-foreground">{stage}</p>
                <span className="tabular rounded-full bg-surface px-1.5 text-[11px] text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((o) => (
                  <article key={o.id} className="rounded-md border border-border bg-card p-3 shadow-[var(--shadow-card)]">
                    <p className="text-[13px] leading-snug font-medium">{o.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{o.client}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="tabular text-sm font-semibold">${fmtMoney(o.value)}</span>
                      <span className="tabular rounded bg-accent px-1.5 py-px text-[11px] font-medium text-accent-foreground">{o.probability}%</span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{o.owner} · {fmtDate(o.close)}</p>
                  </article>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">No opportunities</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Panel className="mt-4" bodyClassName="p-0">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search opportunities"
              className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none focus:border-primary/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 font-medium">Opportunity</th>
                <th className="px-3 py-2.5 font-medium">Counterparty</th>
                <th className="px-3 py-2.5 font-medium">Entity</th>
                <th className="px-3 py-2.5 font-medium">Stage</th>
                <th className="px-3 py-2.5 text-right font-medium">Est. value</th>
                <th className="px-3 py-2.5 text-right font-medium">Probability</th>
                <th className="px-3 py-2.5 font-medium">Expected close</th>
                <th className="px-5 py-2.5 font-medium">Responsible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/50">
                  <td className="px-5 py-3">
                    <p className="font-medium">{o.name}</p>
                    <p className="tabular text-xs text-muted-foreground">{o.id} · {o.sector}</p>
                  </td>
                  <td className="px-3 py-3 text-xs">{o.client}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(o.entity)}</td>
                  <td className="px-3 py-3"><StatusBadge status={o.stage} /></td>
                  <td className="tabular px-3 py-3 text-right">${fmtMoney(o.value)}</td>
                  <td className="tabular px-3 py-3 text-right">{o.probability}%</td>
                  <td className="px-3 py-3 text-xs">{fmtDate(o.close)}</td>
                  <td className="px-5 py-3 text-xs">{o.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* CREATE OPPORTUNITY MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <TrendingUp className="size-5 text-primary" /> Register Business Opportunity
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add new tender pursuit or concession opportunity to pipeline.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOpportunity} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Opportunity Title</label>
              <input
                type="text"
                placeholder="e.g. Metro Rail Extension Tender"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Client / Authority</label>
                <input
                  type="text"
                  placeholder="e.g. National Rail Authority"
                  value={formData.client}
                  onChange={(e) => setFormData((f) => ({ ...f, client: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Target Entity</label>
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
                <label className="block text-xs font-semibold text-foreground mb-1">Est. Contract Value ($)</label>
                <input
                  type="number"
                  placeholder="25000000"
                  value={formData.value}
                  onChange={(e) => setFormData((f) => ({ ...f, value: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Win Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData((f) => ({ ...f, probability: Number(e.target.value) }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Pipeline Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData((f) => ({ ...f, stage: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {pipelineStages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Pursuit Lead</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData((f) => ({ ...f, owner: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
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
                Save Opportunity
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
