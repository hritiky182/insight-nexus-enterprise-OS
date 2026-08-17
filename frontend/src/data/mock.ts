export type EntityId = "all" | "bizdev" | "construction" | "logistics" | "foundation";

export const entities = [
  {
    id: "bizdev",
    name: "Business Development & Project Coordination",
    short: "BD",
    color: "var(--color-chart-1)",
    description: "Business development, opportunity identification, project origination, structuring & client management",
  },
  {
    id: "construction",
    name: "Civil Engineering & Construction",
    short: "CN",
    color: "var(--color-chart-2)",
    description: "Engineering, construction, infrastructure delivery, site operations, HSE & quality control",
  },
  {
    id: "logistics",
    name: "Logistics & Freight Forwarding",
    short: "LG",
    color: "var(--color-chart-3)",
    description: "Freight forwarding, logistics operations, shipment tracking, customs, fleet & warehousing",
  },
  {
    id: "foundation",
    name: "Foundation / NGO",
    short: "FD",
    color: "var(--color-chart-4)",
    description: "Community programs, grants, public-benefit projects, ESG initiatives & program management",
  },
] as const;

export const entityName = (id: string) =>
  entities.find((e) => e.id === id)?.name ?? "All Entities";

export type Status = "on-track" | "at-risk" | "delayed" | "planning" | "completed" | "on-hold";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Project {
  id: string;
  code: string;
  name: string;
  entity: string;
  client: string;
  manager: string;
  status: Status;
  risk: RiskLevel;
  budget: number;
  actual: number;
  progress: number;
  start: string;
  end: string;
  location: string;
  description: string;
  health: number;
}

export const projects: Project[] = [
  {
    id: "p-1", code: "PRJ-2041", name: "Coastal Ring Road — Section 4", entity: "construction",
    client: "Regional Highways Authority", manager: "Amara Osei", status: "at-risk", risk: "high",
    budget: 184_500_000, actual: 141_200_000, progress: 68, start: "2024-03-11", end: "2026-11-30",
    location: "North Coastal Corridor",
    description: "18.4 km dual carriageway including three grade-separated interchanges, 2 viaducts and coastal drainage works.",
    health: 62,
  },
  {
    id: "p-2", code: "PRJ-2088", name: "Inland Container Depot Expansion", entity: "logistics",
    client: "Port & Freight Consortium", manager: "Daniel Reyes", status: "on-track", risk: "medium",
    budget: 76_400_000, actual: 41_800_000, progress: 54, start: "2024-09-02", end: "2026-06-15",
    location: "Eastern Industrial Zone",
    description: "Expansion of ICD capacity to 420k TEU with rail siding, RTG yard and automated gate system.",
    health: 84,
  },
  {
    id: "p-3", code: "PRJ-2103", name: "Metro Line 3 — Depot & Workshop", entity: "construction",
    client: "Metropolitan Transit Board", manager: "Lena Fischer", status: "on-track", risk: "medium",
    budget: 232_000_000, actual: 88_900_000, progress: 39, start: "2025-01-20", end: "2027-08-31",
    location: "South Industrial Belt",
    description: "Design-build of rolling stock depot, maintenance workshop, stabling yard and control centre.",
    health: 88,
  },
  {
    id: "p-4", code: "PRJ-1994", name: "Water Treatment Plant Upgrade", entity: "construction",
    client: "Municipal Water Utility", manager: "Tomás Okafor", status: "delayed", risk: "critical",
    budget: 58_300_000, actual: 61_900_000, progress: 82, start: "2023-06-05", end: "2025-12-20",
    location: "Western Basin",
    description: "Capacity upgrade from 90 to 160 MLD, including membrane filtration and sludge handling.",
    health: 41,
  },
  {
    id: "p-5", code: "PRJ-2120", name: "Regional Distribution Hub", entity: "logistics",
    client: "Continental Retail Group", manager: "Priya Nandakumar", status: "on-track", risk: "low",
    budget: 44_100_000, actual: 18_600_000, progress: 31, start: "2025-04-14", end: "2026-10-09",
    location: "Central Logistics Park",
    description: "62,000 m² cross-dock facility with 84 dock doors, cold chain zone and fleet workshop.",
    health: 92,
  },
  {
    id: "p-6", code: "PRJ-2011", name: "Grid Interconnection Substation", entity: "construction",
    client: "National Transmission Operator", manager: "Marcus Lindqvist", status: "at-risk", risk: "high",
    budget: 97_800_000, actual: 72_400_000, progress: 71, start: "2024-01-08", end: "2026-04-30",
    location: "Highland Plateau",
    description: "400/132 kV GIS substation with 2×315 MVA transformers and SCADA integration.",
    health: 58,
  },
  {
    id: "p-7", code: "PRJ-2135", name: "Community Health Campus", entity: "foundation",
    client: "Regional Health Trust", manager: "Yara Haddad", status: "planning", risk: "low",
    budget: 21_700_000, actual: 2_400_000, progress: 9, start: "2025-11-03", end: "2027-05-28",
    location: "Northern District",
    description: "Grant-funded 120-bed community health campus with outpatient wing and training centre.",
    health: 95,
  },
  {
    id: "p-8", code: "PRJ-2077", name: "Airport Cargo Terminal Retrofit", entity: "logistics",
    client: "Airport Development Company", manager: "Daniel Reyes", status: "on-hold", risk: "medium",
    budget: 33_900_000, actual: 12_100_000, progress: 27, start: "2024-07-22", end: "2026-02-11",
    location: "International Airport",
    description: "Retrofit of cargo terminal 2 including ULD handling, cold storage and customs zone.",
    health: 66,
  },
  {
    id: "p-9", code: "PRJ-1960", name: "Industrial Park Master Development", entity: "bizdev",
    client: "Sovereign Investment Vehicle", manager: "Elena Duarte", status: "on-track", risk: "medium",
    budget: 310_000_000, actual: 96_500_000, progress: 33, start: "2024-10-01", end: "2028-03-31",
    location: "Southern Free Zone",
    description: "Master development of 480 ha industrial park: land preparation, utilities, roads and tenant fit-out programme.",
    health: 81,
  },
  {
    id: "p-10", code: "PRJ-2144", name: "Rural Electrification Programme", entity: "foundation",
    client: "Development Finance Partner", manager: "Yara Haddad", status: "on-track", risk: "low",
    budget: 15_200_000, actual: 8_900_000, progress: 58, start: "2024-11-18", end: "2026-08-14",
    location: "Multiple Districts",
    description: "Mini-grid deployment across 46 rural settlements with community maintenance training.",
    health: 90,
  },
  {
    id: "p-11", code: "PRJ-2058", name: "Bulk Fuel Terminal Automation", entity: "logistics",
    client: "Energy Distribution Partner", manager: "Priya Nandakumar", status: "completed", risk: "low",
    budget: 27_600_000, actual: 26_300_000, progress: 100, start: "2023-02-06", end: "2025-04-18",
    location: "Harbour Precinct",
    description: "Terminal automation, custody transfer metering and safety instrumented systems upgrade.",
    health: 100,
  },
  {
    id: "p-12", code: "PRJ-2151", name: "Bridge Rehabilitation Framework", entity: "construction",
    client: "Regional Highways Authority", manager: "Amara Osei", status: "planning", risk: "medium",
    budget: 48_900_000, actual: 1_100_000, progress: 4, start: "2026-01-12", end: "2028-01-31",
    location: "Regional Network",
    description: "Framework agreement for structural rehabilitation of 27 bridges over a 24-month programme.",
    health: 93,
  },
];

