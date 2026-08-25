import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { type EntityId } from "@/data/mock";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  domain: string;
  entityScope: EntityId[];
  defaultEntity: EntityId;
  avatar: string;
  title: string;
  aiAuthorityLevel: "AI-A0 — Observe" | "AI-A1 — Recommend" | "AI-A2 — Prepare" | "AI-A3 — Submit / Initiate" | "AI-A4 — Limited Execution";
  approvalLimit: number; // in USD
}

export const mockUsers: UserProfile[] = [
  {
    id: "usr-exec-1",
    name: "Amara Osei",
    email: "amara.osei@enterprise.internal",
    role: "Group CEO",
    domain: "Civil Infrastructure, Construction & Logistics Group",
    title: "Chief Executive Officer & Group Managing Director",
    entityScope: ["all", "bizdev", "construction", "logistics", "foundation"],
    defaultEntity: "all",
    avatar: "AO",
    aiAuthorityLevel: "AI-A3 — Submit / Initiate",
    approvalLimit: 15_000_000,
  },
  {
    id: "usr-dir-const",
    name: "Marcus Lindqvist",
    email: "marcus.l@enterprise.internal",
    role: "Civil Engineering & Construction Director",
    domain: "Civil Engineering, EPC Contracts & Heavy Construction",
    title: "Managing Director — Engineering & Construction",
    entityScope: ["construction"],
    defaultEntity: "construction",
    avatar: "ML",
    aiAuthorityLevel: "AI-A2 — Prepare",
    approvalLimit: 5_000_000,
  },
  {
    id: "usr-fin-ctrl",
    name: "Sofia Marchetti",
    email: "sofia.marchetti@enterprise.internal",
    role: "Group CFO & Financial Controller",
    domain: "Capital Allocation, Treasury & Financial Control",
    title: "Head of Group Treasury & Financial Control",
    entityScope: ["all", "bizdev", "construction", "logistics", "foundation"],
    defaultEntity: "all",
    avatar: "SM",
    aiAuthorityLevel: "AI-A2 — Prepare",
    approvalLimit: 2_500_000,
  },
  {
    id: "usr-log-lead",
    name: "Daniel Reyes",
    email: "daniel.reyes@enterprise.internal",
    role: "Logistics & Supply Chain Manager",
    domain: "Port Terminals, Fleet Assets & Freight Forwarding",
    title: "Director of Freight & Logistics Operations",
    entityScope: ["logistics"],
    defaultEntity: "logistics",
    avatar: "DR",
    aiAuthorityLevel: "AI-A1 — Recommend",
    approvalLimit: 500_000,
  },
  {
    id: "usr-fnd-lead",
    name: "Yara Haddad",
    email: "yara.haddad@enterprise.internal",
    role: "PPP Concessions & Foundation Lead",
    domain: "Public-Private Partnerships, Infrastructure Grants & ESG",
    title: "Executive Director — PPP Projects & CSR Foundation",
    entityScope: ["foundation"],
    defaultEntity: "foundation",
    avatar: "YH",
    aiAuthorityLevel: "AI-A1 — Recommend",
    approvalLimit: 250_000,
  },
  {
    id: "usr-viewer-1",
    name: "External Auditor",
    email: "audit.partner@external-audit.internal",
    role: "GRC & Compliance Auditor",
    domain: "Independent Assurance, ISO 31000 Risk & Compliance",
    title: "Senior Governance & GRC Auditor",
    entityScope: ["construction", "logistics"],
    defaultEntity: "construction",
    avatar: "EA",
    aiAuthorityLevel: "AI-A0 — Observe",
    approvalLimit: 0,
  },
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userId: string) => boolean;
  logout: () => void;
  canAccessEntity: (entityId: EntityId) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "enterprise_os_auth_user_id";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  });

  const user = useMemo(() => {
    if (!userId) return null;
    return mockUsers.find((u) => u.id === userId) ?? null;
  }, [userId]);

  const login = (id: string) => {
    const found = mockUsers.find((u) => u.id === id);
    if (found) {
      setUserId(found.id);
      localStorage.setItem(AUTH_STORAGE_KEY, found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const canAccessEntity = (entityId: EntityId) => {
    if (!user) return false;
    if (user.entityScope.includes("all")) return true;
    return user.entityScope.includes(entityId);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      canAccessEntity,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
