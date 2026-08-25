import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Shield, HardHat, CheckCircle2, UserPlus, Search, Building2, Key, UserCheck } from "lucide-react";
import { Panel, StatCard, PageHeader, StatusBadge } from "@/components/kit";
import { ConstructionMvpFlowBanner } from "@/components/construction-mvp-flow-banner";
import { people, roles, entities } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SiteUsersPage() {
  const [userList, setUserList] = useState(people);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Site Engineer",
    department: "Project Delivery",
    location: "Coastal Sector Phase 1",
    projects: 1,
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Please fill in user name and email");
      return;
    }
    const created = {
      id: `EMP-${1200 + userList.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      location: newUser.location,
      entity: "construction",
      projects: Number(newUser.projects) || 1,
    };
    setUserList([created, ...userList]);
    toast.success(`Site Access Granted: ${created.name}`, {
      description: `Role: ${created.role} · Location: ${created.location}`,
    });
    setIsModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "Site Engineer",
      department: "Project Delivery",
      location: "Coastal Sector Phase 1",
      projects: 1,
    });
  };

  const filteredPeople = userList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "all" || p.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const siteRoles = [
    { title: "Project Manager (PM)", code: "PM", count: 12, permissions: "Full site authority, approvals up to $250k, RFI sign-off" },
    { title: "Site Engineer", code: "SE", count: 28, permissions: "Daily log creation, drawing review, technical submittals" },
    { title: "Site Supervisor", code: "SV", count: 45, permissions: "Workforce logging, vehicle pick/drop tracking, site notes" },
    { title: "HSE & Quality Lead", code: "HSE", count: 16, permissions: "Safety observations, NDT inspections, corrective action tracking" },
  ];

  return (
    <>
      <ConstructionMvpFlowBanner compact />

      <PageHeader
        title="Site Users & Access"
        description="Role-Based Access Control (RBAC) & Project-Level Permissions for PM, Site Engineer, Supervisor & HSE/Quality"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <UserPlus className="size-4" /> Add Site User
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Site Personnel" value={String(userList.length)} sub="active site personnel" icon={Users} />
        <StatCard label="Project Managers" value="12" sub="across active sites" icon={HardHat} tone="neutral" />
        <StatCard label="HSE & Quality Officers" value="16" sub="compliance officers" icon={Shield} tone="success" />
        <StatCard label="Access Scopes" value="Project-Level" sub="RBAC Enforced" icon={Key} tone="warning" />
      </div>

      {/* Role Matrix */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteRoles.map((r) => (
          <div key={r.code} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                {r.code}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-foreground">
                {r.count} Assigned
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">{r.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{r.permissions}</p>
          </div>
        ))}
      </div>

      {/* User Register */}
      <div className="mt-4">
        <Panel
          title="Site Users & Access Directory"
          description="Manage user assignments, role capabilities and entity access scope"
          bodyClassName="p-0"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 bg-secondary/30">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user by name, role or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Filter Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                <option value="director">Director</option>
                <option value="manager">Project Manager</option>
                <option value="engineer">Engineer</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 font-medium">User Name</th>
                  <th className="px-3 py-2.5 font-medium">Site Role</th>
                  <th className="px-3 py-2.5 font-medium">Department</th>
                  <th className="px-3 py-2.5 font-medium">Assigned Location</th>
                  <th className="px-3 py-2.5 font-medium">Active Projects</th>
                  <th className="px-5 py-2.5 text-right font-medium">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPeople.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <HardHat className="size-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{u.department}</td>
                    <td className="px-3 py-3 text-xs text-foreground font-medium">{u.location}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{u.projects} site(s)</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> Authorized
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* ADD SITE USER MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <UserPlus className="size-5 text-primary" /> Assign New Site User
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Grant site access rights and role-based permissions to personnel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Tariq Al-Mansoor"
                value={newUser.name}
                onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Corporate Email</label>
              <input
                type="email"
                placeholder="e.g. tariq.m@enterprise.internal"
                value={newUser.email}
                onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Site Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((u) => ({ ...u, role: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="Project Manager">Project Manager (PM)</option>
                  <option value="Site Engineer">Site Engineer</option>
                  <option value="Site Supervisor">Site Supervisor</option>
                  <option value="HSE & Quality Officer">HSE & Quality Officer</option>
                  <option value="Commercial Lead">Commercial Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser((u) => ({ ...u, department: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assigned Site Location</label>
              <input
                type="text"
                value={newUser.location}
                onChange={(e) => setNewUser((u) => ({ ...u, location: e.target.value }))}
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
                <UserCheck className="size-4" /> Grant Site Access
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