export const milestones = [
  { id: "m1", project: "p-1", name: "Earthworks completion — Ch 0+000 to 6+400", due: "2025-08-30", status: "completed", value: 22_000_000 },
  { id: "m2", project: "p-1", name: "Viaduct V1 deck casting", due: "2026-02-14", status: "in-progress", value: 31_500_000 },
  { id: "m3", project: "p-1", name: "Interchange IC-2 structural completion", due: "2026-05-29", status: "at-risk", value: 18_200_000 },
  { id: "m4", project: "p-1", name: "Pavement & surfacing package", due: "2026-09-12", status: "planned", value: 26_400_000 },
  { id: "m5", project: "p-1", name: "Provisional acceptance", due: "2026-11-30", status: "planned", value: 12_000_000 },
];

export interface Risk {
  id: string; title: string; entity: string; project: string; category: string;
  probability: number; impact: number; owner: string; mitigation: string;
  due: string; status: "open" | "mitigating" | "monitoring" | "closed";
}

export const risks: Risk[] = [
  { id: "R-118", title: "Coastal permit renewal delay blocking marine works", entity: "construction", project: "PRJ-2041", category: "Regulatory", probability: 4, impact: 5, owner: "Amara Osei", mitigation: "Escalated to authority liaison; parallel submission of amended EIA annexes.", due: "2026-09-04", status: "mitigating" },
  { id: "R-092", title: "Membrane supplier single-source dependency", entity: "construction", project: "PRJ-1994", category: "Supply chain", probability: 4, impact: 4, owner: "Tomás Okafor", mitigation: "Qualifying secondary supplier; 12-week buffer stock ordered.", due: "2026-08-29", status: "open" },
  { id: "R-141", title: "FX exposure on imported GIS equipment", entity: "construction", project: "PRJ-2011", category: "Financial", probability: 3, impact: 5, owner: "Group Treasury", mitigation: "Forward cover placed for 70% of remaining exposure.", due: "2026-10-15", status: "mitigating" },
  { id: "R-076", title: "Skilled labour shortage in southern belt", entity: "construction", project: "PRJ-2103", category: "Resource", probability: 3, impact: 3, owner: "Lena Fischer", mitigation: "Framework with two labour providers; apprenticeship intake scheduled.", due: "2026-11-01", status: "monitoring" },
  { id: "R-133", title: "Customs clearance variability affecting inbound cargo", entity: "logistics", project: "PRJ-2088", category: "Operational", probability: 3, impact: 2, owner: "Daniel Reyes", mitigation: "Pre-clearance agreement and bonded storage arrangement.", due: "2026-09-20", status: "monitoring" },
  { id: "R-150", title: "Grant disbursement timing vs works programme", entity: "foundation", project: "PRJ-2135", category: "Financial", probability: 2, impact: 4, owner: "Yara Haddad", mitigation: "Tranche schedule renegotiated with development partner.", due: "2026-10-02", status: "open" },
  { id: "R-101", title: "Ground conditions worse than baseline at IC-2", entity: "construction", project: "PRJ-2041", category: "Technical", probability: 4, impact: 4, owner: "Amara Osei", mitigation: "Additional geotech investigation; variation notice served.", due: "2026-08-22", status: "mitigating" },
  { id: "R-088", title: "Fleet emissions compliance deadline", entity: "logistics", project: "PRJ-2120", category: "Compliance", probability: 2, impact: 3, owner: "Priya Nandakumar", mitigation: "Retrofit programme for 22 units; 9 completed.", due: "2026-12-12", status: "mitigating" },
  { id: "R-159", title: "Counterparty credit deterioration — tenant anchor", entity: "bizdev", project: "PRJ-1960", category: "Commercial", probability: 2, impact: 5, owner: "Elena Duarte", mitigation: "Parent guarantee and increased security deposit requested.", due: "2026-11-19", status: "open" },
  { id: "R-045", title: "Legacy claim exposure on completed terminal", entity: "logistics", project: "PRJ-2058", category: "Legal", probability: 1, impact: 3, owner: "Group Legal", mitigation: "Settlement negotiated; provision released.", due: "2026-07-01", status: "closed" },
];

export interface Opportunity {
  id: string; name: string; client: string; entity: string; stage: string;
  value: number; probability: number; close: string; owner: string; sector: string;
}

export const pipelineStages = ["Lead", "Qualification", "Feasibility", "Proposal", "Negotiation", "Won/Lost"];

export const opportunities: Opportunity[] = [
  { id: "OPP-311", name: "Northern Bypass Design & Build", client: "Regional Highways Authority", entity: "construction", stage: "Negotiation", value: 214_000_000, probability: 65, close: "2026-10-30", owner: "Elena Duarte", sector: "Roads" },
  { id: "OPP-298", name: "Deep-Water Berth Extension", client: "Port & Freight Consortium", entity: "construction", stage: "Proposal", value: 168_500_000, probability: 45, close: "2026-11-21", owner: "Marcus Lindqvist", sector: "Marine" },
  { id: "OPP-334", name: "National Cold Chain Network", client: "Agri Export Board", entity: "logistics", stage: "Feasibility", value: 92_000_000, probability: 30, close: "2027-01-15", owner: "Priya Nandakumar", sector: "Logistics" },
  { id: "OPP-341", name: "Solar + Storage IPP Package", client: "Independent Power Developer", entity: "bizdev", stage: "Qualification", value: 145_000_000, probability: 20, close: "2027-03-04", owner: "Elena Duarte", sector: "Energy" },
  { id: "OPP-352", name: "Urban Housing Regeneration Phase 1", client: "City Development Agency", entity: "construction", stage: "Lead", value: 78_400_000, probability: 10, close: "2027-05-29", owner: "Lena Fischer", sector: "Buildings" },
  { id: "OPP-287", name: "Rail Freight Terminal Concession", client: "National Rail Operator", entity: "logistics", stage: "Negotiation", value: 121_000_000, probability: 70, close: "2026-09-26", owner: "Daniel Reyes", sector: "Rail" },
  { id: "OPP-360", name: "School Infrastructure Grant Programme", client: "Education Endowment Partner", entity: "foundation", stage: "Proposal", value: 18_900_000, probability: 55, close: "2026-12-11", owner: "Yara Haddad", sector: "Social" },
  { id: "OPP-266", name: "Airport Landside Redevelopment", client: "Airport Development Company", entity: "bizdev", stage: "Won/Lost", value: 64_000_000, probability: 100, close: "2026-06-30", owner: "Elena Duarte", sector: "Aviation" },
  { id: "OPP-370", name: "Regional Water Reuse Scheme", client: "Municipal Water Utility", entity: "construction", stage: "Feasibility", value: 56_200_000, probability: 35, close: "2027-02-18", owner: "Tomás Okafor", sector: "Water" },
  { id: "OPP-375", name: "Last-Mile Fleet Electrification", client: "Continental Retail Group", entity: "logistics", stage: "Qualification", value: 27_500_000, probability: 25, close: "2027-01-30", owner: "Priya Nandakumar", sector: "Fleet" },
];

