import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, Plus, FileSignature } from "lucide-react";
import { PageHeader, Panel, StatusBadge, StatCard, EmptyState } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { contracts, entityName, fmtMoney, fmtDate, entities, type EntityId } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ContractsIndexPage() {
  const { scope, label } = useEntity();
  const [contractList, setContractList] = useState(contracts);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    counterparty: "",
    type: "FIDIC Red Book",
    entity: "construction" as EntityId,
    project: "PRJ-2026-01",
    value: "18500000",
    risk: "low",
    expiry: "2027-12-31",
  });

  const rows = useMemo(
    () =>
      scope(contractList).filter(
        (c) =>
          `${c.title} ${c.counterparty} ${c.id} ${c.project}`.toLowerCase().includes(q.toLowerCase()) &&
          (status === "all" || c.status === status),
      ),
    [scope, contractList, q, status],
  );

  const total = rows.reduce((s, c) => s + c.value, 0);
  const expiring = rows.filter((c) => c.status === "expiring");

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter contract title");
      return;
    }

    const newCtr = {
      id: `CNT-2026-${String(contractList.length + 1).padStart(2, "0")}`,
      title: formData.title,
      counterparty: formData.counterparty || "Apex Subcontracting Ltd",
      type: formData.type,
      entity: formData.entity,
      project: formData.project,
      value: Number(formData.value) || 10_000_000,
      start: "2026-08-17",
      expiry: formData.expiry,
      status: "active" as any,
      risk: formData.risk as any,
      owner: "Group Legal",
    };

    setContractList((prev) => [newCtr, ...prev]);
    toast.success(`Contract Executed: ${newCtr.id}`, {
      description: `${newCtr.title} · Value: $${fmtMoney(newCtr.value)}`,
    });
    setIsModalOpen(false);
    setFormData({
      title: "",
      counterparty: "",
      type: "FIDIC Red Book",
      entity: "construction" as EntityId,
      project: "PRJ-2026-01",
      value: "18500000",
      risk: "low",
      expiry: "2027-12-31",
    });
  };

  return (
    <>
      <PageHeader
        title="Contracts"
        description={`Contract register · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contracts" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            New contract
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Contracts" value={String(rows.length)} sub="in register" />
        <StatCard label="Contract value" value={`$${fmtMoney(total)}`} sub="aggregate" />
        <StatCard label="Expiring in 90 days" value={String(expiring.length)} sub={`$${fmtMoney(expiring.reduce((s, c) => s + c.value, 0))} exposure`} tone="warning" />
        <StatCard label="High risk" value={String(rows.filter((c) => c.risk === "high" || c.risk === "critical").length)} sub="require review" tone="danger" />
      </div>

      <Panel className="mt-4" bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search contracts, counterparties or projects" className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none focus:border-primary/50" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm outline-none focus:border-primary/50">
            <option value="all">All statuses</option>
            {["active", "expiring", "draft", "under-review", "closed"].map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
          </select>
        </div>
        {rows.length === 0 ? (
          <div className="p-6"><EmptyState title="No contracts match your filters" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Contract</th>
                  <th className="px-3 py-2.5 font-medium">Counterparty</th>
                  <th className="px-3 py-2.5 font-medium">Entity</th>
                  <th className="px-3 py-2.5 font-medium">Project</th>
                  <th className="px-3 py-2.5 text-right font-medium">Value</th>
                  <th className="px-3 py-2.5 font-medium">Expiry</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/50">
                    <td className="px-5 py-3">
                      <Link to={`/contracts/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link>
                      <span className="tabular block text-xs text-muted-foreground">{c.id} · {c.type}</span>
                    </td>
                    <td className="px-3 py-3 text-xs">{c.counterparty}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(c.entity)}</td>
                    <td className="tabular px-3 py-3 text-xs">{c.project}</td>
                    <td className="tabular px-3 py-3 text-right">${fmtMoney(c.value)}</td>
                    <td className="px-3 py-3 text-xs">{fmtDate(c.expiry)}</td>
                    <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3"><StatusBadge status={c.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* CREATE CONTRACT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileSignature className="size-5 text-primary" /> Register Commercial Contract
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register legal agreement, contractor terms, and risk classification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateContract} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Contract Title</label>
              <input
                type="text"
                placeholder="e.g. EPC Turnkey Water Facility Contract"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Counterparty / Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Engineering Ltd"
                  value={formData.counterparty}
                  onChange={(e) => setFormData((f) => ({ ...f, counterparty: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Contract Form / Standard</label>
                <input
                  type="text"
                  placeholder="FIDIC Silver Book"
                  value={formData.type}
                  onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Contract Value ($)</label>
                <input
                  type="number"
                  placeholder="18500000"
                  value={formData.value}
                  onChange={(e) => setFormData((f) => ({ ...f, value: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Risk Profile</label>
                <select
                  value={formData.risk}
                  onChange={(e) => setFormData((f) => ({ ...f, risk: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData((f) => ({ ...f, expiry: e.target.value }))}
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
                Execute Contract
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
