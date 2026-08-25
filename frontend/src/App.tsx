import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EntityProvider } from "@/components/entity-context";
import { AuthProvider } from "@/components/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

import LoginPage from "@/routes/login";
import DashboardPage from "@/routes/index";
import ProjectsIndexPage from "@/routes/projects.index";
import ProjectDetailPage from "@/routes/projects.$projectId";
import SiteUsersPage from "@/routes/site-users";
import DailyReportingPage from "@/routes/daily-reporting";
import ProgressTrackingPage from "@/routes/progress-tracking";
import IssuesRfisPage from "@/routes/issues-rfis";
import QualityHsePage from "@/routes/quality-hse";
import DocumentsApprovalsPage from "@/routes/documents-approvals";
import AIPage from "@/routes/ai";
import SettingsPage from "@/routes/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EntityProvider>
          <BrowserRouter>
            <Routes>
              {/* Unrestricted Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Construction Site Operations MVP Flow Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                {/* Step 8: Management Dashboard & Audit */}
                <Route path="/" element={<DashboardPage />} />

                {/* Step 1: Project & Site Setup */}
                <Route path="/projects" element={<ProjectsIndexPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />

                {/* Step 2: Site Users & Access */}
                <Route path="/site-users" element={<SiteUsersPage />} />

                {/* Step 3: Daily Site Reporting */}
                <Route path="/daily-reporting" element={<DailyReportingPage />} />

                {/* Step 4: Progress Tracking */}
                <Route path="/progress-tracking" element={<ProgressTrackingPage />} />

                {/* Step 5: Issues / Tasks / RFIs */}
                <Route path="/issues-rfis" element={<IssuesRfisPage />} />

                {/* Step 6: Inspection / Quality / HSE */}
                <Route path="/quality-hse" element={<QualityHsePage />} />

                {/* Step 7: Documents & Approvals */}
                <Route path="/documents-approvals" element={<DocumentsApprovalsPage />} />

                {/* Platform System & Settings */}
                <Route path="/ai" element={<AIPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Legacy route redirects to Construction MVP Flow */}
                <Route path="/people" element={<Navigate to="/site-users" replace />} />
                <Route path="/risks" element={<Navigate to="/quality-hse" replace />} />
                <Route path="/documents" element={<Navigate to="/documents-approvals" replace />} />
                <Route path="/approvals" element={<Navigate to="/documents-approvals" replace />} />
                <Route path="/assets" element={<Navigate to="/progress-tracking" replace />} />
                <Route path="/business-development" element={<Navigate to="/projects" replace />} />
                <Route path="/procurement" element={<Navigate to="/projects" replace />} />
                <Route path="/contracts" element={<Navigate to="/documents-approvals" replace />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="bottom-right" />
          </BrowserRouter>
        </EntityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
