import { useState } from "react";
import { PageHeader, Panel, StatusBadge, StatCard, ProgressBar } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntity } from "@/components/entity-context";
import { purchaseRequests, purchaseOrders, suppliers, tenders, entityName, fmtMoney, fmtDate, entities, type EntityId } from "@/data/mock";
import { Plus, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const flow = ["Request", "Approval", "Sourcing", "Evaluation", "PO", "Delivery", "Invoice"];

export default function ProcurementPage() {
  const { scope, label } = useEntity();
  const [requestList, setRequestList] = useState(purchaseRequests);
  const [tab, setTab] = useState("requests");
  const requests = scope(requestList);
  const orders = scope(purchaseOrders);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project: "PRJ-2026-01",
    entity: "construction" as EntityId,
    supplier: "Universal Materials Ltd",
    amount: "450000",
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter request title");
      return;
    }

    const newReq = {
      id: `PR-2026-${String(requestList.length + 1).padStart(2, "0")}`,
      title: formData.title,
      project: formData.project,
      entity: formData.entity,
      supplier: formData.supplier,
      amount: Number(formData.amount) || 100_000,
      stage: "Sourcing",
      requester: "Procurement Lead",
      date: "2026-08-17",
      status: "pending" as any,
    };

    setRequestList((prev) => [newReq, ...prev]);
    toast.success(`Purchase Request Logged: ${newReq.id}`, {
      description: `${newReq.title} · Amount: $${fmtMoney(newReq.amount)}`,
    });
    setIsModalOpen(false);
    setFormData({
      title: "",
      project: "PRJ-2026-01",
      entity: "construction" as EntityId,
      supplier: "Universal Materials Ltd",
      amount: "450000",
    });
  };

  return (
    <>
      <PageHeader
        title="Procurement"
        description={`Sourcing and supply chain · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Procurement" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            New purchase request
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open requests" value={String(requests.filter((r) => r.status === "pending").length)} sub="awaiting action" tone="warning" />
        <StatCard label="Committed spend" value={`$${fmtMoney(orders.reduce((s, o) => s + o.amount, 0))}`} sub="active purchase orders" />
        <StatCard label="Approved suppliers" value={String(suppliers.filter((s) => s.status === "Approved").length)} sub={`${suppliers.length} registered`} />
        <StatCard label="Avg. on-time delivery" value={`${Math.round(suppliers.reduce((s, x) => s + x.onTime, 0) / suppliers.length)}%`} sub="rolling 12 months" tone="success" />
      </div>

      <Panel className="mt-4" title="Procurement workflow" description="Standard request-to-invoice lifecycle">
        <div className="flex flex-wrap items-center gap-2">
          {flow.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium">{i + 1}. {step}</span>
              {i < flow.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="requests">Purchase requests</TabsTrigger>
            <TabsTrigger value="orders">Purchase orders</TabsTrigger>
            <TabsTrigger value="tenders">Tender evaluation</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Request</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Supplier</th><th className="px-3 py-2.5 font-medium">Stage</th><th className="px-3 py-2.5 text-right font-medium">Amount</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3"><p className="font-medium">{r.title}</p><p className="tabular text-xs text-muted-foreground">{r.id} · {r.project} · {fmtDate(r.date)}</p></td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(r.entity)}</td>
                      <td className="px-3 py-3 text-xs">{r.supplier}</td>
                      <td className="px-3 py-3 text-xs">{r.stage}</td>
                      <td className="tabular px-3 py-3 text-right">${fmtMoney(r.amount)}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">PO</th><th className="px-3 py-2.5 font-medium">Supplier</th><th className="px-3 py-2.5 font-medium">Project</th><th className="px-3 py-2.5 font-medium">Delivery</th><th className="px-3 py-2.5 text-right font-medium">Amount</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-secondary/50">
                      <td className="tabular px-5 py-3 font-medium">{o.id}</td>
                      <td className="px-3 py-3 text-xs">{o.supplier}</td>
                      <td className="tabular px-3 py-3 text-xs">{o.project}</td>
                      <td className="px-3 py-3 text-xs">{fmtDate(o.delivery)}</td>
                      <td className="tabular px-3 py-3 text-right">${fmtMoney(o.amount)}</td>
                      <td className="px-5 py-3 text-xs">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="tenders" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Tender</th><th className="px-3 py-2.5 font-medium">Project</th><th className="px-3 py-2.5 text-center font-medium">Bidders</th><th className="px-3 py-2.5 text-right font-medium">Lowest bid</th><th className="px-3 py-2.5 font-medium">Recommended</th><th className="px-3 py-2.5 text-right font-medium">Score</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tenders.map((t) => (
                    <tr key={t.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3"><p className="font-medium">{t.title}</p><p className="tabular text-xs text-muted-foreground">{t.id}</p></td>
                      <td className="tabular px-3 py-3 text-xs">{t.project}</td>
                      <td className="tabular px-3 py-3 text-center">{t.bidders}</td>
                      <td className="tabular px-3 py-3 text-right">${fmtMoney(t.lowest)}</td>
                      <td className="px-3 py-3 text-xs">{t.recommended}</td>
                      <td className="tabular px-3 py-3 text-right">{t.score}</td>
                      <td className="px-5 py-3 text-xs">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="suppliers" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Supplier</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 text-right font-medium">Spend</th><th className="px-3 py-2.5 font-medium">On-time</th><th className="px-3 py-2.5 font-medium">Quality</th><th className="px-3 py-2.5 text-right font-medium">Rating</th><th className="px-5 py-2.5 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3"><p className="font-medium">{s.name}</p><p className="tabular text-xs text-muted-foreground">{s.id} · {s.contracts} contracts</p></td>
                      <td className="px-3 py-3 text-xs">{s.category}</td>
                      <td className="tabular px-3 py-3 text-right">${fmtMoney(s.spend)}</td>
                      <td className="w-32 px-3 py-3"><ProgressBar value={s.onTime} tone={s.onTime < 70 ? "danger" : "success"} /></td>
                      <td className="w-32 px-3 py-3"><ProgressBar value={s.quality} /></td>
                      <td className="tabular px-3 py-3 text-right font-medium">{s.rating}</td>
                      <td className="px-5 py-3"><StatusBadge status={s.status === "Approved" ? "approved" : "under-review"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>

      {/* CREATE PURCHASE REQUEST MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <ShoppingCart className="size-5 text-primary" /> Create Purchase Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Requisition materials, equipment, or sub-contractor services.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRequest} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Requisition Title</label>
              <input
                type="text"
                placeholder="e.g. High-Yield Structural Steel Beam Requisition"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Project Reference</label>
                <input
                  type="text"
                  placeholder="PRJ-2026-01"
                  value={formData.project}
                  onChange={(e) => setFormData((f) => ({ ...f, project: e.target.value }))}
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
                <label className="block text-xs font-semibold text-foreground mb-1">Preferred Supplier</label>
                <input
                  type="text"
                  placeholder="Universal Materials Ltd"
                  value={formData.supplier}
                  onChange={(e) => setFormData((f) => ({ ...f, supplier: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Estimated Cost ($)</label>
                <input
                  type="number"
                  placeholder="450000"
                  value={formData.amount}
                  onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
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
                Submit Requisition
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
