import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth-context";
import { type EntityId } from "@/data/mock";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requiredEntity?: EntityId;
}

export function ProtectedRoute({ children, requiredRole, requiredEntity }: ProtectedRouteProps) {
  const { isAuthenticated, user, canAccessEntity } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-3">
          <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          Your active role (<span className="font-semibold text-foreground">{user.role}</span>) does not have authorization to view this enterprise module.
        </p>
      </div>
    );
  }

  if (requiredEntity && !canAccessEntity(requiredEntity)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-warning/10 p-4 text-warning mb-3">
          <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">Entity Boundary Isolation</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          This record belongs to an operating entity outside your configured user scope ({user.entityScope.join(", ")}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
