# Insight Nexus — Enterprise Operating System (Frontend Workspace)

This directory contains the complete React 19 + TypeScript + Vite single-page application (SPA) for **Insight Nexus**, an Enterprise Control Tower & Operating System for multi-entity infrastructure, civil engineering, logistics, and NGO management organizations.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production bundle
npm run preview
```

---

## 🏛️ Application Architecture & Key Modules

| Module | Route | Functionality |
| :--- | :--- | :--- |
| **Executive Control Tower** | `/` | Portfolio overview, cash flow, critical alerts, health indices, chart analytics. |
| **Projects Directory** | `/projects` | Searchable project register with budget vs actual and health indicators. |
| **Project Overview** | `/projects/:projectId` | Detailed tabbed workspace (Summary, Schedule, Contracts, Procurement, Risks, Team, Activity). |
| **Business Development** | `/business-development` | Opportunity pipeline across 6 stages with win probability weighting. |
| **Contracts Register** | `/contracts` | Client contracts, subcontracts, expiry dates, and risk classifications. |
| **Contract Workspace** | `/contracts/:contractId` | Obligations, insurance renewals, variation orders (VOs), and claims register. |
| **Procurement & Sourcing** | `/procurement` | 7-stage procurement workflow, purchase orders, tenders, and supplier performance scorecards. |
| **Finance & Treasury** | `/finance` | Revenue/cost trends, cash flow, project profitability, and receivables/payables ageing matrices. |
| **Governance & Risks** | `/risks` | 5x5 Risk Heatmap matrix, risk register, environmental permits, and HSE corrective actions (CA). |
| **Central Approvals** | `/approvals` | Consolidated approval inbox with interactive modal actions (*Approve / Reject / Request Changes*). |
| **Document Management** | `/documents` | Hierarchical folder tree with security classifications (*Internal, Confidential, Restricted*). |
| **People & Organization** | `/people` | Entity organizational hierarchy, department leads, and Role-Based Access Control (RBAC). |
| **Assets & Logistics** | `/assets` | Plant equipment utilization, freight shipment live tracking, and warehouse capacity metrics. |
| **AI Intelligence** | `/ai` | Scoped conversational AI assistant with instant executive prompt shortcuts. |
| **Platform Settings** | `/settings` | System configuration, user permissions, notification alert thresholds, and AI setup. |

---

## 🔧 Technical Overview

* **React 19 & TypeScript**: Component architecture with strict typing.
* **Vite**: Fast HMR and bundle compilation.
* **React Router v7**: Declarative path routing with nested layouts (`AppShell`, `ProtectedRoute`).
* **TanStack React Query**: State management and client-side data query cache.
* **Recharts**: Responsive chart visualizations (Area, Bar, Pie, Line).
* **Radix UI & Tailwind CSS v4**: Modular UI design tokens (`styles.css`).
