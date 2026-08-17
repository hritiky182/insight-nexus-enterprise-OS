import { useState } from "react";
import { PageHeader, Panel, StatCard } from "@/components/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntity } from "@/components/entity-context";
import { people, departments, roles, entities, entityName } from "@/data/mock";

export default function PeoplePage() {
  const { scope, label } = useEntity();
  const [tab, setTab] = useState("entities");

  return (
    <>
      <PageHeader title="People & Organization" description={`Organizational structure · ${label}`} breadcrumbs={[{ label: "Home", to: "/" }, { label: "People" }]} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Entities" value="4" sub="operating companies" />
        <StatCard label="Departments" value={String(departments.length)} sub="across the group" />
        <StatCard label="Headcount" value={String(departments.reduce((s, d) => s + d.headcount, 0))} sub="permanent staff" />
        <StatCard label="Role profiles" value={String(roles.length)} sub="permission sets" />
      </div>

      <div className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="entities" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {entities.map((e) => {
              const depts = departments.filter((d) => d.entity === e.id);
              return (
                <Panel key={e.id} title={e.name} description={`${depts.length} departments`}>
                  <p className="text-2xl font-semibold">{depts.reduce((s, d) => s + d.headcount, 0)}</p>
                  <p className="text-xs text-muted-foreground">headcount</p>
                  <ul className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs">
                    {depts.map((d) => (
                      <li key={d.name} className="flex justify-between"><span>{d.name}</span><span className="tabular text-muted-foreground">{d.headcount}</span></li>
                    ))}
                  </ul>
                </Panel>
              );
            })}
          </TabsContent>

          <TabsContent value="departments" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Department</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Lead</th><th className="px-5 py-2.5 text-right font-medium">Headcount</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scope(departments).map((d) => (
                    <tr key={d.name} className="hover:bg-secondary/50">
                      <td className="px-5 py-3 font-medium">{d.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(d.entity)}</td>
                      <td className="px-3 py-3 text-xs">{d.lead}</td>
                      <td className="tabular px-5 py-3 text-right">{d.headcount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="employees" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Name</th><th className="px-3 py-2.5 font-medium">Role</th><th className="px-3 py-2.5 font-medium">Entity</th><th className="px-3 py-2.5 font-medium">Department</th><th className="px-3 py-2.5 font-medium">Location</th><th className="px-5 py-2.5 text-right font-medium">Projects</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scope(people).map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3"><div className="flex items-center gap-2.5"><span className="flex size-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">{m.name.split(" ").map((n) => n[0]).join("")}</span><div><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div></div></td>
                      <td className="px-3 py-3 text-xs">{m.role}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(m.entity)}</td>
                      <td className="px-3 py-3 text-xs">{m.department}</td>
                      <td className="px-3 py-3 text-xs">{m.location}</td>
                      <td className="tabular px-5 py-3 text-right">{m.projects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>

          <TabsContent value="roles" className="mt-4">
            <Panel bodyClassName="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-2.5 font-medium">Role</th><th className="px-3 py-2.5 font-medium">Scope</th><th className="px-3 py-2.5 font-medium">Permissions</th><th className="px-5 py-2.5 text-right font-medium">Users</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {roles.map((r) => (
                    <tr key={r.name} className="hover:bg-secondary/50">
                      <td className="px-5 py-3 font-medium">{r.name}</td>
                      <td className="px-3 py-3 text-xs">{r.scope}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{r.permissions}</td>
                      <td className="tabular px-5 py-3 text-right">{r.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
