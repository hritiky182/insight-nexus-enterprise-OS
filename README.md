# Insight Nexus — Enterprise Operating System

**Insight Nexus** is a premium enterprise web application UI demo and executive control tower designed for multi-entity infrastructure, civil engineering, logistics, and project management organizations.

Built with a focus on visual sophistication, high information density, and realistic enterprise workflows, Insight Nexus demonstrates how group executives and entity-level managers govern complex project portfolios, financial exposures, procurement pipelines, contracts, risks, assets, and approvals in a unified interface.

---

## 🌟 Key Highlights & Core Features

### 🏢 1. Multi-Entity Governance Model
Insight Nexus implements a multi-entity data architecture:
* **Consolidated "All Entities" View**: Allows Group Executives to review enterprise-wide cash flow, portfolio risk, combined financial margins, and cross-entity approval bottlenecks.
* **4 Dedicated Operating Entities**:
  1. **Business Development & Project Coordination (`BD`)**: Origination, structuring, client management, and feasibility.
  2. **Civil Engineering & Construction (`CN`)**: Engineering delivery, EPC projects, site operations, and HSE management.
  3. **Logistics & Freight Forwarding (`LG`)**: Container depots, fleet management, shipment tracking, and cold-chain logistics.
  4. **Foundation / NGO (`FD`)**: Community programs, public-benefit grant management, and ESG initiatives.
* **Context Switching**: Instant UI re-scoping across all 13 modules using the top entity selector in the sidebar.

---

### 📊 2. The 13 Enterprise Operating Modules

#### 1. Executive Control Tower (`/`)
* **KPI Header Cards**: Real-time snapshot of Active Projects, Portfolio Value ($1.15B+), Budget vs Actual spend, Group Cash Position ($203M), Open Risks, Pending Approvals ($28.6M), and Commercial Pipeline ($300M+).
* **Attention Required Feed**: Priority alerts highlighting budget overruns, contract expiry risks, and overdue approvals.
* **Interactive Data Visualizations**: Portfolio distribution by entity, project status pie charts, revenue/cost trends, risk category counts, and monthly cash flow charts using Recharts.
* **Entity Performance Comparison**: Real-time financial table comparing revenue, costs, profit margins, and cash reserves across entities.

#### 2. Project Delivery & Management (`/projects` & `/projects/:projectId`)
* **Project Register**: Filterable table tracking project status (*On Track, At Risk, Delayed, Planning, Completed, On Hold*), progress, budget, actual spend, and delivery health score (0–100).
* **Deep-Dive Project Workspace**: Detailed view featuring summary stats, milestone timelines, budget breakdowns, contract obligations, procurement logs, risk heatmaps, documents, site team roster, and project activity audit trail.

#### 3. Business Development & Commercial Pipeline (`/business-development`)
* **Opportunity Pipeline**: Visual stage-based pipeline (*Lead → Qualification → Feasibility → Proposal → Negotiation → Won/Lost*).
* **Financial Weighting**: Opportunity value, win probability %, target close dates, responsible owners, and sector tagging (Roads, Marine, Energy, Logistics, Social Infrastructure).

#### 4. Contract Lifecycle & Claims Register (`/contracts` & `/contracts/:contractId`)
* **Contract Register**: Complete inventory of client contracts (FIDIC, EPC), subcontracts, supply agreements, and grant agreements with risk ratings and expiry warnings.
* **Contract Detail Workspace**: Track contractual obligations, insurance renewals, performance bond requirements, Variation Orders (VOs), and Extension of Time (EOT) claims.

#### 5. Procurement & Supply Chain (`/procurement`)
* **7-Stage Workflow Tracker**: *Request → Approval → Sourcing → Evaluation → Purchase Order → Delivery → Invoice*.
* **Procurement Operations**: Manage purchase requests, active PO status (*In production, Partially delivered, Acknowledged*), tender evaluation scorecards, and supplier performance matrices (on-time delivery %, quality ratings).

#### 6. Financial Control Tower & Treasury (`/finance`)
* **Financial Analytics**: Consolidated revenue vs cost trends, monthly cash inflow/outflow balance, and project-level gross margin profitability analysis.
* **Working Capital & Ageing**: Receivables and Payables ageing matrix (*Current, 30 days, 60 days, 90+ days*) to identify working capital bottlenecks.
* **Transaction Register**: Auditable financial transaction ledger with cleared/pending status.

#### 7. Governance, Risk & Compliance (`/risks`)
* **ISO-Style Risk Heatmap**: 5x5 Matrix plotting Risk Probability vs. Impact.
* **Enterprise Risk Register**: Risk owners, mitigation strategies, due dates, and status (*Open, Mitigating, Monitoring, Closed*).
* **Compliance & Permits**: Track expiring environmental permits, vehicle operator licenses, ISO 45001 surveillance audits, and Health & Safety (HSE) Corrective Action Requests (CA).

#### 8. Document Management System (`/documents`)
* **Hierarchical Folder Structure**: Organized by Projects, Contracts, Procurement, Finance, Compliance, Governance, and Assets.
* **Security Classifications**: Tagged with security clearance levels (*Internal, Confidential, Restricted*) and version control.

