import { useState } from "react";
import { PageHeader, Panel, StatusBadge } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntity } from "@/components/entity-context";
import { roles, departments, entities, entityName } from "@/data/mock";
import {
  Settings,
  Shield,
  Users,
  Building2,
  Lock,
  Globe,
  Database,
  CheckCircle,
  Save,
  Key,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { label } = useEntity();
  const [tab, setTab] = useState("general");

  // General Settings State
  const [systemName, setSystemName] = useState("Group Control Tower");
  const [defaultCurrency, setDefaultCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("UTC+00:00 (GMT)");
  const [auditLogging, setAuditLogging] = useState(true);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform settings saved successfully");
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description={`Platform configuration, role-based access control, security & entity governance · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Settings" }]}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general">General & Workspace</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="departments">Departments & Teams</TabsTrigger>
          <TabsTrigger value="integrations">Integrations & Security</TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL & WORKSPACE */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="System Preferences" description="Configure core branding and regional defaults">
              <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Platform Title
                  </label>
                  <input
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Reporting Base Currency
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="USD ($)">USD ($) — United States Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    System Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="UTC+00:00 (GMT)">UTC+00:00 (GMT)</option>
                    <option value="UTC+01:00 (CET)">UTC+01:00 (CET)</option>
                    <option value="UTC+05:30 (IST)">UTC+05:30 (IST)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audit-log"
                      checked={auditLogging}
                      onChange={(e) => setAuditLogging(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="audit-log" className="text-xs text-foreground cursor-pointer">
                      Enable mandatory audit logging on approval actions
                    </label>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Save className="size-3.5" />
                    Save Preferences
                  </button>
                </div>
              </form>
            </Panel>

            <Panel title="Entities & Business Units" description="Active group entities configured in workspace">
              <div className="divide-y divide-border">
                {entities.map((e) => (
                  <div key={e.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
                        {e.short}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">ID: {e.id}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                      <CheckCircle className="size-3.5" /> Active
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 2: ROLES & PERMISSIONS */}
        <TabsContent value="roles" className="mt-4">
          <Panel title="Role-Based Access Control (RBAC)" description="Defined system roles, user allocations, and permission thresholds">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Role Title</th>
                    <th className="px-3 py-3 font-medium">Active Users</th>
                    <th className="px-3 py-3 font-medium">Entity Scope</th>
                    <th className="px-3 py-3 font-medium">Permissions & Limits</th>
                    <th className="px-5 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {roles.map((r) => (
                    <tr key={r.name} className="hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-foreground text-xs">{r.name}</p>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <span className="tabular font-medium text-foreground">{r.users} users</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        <span className="rounded bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                          {r.scope}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{r.permissions}</td>
                      <td className="px-5 py-3 text-right">
                        <StatusBadge status="active" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 3: DEPARTMENTS & TEAMS */}
        <TabsContent value="departments" className="mt-4">
          <Panel title="Corporate Departments Register" description="Headcount and department leads across all operating entities">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Department</th>
                    <th className="px-3 py-3 font-medium">Entity</th>
                    <th className="px-3 py-3 font-medium">Department Lead</th>
                    <th className="px-3 py-3 font-medium">Headcount</th>
                    <th className="px-5 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {departments.map((d) => (
                    <tr key={d.name} className="hover:bg-secondary/40">
                      <td className="px-5 py-3 font-medium text-xs text-foreground">{d.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(d.entity)}</td>
                      <td className="px-3 py-3 text-xs text-foreground font-medium">{d.lead}</td>
                      <td className="px-3 py-3 text-xs">
                        <span className="tabular font-semibold text-foreground">{d.headcount}</span> members
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="rounded border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                          Manage Team
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 4: INTEGRATIONS & SECURITY */}
        <TabsContent value="integrations" className="mt-4 space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Enterprise ERP & API Connections" description="Connected backend enterprise platforms">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <Database className="size-4 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">SAP S/4HANA Finance API</h4>
                      <p className="text-[11px] text-muted-foreground">Syncs financial ledgers & cash flow</p>
                    </div>
                  </div>
                  <span className="rounded bg-success/10 px-2 py-0.5 font-medium text-success border border-success/20">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <Globe className="size-4 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">Oracle Primavera P6 EPPM</h4>
                      <p className="text-[11px] text-muted-foreground">Syncs project schedules & milestones</p>
                    </div>
                  </div>
                  <span className="rounded bg-success/10 px-2 py-0.5 font-medium text-success border border-success/20">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <Key className="size-4 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">Banking Swift Gateway</h4>
                      <p className="text-[11px] text-muted-foreground">Automated payment status reconciliation</p>
                    </div>
                  </div>
                  <span className="rounded bg-warning/10 px-2 py-0.5 font-medium text-warning-foreground border border-warning/20">
                    Sync Pending
                  </span>
                </div>
              </div>
            </Panel>

            <Panel title="Security & Authentication" description="Single sign-on, session timeout & access policies">
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">SAML 2.0 / Okta SSO</h4>
                    <p className="text-[11px] text-muted-foreground">Enterprise single sign-on enforced</p>
                  </div>
                  <StatusBadge status="active" />
                </div>

                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Session Timeout</h4>
                    <p className="text-[11px] text-muted-foreground">30 minutes idle expiration</p>
                  </div>
                  <button className="rounded border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary">
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
                    <p className="text-[11px] text-muted-foreground">Enforced for executives & finance leads</p>
                  </div>
                  <StatusBadge status="active" />
                </div>
              </div>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
