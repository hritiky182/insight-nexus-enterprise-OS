import { useState, useRef, useEffect } from "react";
import { PageHeader, Panel, StatCard } from "@/components/kit";
import { useEntity } from "@/components/entity-context";
import { useAuth } from "@/components/auth-context";
import {
  aiSuggestions,
  aiResponses,
  aiDefaultResponse,
  recentAnalyses,
} from "@/data/mock";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Database,
  Search,
  ShieldCheck,
  AlertOctagon,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  isDecisionPack?: boolean;
}

export default function AIPage() {
  const { label } = useEntity();
  const { user } = useAuth();
  const [aiKillSwitch, setAiKillSwitch] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Welcome to **Group Control Tower AI Intelligence**.\n\nActive Authority: **${user?.aiAuthorityLevel ?? "AI-A2 — Prepare"}** · User: **${user?.name}** (${user?.role}).\n\nI have permission-aware visibility across authorized entities (${user?.entityScope.join(", ")}), active projects, contracts, pending approvals, and live treasury ledgers.\n\nAsk a natural language query or generate a formal **AI Decision Pack** for executive review.`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const matched = aiResponses[textToSend] || aiDefaultResponse;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: matched,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Response copied to clipboard");
  };

  const handleClear = () => {
    setMessages([
      {
        id: "m-1",
        sender: "ai",
        text: `Conversation cleared. Ready for your next query on **${label}**.`,
        time: "Just now",
      },
    ]);
    toast.info("Chat history cleared");
  };

  return (
    <>
      <PageHeader
        title="AI Intelligence & Decision Support"
        description={`Governed AI Intelligence Layer · Active Scope: ${label} · Level: ${user?.aiAuthorityLevel ?? "AI-A2"}`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "AI Intelligence" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAiKillSwitch(!aiKillSwitch);
                toast.warning(
                  !aiKillSwitch
                    ? "AI Emergency Stop Activated — Model execution paused"
                    : "AI Copilot Resumed"
                );
              }}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                aiKillSwitch
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <AlertOctagon className="size-3.5" />
              {aiKillSwitch ? "AI Halted (Click to Resume)" : "Emergency Stop"}
            </button>

            <button
              onClick={() => {
                if (aiKillSwitch) return;
                const decisionPackText = `### AI DECISION PACK — EXECUTIVE SUMMARY
**Target Issue:** Variation Order VO-014 (Water Treatment Works Extension)
**Contracting Entity:** Meridian Civil Engineering & Construction Ltd
**Contractor:** Apex Infrastructure Partners
**Claim Value:** $4,260,000 | **Budget Impact:** +2.8% Contingency Drawdown

#### 1. Context & Root Cause
Unforeseen ground rock formations encountered during deep foundation excavation at Node 4B. Geo-technical soil report confirmed scope variance.

#### 2. Risk & Financial Exposure
- **Legal Risk:** High risk of contractor suspension if unaddressed within 14 days (Clause 18.2).
- **Schedule Impact:** 21 days extension of time requested (critical path non-delay if approved by 25 Aug 2026).

#### 3. AI Recommendation & Authority Requirement
- **Action:** Approve VO-014 capped at $4,000,000 negotiated settlement.
- **Required Authority:** Group Executive ($15M limit) or Entity Director ($5M limit).`;

                setMessages((prev) => [
                  ...prev,
                  {
                    id: `pack-${Date.now()}`,
                    sender: "ai",
                    text: decisionPackText,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    isDecisionPack: true,
                  },
                ]);
                toast.success("AI Decision Pack generated for VO-014");
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <FileCheck className="size-3.5" />
              Generate Decision Pack
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <RefreshCw className="size-3.5" />
              Clear
            </button>
          </div>
        }
      />

      {/* KPI Header Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-6">
        <StatCard
          label="Active Authority"
          value={user?.aiAuthorityLevel.split(" ")[0] ?? "AI-A2"}
          sub={user?.aiAuthorityLevel.split(" — ")[1] ?? "Prepare"}
          icon={ShieldCheck}
          tone="success"
        />
        <StatCard
          label="Data Guardrail"
          value="Strict RBAC"
          sub={`Entity Scope: ${user?.entityScope.join(", ")}`}
          icon={Database}
          tone="neutral"
        />
        <StatCard
          label="Indexed Records"
          value="12 Projects"
          sub="10 Contracts · 7 Approvals"
          icon={Cpu}
          tone="neutral"
        />
        <StatCard
          label="Audit Lineage"
          value="100% Immutable"
          sub="All prompts logged to audit trail"
          icon={Zap}
          tone="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* MAIN CHAT AREA */}
        <div className="lg:col-span-2 flex flex-col h-[650px] rounded-lg border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Control Tower Copilot</h3>
                <p className="text-[11px] text-muted-foreground">User: {user?.name} · Authority: {user?.aiAuthorityLevel}</p>
              </div>
            </div>
            {aiKillSwitch ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive border border-destructive/20">
                <AlertOctagon className="size-3 animate-spin" /> Emergency Halted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success border border-success/20">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Live Sync
              </span>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground border border-border"
                  }`}
                >
                  {msg.sender === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>

                <div
                  className={`relative max-w-[85%] rounded-lg p-4 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/40 border border-border text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {msg.text.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={i} className="font-semibold text-sm my-1 text-foreground">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className="my-0.5">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>{msg.time}</span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.text)}
                        className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        <Copy className="size-3" /> Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-secondary text-foreground border border-border">
                  <Bot className="size-4 animate-spin" />
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground animate-pulse">
                  Analyzing portfolio metrics across entities…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="border-t border-border bg-secondary/20 p-3">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
              Suggested Executive Queries
            </p>
            <div className="flex flex-wrap gap-1.5">
              {aiSuggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary hover:border-primary/40 text-left truncate max-w-xs"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Box */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <input
              type="text"
              placeholder="Ask AI anything about budgets, risks, contracts or performance…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="size-3.5" />
              Ask
            </button>
          </div>
        </div>

        {/* SIDEBAR: RECENT ANALYSES & INTELLIGENCE FEEDS */}
        <div className="space-y-6">
          <Panel title="Recent Automated Reports" description="Pre-calculated intelligence briefings">
            <div className="divide-y divide-border">
              {recentAnalyses.map((an) => (
                <div key={an.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground">{an.title}</h4>
                    <span className="tabular text-[10px] font-mono text-muted-foreground">
                      {an.id}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Scope: {an.scope}</span>
                    <span>{an.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Real-Time Data Connections" description="Active integrations feeding AI reasoning">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-2.5">
                <span className="font-medium text-foreground">Projects & Milestones</span>
                <span className="text-success font-semibold">12 Active</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-2.5">
                <span className="font-medium text-foreground">Contracts & Claims</span>
                <span className="text-success font-semibold">10 Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-2.5">
                <span className="font-medium text-foreground">Governance Approvals</span>
                <span className="text-warning-foreground font-semibold">7 Pending</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-2.5">
                <span className="font-medium text-foreground">Treasury & Receivables</span>
                <span className="text-success font-semibold">Live Feed</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
