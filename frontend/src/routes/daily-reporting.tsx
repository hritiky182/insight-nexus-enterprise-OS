import { useState } from "react";
import { ClipboardList, Camera, Plus, Calendar, User, Sun, CloudRain, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Panel, StatCard, PageHeader, ProgressBar } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { dailySiteLogs, type DailySiteLog } from "@/data/mock";

export default function DailyReportingPage() {
  const [logs, setLogs] = useState<DailySiteLog[]>(dailySiteLogs);
  const [showModal, setShowModal] = useState(false);

  // New Log Form State
  const [newLog, setNewLog] = useState({
    projectName: "Coastal Ring Road — Section 4",
    supervisor: "Amara Osei",
    shift: "Morning" as const,
    workDone: "",
    progressPercent: 70,
    workforceCount: 45,
    notes: "",
    delays: "None",
    weather: "Sunny, 32°C",
  });

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DailySiteLog = {
      id: `DSL-${100 + logs.length + 1}`,
      date: new Date().toISOString().split("T")[0] || "2026-08-25",
      projectCode: "PRJ-2041",
      projectName: newLog.projectName,
      supervisor: newLog.supervisor,
      shift: newLog.shift,
      workDone: newLog.workDone || "General excavation and site preparation completed.",
      progressPercent: Number(newLog.progressPercent),
      workforceCount: Number(newLog.workforceCount),
      photos: ["/photos/site_new.jpg"],
      notes: newLog.notes || "All safety checks passed prior to shift start.",
      delays: newLog.delays,
      weather: newLog.weather,
    };
    setLogs([created, ...logs]);
    setShowModal(false);
  };

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Daily Site Reporting"
        description="Site operations daily logs: Progress recording, Work Done entries, Site Photo uploads, and Supervisor Notes"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> New Daily Log Entry
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Logs Filed" value={String(logs.length)} sub="this month" icon={ClipboardList} />
        <StatCard label="Active Site Workforce" value="106" sub="across all active shifts" icon={User} tone="neutral" />
        <StatCard label="Site Photos Captured" value="48" sub="attached to logs" icon={Camera} tone="success" />
        <StatCard label="Daily Shift Compliance" value="98%" sub="logs submitted on-time" icon={CheckCircle2} tone="warning" />
      </div>

      {/* Log Feed */}
      <div className="mt-6 space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {log.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{log.projectName}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {log.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="size-3" /> Supervisor: {log.supervisor}</span>
                    <span>•</span>
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">{log.shift} Shift</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-amber-500 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full">
                  <Sun className="size-3.5" /> {log.weather}
                </span>
                <span className="font-semibold text-foreground bg-secondary px-3 py-1 rounded-md">
                  Workforce: {log.workforceCount} Workers
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {/* Work Done */}
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Work Done Today
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/50">
                    {log.workDone}
                  </p>
                </div>

                {log.notes && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Supervisor Notes
                    </h4>
                    <p className="text-xs text-muted-foreground italic bg-secondary/20 p-2.5 rounded-md">
                      "{log.notes}"
                    </p>
                  </div>
                )}

                {log.delays && log.delays !== "None" && (
                  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span><strong>Delay Recorded:</strong> {log.delays}</span>
                  </div>
                )}
              </div>

              {/* Progress & Site Photos */}
              <div className="space-y-3 border-l border-border pl-0 lg:pl-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-muted-foreground">Cumulative Progress</span>
                    <span className="text-primary">{log.progressPercent}%</span>
                  </div>
                  <ProgressBar value={log.progressPercent} />
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                    <Camera className="size-3.5" /> Site Photos ({log.photos.length})
                  </h4>
                  <div className="flex gap-2">
                    {log.photos.map((_, i) => (
                      <div key={i} className="flex h-20 w-28 items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground font-medium">
                        Photo #{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" /> Create Daily Site Log
            </h3>
            <form onSubmit={handleCreateLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Select Site Project</label>
                  <select
                    value={newLog.projectName}
                    onChange={(e) => setNewLog({ ...newLog, projectName: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Coastal Ring Road — Section 4">Coastal Ring Road — Section 4</option>
                    <option value="Metro Line 3 — Depot & Workshop">Metro Line 3 — Depot & Workshop</option>
                    <option value="Water Treatment Plant Upgrade">Water Treatment Plant Upgrade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    value={newLog.supervisor}
                    onChange={(e) => setNewLog({ ...newLog, supervisor: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Shift</label>
                  <select
                    value={newLog.shift}
                    onChange={(e) => setNewLog({ ...newLog, shift: e.target.value as any })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Workforce Count</label>
                  <input
                    type="number"
                    value={newLog.workforceCount}
                    onChange={(e) => setNewLog({ ...newLog, workforceCount: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Progress %</label>
                  <input
                    type="number"
                    value={newLog.progressPercent}
                    onChange={(e) => setNewLog({ ...newLog, progressPercent: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Work Done Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe activities completed during this shift..."
                  value={newLog.workDone}
                  onChange={(e) => setNewLog({ ...newLog, workDone: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Supervisor Notes / Safety Checks</label>
                  <input
                    type="text"
                    placeholder="Toolbox talk notes, safety checks..."
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Delays Experienced</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 min weather delay"
                    value={newLog.delays}
                    onChange={(e) => setNewLog({ ...newLog, delays: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
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
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
