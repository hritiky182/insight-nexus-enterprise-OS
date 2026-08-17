import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, ArrowUpDown, LayoutGrid, List, Plus, FolderPlus } from "lucide-react";
import { PageHeader, Panel, StatusBadge, ProgressBar, StatCard, EmptyState } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { projects, entityName, fmtMoney, fmtDate, entities, type EntityId } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type SortKey = "name" | "budget" | "progress" | "end";

export default function ProjectsIndexPage() {
  const { scope, label, entity: currentContextEntity } = useEntity();
  const [projectList, setProjectList] = useState(projects);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [entity, setEntityFilter] = useState("all");
  const [risk, setRisk] = useState("all");
  const [sort, setSort] = useState<SortKey>("budget");
  const [asc, setAsc] = useState(false);
  const [view, setView] = useState<"table" | "cards">("table");

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: `PRJ-2026-${String(projectList.length + 1).padStart(2, "0")}`,
    entity: "construction" as EntityId,
    client: "",
    manager: "",
    budget: "15000000",
    location: "Accra, Ghana",
    status: "planning",
    risk: "low",
    description: "",
  });

  const rows = useMemo(() => {
    let list = scope(projectList).filter(
      (p) =>
        (q === "" ||
          `${p.name} ${p.code} ${p.client} ${p.manager}`.toLowerCase().includes(q.toLowerCase())) &&
        (status === "all" || p.status === status) &&
        (entity === "all" || p.entity === entity) &&
        (risk === "all" || p.risk === risk),
    );
    list = [...list].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sort === "name") return a.name.localeCompare(b.name) * dir;
      if (sort === "end") return (a.end > b.end ? 1 : -1) * dir;
      return ((a[sort] as number) - (b[sort] as number)) * dir;
    });
    return list;
  }, [scope, projectList, q, status, entity, risk, sort, asc]);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setAsc(!asc);
    else {
      setSort(k);
      setAsc(false);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const newPrj = {
      id: `prj-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      entity: formData.entity,
      client: formData.client || "Meridian Infrastructure",
      manager: formData.manager || "Executive Project Lead",
      status: formData.status as any,
      budget: Number(formData.budget) || 10_000_000,
      actual: 0,
      progress: 5,
      start: "2026-08-17",
      end: "2027-08-17",
      risk: formData.risk as any,
      location: formData.location,
      health: 95,
      description: formData.description || "Newly initiated infrastructure project package.",
    };

    setProjectList((prev) => [newPrj, ...prev]);
    toast.success(`Project Created: ${newPrj.name}`, {
      description: `Code: ${newPrj.code} · Budget: $${fmtMoney(newPrj.budget)}`,
    });
    setIsModalOpen(false);
    setFormData({
      name: "",
      code: `PRJ-2026-${String(projectList.length + 2).padStart(2, "0")}`,
      entity: "construction" as EntityId,
      client: "",
      manager: "",
      budget: "15000000",
      location: "Accra, Ghana",
      status: "planning",
      risk: "low",
      description: "",
    });
  };

  const total = rows.reduce((s, p) => s + p.budget, 0);
  const spent = rows.reduce((s, p) => s + p.actual, 0);

  const selectCls =
    "h-9 rounded-md border border-border bg-surface px-2.5 text-sm outline-none focus:border-primary/50";

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${rows.length} projects in scope · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Projects" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            New project
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Portfolio value" value={`$${fmtMoney(total)}`} sub="approved budget" />
        <StatCard label="Committed" value={`$${fmtMoney(spent)}`} sub={`${Math.round((spent / (total || 1)) * 100)}% of budget`} />
        <StatCard label="At risk / delayed" value={String(rows.filter((p) => p.status === "at-risk" || p.status === "delayed").length)} sub="require intervention" tone="warning" />
        <StatCard label="Avg. progress" value={`${Math.round(rows.reduce((s, p) => s + p.progress, 0) / (rows.length || 1))}%`} sub="weighted by count" />
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by project, code, client or manager"
              className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="all">All statuses</option>
            {["on-track", "at-risk", "delayed", "planning", "on-hold", "completed"].map((s) => (
              <option key={s} value={s}>{s.replace("-", " ")}</option>
            ))}
          </select>
          <select value={entity} onChange={(e) => setEntityFilter(e.target.value)} className={selectCls}>
            <option value="all">All entities</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className={selectCls}>
            <option value="all">All risk levels</option>
            {["low", "medium", "high", "critical"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex overflow-hidden rounded-md border border-border">
            <button
              onClick={() => setView("table")}
              className={`p-2 ${view === "table" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              aria-label="Table view"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setView("cards")}
              className={`p-2 ${view === "cards" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              aria-label="Card view"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No projects match your filters" description="Adjust the search term, status, entity or risk filter to see results." />
          </div>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 font-medium hover:text-foreground">
                      Project <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 font-medium">Entity</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Manager</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 text-right">
                    <button onClick={() => toggleSort("budget")} className="ml-auto flex items-center gap-1 font-medium hover:text-foreground">
                      Budget <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">Actual</th>
                  <th className="px-3 py-2.5">
                    <button onClick={() => toggleSort("progress")} className="flex items-center gap-1 font-medium hover:text-foreground">
                      Progress <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5">
                    <button onClick={() => toggleSort("end")} className="flex items-center gap-1 font-medium hover:text-foreground">
                      Schedule <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                  <th className="px-5 py-2.5 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/50">
                    <td className="px-5 py-3">
                      <Link to={`/projects/${p.id}`} className="font-medium hover:text-primary">
                        {p.name}
                      </Link>
                      <span className="tabular block text-xs text-muted-foreground">{p.code} · {p.location}</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(p.entity)}</td>
                    <td className="px-3 py-3 text-xs">{p.client}</td>
                    <td className="px-3 py-3 text-xs">{p.manager}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                    <td className="tabular px-3 py-3 text-right">${fmtMoney(p.budget)}</td>
                    <td className={`tabular px-3 py-3 text-right ${p.actual > p.budget ? "font-medium text-destructive" : ""}`}>
                      ${fmtMoney(p.actual)}
                    </td>
                    <td className="w-40 px-3 py-3"><ProgressBar value={p.progress} tone={p.status === "delayed" ? "danger" : undefined} /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {fmtDate(p.start)} → {fmtDate(p.end)}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="tabular text-xs text-muted-foreground">{p.code} · {entityName(p.entity)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-3"><ProgressBar value={p.progress} /></div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="tabular font-medium">${fmtMoney(p.budget)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>

      {/* NEW PROJECT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FolderPlus className="size-5 text-primary" /> Create New Enterprise Project
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define master project details, scope allocation, and entity ownership.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Takoradi Port Expansion Phase II"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Project Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
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
                <label className="block text-xs font-semibold text-foreground mb-1">Approved Budget (USD)</label>
                <input
                  type="number"
                  placeholder="15000000"
                  value={formData.budget}
                  onChange={(e) => setFormData((f) => ({ ...f, budget: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Client / Authority</label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Transport"
                  value={formData.client}
                  onChange={(e) => setFormData((f) => ({ ...f, client: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Project Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Kwame Mensah"
                  value={formData.manager}
                  onChange={(e) => setFormData((f) => ({ ...f, manager: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="planning">Planning</option>
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Risk Profile</label>
                <select
                  value={formData.risk}
                  onChange={(e) => setFormData((f) => ({ ...f, risk: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Scope Summary & Objectives</label>
              <textarea
                rows={2}
                placeholder="Brief summary of engineering scope, key deliverables and stage gate targets…"
                value={formData.description}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-md border border-border bg-background p-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border flex items-center justify-between sm:justify-end gap-2">
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
                <FolderPlus className="size-4" /> Create Project Record
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
