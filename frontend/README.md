# Insight Nexus

Build a premium enterprise web application UI demo for a multi-entity infrastructure, construction, logistics and project management organization.

IMPORTANT:

- FRONTEND ONLY.

- Use static/mock data only.

- No backend, database, API, authentication or real integrations.

- All interactions should work using local mock state.

- Do not use any company/brand name.

- This is a polished product demo, not a generic admin template.

DESIGN DIRECTION:

Create a sophisticated enterprise SaaS interface inspired by modern platforms such as Linear, Stripe, Palantir and high-end ERP/control-tower products.

Visual style:

- Clean, minimal, premium and professional

- Dark charcoal/navy sidebar with a light main workspace

- Subtle borders, soft shadows and restrained use of color

- Excellent typography and spacing

- Dense enough for enterprise users but never cluttered

- Use cards, tables, charts, status badges and timelines

- Use professional blue/indigo accents with green/amber/red only for status

- Responsive desktop-first design

- Consistent reusable components throughout

- Avoid excessive gradients, oversized cards, cartoonish illustrations and unnecessary animations

APPLICATION STRUCTURE:

1. EXECUTIVE CONTROL TOWER

Create the main dashboard with:

- Total active projects

- Portfolio value

- Budget vs actual

- Cash position

- Open risks

- Pending approvals

- Business opportunities

- Project health overview

- Entity performance

- Recent activity

- Critical alerts

- Upcoming deadlines

Include attractive charts:

- Portfolio by entity

- Project status

- Budget vs actual

- Revenue/cost trend

- Risk distribution

Add an "Attention Required" section showing critical decisions, delayed projects, contract expiries and financial exceptions.

2. PROJECTS

Create a project management module with:

- Project list/table

- Search and filters

- Status

- Entity

- Project manager

- Client

- Budget

- Actual cost

- Progress

- Start/end dates

- Risk level

Create a detailed Project Overview page containing:

- Project summary

- Progress

- Budget vs actual

- Schedule

- Milestones

- Risks

- Contracts

- Procurement

- Documents

- Team

- Activity timeline

Use realistic infrastructure/construction mock projects.

3. BUSINESS DEVELOPMENT

Create:

- Opportunity pipeline

- Opportunity cards

- Lead/opportunity table

- Estimated value

- Probability

- Stage

- Client/counterparty

- Expected close date

- Responsible person

Pipeline stages:

Lead → Qualification → Feasibility → Proposal → Negotiation → Won/Lost

4. CONTRACTS

Create:

- Contract register

- Contract value

- Entity

- Project

- Counterparty

- Status

- Expiry date

- Payment milestones

- Risk level

Contract detail page with:

- Overview

- Obligations

- Milestones

- Variations

- Claims

- Documents

- Activity

5. PROCUREMENT

Create:

- Purchase requests

- Purchase orders

- Suppliers

- Tender/evaluation table

- Approval status

- Procurement spend

- Supplier performance

Show workflow:

Request → Approval → Sourcing → Evaluation → PO → Delivery → Invoice

6. FINANCE

Create a finance dashboard with:

- Revenue

- Expenses

- Cash

- Receivables

- Payables

- Project profitability

- Budget vs actual

- Cash-flow chart

- Entity financial comparison

Include transaction tables with realistic static data.

7. RISKS & COMPLIANCE

Create:

- Risk register

- Risk matrix

- Risk score

- Probability/impact

- Owner

- Mitigation

- Due date

- Status

Also include:

- Compliance obligations

- Expiring permits/licenses

- Corrective actions

- Critical alerts

8. DOCUMENTS

Create a professional document management UI:

- Folder/tree navigation

- Search

- Filters

- Document table

- Entity

- Project

- Category

- Classification

- Version

- Owner

- Modified date

Use classifications such as:

Internal / Confidential / Restricted

9. PEOPLE & ORGANIZATION

Create:

- Organization overview

- Entities

- Departments

- Employees

- Roles

- Project assignments

Show four sample entities without using any real company name:

- Business Development

- Construction

- Logistics

- Foundation

10. ASSETS & LOGISTICS

Create:

- Asset/equipment list

- Fleet overview

- Shipment tracking

- Warehouse summary

- Asset status

- Maintenance status

- Logistics KPIs

11. WORKFLOW / APPROVALS

Create an approval center showing:

- Pending approvals

- Approval type

- Requester

- Entity

- Amount

- Priority

- Due date

Allow opening an approval detail modal with Approve / Reject / Request Changes buttons using mock state.

12. AI INTELLIGENCE

Create a visually impressive but professional AI workspace.

Include:

- AI assistant chat interface

- Suggested questions

- Recent analyses

- Executive briefing

- Project intelligence

- Risk intelligence

- Financial insights

Example questions:

"What projects are currently at risk?"

"Which projects are exceeding budget?"

"Show outstanding approvals."

"Summarize critical contract obligations."

"What is affecting cash flow?"

The AI should respond with STATIC MOCK RESPONSES only.

Include a clear notice that AI operates within user permissions.

13. SETTINGS

Create settings pages for:

- Organization

- Entities

- Users

- Roles & permissions

- Workflow

- Notifications

- AI configuration

- Integrations

MAIN NAVIGATION:

Dashboard

Projects

Business Development

Contracts

Procurement

Finance

Risks & Compliance

Documents

People

Assets & Logistics

Approvals

AI Intelligence

Settings

SIDEBAR:

Include entity selector at the top:

"All Entities"

Allow switching between:

- All Entities

- Business Development

- Construction

- Logistics

- Foundation

The UI should visually demonstrate that group executives can see consolidated information while entity users can work within their own entity.

HEADER:

Include:

- Global search

- Notifications

- Help

- User profile

- Current entity/context

IMPORTANT UX REQUIREMENTS:

- Sidebar navigation should work.

- Dashboard cards should link to relevant modules.

- Tables should have working search/filter/sort UI.

- Tabs should work.

- Modals/drawers should open for details.

- Buttons should produce realistic UI feedback using local state.

- Breadcrumbs should be included on detail pages.

- Use realistic mock data rather than lorem ipsum.

- Use consistent icons.

- Provide empty/loading states where appropriate.

- Make the application feel like a real enterprise product.

RESPONSIVE:

Optimize primarily for desktop/laptop because this is an enterprise management platform, but ensure tablet/mobile layouts remain usable.

TECHNICAL:

Use React with a clean reusable component architecture.

Keep all data in local mock/static files.

Do not implement backend functionality.

Do not create unnecessary infrastructure.

MOST IMPORTANT:

The result should look like a high-end enterprise product demo that could be presented to executives or a client.

Prioritize visual quality, information hierarchy, navigation, dashboard experience and realistic enterprise workflows over implementing deep business logic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ba737c9-f828-404c-abeb-314557b093a1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
