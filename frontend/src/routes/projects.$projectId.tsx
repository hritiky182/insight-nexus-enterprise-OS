import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays, MapPin, User, Building2, FileText, AlertTriangle, Package, Users2,
} from "lucide-react";
import { PageHeader, Panel, StatusBadge, ProgressBar, StatCard, KeyValue, EmptyState } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  projects, milestones, risks, contracts, purchaseRequests, documents, people,
  projectActivity, entityName, fmtMoney, fmtCurrency, fmtDate,
} from "@/data/mock";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const p = projects.find((item) => item.id === projectId);
  const [tab, setTab] = useState("overview");

  if (!p) {
    return (
      <div className="p-8 text-center">
        <EmptyState title="Project Not Found" description="The requested project could not be located." />
        <Link to="/projects" className="mt-4 inline-block text-xs font-semibold text-primary underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const pMilestones = milestones.filter((m) => m.project === p.id);
  const pRisks = risks.filter((r) => r.project === p.code);
  const pContracts = contracts.filter((c) => c.project === p.code);
  const pProcurement = purchaseRequests.filter((r) => r.project === p.code);
  const pDocs = documents.filter((d) => d.project === p.code);
  const team = people.filter((m) => m.entity === p.entity).slice(0, 5);
  const variance = ((p.actual / p.budget) * 100 - p.progress).toFixed(1);

  return (
    <>
      <PageHeader
        title={p.name}
        description={p.description}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: p.code }]}
        actions={
          <>
            <StatusBadge status={p.status} />
            <button
              onClick={() => toast.success("Status report queued", { description: `${p.code} report will be generated for the August period.` })}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              Generate report
            </button>
            <Link to="/approvals" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Raise approval
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Approved budget" value={`$${fmtMoney(p.budget)}`} sub="incl. contingency" />
        <StatCard label="Actual cost" value={`$${fmtMoney(p.actual)}`} delta={{ value: `${variance}% vs progress`, positive: Number(variance) <= 0 }} tone={p.actual > p.budget ? "danger" : "neutral"} />
        <StatCard label="Physical progress" value={`${p.progress}%`} sub="verified to date" />
        <StatCard label="Health index" value={`${p.health}`} sub="delivery confidence" tone={p.health < 60 ? "danger" : p.health < 80 ? "warning" : "success"} />
        <StatCard label="Risk level" value={p.risk.toUpperCase()} sub={`${pRisks.length} open items`} tone={p.risk === "critical" || p.risk === "high" ? "danger" : "neutral"} />
      </div>

      <div className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex w-full flex-wrap justify-start">
            {["overview", "schedule", "milestones", "risks", "contracts", "procurement", "documents", "team", "activity"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-4 grid gap-4 xl:grid-cols-3">
            <Panel title="Project summary" className="xl:col-span-2">
              <KeyValue
                items={[
                  { label: "Project code", value: p.code },
                  { label: "Entity", value: <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-muted-foreground" />{entityName(p.entity)}</span> },
                  { label: "Client", value: p.client },
                  { label: "Project manager", value: <span className="inline-flex items-center gap-1.5"><User className="size-3.5 text-muted-foreground" />{p.manager}</span> },
                  { label: "Location", value: <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-muted-foreground" />{p.location}</span> },
                  { label: "Duration", value: <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-muted-foreground" />{fmtDate(p.start)} → {fmtDate(p.end)}</span> },
                ]}
              />
              <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </Panel>

            <Panel title="Budget vs actual">
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Approved budget</span>
                    <span className="tabular">{fmtCurrency(p.budget)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary/30" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Cost to date</span>
                    <span className="tabular">{fmtCurrency(p.actual)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className={`h-2 rounded-full ${p.actual > p.budget ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${Math.min((p.actual / p.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="tabular font-medium">{fmtCurrency(p.budget - p.actual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost performance</p>
                    <p className={`tabular font-medium ${p.actual / p.budget > p.progress / 100 ? "text-destructive" : "text-success"}`}>
                      {(p.progress / ((p.actual / p.budget) * 100)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Panel title="Schedule position" description="Baseline vs current programme">
              <div className="space-y-5">
                <div>
                  <p className="mb-1.5 text-xs text-muted-foreground">Baseline progress</p>
                  <ProgressBar value={Math.min(p.progress + 6, 100)} tone="success" />
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-muted-foreground">Actual progress</p>
                  <ProgressBar value={p.progress} tone={p.status === "delayed" ? "danger" : p.status === "at-risk" ? "warning" : "success"} />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 lg:grid-cols-4">
                  <div><p className="text-xs text-muted-foreground">Start</p><p className="text-sm font-medium">{fmtDate(p.start)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Planned completion</p><p className="text-sm font-medium">{fmtDate(p.end)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Forecast completion</p><p className="text-sm font-medium">{p.status === "delayed" ? "Q2 2027" : fmtDate(p.end)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Float</p><p className={`text-sm font-medium ${p.status === "on-track" ? "text-success" : "text-destructive"}`}>{p.status === "on-track" ? "+12 days" : "-21 days"}</p></div>
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="milestones" className="mt-4">
            <Panel title="Milestones" bodyClassName="p-0">
              {pMilestones.length === 0 ? (
                <div className="p-6"><EmptyState title="No milestones recorded" description="Milestones will appear here once the programme baseline is approved." /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {pMilestones.map((m) => (
                    <li key={m.id} className="flex items-center gap-4 px-5 py-3">
                      <span className={`size-2 rounded-full ${m.status === "completed" ? "bg-success" : m.status === "at-risk" ? "bg-destructive" : m.status === "in-progress" ? "bg-primary" : "bg-border"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">Due {fmtDate(m.due)}</p>
                      </div>
                      <span className="tabular text-sm">${fmtMoney(m.value)}</span>
                      <StatusBadge status={m.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="risks" className="mt-4">
            <Panel title="Project risks" bodyClassName="p-0">
              {pRisks.length === 0 ? (
                <div className="p-6"><EmptyState title="No open risks" description="This project has no risks currently registered above the reporting threshold." /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                    <tr><th className="px-5 py-2 font-medium">Risk</th><th className="px-3 py-2 font-medium">Category</th><th className="px-3 py-2 text-center font-medium">Score</th><th className="px-3 py-2 font-medium">Owner</th><th className="px-5 py-2 font-medium">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pRisks.map((r) => (
                      <tr key={r.id} className="hover:bg-secondary/50">
                        <td className="px-5 py-3">
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.id} · {r.mitigation}</p>
                        </td>
                        <td className="px-3 py-3 text-xs">{r.category}</td>
                        <td className="tabular px-3 py-3 text-center font-medium">{r.probability * r.impact}</td>
                        <td className="px-3 py-3 text-xs">{r.owner}</td>
                        <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="contracts" className="mt-4">
            <Panel title="Related contracts" bodyClassName="p-0">
              {pContracts.length === 0 ? (
                <div className="p-6"><EmptyState title="No contracts linked" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {pContracts.map((c) => (
                    <li key={c.id} className="flex items-center gap-4 px-5 py-3">
                      <FileText className="size-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <Link to={`/contracts/${c.id}`} className="text-sm font-medium hover:text-primary">{c.title}</Link>
                        <p className="text-xs text-muted-foreground">{c.id} · {c.counterparty} · {c.type}</p>
                      </div>
                      <span className="tabular text-sm">${fmtMoney(c.value)}</span>
                      <StatusBadge status={c.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="procurement" className="mt-4">
            <Panel title="Procurement activity" bodyClassName="p-0">
              {pProcurement.length === 0 ? (
                <div className="p-6"><EmptyState title="No procurement records" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {pProcurement.map((r) => (
                    <li key={r.id} className="flex items-center gap-4 px-5 py-3">
                      <Package className="size-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.id} · {r.supplier} · stage {r.stage}</p>
                      </div>
                      <span className="tabular text-sm">${fmtMoney(r.amount)}</span>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Panel title="Documents" bodyClassName="p-0">
              {pDocs.length === 0 ? (
                <div className="p-6"><EmptyState title="No documents" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {pDocs.map((d) => (
                    <li key={d.id} className="flex items-center gap-4 px-5 py-3">
                      <FileText className="size-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.folder} · {d.version} · {d.owner}</p>
                      </div>
                      <StatusBadge status={d.classification} />
                      <span className="text-xs text-muted-foreground">{fmtDate(d.modified)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="team" className="mt-4">
            <Panel title="Project team" bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {team.map((m) => (
                  <li key={m.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role} · {m.department}</p>
                    </div>
                    <Users2 className="size-4 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </Panel>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Panel title="Activity timeline">
              <ol className="relative space-y-6 border-l border-border pl-6">
                {projectActivity.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute top-1 -left-[27px] size-2.5 rounded-full border-2 border-card bg-primary" />
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{a.actor} · {a.time}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>

      {p.status !== "on-track" && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 text-warning" />
          <div>
            <p className="text-sm font-medium">Delivery intervention recommended</p>
            <p className="text-xs text-muted-foreground">
              This project is outside tolerance. A recovery plan review is scheduled with the entity director.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