export interface Contract {
  id: string; title: string; counterparty: string; entity: string; project: string;
  type: string; value: number; status: "active" | "expiring" | "draft" | "closed" | "under-review";
  start: string; expiry: string; risk: RiskLevel; owner: string;
}

export const contracts: Contract[] = [
  { id: "CTR-4102", title: "Main Works Contract — Section 4", counterparty: "Regional Highways Authority", entity: "construction", project: "PRJ-2041", type: "Client — FIDIC Yellow", value: 184_500_000, status: "active", start: "2024-03-11", expiry: "2026-12-31", risk: "high", owner: "Group Legal" },
  { id: "CTR-4188", title: "Earthworks Subcontract Package E2", counterparty: "Terra Civil Works", entity: "construction", project: "PRJ-2041", type: "Subcontract", value: 38_200_000, status: "active", start: "2024-05-02", expiry: "2026-08-31", risk: "medium", owner: "Amara Osei" },
  { id: "CTR-4211", title: "ICD Expansion EPC Agreement", counterparty: "Port & Freight Consortium", entity: "logistics", project: "PRJ-2088", type: "Client — EPC", value: 76_400_000, status: "active", start: "2024-09-02", expiry: "2026-07-15", risk: "medium", owner: "Group Legal" },
  { id: "CTR-3990", title: "Membrane Supply & Commissioning", counterparty: "Aquafilt Systems", entity: "construction", project: "PRJ-1994", type: "Supply", value: 14_800_000, status: "under-review", start: "2023-08-14", expiry: "2026-09-15", risk: "critical", owner: "Tomás Okafor" },
  { id: "CTR-4260", title: "Depot Design Services", counterparty: "Meridian Engineering", entity: "construction", project: "PRJ-2103", type: "Consultancy", value: 9_600_000, status: "active", start: "2025-02-03", expiry: "2027-06-30", risk: "low", owner: "Lena Fischer" },
  { id: "CTR-4275", title: "Fleet Leasing Master Agreement", counterparty: "Northline Mobility", entity: "logistics", project: "PRJ-2120", type: "Lease", value: 6_400_000, status: "expiring", start: "2023-10-01", expiry: "2026-09-30", risk: "medium", owner: "Priya Nandakumar" },
  { id: "CTR-4301", title: "GIS Equipment Supply", counterparty: "Voltcore Industries", entity: "construction", project: "PRJ-2011", type: "Supply", value: 31_900_000, status: "active", start: "2024-04-19", expiry: "2026-05-30", risk: "high", owner: "Marcus Lindqvist" },
  { id: "CTR-4320", title: "Grant Funding Agreement — Health Campus", counterparty: "Regional Health Trust", entity: "foundation", project: "PRJ-2135", type: "Grant", value: 21_700_000, status: "draft", start: "2025-11-03", expiry: "2027-06-30", risk: "low", owner: "Yara Haddad" },
  { id: "CTR-4155", title: "Land Development Framework", counterparty: "Sovereign Investment Vehicle", entity: "bizdev", project: "PRJ-1960", type: "Framework", value: 310_000_000, status: "active", start: "2024-10-01", expiry: "2028-03-31", risk: "medium", owner: "Elena Duarte" },
  { id: "CTR-4066", title: "Terminal Automation O&M", counterparty: "Energy Distribution Partner", entity: "logistics", project: "PRJ-2058", type: "O&M", value: 3_200_000, status: "expiring", start: "2025-05-01", expiry: "2026-08-31", risk: "low", owner: "Priya Nandakumar" },
];

export const contractObligations = [
  { id: "OB-1", contract: "CTR-4102", title: "Monthly progress report to Engineer", frequency: "Monthly", next: "2026-09-05", status: "on-track", owner: "Amara Osei" },
  { id: "OB-2", contract: "CTR-4102", title: "Performance bond maintenance (10% of value)", frequency: "Continuous", next: "2026-12-31", status: "on-track", owner: "Group Treasury" },
  { id: "OB-3", contract: "CTR-4102", title: "Environmental monitoring submission", frequency: "Quarterly", next: "2026-09-30", status: "at-risk", owner: "HSE Lead" },
  { id: "OB-4", contract: "CTR-4102", title: "Insurance renewal — CAR policy", frequency: "Annual", next: "2026-10-14", status: "action-required", owner: "Group Legal" },
];

export const contractVariations = [
  { id: "VO-014", contract: "CTR-4102", title: "Additional ground improvement at IC-2", value: 4_260_000, status: "submitted", date: "2026-06-18" },
  { id: "VO-012", contract: "CTR-4102", title: "Revised drainage design — coastal section", value: 1_840_000, status: "approved", date: "2026-03-02" },
  { id: "VO-009", contract: "CTR-4102", title: "Traffic management extension", value: 720_000, status: "approved", date: "2025-11-27" },
];

export const contractClaims = [
  { id: "CL-006", contract: "CTR-4102", title: "Extension of time — permit delay (58 days)", value: 3_100_000, status: "under-assessment", date: "2026-07-04" },
  { id: "CL-004", contract: "CTR-4102", title: "Disruption costs — utility diversion", value: 940_000, status: "agreed", date: "2026-02-11" },
];

export interface PurchaseItem {
  id: string; title: string; entity: string; project: string; supplier: string;
  amount: number; stage: string; status: "pending" | "approved" | "rejected" | "delivered" | "invoiced";
  requester: string; date: string;
}

export const purchaseRequests: PurchaseItem[] = [
  { id: "PR-8841", title: "Reinforcement steel — 1,200 t", entity: "construction", project: "PRJ-2041", supplier: "Ferro Metals Group", amount: 1_980_000, stage: "Approval", status: "pending", requester: "Site Procurement", date: "2026-08-11" },
  { id: "PR-8836", title: "Precast beam segments — batch 3", entity: "construction", project: "PRJ-2041", supplier: "Castform Precast", amount: 3_420_000, stage: "Sourcing", status: "approved", requester: "Amara Osei", date: "2026-08-06" },
  { id: "PR-8852", title: "RTG crane spares package", entity: "logistics", project: "PRJ-2088", supplier: "Harbourtech Systems", amount: 640_000, stage: "Evaluation", status: "pending", requester: "Daniel Reyes", date: "2026-08-13" },
  { id: "PR-8809", title: "Membrane modules — replacement set", entity: "construction", project: "PRJ-1994", supplier: "Aquafilt Systems", amount: 2_150_000, stage: "PO", status: "approved", requester: "Tomás Okafor", date: "2026-07-29" },
  { id: "PR-8860", title: "Racking system — cold zone", entity: "logistics", project: "PRJ-2120", supplier: "Storex Solutions", amount: 880_000, stage: "Request", status: "pending", requester: "Warehouse Ops", date: "2026-08-15" },
  { id: "PR-8790", title: "Medical fit-out package", entity: "foundation", project: "PRJ-2135", supplier: "Careline Equipment", amount: 1_240_000, stage: "Delivery", status: "delivered", requester: "Yara Haddad", date: "2026-07-14" },
];

