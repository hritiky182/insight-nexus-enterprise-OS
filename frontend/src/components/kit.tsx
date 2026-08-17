import { Link } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  sub,
  delta,
  icon: Icon,
  to,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: { value: string; positive?: boolean };
  icon?: LucideIcon;
  to?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneRing = {
    neutral: "text-primary bg-accent",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
  }[tone];

  const body = (
    <div className="group h-full rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {Icon && (
          <span className={cn("flex size-7 items-center justify-center rounded-md", toneRing)}>
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p className="tabular mt-3 text-2xl font-semibold text-foreground">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {delta && (
          <span
            className={cn(
              "tabular text-xs font-medium",
              delta.positive ? "text-success" : "text-destructive",
            )}
          >
            {delta.value}
          </span>
        )}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

const statusStyles: Record<string, string> = {
  "on-track": "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  approved: "bg-success/10 text-success border-success/20",
  completed: "bg-muted text-muted-foreground border-border",
  closed: "bg-muted text-muted-foreground border-border",
  delivered: "bg-success/10 text-success border-success/20",
  valid: "bg-success/10 text-success border-success/20",
  agreed: "bg-success/10 text-success border-success/20",
  low: "bg-success/10 text-success border-success/20",
  "at-risk": "bg-warning/10 text-warning-foreground border-warning/30",
  expiring: "bg-warning/10 text-warning-foreground border-warning/30",
  pending: "bg-warning/10 text-warning-foreground border-warning/30",
  medium: "bg-warning/10 text-warning-foreground border-warning/30",
  "in-progress": "bg-info/10 text-info border-info/20",
  submitted: "bg-info/10 text-info border-info/20",
  monitoring: "bg-info/10 text-info border-info/20",
  mitigating: "bg-info/10 text-info border-info/20",
  planning: "bg-info/10 text-info border-info/20",
  planned: "bg-muted text-muted-foreground border-border",
  draft: "bg-muted text-muted-foreground border-border",
  "on-hold": "bg-muted text-muted-foreground border-border",
  open: "bg-accent text-accent-foreground border-primary/20",
  delayed: "bg-destructive/10 text-destructive border-destructive/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  "action-required": "bg-destructive/10 text-destructive border-destructive/20",
  "under-review": "bg-warning/10 text-warning-foreground border-warning/30",
  "under-assessment": "bg-info/10 text-info border-info/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap capitalize",
        statusStyles[key] ?? "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}

export function ProgressBar({ value, tone }: { value: number; tone?: string | undefined }) {
  const color =
    tone === "danger"
      ? "bg-destructive"
      : tone === "warning"
        ? "bg-warning"
        : tone === "success"
          ? "bg-success"
          : "bg-primary";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full min-w-16 overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="tabular w-9 text-right text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((b, i) => (
            <span key={b.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3" />}
              {b.to ? (
                <Link to={b.to} className="transition-colors hover:text-foreground">
                  {b.label}
                </Link>
              ) : (
                <span className="text-foreground">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function KeyValue({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">{i.label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
