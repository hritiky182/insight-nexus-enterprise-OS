import { useState, useMemo } from "react";
import { PageHeader, Panel, StatusBadge, StatCard } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { useAuth } from "@/components/auth-context";
import {
  approvals,
  entityName,
  fmtCurrency,
  fmtMoney,
  fmtDate,
  type Approval,
} from "@/data/mock";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ApprovalsPage() {
  const { scope, label } = useEntity();
  const { user } = useAuth();
  const [items, setItems] = useState<Approval[]>(approvals);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Modal State
  const [selectedItem, setSelectedItem] = useState<Approval | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userDoALimit = user?.approvalLimit ?? 0;

  const scopedItems = scope(items);

  const filteredItems = useMemo(() => {
    return scopedItems.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchPriority = priorityFilter === "all" || item.priority === priorityFilter;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.requester.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }, [scopedItems, statusFilter, priorityFilter, search]);

  const pendingCount = useMemo(
    () => scopedItems.filter((i) => i.status === "pending").length,
    [scopedItems]
  );
  const criticalPendingCount = useMemo(
    () => scopedItems.filter((i) => i.status === "pending" && i.priority === "critical").length,
    [scopedItems]
  );
  const pendingValue = useMemo(
    () => scopedItems.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0),
    [scopedItems]
  );
  const approvedCount = useMemo(
    () => scopedItems.filter((i) => i.status === "approved").length,
    [scopedItems]
  );

  const handleOpenReview = (item: Approval) => {
    setSelectedItem(item);
    setDecisionNote("");
    setIsModalOpen(true);
  };

  const handleDecision = (newStatus: "approved" | "rejected") => {
    if (!selectedItem) return;

    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, status: newStatus } : item))
    );

    if (newStatus === "approved") {
      toast.success(`Approval ${selectedItem.id} Approved`, {
        description: `Decision recorded for "${selectedItem.title}".`,
      });
    } else {
      toast.error(`Approval ${selectedItem.id} Rejected`, {
        description: `Rejection recorded for "${selectedItem.title}".`,
      });
    }

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <PageHeader
        title="Approvals"
        description={`Executive authorization & governance requests · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Approvals" }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Pending Approvals"
          value={String(pendingCount)}
          sub="action required"
          icon={CheckSquare}
          tone={pendingCount > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Critical Priority"
          value={String(criticalPendingCount)}
          sub="immediate attention"
          icon={AlertTriangle}
          tone={criticalPendingCount > 0 ? "danger" : "neutral"}
        />
        <StatCard
          label="Pending Value"
          value={fmtMoney(pendingValue)}
          sub="total exposure pending"
          icon={Clock}
          tone="neutral"
        />
        <StatCard
          label="Approved Decisions"
          value={String(approvedCount)}
          sub="completed approvals"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* Filter and Table Panel */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, ID, requester, or type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Request & ID</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Requester</th>
                  <th className="px-3 py-3 font-medium">Entity</th>
                  <th className="px-3 py-3 font-medium">Priority</th>
                  <th className="px-3 py-3 font-medium">Due Date</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                      No approval requests match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="tabular text-xs text-muted-foreground">{item.id}</p>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <span className="rounded bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{item.requester}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {entityName(item.entity)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={item.priority} />
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {fmtDate(item.due)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="tabular px-3 py-3 text-right font-semibold text-foreground">
                        {item.amount > 0 ? fmtCurrency(item.amount) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                        >
                          <Eye className="size-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* APPROVE / REJECT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="tabular text-xs font-bold text-primary">{selectedItem.id}</span>
                  <StatusBadge status={selectedItem.priority} />
                  <StatusBadge status={selectedItem.status} />
                </div>
                <DialogTitle className="text-base font-semibold mt-1">
                  {selectedItem.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Submitted by {selectedItem.requester} · {entityName(selectedItem.entity)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-sm">
                {/* Details Breakdown */}
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Request Type</span>
                    <span className="font-medium text-foreground">{selectedItem.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Commitment Amount</span>
                    <span className="tabular font-bold text-foreground">
                      {selectedItem.amount > 0 ? fmtCurrency(selectedItem.amount) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Due Date</span>
                    <span className="font-medium text-foreground">{fmtDate(selectedItem.due)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Current Status</span>
                    <span className="font-medium capitalize text-foreground">
                      {selectedItem.status}
                    </span>
                  </div>
                </div>

                {/* Detailed Justification */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                    Justification & Executive Summary
                  </h4>
                  <p className="rounded-md border border-border bg-background p-3 text-xs leading-relaxed text-muted-foreground">
                    {selectedItem.detail}
                  </p>
                </div>

                {selectedItem.amount > userDoALimit && (
                  <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-2.5 text-xs text-warning">
                    <Lock className="size-4 shrink-0" />
                    <span>
                      Exceeds your Delegation of Authority limit ({fmtCurrency(userDoALimit)}). Escalate to Group Executive for approval.
                    </span>
                  </div>
                )}

                {/* Optional Note Input */}
                <div>
                  <label
                    htmlFor="decision-note"
                    className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1"
                  >
                    Decision Comments / Conditions (Optional)
                  </label>
                  <textarea
                    id="decision-note"
                    rows={2}
                    placeholder="Add an optional comment or approval condition for audit log…"
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision("rejected")}
                    className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="size-4" />
                    Reject Request
                  </button>
                  <button
                    type="button"
                    disabled={selectedItem.amount > userDoALimit}
                    onClick={() => handleDecision("approved")}
                    className="inline-flex items-center gap-1.5 rounded-md bg-success px-3.5 py-1.5 text-xs font-semibold text-success-foreground hover:bg-success/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="size-4" />
                    Approve Request
                  </button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
