import { useState, useMemo } from "react";
import { PageHeader, Panel, StatusBadge, StatCard, ProgressBar } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntity } from "@/components/entity-context";
import {
  assets,
  shipments,
  warehouses,
  entityName,
  fmtMoney,
  fmtCurrency,
  fmtDate,
  type Asset,
  type Shipment,
} from "@/data/mock";
import { Truck, Navigation, Warehouse, Wrench, Search, Filter, ShieldCheck } from "lucide-react";

export default function AssetsPage() {
  const { scope, label } = useEntity();
  const [tab, setTab] = useState("register");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const scopedAssets = scope(assets);
  const scopedShipments = shipments; // global logistics shipments
  const scopedWarehouses = scope(warehouses);

  const filteredAssets = useMemo(() => {
    return scopedAssets.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.project.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || a.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [scopedAssets, search, typeFilter]);

  const totalAssetValue = useMemo(
    () => scopedAssets.reduce((sum, a) => sum + a.value, 0),
    [scopedAssets]
  );
  const avgUtilisation = useMemo(() => {
    if (!scopedAssets.length) return 0;
    return Math.round(
      scopedAssets.reduce((sum, a) => sum + a.utilisation, 0) / scopedAssets.length
    );
  }, [scopedAssets]);

  const activeShipments = useMemo(
    () => scopedShipments.filter((s) => s.status !== "Delivered").length,
    [scopedShipments]
  );

  const totalWarehouseCapacity = useMemo(
    () => scopedWarehouses.reduce((sum, w) => sum + w.capacity, 0),
    [scopedWarehouses]
  );
  const totalWarehouseUsed = useMemo(
    () => scopedWarehouses.reduce((sum, w) => sum + w.used, 0),
    [scopedWarehouses]
  );
  const warehouseOccPercent = totalWarehouseCapacity
    ? Math.round((totalWarehouseUsed / totalWarehouseCapacity) * 100)
    : 0;

  const assetTypes = Array.from(new Set(assets.map((a) => a.type)));

  return (
    <>
      <PageHeader
        title="Assets & Logistics"
        description={`Capital assets, equipment fleet, warehouse operations & transit logistics · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Assets & Logistics" }]}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Asset Value"
          value={fmtMoney(totalAssetValue)}
          sub={`${scopedAssets.length} tracked items`}
          icon={Truck}
          tone="neutral"
        />
        <StatCard
          label="Fleet Utilisation"
          value={`${avgUtilisation}%`}
          sub="average active usage"
          icon={ShieldCheck}
          tone={avgUtilisation > 75 ? "success" : "warning"}
        />
        <StatCard
          label="Active Shipments"
          value={String(activeShipments)}
          sub="in transit / customs"
          icon={Navigation}
          tone={activeShipments > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Warehouse Occupancy"
          value={`${warehouseOccPercent}%`}
          sub={`${scopedWarehouses.length} facilities active`}
          icon={Warehouse}
          tone={warehouseOccPercent > 80 ? "warning" : "success"}
        />
      </div>

      <div className="mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="register">Assets Register</TabsTrigger>
            <TabsTrigger value="shipments">Shipments & Logistics</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses & Storage</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* TAB 1: ASSETS REGISTER */}
          <TabsContent value="register" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assets by name, ID or project…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-9 rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  {assetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Panel bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">Asset & Code</th>
                      <th className="px-3 py-3 font-medium">Category</th>
                      <th className="px-3 py-3 font-medium">Entity / Project</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Condition</th>
                      <th className="px-3 py-3 font-medium">Utilisation</th>
                      <th className="px-3 py-3 font-medium">Next Service</th>
                      <th className="px-5 py-3 text-right font-medium">Est. Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAssets.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-muted-foreground">
                          No assets matched your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAssets.map((a) => (
                        <tr key={a.id} className="transition-colors hover:bg-secondary/40">
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground">{a.name}</p>
                            <p className="tabular text-xs text-muted-foreground">{a.id}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground font-medium">
                              {a.type}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">{entityName(a.entity)}</p>
                            <p className="text-[11px]">{a.project}</p>
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={a.status} />
                          </td>
                          <td className="px-3 py-3 text-xs">
                            <span
                              className={`font-medium ${
                                a.condition === "Good"
                                  ? "text-success"
                                  : a.condition === "Fair"
                                    ? "text-warning-foreground"
                                    : "text-destructive"
                              }`}
                            >
                              {a.condition}
                            </span>
                          </td>
                          <td className="px-3 py-3 w-36">
                            <ProgressBar value={a.utilisation} />
                          </td>
                          <td className="px-3 py-3 text-xs text-muted-foreground">
                            {a.maintenance}
                          </td>
                          <td className="tabular px-5 py-3 text-right font-semibold text-foreground">
                            {fmtCurrency(a.value)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 2: SHIPMENTS & LOGISTICS */}
          <TabsContent value="shipments" className="mt-4 space-y-4">
            <Panel title="Inbound & Transit Shipments" description="Live status of heavy freight, materials & equipment in transit">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scopedShipments.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="tabular text-[11px] font-bold text-primary tracking-wide">
                            {s.id}
                          </span>
                          <h4 className="font-semibold text-foreground text-sm mt-0.5">{s.ref}</h4>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>

                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Origin:</span>
                          <span className="font-medium text-foreground">{s.origin}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Destination:</span>
                          <span className="font-medium text-foreground">{s.destination}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Transport Mode:</span>
                          <span className="rounded bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                            {s.mode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Est. Arrival:</span>
                          <span className="font-medium text-foreground">{fmtDate(s.eta)}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Cargo Value:</span>
                          <span className="font-semibold text-foreground">{fmtCurrency(s.value)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Transit Progress</span>
                        <span className="tabular font-medium text-foreground">{s.progress}%</span>
                      </div>
                      <ProgressBar value={s.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 3: WAREHOUSES & STORAGE */}
          <TabsContent value="warehouses" className="mt-4 space-y-4">
            <Panel title="Warehouse Facilities & Yard Storage" description="Consolidated storage capacity and throughput metrics">
              <div className="grid gap-4 md:grid-cols-2">
                {scopedWarehouses.map((w) => {
                  const pct = Math.round((w.used / w.capacity) * 100);
                  return (
                    <div
                      key={w.name}
                      className="rounded-lg border border-border bg-card p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{w.name}</h4>
                          <p className="text-xs text-muted-foreground">Entity: {entityName(w.entity)}</p>
                        </div>
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                          {w.throughput}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Capacity Utilization</span>
                          <span className="tabular font-semibold text-foreground">{pct}%</span>
                        </div>
                        <ProgressBar value={pct} tone={pct > 80 ? "warning" : "success"} />
                        <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                          <span>Used: {w.used.toLocaleString()} units</span>
                          <span>Capacity: {w.capacity.toLocaleString()} units</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 4: MAINTENANCE SCHEDULE */}
          <TabsContent value="maintenance" className="mt-4">
            <Panel title="Preventive Maintenance & Servicing Log" description="Upcoming inspections, servicing schedules & equipment readiness">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">Asset</th>
                      <th className="px-3 py-3 font-medium">Type</th>
                      <th className="px-3 py-3 font-medium">Operating Condition</th>
                      <th className="px-3 py-3 font-medium">Maintenance Status</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {scopedAssets.map((a) => (
                      <tr key={a.id} className="hover:bg-secondary/40">
                        <td className="px-5 py-3">
                          <p className="font-medium text-foreground">{a.name}</p>
                          <p className="tabular text-xs text-muted-foreground">{a.id} · {a.project}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{a.type}</td>
                        <td className="px-3 py-3 text-xs">
                          <span className="rounded bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                            {a.condition}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Wrench className="size-3.5 text-muted-foreground" />
                            <span>{a.maintenance}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-secondary transition-colors">
                            Schedule Service
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
