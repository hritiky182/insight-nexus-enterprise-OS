import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, mockUsers, type UserProfile } from "@/components/auth-context";
import { useEntity } from "@/components/entity-context";
import { entities } from "@/data/mock";
import {
  Shield,
  Lock,
  Building2,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setEntity } = useEntity();

  const [selectedUser, setSelectedUser] = useState<UserProfile>(mockUsers[0]!);
  const [password, setPassword] = useState("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleLogin = (userToLogin: UserProfile) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(userToLogin.id);
      if (success) {
        setEntity(userToLogin.defaultEntity);
        toast.success(`Welcome back, ${userToLogin.name}`, {
          description: `Authenticated as ${userToLogin.role} · ${userToLogin.title}`,
        });
        navigate(from, { replace: true });
      } else {
        toast.error("Authentication failed");
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(selectedUser);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary selection:text-primary-foreground">
      {/* Background Graphic Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 size-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm shadow-md">
            M
          </div>
          <div>
            <h1 className="font-bold text-sm text-foreground tracking-tight flex items-center gap-2">
              ENTERPRISE <span className="text-muted-foreground font-normal">OS</span>
            </h1>
            <p className="text-[11px] text-muted-foreground">Group Control Tower & Operational System</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 font-medium text-success border border-success/20">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            Platform v2.4 Active
          </span>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Column — Info & Feature Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary mb-3">
                <Shield className="size-3.5" /> Multi-Entity Enterprise Portal
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                Unified Group Operations & Control
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Secure multi-entity operating environment uniting civil engineering, logistics, business development, and foundation operations with ISO 31000 compliance and AI intelligence.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="rounded-md bg-primary/10 p-2 text-primary mt-0.5">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Multi-Entity Data Isolation</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Strict boundary isolation across 4 operating entities with consolidated executive rollups.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="rounded-md bg-primary/10 p-2 text-primary mt-0.5">
                  <Lock className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Governed Delegation of Authority</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Role-based approval thresholds from $250K to $15M+ with immutable audit trails.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="rounded-md bg-primary/10 p-2 text-primary mt-0.5">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Permission-Aware AI Intelligence</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AI Authority Levels AI-A0 to AI-A4 enforcing strict context guardrails over live records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Quick Persona Switcher & Login Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Demo Login Cards */}
            <div className="rounded-xl border border-border bg-card/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <UserCheck className="size-4 text-primary" /> Select Executive Persona to Sign In
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Click any role card below for instant authentication</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  Demo Fast-Track
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {mockUsers.map((u) => {
                  const isSelected = selectedUser.id === u.id;
                  const isAll = u.entityScope.includes("all");
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(u);
                        handleLogin(u);
                      }}
                      disabled={isSubmitting}
                      className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all hover:border-primary/50 hover:shadow-md ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-background hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 items-center justify-center rounded-full font-bold text-xs ${
                            isAll
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {u.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-foreground truncate">{u.name}</p>
                            {isAll && (
                              <span className="text-[9px] font-semibold bg-primary/10 text-primary px-1.5 py-0.2 rounded shrink-0">
                                Group Scope
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-foreground/80 line-clamp-1">{u.role}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{u.domain}</p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Credentials Form */}
            <form onSubmit={handleFormSubmit} className="rounded-xl border border-border bg-card/90 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Or Sign In with Corporate Email
              </h3>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => {
                    const match = mockUsers.find((u) => u.email === e.target.value);
                    if (match) setSelectedUser(match);
                  }}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Sign In as {selectedUser.name} <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border bg-card/60 backdrop-blur-sm px-6 py-4 text-center text-xs text-muted-foreground">
        <p>© 2027 Group Control Tower · Multi-Entity Enterprise OS · Security Standard ISO/IEC 27001</p>
      </footer>
    </div>
  );
}
