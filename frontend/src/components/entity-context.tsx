import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { entities, type EntityId } from "@/data/mock";

interface Ctx {
  entity: EntityId;
  setEntity: (e: EntityId) => void;
  label: string;
  isGroup: boolean;
  scope: <T extends { entity?: string }>(rows: T[]) => T[];
}

const EntityContext = createContext<Ctx | null>(null);

export function EntityProvider({ children }: { children: ReactNode }) {
  const [entity, setEntity] = useState<EntityId>("all");

  const value = useMemo<Ctx>(
    () => ({
      entity,
      setEntity,
      label: entity === "all" ? "All Entities" : (entities.find((e) => e.id === entity)?.name ?? "All Entities"),
      isGroup: entity === "all",
      scope: (rows) => (entity === "all" ? rows : rows.filter((r) => r.entity === entity)),
    }),
    [entity],
  );

  return <EntityContext.Provider value={value}>{children}</EntityContext.Provider>;
}

export function useEntity() {
  const ctx = useContext(EntityContext);
  if (!ctx) throw new Error("useEntity must be used inside EntityProvider");
  return ctx;
}