export const purchaseOrders = [
  { id: "PO-5521", supplier: "Castform Precast", entity: "construction", project: "PRJ-2041", amount: 3_420_000, issued: "2026-08-08", delivery: "2026-10-02", status: "In production" },
  { id: "PO-5498", supplier: "Ferro Metals Group", entity: "construction", project: "PRJ-2103", amount: 2_760_000, issued: "2026-07-22", delivery: "2026-09-18", status: "Partially delivered" },
  { id: "PO-5533", supplier: "Aquafilt Systems", entity: "construction", project: "PRJ-1994", amount: 2_150_000, issued: "2026-08-12", delivery: "2026-11-05", status: "Acknowledged" },
  { id: "PO-5476", supplier: "Harbourtech Systems", entity: "logistics", project: "PRJ-2088", amount: 1_180_000, issued: "2026-06-30", delivery: "2026-08-28", status: "Delivered" },
  { id: "PO-5541", supplier: "Northline Mobility", entity: "logistics", project: "PRJ-2120", amount: 690_000, issued: "2026-08-14", delivery: "2026-09-30", status: "Acknowledged" },
];

export const suppliers = [
  { id: "SUP-101", name: "Ferro Metals Group", category: "Materials", spend: 14_200_000, rating: 4.6, onTime: 94, quality: 96, status: "Approved", contracts: 6 },
  { id: "SUP-118", name: "Castform Precast", category: "Precast", spend: 9_800_000, rating: 4.2, onTime: 88, quality: 92, status: "Approved", contracts: 4 },
  { id: "SUP-122", name: "Aquafilt Systems", category: "Process equipment", spend: 16_950_000, rating: 3.1, onTime: 61, quality: 84, status: "Under review", contracts: 2 },
  { id: "SUP-140", name: "Harbourtech Systems", category: "Handling equipment", spend: 7_400_000, rating: 4.4, onTime: 91, quality: 93, status: "Approved", contracts: 3 },
  { id: "SUP-155", name: "Voltcore Industries", category: "Electrical", spend: 31_900_000, rating: 4.0, onTime: 82, quality: 95, status: "Approved", contracts: 2 },
  { id: "SUP-163", name: "Northline Mobility", category: "Fleet", spend: 6_100_000, rating: 3.8, onTime: 87, quality: 88, status: "Approved", contracts: 5 },
];

export const tenders = [
  { id: "TND-221", title: "Pavement & surfacing package", project: "PRJ-2041", bidders: 5, lowest: 24_100_000, recommended: "Terra Civil Works", score: 88.4, status: "Evaluation" },
  { id: "TND-214", title: "Depot M&E installation", project: "PRJ-2103", bidders: 4, lowest: 18_600_000, recommended: "Meridian Engineering", score: 84.1, status: "Award pending" },
  { id: "TND-229", title: "Cold chain refrigeration", project: "PRJ-2120", bidders: 6, lowest: 5_900_000, recommended: "Polarline Cooling", score: 91.2, status: "Evaluation" },
];

export const approvals = [
  { id: "APR-9012", title: "Variation Order VO-014 — Ground improvement IC-2", type: "Contract variation", requester: "Amara Osei", entity: "construction", amount: 4_260_000, priority: "critical", due: "2026-08-19", status: "pending", detail: "Additional ground improvement works at Interchange IC-2 following geotechnical findings. Cost impact within contingency; time impact 3 weeks under assessment." },
  { id: "APR-9008", title: "Purchase Request PR-8841 — Reinforcement steel", type: "Procurement", requester: "Site Procurement", entity: "construction", amount: 1_980_000, priority: "high", due: "2026-08-18", status: "pending", detail: "1,200 t of reinforcement steel for Q4 deck programme. Three quotations received; recommended supplier is Ferro Metals Group at 2.4% below budget rate." },
  { id: "APR-9021", title: "Supplier onboarding — Polarline Cooling", type: "Supplier", requester: "Priya Nandakumar", entity: "logistics", amount: 0, priority: "medium", due: "2026-08-24", status: "pending", detail: "New supplier registration with completed due-diligence pack, financial screening and HSE prequalification." },
  { id: "APR-9016", title: "Capex release — RTG yard phase 2", type: "Capital expenditure", requester: "Daniel Reyes", entity: "logistics", amount: 12_400_000, priority: "high", due: "2026-08-21", status: "pending", detail: "Release of phase 2 capex against approved business case. IRR 14.8%, payback 6.2 years." },
  { id: "APR-9025", title: "Grant tranche 2 disbursement request", type: "Finance", requester: "Yara Haddad", entity: "foundation", amount: 3_600_000, priority: "medium", due: "2026-08-27", status: "pending", detail: "Second tranche request supported by milestone verification report and independent audit certificate." },
  { id: "APR-9003", title: "Contract renewal — Fleet leasing master agreement", type: "Contract", requester: "Priya Nandakumar", entity: "logistics", amount: 6_400_000, priority: "critical", due: "2026-08-17", status: "pending", detail: "Master lease expires 30 September 2026. Renewal at 3.1% uplift with expanded EV allocation." },
  { id: "APR-8990", title: "Recruitment approval — 4 site engineers", type: "People", requester: "Lena Fischer", entity: "construction", amount: 0, priority: "low", due: "2026-08-30", status: "pending", detail: "Headcount request aligned to depot works programme ramp-up in Q4." },
];