#### 9. People & Organizational Hierarchy (`/people`)
* **Employee Directory**: Department listings, location, assigned projects, and contact info.
* **Role-Based Access Control (RBAC)**: Defined security scope for *Group Executives, Entity Directors, Project Managers, Financial Controllers, Procurement Officers,* and *Viewers*.

#### 10. Assets & Logistics Control (`/assets`)
* **Plant & Heavy Equipment**: Crane fleets, batching plants, container handling equipment, utilization metrics, and maintenance schedules.
* **Shipment Live Tracking**: Sea, Road, and Air freight tracking with origin, destination, ETA, and cargo value.
* **Warehouse Network**: Storage capacity utilization, cold-storage zoning, and monthly throughput metrics.

#### 11. Central Approval Center (`/approvals`)
* **Multi-Tier Approval Inbox**: Consolidated queue for variation requests, large procurement orders, capex releases, grant tranche disbursements, and fleet contract renewals.
* **Interactive Approval Drawer**: Actionable detail modal allowing executives to *Approve*, *Reject*, or *Request Changes* with local state updates and instant UI feedback.

#### 12. AI Intelligence Workspace (`/ai`)
* **Executive AI Assistant**: Conversational AI workspace with standard prompt shortcuts ("*What projects are at risk?*", "*Show outstanding approvals*", "*What is affecting cash flow?*").
* **Scoped Intelligence**: Contextually constrained briefing engine summarizing portfolio risk, budget deviations, and cash flow impacts.

#### 13. Platform Settings (`/settings`)
* **Administrative Controls**: Organization profile, entity configuration, RBAC permissions manager, notification alert thresholds, and AI model parameters.

---

## 🛠️ Technology Stack & Architecture

* **Frontend Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
* **Build System & Dev Server**: [Vite 6](https://vitejs.dev/)
* **Routing**: [React Router v7](https://reactrouter.com/)
* **Data Management**: [TanStack React Query v5](https://tanstack.com/query)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS variables and Radix UI design tokens (`styles.css`)
* **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives & custom enterprise UI design kit (`src/components/kit.tsx`)
* **Data Visualization**: [Recharts](https://recharts.org/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Notifications**: [Sonner](https://sonner.embla.com/)

---

## 💻 Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher (or `bun` / `pnpm`)

### Installation Steps

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and visit `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📁 Directory Structure

```
insight-nexus-main/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── app-shell.tsx         # Main layout navigation header & sidebar
    │   │   ├── auth-context.tsx      # Mock authentication state provider
    │   │   ├── entity-context.tsx    # Multi-entity scope provider
    │   │   ├── protected-route.tsx  # Route guard wrapper
    │   │   ├── kit.tsx              # Reusable UI component library (Panels, Badges, StatCards)
    │   │   └── ui/                  # Radix UI primitives & styled components
    │   ├── data/
    │   │   └── mock.ts              # High-fidelity mock dataset (Projects, Risks, Financials)
    │   ├── routes/                  # React Router page views
    │   │   ├── index.tsx            # Executive Control Tower Dashboard
    │   │   ├── projects.index.tsx   # Project Directory
    │   │   ├── projects.$projectId.tsx # Project Detail View
    │   │   ├── business-development.tsx # BD & Pipeline
    │   │   ├── contracts.index.tsx  # Contract Register
    │   │   ├── contracts.$contractId.tsx # Contract Detail View
    │   │   ├── procurement.tsx      # Procurement & Supply Chain
    │   │   ├── finance.tsx          # Finance & Treasury
    │   │   ├── risks.tsx            # Governance & Risks
    │   │   ├── approvals.tsx        # Central Approvals
    │   │   ├── documents.tsx        # Document Management
    │   │   ├── people.tsx           # Organization & RBAC
    │   │   ├── assets.tsx           # Fleet & Logistics
    │   │   ├── ai.tsx               # AI Intelligence Workspace
    │   │   ├── settings.tsx         # Platform Settings
    │   │   └── login.tsx            # Authentication Page
    │   ├── App.tsx                  # Core App entry & router configuration
    │   ├── main.tsx                 # React DOM mount point
    │   └── styles.css               # Global CSS tokens, custom scrollbars, typography
    ├── package.json
    └── vite.config.ts
```

---

## 🎯 Target Persona & User Roles

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Group Executive** | All Entities | High-level portfolio overview, cash flow forecasting, board reporting, approving high-value variations (> $5M). |
| **Entity Director** | Single Entity | Full operational control within their entity (BD, Construction, Logistics, Foundation), budget tracking, approvals (< $5M). |
| **Project Manager** | Assigned Projects | Milestone updates, site risk logging, subcontract variations, progress reporting. |
| **Finance Controller** | Group / Entity | Treasury, receivables/payables ageing, cash flow monitoring, invoice clearance. |
| **Procurement Officer** | Group / Entity | PO issuing, tender evaluation, supplier scorecard management. |

---

## 📝 Design Principles

* **Linear & Palantir Inspired Aesthetic**: Dark charcoal navigation sidebar combined with crisp, high-contrast light main workspace panels.
* **Information Density**: Tailored for enterprise decision-makers with detailed data tables, mini progress indicators, and precise badge indicators.
* **Zero Dummy Data**: Uses realistic infrastructure projects (*Coastal Ring Road, Metro Line 3 Depot, Inland Container Depot*) rather than generic filler text.
