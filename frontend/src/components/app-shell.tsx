import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Users, ClipboardList, Activity, MessageSquare,
  ShieldCheck, FileCheck, Sparkles, Settings, Search,
  Bell, HelpCircle, ChevronsUpDown, Check, Menu, X, Layers, LogOut, HardHat
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useEntity } from "@/components/entity-context";
import { useAuth } from "@/components/auth-context";
import { entities, notifications, type EntityId } from "@/data/mock";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  {
    section: "Construction MVP Flow",
    items: [
      { to: "/", label: "Dashboard & Audit", icon: LayoutDashboard },
      { to: "/projects", label: "Project & Site Setup", icon: FolderKanban },
      { to: "/site-users", label: "Site Users & Access", icon: Users },
      { to: "/daily-reporting", label: "Daily Site Reporting", icon: ClipboardList },
      { to: "/progress-tracking", label: "Progress Tracking", icon: Activity },
      { to: "/issues-rfis", label: "Issues, Tasks & RFIs", icon: MessageSquare, badge: 4 },
      { to: "/quality-hse", label: "Inspection / HSE", icon: ShieldCheck, badge: 3 },
      { to: "/documents-approvals", label: "Documents & Approvals", icon: FileCheck, badge: 7 },
    ],
  },
  {
    section: "Platform Foundations",
    items: [
      { to: "/settings", label: "Platform Settings", icon: Settings },
      { to: "/ai", label: "AI Site Copilot", icon: Sparkles },
    ],
  },
];

function EntitySelector() {
  const { entity, setEntity, label } = useEntity();
  const { canAccessEntity } = useAuth();

  const allOptions: { id: EntityId; name: string; hint: string }[] = [
    { id: "all", name: "All Entities", hint: "Consolidated group view" },
    ...entities.map((e) => ({ id: e.id as EntityId, name: e.name, hint: "Entity workspace" })),
  ];

  // Filter options by logged-in user permissions
  const availableOptions = allOptions.filter((o) => canAccessEntity(o.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md border border-nav-border bg-nav-active/50 px-2.5 py-2 text-left transition-colors hover:bg-nav-active">
        <span className="flex size-7 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
          {entity === "all" ? "GR" : entities.find((e) => e.id === entity)?.short}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-nav-foreground">{label}</span>
          <span className="block text-[11px] text-nav-muted">
            {entity === "all" ? "Group consolidated" : "Entity scope"}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-nav-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs">Switch context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableOptions.map((o) => (
          <DropdownMenuItem key={o.id} onSelect={() => setEntity(o.id)} className="gap-2">
            <span className="flex-1">
              <span className="block text-sm">{o.name}</span>
              <span className="block text-[11px] text-muted-foreground">{o.hint}</span>
            </span>
            {entity === o.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-nav">
      <div className="flex items-center gap-2.5 border-b border-nav-border px-4 py-3.5">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary">
          <HardHat className="size-4 text-primary-foreground" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-nav-foreground">Enterprise OS</p>
          <p className="text-[11px] text-primary font-medium">Construction Site Operations MVP</p>
        </div>
      </div>

      <div className="border-b border-nav-border p-3">
        <EntitySelector />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-nav-muted uppercase">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                        active
                          ? "bg-nav-active font-medium text-nav-foreground"
                          : "text-nav-muted hover:bg-nav-active/60 hover:text-nav-foreground",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {"badge" in item && item.badge ? (
                        <span className="tabular rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold text-primary-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-nav-border p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {user?.avatar ?? "US"}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-nav-foreground">{user?.name ?? "User"}</p>
            <p className="truncate text-[11px] text-nav-muted">{user?.role ?? "Guest"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { label, isGroup } = useEntity();
  const { user, logout } = useAuth();
  const unread = notifications.filter((n) => n.unread).length;

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search projects, contracts, suppliers, documents…"
          className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="mr-1 hidden items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs sm:flex">
          <span className="text-muted-foreground">Context</span>
          <span className="font-medium text-foreground">{label}</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-px text-[10px] font-medium",
              isGroup ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {isGroup ? "Consolidated" : "Entity"}
          </span>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              Notifications <span className="text-muted-foreground">{unread} unread</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                <span className="text-[13px] font-medium">{n.title}</span>
                <span className="text-[11px] text-muted-foreground">
                  {n.detail} · {n.time}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <HelpCircle className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-md border border-border bg-background py-1 pr-2 pl-1 hover:bg-secondary">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {user?.avatar ?? "US"}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[12px] font-medium">{user?.name ?? "User"}</span>
              <span className="block text-[10px] text-muted-foreground">{user?.role ?? "Guest"}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">
              <span className="block font-semibold">{user?.name}</span>
              <span className="block text-[10px] text-muted-foreground font-normal">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>System Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/ai")}>AI Copilot ({user?.aiAuthorityLevel.split(" ")[0]})</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive gap-2">
              <LogOut className="size-3.5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-nav-border lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 -right-10 rounded-md bg-surface p-2 text-foreground"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