export const documents = [
  { id: "DOC-7741", name: "Section 4 — Consolidated Progress Report Aug 2026.pdf", folder: "Projects / PRJ-2041 / Reports", entity: "construction", project: "PRJ-2041", category: "Report", classification: "Internal", version: "v12.0", owner: "Amara Osei", modified: "2026-08-14", size: "8.4 MB" },
  { id: "DOC-7702", name: "Main Works Contract — Executed.pdf", folder: "Contracts / CTR-4102", entity: "construction", project: "PRJ-2041", category: "Contract", classification: "Confidential", version: "v1.0", owner: "Group Legal", modified: "2024-03-12", size: "22.1 MB" },
  { id: "DOC-7788", name: "Geotechnical Investigation — IC-2 Addendum.pdf", folder: "Projects / PRJ-2041 / Technical", entity: "construction", project: "PRJ-2041", category: "Technical", classification: "Internal", version: "v3.1", owner: "Meridian Engineering", modified: "2026-06-11", size: "34.7 MB" },
  { id: "DOC-7810", name: "Group Cash Flow Forecast Q3-Q4 2026.xlsx", folder: "Finance / Treasury", entity: "bizdev", project: "—", category: "Financial", classification: "Restricted", version: "v5.2", owner: "Group Treasury", modified: "2026-08-12", size: "3.2 MB" },
  { id: "DOC-7756", name: "ICD Expansion — HSE Plan.pdf", folder: "Projects / PRJ-2088 / HSE", entity: "logistics", project: "PRJ-2088", category: "HSE", classification: "Internal", version: "v4.0", owner: "HSE Lead", modified: "2026-05-28", size: "6.9 MB" },
  { id: "DOC-7829", name: "Tender Evaluation Report — TND-221.pdf", folder: "Procurement / Tenders", entity: "construction", project: "PRJ-2041", category: "Procurement", classification: "Confidential", version: "v2.0", owner: "Procurement Board", modified: "2026-08-09", size: "11.3 MB" },
  { id: "DOC-7833", name: "Grant Funding Agreement — Draft.docx", folder: "Contracts / CTR-4320", entity: "foundation", project: "PRJ-2135", category: "Contract", classification: "Confidential", version: "v0.6", owner: "Yara Haddad", modified: "2026-08-05", size: "1.1 MB" },
  { id: "DOC-7794", name: "Fleet Maintenance Schedule 2026.xlsx", folder: "Assets / Fleet", entity: "logistics", project: "—", category: "Operations", classification: "Internal", version: "v9.0", owner: "Fleet Manager", modified: "2026-08-01", size: "2.4 MB" },
  { id: "DOC-7845", name: "Board Pack — August 2026.pdf", folder: "Governance / Board", entity: "bizdev", project: "—", category: "Governance", classification: "Restricted", version: "v1.0", owner: "Company Secretary", modified: "2026-08-15", size: "18.6 MB" },
  { id: "DOC-7767", name: "Environmental Permit — Coastal Works.pdf", folder: "Compliance / Permits", entity: "construction", project: "PRJ-2041", category: "Compliance", classification: "Internal", version: "v2.0", owner: "HSE Lead", modified: "2025-09-04", size: "4.8 MB" },
];

export const documentTree = [
  { name: "Projects", count: 1284, children: ["PRJ-2041", "PRJ-2088", "PRJ-2103", "PRJ-1994", "PRJ-2120"] },
  { name: "Contracts", count: 412, children: ["Client contracts", "Subcontracts", "Supply", "Grants"] },
  { name: "Procurement", count: 366, children: ["Tenders", "Purchase orders", "Suppliers"] },
  { name: "Finance", count: 298, children: ["Treasury", "Reporting", "Tax"] },
  { name: "Compliance", count: 174, children: ["Permits", "Audits", "Policies"] },
  { name: "Governance", count: 88, children: ["Board", "Committees"] },
  { name: "Assets", count: 143, children: ["Fleet", "Plant", "Warehouses"] },
];

export const people = [
  { id: "EMP-1042", name: "Elena Duarte", role: "Group Development Director", entity: "bizdev", department: "Business Development", location: "Head Office", projects: 3, email: "e.duarte@group.example" },
  { id: "EMP-1088", name: "Amara Osei", role: "Senior Project Director", entity: "construction", department: "Project Delivery", location: "North Coastal Corridor", projects: 2, email: "a.osei@group.example" },
  { id: "EMP-1103", name: "Lena Fischer", role: "Project Director", entity: "construction", department: "Project Delivery", location: "South Industrial Belt", projects: 1, email: "l.fischer@group.example" },
  { id: "EMP-1121", name: "Tomás Okafor", role: "Project Manager", entity: "construction", department: "Water & Process", location: "Western Basin", projects: 1, email: "t.okafor@group.example" },
  { id: "EMP-1150", name: "Daniel Reyes", role: "Head of Terminal Operations", entity: "logistics", department: "Operations", location: "Eastern Industrial Zone", projects: 2, email: "d.reyes@group.example" },
  { id: "EMP-1166", name: "Priya Nandakumar", role: "Logistics Programme Manager", entity: "logistics", department: "Programmes", location: "Central Logistics Park", projects: 3, email: "p.nandakumar@group.example" },
  { id: "EMP-1182", name: "Marcus Lindqvist", role: "Power & Grid Lead", entity: "construction", department: "Energy", location: "Highland Plateau", projects: 1, email: "m.lindqvist@group.example" },
  { id: "EMP-1195", name: "Yara Haddad", role: "Foundation Programme Lead", entity: "foundation", department: "Social Impact", location: "Northern District", projects: 2, email: "y.haddad@group.example" },
  { id: "EMP-1211", name: "Sofia Marchetti", role: "Group Financial Controller", entity: "bizdev", department: "Finance", location: "Head Office", projects: 0, email: "s.marchetti@group.example" },
  { id: "EMP-1223", name: "Idris Bello", role: "Head of Procurement", entity: "bizdev", department: "Procurement", location: "Head Office", projects: 0, email: "i.bello@group.example" },
];

export const departments = [
  { name: "Project Delivery", entity: "construction", headcount: 486, lead: "Amara Osei" },
  { name: "Energy", entity: "construction", headcount: 112, lead: "Marcus Lindqvist" },
  { name: "Water & Process", entity: "construction", headcount: 78, lead: "Tomás Okafor" },
  { name: "Operations", entity: "logistics", headcount: 344, lead: "Daniel Reyes" },
  { name: "Programmes", entity: "logistics", headcount: 96, lead: "Priya Nandakumar" },
  { name: "Business Development", entity: "bizdev", headcount: 54, lead: "Elena Duarte" },
  { name: "Finance", entity: "bizdev", headcount: 71, lead: "Sofia Marchetti" },
  { name: "Procurement", entity: "bizdev", headcount: 63, lead: "Idris Bello" },
  { name: "Social Impact", entity: "foundation", headcount: 41, lead: "Yara Haddad" },
];

export const roles = [
  { name: "Group Executive", users: 8, scope: "All entities", permissions: "Full read, approvals above 5M" },
  { name: "Entity Director", users: 14, scope: "Single entity", permissions: "Full entity read/write, approvals to 5M" },
  { name: "Project Manager", users: 62, scope: "Assigned projects", permissions: "Project read/write, approvals to 250K" },
  { name: "Finance Controller", users: 11, scope: "All entities", permissions: "Financial modules, no HR data" },
  { name: "Procurement Officer", users: 27, scope: "Assigned entities", permissions: "Procurement read/write" },
  { name: "Viewer", users: 138, scope: "Assigned entities", permissions: "Read only" },
];

