import { useState } from "react";
import { MessageSquare, AlertTriangle, CheckCircle2, Clock, Plus, Filter, UserCheck, MapPin } from "lucide-react";
import { Panel, StatCard, PageHeader, StatusBadge } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { rfisAndIssues, type RfiIssue } from "@/data/mock";

export default function IssuesRfisPage() {
  const [items, setItems] = useState<RfiIssue[]>(rfisAndIssues);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    type: "RFI" as const,
    priority: "High" as const,
    assignee: "Lead Structural Engineer",
    siteLocation: "Section 4 Viaduct V1",
    description: "",
  });

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RfiIssue = {
      id: `${newItem.type === "RFI" ? "RFI" : newItem.type === "Issue" ? "ISS" : "TSK"}-${200 + items.length + 1}`,
      title: newItem.title || "New Site Query / Item",
      projectCode: "PRJ-2041",
      type: newItem.type,
      priority: newItem.priority,
      status: "Open",
      assignee: newItem.assignee,
      siteLocation: newItem.siteLocation,
      raisedBy: "Site Engineer",
      date: new Date().toISOString().split("T")[0] || "2026-08-25",
      description: newItem.description || "Detailed site observation raised for engineering clarification.",
    };
    setItems([created, ...items]);
    setShowModal(false);
  };

  const handleUpdateStatus = (id: string, newStatus: RfiIssue["status"]) => {
    setItems(items.map((it) => (it.id === id ? { ...it, status: newStatus } : it)));
  };

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Issues, Tasks & RFIs"
        description="Site issue tracking and Requests For Information (RFIs): Raise, Assign, Track and Close site engineering queries"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Raise Issue / RFI
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Items Raised" value={String(items.length)} sub="issues, RFIs & tasks" icon={MessageSquare} />
        <StatCard label="Critical Priority" value={String(items.filter((i) => i.priority === "Critical").length)} sub="requires immediate action" icon={AlertTriangle} tone="danger" />
        <StatCard label="Open & In Review" value={String(items.filter((i) => i.status !== "Closed").length)} sub="active resolution" icon={Clock} tone="warning" />
        <StatCard label="Closed / Resolved" value={String(items.filter((i) => i.status === "Closed").length)} sub="closed out site items" icon={CheckCircle2} tone="success" />
      </div>

      {/* Filter Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Type:</span>
          <div className="flex gap-1">
            {["all", "RFI", "Issue", "Task"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Review">In Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  item.type === "RFI" ? "bg-blue-500/10 text-blue-500" :
                  item.type === "Issue" ? "bg-amber-500/10 text-amber-500" :
                  "bg-purple-500/10 text-purple-500"
                }`}>
                  {item.type} • {item.id}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  item.priority === "Critical" ? "bg-destructive/10 text-destructive" :
                  item.priority === "High" ? "bg-amber-500/10 text-amber-500" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {item.priority}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-sm leading-snug">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                <span className="truncate">{item.siteLocation}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UserCheck className="size-3.5 text-emerald-500" />
                <span className="truncate">Assignee: {item.assignee}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">Raised by: {item.raisedBy}</span>

              {/* Status Update Quick Action */}
              <div className="flex items-center gap-1">
                {item.status !== "Closed" ? (
                  <button
                    onClick={() => handleUpdateStatus(item.id, "Closed")}
                    className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  >
                    Mark Closed
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-500">
                    <CheckCircle2 className="size-3.5" /> Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New RFI Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" /> Raise New Issue / RFI / Task
            </h3>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Title / Technical Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rebar overlapping detail at Pier cap IC-2..."
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="RFI">RFI (Request for Info)</option>
                    <option value="Issue">Site Issue</option>
                    <option value="Task">Task Action</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newItem.assignee}
                    onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Site Location</label>
                  <input
                    type="text"
                    value={newItem.siteLocation}
                    onChange={(e) => setNewItem({ ...newItem, siteLocation: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description & Queries</label>
                <textarea
                  rows={3}
                  placeholder="Detail the exact technical query or site issue..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-medium hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Raise Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
