import { useState } from "react";
import { ShieldCheck, HardHat, CheckCircle2, AlertTriangle, FileText, Activity, Shield, Plus, Check } from "lucide-react";
import { Panel, StatCard, PageHeader, StatusBadge } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { hseInspections, correctiveActions, compliance, type HseInspection } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function QualityHsePage() {
  const [inspections, setInspections] = useState<HseInspection[]>(hseInspections);
  const [actions, setActions] = useState(correctiveActions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({
    site: "Section 4 Viaduct Pier 3",
    type: "HSE Compliance Audit" as HseInspection["type"],
    auditor: "HSE Lead",
    findings: "Scaffolding toe-boards missing on deck level 2.",
    score: 88,
    status: "Action Required" as HseInspection["status"],
    actionItem: "Install missing toe-boards and reinspect before morning shift.",
  });

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudit.findings.trim()) {
      toast.error("Please provide audit findings & observations");
      return;
    }
    const created: HseInspection = {
      id: `HSE-${300 + inspections.length + 1}`,
      site: newAudit.site,
      date: new Date().toISOString().split("T")[0]!,
      type: newAudit.type,
      auditor: newAudit.auditor,
      findings: newAudit.findings,
      score: Number(newAudit.score) || 90,
      status: newAudit.status,
      ...(newAudit.actionItem ? { actionItem: newAudit.actionItem } : {}),
    };
    setInspections([created, ...inspections]);
    toast.success(`HSE Observation Logged: ${created.id}`, {
      description: `Site: ${created.site} · Compliance Score: ${created.score}/100`,
    });
    setIsModalOpen(false);
  };

  const handleToggleActionStatus = (id: string) => {
    setActions((prev) =>
      prev.map((ca) =>
        ca.id === id ? { ...ca, status: ca.status === "closed" ? "open" : "closed" } : ca
      )
    );
    const target = actions.find((a) => a.id === id);
    const nextStatus = target?.status === "closed" ? "Open" : "Closed / Resolved";
    toast.info(`Corrective Action Updated: ${id}`, {
      description: `New Status: ${nextStatus}`,
    });
  };

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Inspection / Quality / HSE"
        description="Site Safety & Quality Management: Safety Observations, Quality NDT Inspections, Corrective Action tracking and Regulatory Compliance"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="size-4" /> Log Safety Observation / Inspection
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="HSE Compliance Index" value="94%" sub="ISO 45001 audited" icon={ShieldCheck} tone="success" />
        <StatCard label="Safety Observations" value={String(inspections.length)} sub="site audits conducted" icon={HardHat} tone="neutral" />
        <StatCard label="Open Corrective Actions" value={String(actions.filter((a) => a.status !== "closed").length)} sub="1 high severity pending" icon={AlertTriangle} tone="danger" />
        <StatCard label="Active Permits & Licenses" value={String(compliance.length)} sub="environmental & safety" icon={FileText} />
      </div>

      {/* Inspections & Observations */}
      <div className="mt-6">
        <Panel
          title="Recent Quality & HSE Inspections"
          description="Observations, quality compliance checks and NDT testing results"
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Audit Ref</th>
                  <th className="px-3 py-2.5 font-medium">Site Location</th>
                  <th className="px-3 py-2.5 font-medium">Inspection Type</th>
                  <th className="px-3 py-2.5 font-medium">Audit Findings & Observations</th>
                  <th className="px-3 py-2.5 font-medium">Auditor</th>
                  <th className="px-3 py-2.5 font-medium">Compliance Score</th>
                  <th className="px-5 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inspections.map((ins) => (
                  <tr key={ins.id} className="hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono font-bold text-foreground">{ins.id}</td>
                    <td className="px-3 py-3 font-semibold text-foreground">{ins.site}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
                        {ins.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      <p>{ins.findings}</p>
                      {ins.actionItem && (
                        <span className="block mt-1 text-[11px] font-semibold text-destructive">
                          Action Required: {ins.actionItem}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-foreground font-medium">{ins.auditor}</td>
                    <td className="px-3 py-3 text-xs font-bold tabular">
                      <span className={ins.score >= 90 ? "text-emerald-500" : "text-amber-500"}>
                        {ins.score}/100
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        ins.status === "Passed" ? "bg-emerald-500/10 text-emerald-500" :
                        ins.status === "Closed" ? "bg-blue-500/10 text-blue-500" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {ins.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Corrective Actions & Regulatory Permits */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Corrective Actions Tracker (CAs)" description="Actions required to resolve safety or quality non-conformances">
          <div className="space-y-3">
            {actions.map((ca) => (
              <div key={ca.id} className="rounded-lg border border-border p-3.5 bg-card flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-primary">{ca.id}</span>
                    <h4 className="font-semibold text-foreground text-xs truncate">{ca.title}</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Owner: {ca.owner} • Due: {ca.due}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActionStatus(ca.id)}
                    className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      ca.status === "closed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
                    }`}
                  >
                    <Check className="size-3" /> {ca.status === "closed" ? "Closed" : "Resolve Action"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Regulatory Permits & ISO Compliance" description="Environmental permits, safety licenses and audit surveillance">
          <div className="space-y-3">
            {compliance.slice(0, 4).map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-3.5 bg-card flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-foreground text-xs">{c.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Authority: {c.authority} • Expiry: {c.expiry}
                  </p>
                </div>

                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* LOG INSPECTION MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="size-5 text-primary" /> Log Safety Observation / Quality Audit
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record a site safety observation, NDT quality inspection, or ISO audit finding.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddInspection} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Site Location & Zone</label>
              <input
                type="text"
                value={newAudit.site}
                onChange={(e) => setNewAudit((a) => ({ ...a, site: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Inspection Type</label>
                <select
                  value={newAudit.type}
                  onChange={(e) => setNewAudit((a) => ({ ...a, type: e.target.value as HseInspection["type"] }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="HSE Compliance Audit">HSE Compliance Audit</option>
                  <option value="Safety Observation">Safety Observation</option>
                  <option value="Quality Inspection">Quality Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Compliance Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newAudit.score}
                  onChange={(e) => setNewAudit((a) => ({ ...a, score: Number(e.target.value) }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Audit Findings & Observations</label>
              <textarea
                rows={3}
                value={newAudit.findings}
                onChange={(e) => setNewAudit((a) => ({ ...a, findings: e.target.value }))}
                className="w-full rounded-md border border-border bg-background p-2.5 text-xs outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Corrective Action Required (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Replace defective harness before resuming works"
                value={newAudit.actionItem}
                onChange={(e) => setNewAudit((a) => ({ ...a, actionItem: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
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
                <ShieldCheck className="size-4" /> Save Audit Record
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