export const assets = [
  { id: "AST-3301", name: "Crawler Crane 250 t", type: "Heavy plant", entity: "construction", project: "PRJ-2041", status: "In service", condition: "Good", utilisation: 78, maintenance: "Due 2026-09-12", value: 4_200_000 },
  { id: "AST-3318", name: "Tower Crane TC-14", type: "Heavy plant", entity: "construction", project: "PRJ-2103", status: "In service", condition: "Good", utilisation: 84, maintenance: "Due 2026-10-04", value: 1_800_000 },
  { id: "AST-3342", name: "Concrete Batching Plant B2", type: "Fixed plant", entity: "construction", project: "PRJ-2041", status: "Maintenance", condition: "Fair", utilisation: 41, maintenance: "In progress", value: 2_600_000 },
  { id: "AST-3377", name: "RTG Crane Fleet (6 units)", type: "Handling", entity: "logistics", project: "PRJ-2088", status: "In service", condition: "Good", utilisation: 88, maintenance: "Due 2026-11-20", value: 11_400_000 },
  { id: "AST-3390", name: "Heavy Haulage Tractors (18)", type: "Fleet", entity: "logistics", project: "—", status: "In service", condition: "Fair", utilisation: 73, maintenance: "Rolling", value: 5_900_000 },
  { id: "AST-3404", name: "Reefer Container Pool (120)", type: "Fleet", entity: "logistics", project: "PRJ-2120", status: "Partially idle", condition: "Good", utilisation: 62, maintenance: "Due 2026-09-30", value: 3_300_000 },
  { id: "AST-3421", name: "Mobile Generators (24)", type: "Equipment", entity: "foundation", project: "PRJ-2144", status: "Deployed", condition: "Good", utilisation: 69, maintenance: "Due 2026-12-01", value: 980_000 },
];

export const shipments = [
  { id: "SHP-88214", ref: "GIS bay modules 1-3", origin: "Rotterdam", destination: "Highland Plateau", mode: "Sea + Road", eta: "2026-09-08", status: "In transit", progress: 62, value: 8_600_000 },
  { id: "SHP-88251", ref: "Precast segments batch 3", origin: "Castform Yard", destination: "Section 4 Site", mode: "Road", eta: "2026-08-21", status: "In transit", progress: 84, value: 1_140_000 },
  { id: "SHP-88190", ref: "Membrane modules", origin: "Singapore", destination: "Western Basin", mode: "Sea", eta: "2026-11-02", status: "Booked", progress: 12, value: 2_150_000 },
  { id: "SHP-88203", ref: "Racking components", origin: "Central Logistics Park", destination: "Cold Zone Hub", mode: "Road", eta: "2026-08-19", status: "Customs", progress: 71, value: 880_000 },
  { id: "SHP-88166", ref: "Medical fit-out equipment", origin: "Frankfurt", destination: "Northern District", mode: "Air", eta: "2026-08-17", status: "Delivered", progress: 100, value: 1_240_000 },
];

export const warehouses = [
  { name: "Central Logistics Park", capacity: 62_000, used: 48_900, entity: "logistics", throughput: "18.4k pallets/mo" },
  { name: "Eastern ICD Yard", capacity: 420_000, used: 297_000, entity: "logistics", throughput: "24.1k TEU/mo" },
  { name: "Harbour Precinct Store", capacity: 14_000, used: 6_200, entity: "logistics", throughput: "3.2k pallets/mo" },
  { name: "Site Store — Section 4", capacity: 9_000, used: 7_400, entity: "construction", throughput: "1.1k units/mo" },
];

export const compliance = [
  { id: "CMP-401", title: "Environmental permit — coastal marine works", entity: "construction", authority: "Environmental Agency", expiry: "2026-09-30", status: "expiring", owner: "HSE Lead" },
  { id: "CMP-388", title: "Heavy vehicle operator licence", entity: "logistics", authority: "Transport Authority", expiry: "2026-11-14", status: "valid", owner: "Fleet Manager" },
  { id: "CMP-412", title: "ISO 45001 surveillance audit", entity: "construction", authority: "Certification Body", expiry: "2026-10-08", status: "action-required", owner: "HSE Lead" },
  { id: "CMP-395", title: "Charitable registration renewal", entity: "foundation", authority: "Charities Commission", expiry: "2027-01-31", status: "valid", owner: "Yara Haddad" },
  { id: "CMP-420", title: "Customs bonded warehouse licence", entity: "logistics", authority: "Customs Service", expiry: "2026-08-31", status: "expiring", owner: "Daniel Reyes" },
  { id: "CMP-377", title: "Electrical contractor accreditation", entity: "construction", authority: "Energy Regulator", expiry: "2027-04-22", status: "valid", owner: "Marcus Lindqvist" },
];

export const correctiveActions = [
  { id: "CA-212", title: "Close out scaffolding non-conformance — Section 4", owner: "HSE Lead", due: "2026-08-25", severity: "high", status: "open" },
  { id: "CA-205", title: "Update lifting plan register — depot works", owner: "Lena Fischer", due: "2026-09-02", severity: "medium", status: "in-progress" },
  { id: "CA-198", title: "Retrain gate staff on customs documentation", owner: "Daniel Reyes", due: "2026-09-15", severity: "low", status: "in-progress" },
];

export const activity = [
  { id: 1, actor: "Amara Osei", action: "submitted variation order VO-014 for approval", target: "PRJ-2041", time: "24 minutes ago", type: "approval" },
  { id: 2, actor: "Sofia Marchetti", action: "published the August group cash flow forecast", target: "Finance", time: "1 hour ago", type: "finance" },
  { id: 3, actor: "Procurement Board", action: "completed evaluation for tender TND-221", target: "PRJ-2041", time: "3 hours ago", type: "procurement" },
  { id: 4, actor: "Daniel Reyes", action: "updated shipment ETA for GIS bay modules", target: "SHP-88214", time: "5 hours ago", type: "logistics" },
  { id: 5, actor: "Group Legal", action: "flagged CTR-3990 for contractual review", target: "CTR-3990", time: "Yesterday", type: "contract" },
  { id: 6, actor: "Yara Haddad", action: "requested tranche 2 disbursement", target: "PRJ-2135", time: "Yesterday", type: "finance" },
  { id: 7, actor: "Lena Fischer", action: "closed milestone 'Depot piling completion'", target: "PRJ-2103", time: "2 days ago", type: "project" },
  { id: 8, actor: "HSE Lead", action: "raised corrective action CA-212", target: "PRJ-2041", time: "2 days ago", type: "risk" },
];

export const projectActivity = [
  { id: 1, actor: "Amara Osei", action: "Variation order VO-014 submitted", detail: "Ground improvement at IC-2 — 4.26M", time: "18 Jun 2026" },
  { id: 2, actor: "Meridian Engineering", action: "Geotechnical addendum issued", detail: "Revised bearing capacity at IC-2 piers", time: "11 Jun 2026" },
  { id: 3, actor: "Group Legal", action: "Extension of time claim CL-006 lodged", detail: "58 days claimed for permit delay", time: "04 Jul 2026" },
  { id: 4, actor: "Procurement Board", action: "Tender TND-221 evaluation completed", detail: "Terra Civil Works recommended — score 88.4", time: "09 Aug 2026" },
  { id: 5, actor: "HSE Lead", action: "Corrective action CA-212 raised", detail: "Scaffolding non-conformance, due 25 Aug", time: "13 Aug 2026" },
  { id: 6, actor: "Amara Osei", action: "Monthly progress report v12 published", detail: "Physical progress 68%, 3 weeks behind baseline", time: "14 Aug 2026" },
];

