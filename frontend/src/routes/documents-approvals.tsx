import { useState } from "react";
import { FileCheck, FileText, CheckCircle2, XCircle, Clock, Upload, Search, Filter, Eye, Download, FilePlus } from "lucide-react";
import { Panel, StatCard, PageHeader, StatusBadge } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { drawingsAndSubmittals, approvals, type DrawingSubmittal, type Approval } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DocumentsApprovalsPage() {
  const [submittals, setSubmittals] = useState<DrawingSubmittal[]>(drawingsAndSubmittals);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>(approvals);
  const [activeTab, setActiveTab] = useState<"submittals" | "approvals">("submittals");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubmittal, setNewSubmittal] = useState({
    title: "",
    code: "DWG-2026-",
    category: "Structural Drawing" as DrawingSubmittal["category"],
    revision: "Rev A",
    approver: "Amara Osei (PM)",
    fileSize: "14.2 MB",
  });

  const handleApproveSubmittal = (id: string) => {
    setSubmittals(
      submittals.map((s) => (s.id === id ? { ...s, reviewStatus: "Approved" } : s))
    );
    const item = submittals.find((s) => s.id === id);
    toast.success(`Drawing Approved: ${item?.title || id}`, {
      description: "Status set to Released for Construction",
    });
  };

  const handleApproveItem = (id: string) => {
    const item = pendingApprovals.find((a) => a.id === id);
    setPendingApprovals(pendingApprovals.filter((a) => a.id !== id));
    toast.success(`Approval Processed: ${id}`, {
      description: item?.title,
    });
  };

  const handleAddSubmittal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubmittal.title.trim()) {
      toast.error("Please enter a drawing title");
      return;
    }
    const created: DrawingSubmittal = {
      id: `SUB-${400 + submittals.length + 1}`,
      projectCode: "PRJ-2041",
      title: newSubmittal.title,
      code: newSubmittal.code || `DWG-2026-${submittals.length + 1}`,
      category: newSubmittal.category,
      revision: newSubmittal.revision,
      approver: newSubmittal.approver,
      reviewStatus: "Pending Review",
      fileSize: newSubmittal.fileSize,
      date: new Date().toISOString().split("T")[0]!,
    };
    setSubmittals([created, ...submittals]);
    toast.success(`Drawing Submittal Uploaded: ${created.code}`, {
      description: `Title: ${created.title} · ${created.revision}`,
    });
    setIsModalOpen(false);
    setNewSubmittal({
      title: "",
      code: "DWG-2026-",
      category: "Structural Drawing" as DrawingSubmittal["category"],
      revision: "Rev A",
      approver: "Amara Osei (PM)",
      fileSize: "14.2 MB",
    });
  };

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Documents & Approvals"
        description="Site drawings control, technical submittals, drawing revision management, and multi-stage approval workflows"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Upload className="size-4" /> Upload Drawing / Submittal
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Controlled Submittals" value={String(submittals.length)} sub="drawings & specifications" icon={FileText} />
        <StatCard label="Pending Approval Reviews" value={String(pendingApprovals.length)} sub="2 critical sign-offs pending" icon={Clock} tone="warning" />
        <StatCard label="Approved Drawings" value={String(submittals.filter((s) => s.reviewStatus === "Approved").length)} sub="released for construction" icon={CheckCircle2} tone="success" />
        <StatCard label="Revision Control" value="Rev C Active" sub="100% audit compliant" icon={FileCheck} tone="neutral" />
      </div>

      {/* Tabs Header */}
      <div className="mt-6 flex border-b border-border">
        <button
          onClick={() => setActiveTab("submittals")}
          className={`border-b-2 px-5 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "submittals" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Drawings & Technical Submittals ({submittals.length})
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={`border-b-2 px-5 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "approvals" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Site Approvals ({pendingApprovals.length})
        </button>
      </div>

      {/* Tab 1: Drawings & Submittals */}
      {activeTab === "submittals" && (
        <div className="mt-4">
          <Panel
            title="Drawings & Technical Submittal Register"
            description="Manage drawing revisions, architectural submittals, and MEP technical specs"
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Drawing Ref</th>
                    <th className="px-3 py-2.5 font-medium">Title</th>
                    <th className="px-3 py-2.5 font-medium">Category</th>
                    <th className="px-3 py-2.5 font-medium">Revision</th>
                    <th className="px-3 py-2.5 font-medium">Approver</th>
                    <th className="px-3 py-2.5 font-medium">Review Status</th>
                    <th className="px-5 py-2.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submittals.map((sub) => (
                    <tr key={sub.id} className="hover:bg-secondary/30">
                      <td className="px-5 py-3 font-mono font-bold text-foreground">{sub.code}</td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-foreground">{sub.title}</div>
                        <span className="text-xs text-muted-foreground">Size: {sub.fileSize} • Uploaded {sub.date}</span>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
                          {sub.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold text-xs text-primary">{sub.revision}</td>
                      <td className="px-3 py-3 text-xs text-foreground font-medium">{sub.approver}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          sub.reviewStatus === "Approved" ? "bg-emerald-500/10 text-emerald-500" :
                          sub.reviewStatus === "Pending Review" ? "bg-amber-500/10 text-amber-500" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {sub.reviewStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {sub.reviewStatus !== "Approved" && (
                          <button
                            onClick={() => handleApproveSubmittal(sub.id)}
                            className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                          >
                            Approve Drawing
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 2: Approvals */}
      {activeTab === "approvals" && (
        <div className="mt-4 space-y-3">
          {pendingApprovals.map((app) => (
            <div key={app.id} className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary">{app.id}</span>
                  <h4 className="font-bold text-foreground text-sm">{app.title}</h4>
                  <StatusBadge status={app.priority} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{app.detail}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Requester: <strong className="text-foreground">{app.requester}</strong> • Due: {app.due}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApproveItem(app.id)}
                  className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleApproveItem(app.id)}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <XCircle className="size-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD SUBMITTAL MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Upload className="size-5 text-primary" /> Upload Technical Submittal / Drawing
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register structural drawings, MEP specifications, or architectural submittals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmittal} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Drawing Title</label>
              <input
                type="text"
                placeholder="e.g. Viaduct Pier 4 Foundation Reinforcement Details"
                value={newSubmittal.title}
                onChange={(e) => setNewSubmittal((s) => ({ ...s, title: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Drawing Reference Code</label>
                <input
                  type="text"
                  value={newSubmittal.code}
                  onChange={(e) => setNewSubmittal((s) => ({ ...s, code: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Discipline / Category</label>
                <select
                  value={newSubmittal.category}
                  onChange={(e) => setNewSubmittal((s) => ({ ...s, category: e.target.value as DrawingSubmittal["category"] }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="Structural Drawing">Structural Drawing</option>
                  <option value="Architectural Submittal">Architectural Submittal</option>
                  <option value="MEP Specification">MEP Specification</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Revision Tag</label>
                <input
                  type="text"
                  value={newSubmittal.revision}
                  onChange={(e) => setNewSubmittal((s) => ({ ...s, revision: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Design Approver</label>
                <input
                  type="text"
                  value={newSubmittal.approver}
                  onChange={(e) => setNewSubmittal((s) => ({ ...s, approver: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
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
                <FilePlus className="size-4" /> Submit Drawing
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
