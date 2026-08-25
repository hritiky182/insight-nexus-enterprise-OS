import { useState } from "react";
import { Activity, Truck, MapPin, AlertCircle, CheckCircle2, Clock, Calendar, ArrowRight, Plus, RefreshCw } from "lucide-react";
import { Panel, StatCard, PageHeader, ProgressBar, StatusBadge } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { projects, milestones, vehicleLogs as initialVehicleLogs, type VehicleLog } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProgressTrackingPage() {
  const [activeTab, setActiveTab] = useState<"progress" | "vehicles" | "delays">("progress");
  const [vLogs, setVLogs] = useState<VehicleLog[]>(initialVehicleLogs);
  const [projectList, setProjectList] = useState(projects.filter((p) => p.entity === "construction"));

  // Modal 1: Log Vehicle Dispatch
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleNo: "K-TRK-",
    type: "Transit Mixer 10m³",
    driver: "",
    route: "Batch Plant B2 → Site Zone 4",
    item: "Ready-Mix Concrete (C40/50)",
    status: "Dispatched" as VehicleLog["status"],
    location: "Gate 2 Weighbridge",
  });

  // Modal 2: Update Site Progress %
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedPrjId, setSelectedPrjId] = useState(projectList[0]?.id || "");
  const [newProgress, setNewProgress] = useState("68");

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.driver.trim() || !newVehicle.vehicleNo.trim()) {
      toast.error("Please provide vehicle number and driver name");
      return;
    }
    const created: VehicleLog = {
      id: `VLOG-${800 + vLogs.length + 1}`,
      vehicleNo: newVehicle.vehicleNo,
      type: newVehicle.type,
      driver: newVehicle.driver,
      route: newVehicle.route,
      item: newVehicle.item,
      status: newVehicle.status,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: newVehicle.location,
    };
    setVLogs([created, ...vLogs]);
    toast.success(`Vehicle Dispatch Logged: ${created.vehicleNo}`, {
      description: `Driver: ${created.driver} · Cargo: ${created.item} (${created.status})`,
    });
    setIsVehicleModalOpen(false);
  };

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newProgress);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error("Progress percentage must be between 0 and 100");
      return;
    }
    setProjectList((prev) =>
      prev.map((p) => (p.id === selectedPrjId ? { ...p, progress: val } : p))
    );
    const targetPrj = projectList.find((p) => p.id === selectedPrjId);
    toast.success(`Physical Progress Updated: ${targetPrj?.name || selectedPrjId}`, {
      description: `New Progress: ${val}% Complete`,
    });
    setIsProgressModalOpen(false);
  };

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Progress Tracking"
        description="Site physical progress monitoring: % Complete, Project Milestones, Vehicle Pick/Drop dispatch logs, Site Locations & Delay tracking"
        actions={
          <div className="flex gap-1.5 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setActiveTab("progress")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "progress" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              % Complete & Milestones
            </button>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "vehicles" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vehicle Pick/Drop Logistics
            </button>
            <button
              onClick={() => setActiveTab("delays")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "delays" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Delay Analysis
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Overall Site Physical Progress" value="64%" sub="portfolio weighted average" icon={Activity} />
        <StatCard label="Active Milestones" value={String(milestones.length)} sub="1 completed, 1 at risk" icon={Calendar} tone="neutral" />
        <StatCard label="Vehicle Dispatches Today" value={String(vLogs.length)} sub="concrete & rebar trucks" icon={Truck} tone="success" />
        <StatCard label="Critical Path Delays" value="58 Days" sub="permit renewal delay" icon={AlertCircle} tone="danger" />
      </div>

      {/* Tab 1: Progress & Milestones */}
      {activeTab === "progress" && (
        <div className="mt-6 space-y-6">
          <Panel
            title="Site % Completion & Physical Progress"
            description="Real-time site execution status vs planned target"
            action={
              <button
                onClick={() => setIsProgressModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <RefreshCw className="size-3.5" /> Update Progress %
              </button>
            }
          >
            <div className="space-y-4">
              {projectList.map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-4 bg-card hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                        {p.name} <span className="text-xs text-muted-foreground font-mono">({p.code})</span>
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-primary" /> Location: {p.location} • Manager: {p.manager}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      <span className="text-sm font-bold text-foreground tabular">{p.progress}% Complete</span>
                    </div>
                  </div>

                  <ProgressBar value={p.progress} />

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2">
                    <span>Target Finish: {p.end}</span>
                    <span>Site Health Score: <strong className={p.health < 60 ? "text-destructive" : "text-emerald-500"}>{p.health}/100</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Project Site Milestones Timeline" description="Key execution milestones tracking">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Milestone Name</th>
                    <th className="px-3 py-2.5 font-medium">Due Date</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 text-right font-medium">Milestone Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {milestones.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/30">
                      <td className="px-5 py-3 font-semibold text-foreground">{m.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {m.due}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                          m.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                          m.status === "at-risk" ? "bg-destructive/10 text-destructive" :
                          "bg-blue-500/10 text-blue-500"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-foreground">
                        ${(m.value / 1_000_000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 2: Vehicle Pick/Drop Logistics */}
      {activeTab === "vehicles" && (
        <div className="mt-6">
          <Panel
            title="Vehicle Pick / Drop & Material Movement Log"
            description="Tracking ready-mix trucks, precast girder trailers, and site equipment vehicles in real-time"
            action={
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus className="size-3.5" /> Log Vehicle Pick/Drop
              </button>
            }
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Vehicle ID</th>
                    <th className="px-3 py-2.5 font-medium">Vehicle Type</th>
                    <th className="px-3 py-2.5 font-medium">Driver</th>
                    <th className="px-3 py-2.5 font-medium">Dispatch Route</th>
                    <th className="px-3 py-2.5 font-medium">Material / Cargo</th>
                    <th className="px-3 py-2.5 font-medium">Current Location</th>
                    <th className="px-5 py-2.5 text-right font-medium">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vLogs.map((v) => (
                    <tr key={v.id} className="hover:bg-secondary/40">
                      <td className="px-5 py-3 font-mono font-bold text-foreground">{v.vehicleNo}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{v.type}</td>
                      <td className="px-3 py-3 text-xs text-foreground">{v.driver}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground flex items-center gap-1">
                        <span>{v.route}</span>
                      </td>
                      <td className="px-3 py-3 text-xs font-semibold text-foreground">{v.item}</td>
                      <td className="px-3 py-3 text-xs text-primary font-medium flex items-center gap-1">
                        <MapPin className="size-3" /> {v.location}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          v.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                          v.status === "In Transit" ? "bg-blue-500/10 text-blue-500" :
                          "bg-amber-500/10 text-amber-500"
                        }`}>
                          <Truck className="size-3" /> {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 3: Delay Analysis */}
      {activeTab === "delays" && (
        <div className="mt-6 space-y-4">
          <Panel title="Site Delay Log & Impact Breakdown" description="Identification of critical path bottlenecks and mitigation plans">
            <div className="space-y-4">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Coastal Permit Renewal Delay — Section 4 (PRJ-2041)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Impact:</strong> 58 days extension of time claim lodged. Marine works on Viaduct V1 currently restricted to low-water windows.
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                      Mitigation Action: Escalated to regional environmental authority; parallel submission of amended EIA annexes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Concrete Truck Batching Plant Bottleneck</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Impact:</strong> 30-45 min delays between ready-mix trucks during peak pour hours on Pier 4.
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                      Mitigation Action: Staggered dispatch schedule implemented with Batch Plant B2 starting 05:30 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* MODAL 1: LOG VEHICLE DISPATCH */}
      <Dialog open={isVehicleModalOpen} onOpenChange={setIsVehicleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Truck className="size-5 text-primary" /> Log Vehicle Pick / Drop Dispatch
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record ready-mix truck, precast trailer, or heavy equipment material movement.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVehicle} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Vehicle Plate No</label>
                <input
                  type="text"
                  placeholder="e.g. K-TRK-4925"
                  value={newVehicle.vehicleNo}
                  onChange={(e) => setNewVehicle((v) => ({ ...v, vehicleNo: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Vehicle Type</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle((v) => ({ ...v, type: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="Transit Mixer 10m³">Transit Mixer 10m³</option>
                  <option value="Heavy Flatbed Trailer">Heavy Flatbed Trailer</option>
                  <option value="Dump Truck 20t">Dump Truck 20t</option>
                  <option value="Site Pickup 4x4">Site Pickup 4x4</option>
                  <option value="Mobile Crane 50t">Mobile Crane 50t</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Driver Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kwame Mensah"
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle((v) => ({ ...v, driver: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Dispatch Status</label>
                <select
                  value={newVehicle.status}
                  onChange={(e) => setNewVehicle((v) => ({ ...v, status: e.target.value as any }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Dispatch Route</label>
              <input
                type="text"
                value={newVehicle.route}
                onChange={(e) => setNewVehicle((v) => ({ ...v, route: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Material / Cargo Item</label>
              <input
                type="text"
                value={newVehicle.item}
                onChange={(e) => setNewVehicle((v) => ({ ...v, item: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Truck className="size-4" /> Save Dispatch Log
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: UPDATE SITE PROGRESS % */}
      <Dialog open={isProgressModalOpen} onOpenChange={setIsProgressModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Activity className="size-5 text-primary" /> Update Site Physical Progress %
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update real-time physical completion percentage for target project.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProgress} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Select Project</label>
              <select
                value={selectedPrjId}
                onChange={(e) => {
                  setSelectedPrjId(e.target.value);
                  const p = projectList.find((prj) => prj.id === e.target.value);
                  if (p) setNewProgress(String(p.progress));
                }}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              >
                {projectList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.progress}% current)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">New Physical Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-bold outline-none focus:border-primary"
                required
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProgressModalOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <CheckCircle2 className="size-4" /> Save Progress Update
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