export const alerts = [
  { id: "AL-1", severity: "critical", title: "PRJ-1994 forecast cost overrun of 6.2%", detail: "Actual cost has exceeded approved budget by 3.6M with 18% of works remaining.", link: "/projects/p-4" },
  { id: "AL-2", severity: "critical", title: "Contract CTR-3990 under contractual review", detail: "Supplier performance below threshold; termination clause assessment in progress.", link: "/contracts/CTR-3990" },
  { id: "AL-3", severity: "high", title: "Coastal environmental permit expires in 46 days", detail: "Renewal submission outstanding; marine works exposure of 22.4M.", link: "/risks" },
  { id: "AL-4", severity: "high", title: "Approval APR-9003 overdue tomorrow", detail: "Fleet leasing master agreement renewal decision required.", link: "/approvals" },
  { id: "AL-5", severity: "medium", title: "Receivables ageing above 90 days increased 12%", detail: "Two client invoices totalling 8.1M now beyond terms.", link: "/finance" },
];

export const deadlines = [
  { id: "D-1", title: "Viaduct V1 deck casting milestone", date: "2026-09-04", project: "PRJ-2041", days: 18 },
  { id: "D-2", title: "Bonded warehouse licence renewal", date: "2026-08-31", project: "Logistics", days: 14 },
  { id: "D-3", title: "Tender TND-214 award decision", date: "2026-08-28", project: "PRJ-2103", days: 11 },
  { id: "D-4", title: "Q3 board reporting pack submission", date: "2026-09-12", project: "Group", days: 26 },
  { id: "D-5", title: "Fleet lease renewal execution", date: "2026-09-30", project: "PRJ-2120", days: 44 },
];

/* ---------- Charts ---------- */

export const portfolioByEntity = [
  { entity: "Construction", value: 621.5, projects: 5 },
  { entity: "Logistics", value: 182.0, projects: 4 },
  { entity: "Business Dev", value: 310.0, projects: 1 },
  { entity: "Foundation", value: 36.9, projects: 2 },
];

export const projectStatusMix = [
  { name: "On track", value: 5, color: "var(--color-chart-3)" },
  { name: "At risk", value: 2, color: "var(--color-chart-4)" },
  { name: "Delayed", value: 1, color: "var(--color-chart-5)" },
  { name: "Planning", value: 2, color: "var(--color-chart-2)" },
  { name: "On hold", value: 1, color: "var(--color-chart-1)" },
  { name: "Completed", value: 1, color: "var(--color-muted-foreground)" },
];

export const budgetVsActual = [
  { month: "Feb", budget: 42, actual: 39 },
  { month: "Mar", budget: 48, actual: 46 },
  { month: "Apr", budget: 51, actual: 54 },
  { month: "May", budget: 55, actual: 58 },
  { month: "Jun", budget: 61, actual: 64 },
  { month: "Jul", budget: 58, actual: 62 },
  { month: "Aug", budget: 63, actual: 60 },
];

export const revenueCostTrend = [
  { month: "Feb", revenue: 74, cost: 61, margin: 13 },
  { month: "Mar", revenue: 81, cost: 68, margin: 13 },
  { month: "Apr", revenue: 88, cost: 76, margin: 12 },
  { month: "May", revenue: 92, cost: 78, margin: 14 },
  { month: "Jun", revenue: 97, cost: 84, margin: 13 },
  { month: "Jul", revenue: 103, cost: 86, margin: 17 },
  { month: "Aug", revenue: 109, cost: 91, margin: 18 },
];

export const cashFlow = [
  { month: "Feb", inflow: 82, outflow: 71, net: 11 },
  { month: "Mar", inflow: 88, outflow: 79, net: 9 },
  { month: "Apr", inflow: 79, outflow: 84, net: -5 },
  { month: "May", inflow: 96, outflow: 82, net: 14 },
  { month: "Jun", inflow: 101, outflow: 89, net: 12 },
  { month: "Jul", inflow: 94, outflow: 97, net: -3 },
  { month: "Aug", inflow: 112, outflow: 93, net: 19 },
];

export const riskDistribution = [
  { category: "Regulatory", count: 6 },
  { category: "Financial", count: 9 },
  { category: "Technical", count: 7 },
  { category: "Supply chain", count: 5 },
  { category: "Commercial", count: 4 },
  { category: "Compliance", count: 3 },
];

export const entityFinancials = [
  { entity: "Construction", revenue: 612, cost: 548, margin: 10.5, cash: 84 },
  { entity: "Logistics", revenue: 218, cost: 181, margin: 17.0, cash: 46 },
  { entity: "Business Dev", revenue: 96, cost: 71, margin: 26.0, cash: 61 },
  { entity: "Foundation", revenue: 34, cost: 32, margin: 5.9, cash: 12 },
];

export const transactions = [
  { id: "TRX-55102", date: "2026-08-15", description: "Progress payment — Section 4 IPC #29", entity: "construction", project: "PRJ-2041", type: "Receipt", amount: 12_400_000, status: "Cleared" },
  { id: "TRX-55098", date: "2026-08-14", description: "Subcontractor payment — Terra Civil Works", entity: "construction", project: "PRJ-2041", type: "Payment", amount: -6_180_000, status: "Cleared" },
  { id: "TRX-55091", date: "2026-08-13", description: "ICD milestone invoice M4", entity: "logistics", project: "PRJ-2088", type: "Receipt", amount: 5_900_000, status: "Pending" },
  { id: "TRX-55084", date: "2026-08-12", description: "Equipment supply — Voltcore Industries", entity: "construction", project: "PRJ-2011", type: "Payment", amount: -4_720_000, status: "Cleared" },
  { id: "TRX-55079", date: "2026-08-11", description: "Grant tranche 1 receipt", entity: "foundation", project: "PRJ-2135", type: "Receipt", amount: 3_200_000, status: "Cleared" },
  { id: "TRX-55071", date: "2026-08-09", description: "Fleet lease instalment", entity: "logistics", project: "PRJ-2120", type: "Payment", amount: -540_000, status: "Cleared" },
  { id: "TRX-55066", date: "2026-08-07", description: "Land development fee income", entity: "bizdev", project: "PRJ-1960", type: "Receipt", amount: 2_850_000, status: "Cleared" },
  { id: "TRX-55060", date: "2026-08-05", description: "Payroll — August (construction)", entity: "construction", project: "—", type: "Payment", amount: -8_960_000, status: "Cleared" },
];

export const receivables = [
  { client: "Regional Highways Authority", current: 9_200_000, d30: 3_100_000, d60: 1_400_000, d90: 6_300_000 },
  { client: "Port & Freight Consortium", current: 5_900_000, d30: 800_000, d60: 0, d90: 0 },
  { client: "Metropolitan Transit Board", current: 7_400_000, d30: 2_200_000, d60: 900_000, d90: 0 },
  { client: "Municipal Water Utility", current: 1_100_000, d30: 640_000, d60: 1_800_000, d90: 1_800_000 },
];

