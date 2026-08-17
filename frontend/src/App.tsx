import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import BusinessDevelopmentPage from "@/routes/business-development";
import ContractsIndexPage from "@/routes/contracts.index";
import ContractDetailPage from "@/routes/contracts.$contractId";
import ProcurementPage from "@/routes/procurement";
import FinancePage from "@/routes/finance";
import RisksPage from "@/routes/risks";
import ApprovalsPage from "@/routes/approvals";
import DocumentsPage from "@/routes/documents";
import PeoplePage from "@/routes/people";
import AssetsPage from "@/routes/assets";
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

              {/* Protected Application Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsIndexPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/business-development" element={<BusinessDevelopmentPage />} />
                <Route path="/contracts" element={<ContractsIndexPage />} />
                <Route path="/contracts/:contractId" element={<ContractDetailPage />} />
                <Route path="/procurement" element={<ProcurementPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/risks" element={<RisksPage />} />
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/people" element={<PeoplePage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/ai" element={<AIPage />} />
                <Route path="/settings" element={<SettingsPage />} />
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
