import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel, StatusBadge, StatCard, KeyValue, EmptyState } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  contracts, contractObligations, contractVariations, contractClaims, documents,
  projectActivity, entityName, fmtMoney, fmtCurrency, fmtDate, milestones,
} from "@/data/mock";

export default function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const c = contracts.find((item) => item.id === contractId);
  const [tab, setTab] = useState("overview");

  if (!c) {
    return (
      <div className="p-8 text-center">
        <EmptyState title="Contract Not Found" description="The requested contract could not be located." />
        <Link to="/contracts" className="mt-4 inline-block text-xs font-semibold text-primary underline">
          Back to Contracts
        </Link>
      </div>
    );
  }

  const obligations = contractObligations.filter((o) => o.contract === c.id);
  const variations = contractVariations.filter((v) => v.contract === c.id);
  const claims = contractClaims.filter((v) => v.contract === c.id);
  const docs = documents.filter((d) => d.folder.includes(c.id));

  return (
    <>
      <PageHeader
        title={c.title}
        description={`${c.type} with ${c.counterparty}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contracts", to: "/contracts" }, { label: c.id }]}
        actions={
          <>
            <StatusBadge status={c.status} />
            <button
              onClick={() => toast.success("Review requested", { description: `${c.id} sent to Group Legal for contractual review.` })}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              Request review
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Contract value" value={`$${fmtMoney(c.value)}`} sub="incl. approved variations" />
        <StatCard label="Variations" value={`$${fmtMoney(variations.reduce((s, v) => s + v.value, 0))}`} sub={`${variations.length} submitted`} />
        <StatCard label="Claims exposure" value={`$${fmtMoney(claims.reduce((s, v) => s + v.value, 0))}`} sub={`${claims.length} lodged`} tone="warning" />
        <StatCard label="Expiry" value={fmtDate(c.expiry)} sub="renewal decision required" tone={c.status === "expiring" ? "danger" : "neutral"} />
      </div>

      <div className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex w-full flex-wrap justify-start">
            {["overview", "obligations", "milestones", "variations", "claims", "documents", "activity"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Panel title="Contract summary">
              <KeyValue
                items={[
                  { label: "Reference", value: c.id },
                  { label: "Counterparty", value: c.counterparty },
                  { label: "Entity", value: entityName(c.entity) },
                  { label: "Project", value: c.project },
                  { label: "Type", value: c.type },
                  { label: "Owner", value: c.owner },
                  { label: "Commencement", value: fmtDate(c.start) },
                  { label: "Expiry", value: fmtDate(c.expiry) },
                  { label: "Value", value: fmtCurrency(c.value) },
                ]}
              />
            </Panel>
          </TabsContent>

          <TabsContent value="obligations" className="mt-4">
            <Panel title="Obligations" bodyClassName="p-0">
              {obligations.length === 0 ? <div className="p-6"><EmptyState title="No obligations recorded" /></div> : (
                <ul className="divide-y divide-border">
                  {obligations.map((o) => (
                    <li key={o.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{o.title}</p>
                        <p className="text-xs text-muted-foreground">{o.frequency} · next {fmtDate(o.next)} · {o.owner}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="milestones" className="mt-4">
            <Panel title="Payment milestones" bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {milestones.map((m) => (
                  <li key={m.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">Due {fmtDate(m.due)}</p>
                    </div>
                    <span className="tabular text-sm">${fmtMoney(m.value)}</span>
                    <StatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            </Panel>
          </TabsContent>

          <TabsContent value="variations" className="mt-4">
            <Panel title="Variations" bodyClassName="p-0">
              {variations.length === 0 ? <div className="p-6"><EmptyState title="No variations raised" /></div> : (
                <ul className="divide-y divide-border">
                  {variations.map((v) => (
                    <li key={v.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{v.title}</p>
                        <p className="tabular text-xs text-muted-foreground">{v.id} · {fmtDate(v.date)}</p>
                      </div>
                      <span className="tabular text-sm">${fmtMoney(v.value)}</span>
                      <StatusBadge status={v.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="claims" className="mt-4">
            <Panel title="Claims" bodyClassName="p-0">
              {claims.length === 0 ? <div className="p-6"><EmptyState title="No claims lodged" /></div> : (
                <ul className="divide-y divide-border">
                  {claims.map((v) => (
                    <li key={v.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{v.title}</p>
                        <p className="tabular text-xs text-muted-foreground">{v.id} · {fmtDate(v.date)}</p>
                      </div>
                      <span className="tabular text-sm">${fmtMoney(v.value)}</span>
                      <StatusBadge status={v.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Panel title="Documents" bodyClassName="p-0">
              {docs.length === 0 ? <div className="p-6"><EmptyState title="No documents linked" /></div> : (
                <ul className="divide-y divide-border">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.version} · {d.owner} · {fmtDate(d.modified)}</p>
                      </div>
                      <StatusBadge status={d.classification} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Panel title="Contract activity">
              <ol className="relative space-y-6 border-l border-border pl-6">
                {projectActivity.slice(0, 4).map((a) => (
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
    </>
  );
}