export const payables = [
  { supplier: "Ferro Metals Group", current: 2_600_000, d30: 1_100_000, d60: 0, d90: 0 },
  { supplier: "Voltcore Industries", current: 4_900_000, d30: 2_400_000, d60: 700_000, d90: 0 },
  { supplier: "Castform Precast", current: 1_800_000, d30: 900_000, d60: 320_000, d90: 0 },
  { supplier: "Aquafilt Systems", current: 1_200_000, d30: 0, d60: 480_000, d90: 610_000 },
];

export const projectProfitability = [
  { project: "PRJ-2041", revenue: 152.4, cost: 141.2, margin: 7.3 },
  { project: "PRJ-2088", revenue: 46.1, cost: 41.8, margin: 9.3 },
  { project: "PRJ-2103", revenue: 96.2, cost: 88.9, margin: 7.6 },
  { project: "PRJ-1994", revenue: 58.3, cost: 61.9, margin: -6.2 },
  { project: "PRJ-2120", revenue: 21.4, cost: 18.6, margin: 13.1 },
  { project: "PRJ-1960", revenue: 112.0, cost: 96.5, margin: 13.8 },
];

/* ---------- AI ---------- */

export const aiSuggestions = [
  "What projects are currently at risk?",
  "Which projects are exceeding budget?",
  "Show outstanding approvals.",
  "Summarize critical contract obligations.",
  "What is affecting cash flow?",
];

export const aiResponses: Record<string, string> = {
  "What projects are currently at risk?": `Three projects are outside tolerance this period.

**PRJ-1994 Water Treatment Plant Upgrade** — delayed, critical risk. Actual cost 61.9M against a 58.3M budget (+6.2%) with 18% of works remaining. Root cause is the membrane supplier (Aquafilt Systems, on-time delivery 61%).

**PRJ-2041 Coastal Ring Road Section 4** — at risk, health 62. Physical progress 68% against a 74% baseline. Two drivers: coastal permit renewal (R-118) and worse-than-baseline ground conditions at IC-2 (R-101), with a 58-day extension of time claim lodged.

**PRJ-2011 Grid Interconnection Substation** — at risk, health 58, driven by FX exposure on imported GIS equipment (R-141), 70% now hedged forward.

Recommended focus: permit escalation on PRJ-2041 and a supplier contingency decision on PRJ-1994 within two weeks.`,
  "Which projects are exceeding budget?": `One project has breached its approved budget and two are trending toward breach.

• **PRJ-1994** — 61.9M actual vs 58.3M budget. Overrun 3.6M (6.2%). Margin now -6.2%.
• **PRJ-2041** — 141.2M of 184.5M consumed at 68% progress; forecast at completion 191.8M (+3.9%) if the IC-2 variation is not recovered.
• **PRJ-2011** — 72.4M of 97.8M at 71% progress; FX movement adds an estimated 1.9M exposure.

Group budget-vs-actual is running 2.1% above plan year to date, concentrated in the construction entity.`,
  "Show outstanding approvals.": `You have **7 pending approvals**, 2 marked critical.

• APR-9003 — Fleet leasing renewal, 6.4M, due tomorrow (critical)
• APR-9012 — Variation VO-014, 4.26M, due 19 Aug (critical)
• APR-9008 — Reinforcement steel PR-8841, 1.98M, due 18 Aug
• APR-9016 — Capex release RTG yard phase 2, 12.4M, due 21 Aug
• APR-9025 — Grant tranche 2, 3.6M, due 27 Aug
• APR-9021 — Supplier onboarding, due 24 Aug
• APR-8990 — Recruitment, 4 site engineers, due 30 Aug

Total value pending decision: **28.6M**. Average cycle time this quarter is 3.4 days, up from 2.1 days.`,
  "Summarize critical contract obligations.": `Four obligations require attention within 60 days.

**CTR-4102 (Main Works, 184.5M)** — CAR insurance renewal due 14 Oct is flagged action-required; quarterly environmental monitoring submission due 30 Sep is at risk of being late. The performance bond (10%) must remain in force to 31 Dec 2026.

**CTR-3990 (Membrane Supply, 14.8M)** — under contractual review. Delivery performance below the 85% threshold triggers the remedy provisions; a termination-for-convenience assessment is in progress.

**CTR-4275 (Fleet Leasing, 6.4M)** and **CTR-4066 (Terminal O&M, 3.2M)** both expire within 45 days without executed renewals.

Aggregate value of contracts expiring in 90 days: **9.6M**.`,
  "What is affecting cash flow?": `Net cash for August is **+19M**, but two structural pressures remain.

**Receivables ageing** — 8.1M is now beyond 90 days, concentrated in Regional Highways Authority (6.3M) and Municipal Water Utility (1.8M). This is a 12% increase on last month and the main driver of the April and July negative net months.

**Capex phasing** — the RTG yard phase 2 release (12.4M) and precast commitments (3.4M) land in the same quarter as the depot mobilisation.

Group cash position is 203M with 61M undrawn facility headroom. Under the current forecast, coverage stays above the 90-day policy minimum, but collecting the 90-day bucket would restore roughly three weeks of headroom.`,
};

export const aiDefaultResponse = `Here is what the platform can see for that request within your permissions.

Across 4 entities and 12 active projects, portfolio value is **1,150.4M** with 741.2M committed to date. Group health index is 78/100, weighted down by two construction projects.

If you need a specific cut of this — by entity, project, contract, supplier or period — ask for it directly and I will scope the analysis to the records you are authorised to view.`;

export const recentAnalyses = [
  { id: "AN-1", title: "Cost-to-complete reforecast — construction portfolio", date: "15 Aug 2026", scope: "5 projects" },
  { id: "AN-2", title: "Supplier concentration exposure review", date: "12 Aug 2026", scope: "Group" },
  { id: "AN-3", title: "Contract expiry impact assessment Q4", date: "09 Aug 2026", scope: "10 contracts" },
  { id: "AN-4", title: "Working capital sensitivity — 90 day scenario", date: "05 Aug 2026", scope: "Group treasury" },
];

export const notifications = [
  { id: "N-1", title: "VO-014 awaiting your approval", detail: "Submitted by Amara Osei — 4.26M", time: "24m", unread: true },
  { id: "N-2", title: "CTR-3990 escalated to contractual review", detail: "Group Legal", time: "1h", unread: true },
  { id: "N-3", title: "Cash flow forecast published", detail: "Sofia Marchetti", time: "3h", unread: true },
  { id: "N-4", title: "Tender TND-221 evaluation complete", detail: "Procurement Board", time: "Yesterday", unread: false },
];

/* ---------- helpers ---------- */

export const fmtMoney = (n: number, digits = 1) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(digits)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(digits)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K`;
  return `${sign}${abs}`;
};

export const fmtCurrency = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export type Approval = (typeof approvals)[number];
export type Asset = (typeof assets)[number];
export type Shipment = (typeof shipments)[number];
