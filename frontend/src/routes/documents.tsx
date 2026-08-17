import { useMemo, useState } from "react";
import { Search, Folder, FileText, Upload, Plus } from "lucide-react";
import { PageHeader, Panel, StatusBadge, EmptyState } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { documents, documentTree, entityName, fmtDate, entities, type EntityId } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { scope, label } = useEntity();
  const [docList, setDocList] = useState(documents);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("All");
  const [cls, setCls] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Technical Specifications",
    classification: "Internal",
    entity: "construction" as EntityId,
    owner: "Document Controller",
    fileSize: "4.2 MB",
  });

  const rows = useMemo(
    () => scope(docList).filter((d) =>
      `${d.name} ${d.owner} ${d.category}`.toLowerCase().includes(q.toLowerCase()) &&
      (folder === "All" || d.folder.startsWith(folder)) &&
      (cls === "all" || d.classification === cls)),
    [scope, docList, q, folder, cls],
  );

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter document name");
      return;
    }

    const newDoc = {
      id: `DOC-2026-${String(docList.length + 1).padStart(2, "0")}`,
      name: formData.name,
      folder: folder === "All" ? "Project Files" : folder,
      category: formData.category,
      classification: formData.classification as any,
      entity: formData.entity,
      project: "PRJ-2026-01",
      owner: formData.owner,
      size: formData.fileSize,
      modified: "2026-08-17",
      version: "v1.0",
    };

    setDocList((prev) => [newDoc, ...prev]);
    toast.success(`Document Uploaded: ${newDoc.name}`, {
      description: `Category: ${newDoc.category} · Classification: ${newDoc.classification}`,
    });
    setIsModalOpen(false);
    setFormData({
      name: "",
      category: "Technical Specifications",
      classification: "Internal",
      entity: "construction" as EntityId,
      owner: "Document Controller",
      fileSize: "4.2 MB",
    });
  };

  return (
    <>
      <PageHeader
        title="Documents"
        description={`Document control · ${label}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Documents" }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Upload className="size-4" />
            Upload
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Panel title="Repository" bodyClassName="p-2">
          <button onClick={() => setFolder("All")} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${folder === "All" ? "bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>
            <Folder className="size-4" /> All documents
          </button>
          {documentTree.map((f) => (
            <div key={f.name} className="mt-1">
              <button onClick={() => setFolder(f.name)} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${folder === f.name ? "bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>
                <Folder className="size-4 shrink-0" /><span className="flex-1 truncate">{f.name}</span>
                <span className="tabular text-[11px] text-muted-foreground">{f.count}</span>
              </button>
              <ul className="mt-0.5 ml-6 space-y-0.5">
                {f.children.map((c) => (
                  <li key={c} className="truncate rounded px-2 py-1 text-xs text-muted-foreground hover:bg-secondary">{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>

        <Panel bodyClassName="p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            <div className="relative min-w-56 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents" className="h-9 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none focus:border-primary/50" />
            </div>
            <select value={cls} onChange={(e) => setCls(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm outline-none">
              <option value="all">All classifications</option>
              {["Internal", "Confidential", "Restricted"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {rows.length === 0 ? <div className="p-6"><EmptyState title="No documents found" description="Try a different folder, classification or search term." /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Document</th>
                    <th className="px-3 py-2.5 font-medium">Folder</th>
                    <th className="px-3 py-2.5 font-medium">Entity</th>
                    <th className="px-3 py-2.5 font-medium">Category</th>
                    <th className="px-3 py-2.5 font-medium">Classification</th>
                    <th className="px-3 py-2.5 font-medium">Version</th>
                    <th className="px-3 py-2.5 text-right font-medium">Size</th>
                    <th className="px-5 py-2.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((d) => (
                    <tr key={d.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-3">
                        <p className="font-medium flex items-center gap-2">
                          <FileText className="size-4 text-primary shrink-0" />
                          {d.name}
                        </p>
                        <p className="tabular text-xs text-muted-foreground">{d.id} · {d.owner}</p>
                      </td>
                      <td className="px-3 py-3 text-xs">{d.folder}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{entityName(d.entity)}</td>
                      <td className="px-3 py-3 text-xs">{d.category}</td>
                      <td className="px-3 py-3"><StatusBadge status={d.classification} /></td>
                      <td className="px-3 py-3 text-xs">{d.version}</td>
                      <td className="tabular px-3 py-3 text-right text-xs">{d.size}</td>
                      <td className="px-5 py-3 text-xs">{fmtDate(d.modified)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Upload className="size-5 text-primary" /> Upload Enterprise Document
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register document metadata, security classification, and access scope.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDocument} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Document Title / File Name</label>
              <input
                type="text"
                placeholder="e.g. Geotechnical Soil Survey Report 2026.pdf"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Document Category</label>
                <input
                  type="text"
                  placeholder="Technical Specs"
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Security Classification</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData((f) => ({ ...f, classification: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="Internal">Internal</option>
                  <option value="Confidential">Confidential</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Target Entity</label>
                <select
                  value={formData.entity}
                  onChange={(e) => setFormData((f) => ({ ...f, entity: e.target.value as EntityId }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Document Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData((f) => ({ ...f, owner: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
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
                Confirm Upload
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
