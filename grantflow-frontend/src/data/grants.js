// PRD-accurate grant programme data
export const GRANTS_DATA = [
  {
    id: 'CDG',
    slug: 'cdg',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_mvoZaxEqUaG2o1-l7jUV_1AkpeWszwRscGG_6Lt4GilbNZHvoT9Sn-OToaa6vD6lCQ9G2pJKY6_k7b2CIkTsAttUG11DmZWtd_hD2tTJ0jmRtPVDAcnokyt2dy-asAWPXk-rpO7Hg5mUmn212cCoJKDQ7qgbtL8fyJTIGOouV-SjbrDa6LMxFq0FkU0v0e6-obtW3pozASxK6WmPbuYeGvWkn_KuDtJheE-dXF4dPwuO5A9h1-LjtZu0mbezZcbrV40hMmd854",
    imageAlt: "Community Development",
    category: "Community",
    categoryColor: "bg-amber-500 text-slate-900",
    mobileIcon: "groups",
    title: "Community Development Grant (CDG)",
    shortTitle: "CDG",
    purpose: "Fund community-level infrastructure and social service projects",
    description: "Supporting grassroots organizations to build community-level infrastructure and deliver social service projects in rural and semi-urban India. Ideal for registered NGOs, Trusts, and Section 8 Companies.",
    fundingRange: "₹2,00,000 – ₹20,00,000",
    fundingMin: 200000,
    fundingMax: 2000000,
    duration: "6 to 18 months",
    durationMin: 6,
    durationMax: 18,
    eligibleApplicants: "Registered NGOs, Trusts, Section 8 Companies with minimum 2 years of operation",
    eligibleTypes: ["NGO", "Trust", "Section 8 Company"],
    minYears: 2,
    geographicFocus: "Rural and semi-urban areas in India",
    annualCycle: "Applications open April 1 – June 30 each year",
    deadline: "June 30, 2026",
    maxAwards: 10,
    totalBudget: "₹2 Crore per cycle",
    reviewerCount: 1,
    meta: [
      { label: "Funding Range", value: "₹2L – ₹20L", highlight: true },
      { label: "Duration", value: "6–18 Months" },
      { label: "Deadline", value: "Jun 30, 2026", danger: true },
      { label: "Eligibility", value: "NGOs/Trusts" },
    ],
    eligibilityCriteria: [
      { code: "E1", label: "Organisation Type", rule: "Must be NGO, Trust, or Section 8 Company" },
      { code: "E2", label: "Minimum Age", rule: "Year of establishment ≤ current year – 2" },
      { code: "E3", label: "Geographic Focus", rule: "Project location must be in a rural/semi-urban district" },
      { code: "E4", label: "Funding Range", rule: "Amount requested between ₹2L and ₹20L" },
      { code: "E5", label: "Project Duration", rule: "End date – start date between 6 and 18 months" },
      { code: "E6", label: "Budget Overhead", rule: "Overhead line ≤ 15% of total requested amount" },
      { code: "E7", label: "Budget Total", rule: "Sum of all budget lines must equal total amount requested (±₹500)" },
      { code: "E8", label: "Thematic Alignment (AI)", rule: "Project description must align to community development themes — AI score ≥ 60%", ai: true },
      { code: "E9", label: "Beneficiary Count (AI)", rule: "Must be > 0 and reasonable for budget — cost per beneficiary < ₹50,000", ai: true },
    ],
    scoringRubric: [
      { dimension: "Community Need & Problem Clarity", weight: 25 },
      { dimension: "Project Design & Feasibility", weight: 25 },
      { dimension: "Organisation Track Record", weight: 20 },
      { dimension: "Expected Impact & Outcomes", weight: 20 },
      { dimension: "Budget Realism", weight: 10 },
    ],
    requiredDocuments: [
      { label: "Registration Certificate", notes: "Certificate of Registration / Trust Deed / MOA-AOA" },
      { label: "FCRA Certificate", notes: "Only if foreign funds received previously", optional: true },
      { label: "80G / 12A Tax Certificate", notes: "Tax exemption proof" },
      { label: "Last 2 Years Audited Financial Statements", notes: "Signed by registered CA" },
      { label: "Project Budget Breakdown", notes: "Detailed line-item budget matching form totals" },
      { label: "Board Resolution", notes: "Signed by Chairperson authorising application" },
      { label: "Photographs of target community / site", notes: "Evidence of problem statement" },
    ],
    workflowStages: [
      { stage: "Submitted", actor: "System", sla: "Instant", icon: "check_circle" },
      { stage: "Eligibility Screening", actor: "AI Agent", sla: "1 day", icon: "smart_toy" },
      { stage: "Under Review", actor: "Grant Reviewer", sla: "7 days", icon: "rate_review" },
      { stage: "Award Decision", actor: "Program Officer", sla: "3 days", icon: "gavel" },
      { stage: "Agreement Sent", actor: "System", sla: "1 day", icon: "handshake" },
      { stage: "Active Grant", actor: "Finance Officer", sla: "Ongoing", icon: "rocket_launch" },
      { stage: "Reporting", actor: "Applicant / PO", sla: "Per schedule", icon: "assessment" },
      { stage: "Closed", actor: "Program Officer", sla: "On final report", icon: "verified" },
    ],
    reportingSchedule: "1 × 6-Month Progress Report, 1 × Final Report",
  },
  {
    id: 'EIG',
    slug: 'eig',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIb3ZVL3KSR6B1950t0U2IzABRssRCKyPE616P3k8hnVtbXzX1Lir5wre5z3_S48pHrdT_ifgZpI7HKHDgadJnoyBGp24WFw8iwJHKGorFvz7oNenzV8kdFmX4J3pkKgs5gkF3hKc_a21PfOL6V2mxMsSnKEwqy0kt7QP4YMA252YKhsZADbBlB0SxUMa-D3Ena7DHUF1G85q-QKlzjfyv_cpB4_CmfIlgL1oTQfjVGYE-K6e6t0AiLB7DM2bbLiqHHTXgI33JI4o",
    imageAlt: "Education Innovation",
    category: "Education",
    categoryColor: "bg-blue-600 text-white",
    mobileIcon: "school",
    title: "Education Innovation Grant (EIG)",
    shortTitle: "EIG",
    purpose: "Fund technology-enabled or pedagogy-innovation projects improving learning outcomes in government schools",
    description: "Funding for projects that leverage technology or innovative pedagogy to improve learning outcomes in government schools. Open to NGOs, EdTech non-profits, research institutions, and universities.",
    fundingRange: "₹5,00,000 – ₹50,00,000",
    fundingMin: 500000,
    fundingMax: 5000000,
    duration: "12 to 24 months",
    durationMin: 12,
    durationMax: 24,
    eligibleApplicants: "NGOs, EdTech non-profits, Research institutions, Universities",
    eligibleTypes: ["NGO", "EdTech Non-profit", "Research Institution", "University"],
    minYears: 1,
    geographicFocus: "Any state in India; preference for aspirational districts",
    annualCycle: "Rolling applications — reviewed quarterly (Jan, Apr, Jul, Oct)",
    deadline: "Rolling (Quarterly)",
    maxAwards: 5,
    totalBudget: "₹5 Crore per year",
    reviewerCount: 2,
    meta: [
      { label: "Funding Range", value: "₹5L – ₹50L", highlight: true },
      { label: "Duration", value: "12–24 Months" },
      { label: "Deadline", value: "Rolling Quarterly" },
      { label: "Eligibility", value: "NGOs/EdTech" },
    ],
    eligibilityCriteria: [
      { code: "E1", label: "Organisation Type", rule: "NGO / EdTech Non-profit / Research Institution / University only" },
      { code: "E2", label: "Minimum Operation", rule: "Established ≥ 1 year ago" },
      { code: "E3", label: "Funding Range", rule: "Amount between ₹5L and ₹50L" },
      { code: "E4", label: "Project Duration", rule: "12–24 months" },
      { code: "E5", label: "Schools Targeted", rule: "Minimum 5 schools" },
      { code: "E6", label: "Grade Coverage", rule: "Must target at least one grade level" },
      { code: "E7", label: "Budget Overhead Cap", rule: "Overheads ≤ 15% of total" },
      { code: "E8", label: "Budget Total Match", rule: "Budget lines must sum to requested total (±₹500)" },
      { code: "E9", label: "Education Theme (AI)", rule: "AI NLP score for education innovation alignment ≥ 65%", ai: true },
      { code: "E10", label: "Impact Plan (AI)", rule: "AI checks whether a measurable plan with indicators exists", ai: true },
    ],
    scoringRubric: [
      { dimension: "Innovation & Novelty", weight: 25 },
      { dimension: "Educational Impact Potential", weight: 25 },
      { dimension: "Team & Organisational Capacity", weight: 20 },
      { dimension: "Scalability & Sustainability", weight: 15 },
      { dimension: "Budget Efficiency", weight: 15 },
    ],
    requiredDocuments: [
      { label: "Registration / Incorporation Certificate", notes: "Official registration document" },
      { label: "Last 2 Years Audited Financials", notes: "Signed by registered CA" },
      { label: "Proof of prior education project", notes: "Report or case study (mandatory for NGOs/EdTechs)" },
      { label: "School Partnership Letters (min 2)", notes: "MoU or letter of intent from target schools" },
      { label: "Team CVs", notes: "Project Lead + 2 key members, 1-page CV format" },
      { label: "Detailed Budget with Breakdown", notes: "Line-item detail" },
      { label: "Product Demo / Prototype", notes: "Screenshots, demo video link, or working URL", optional: true },
    ],
    workflowStages: [
      { stage: "Submitted", actor: "System", sla: "Instant", icon: "check_circle" },
      { stage: "Eligibility Screening", actor: "AI Agent", sla: "1 day", icon: "smart_toy" },
      { stage: "Under Review", actor: "2 Reviewers", sla: "10 days", icon: "rate_review" },
      { stage: "Award Decision", actor: "Program Officer", sla: "5 days", icon: "gavel" },
      { stage: "Agreement Sent", actor: "System", sla: "1 day", icon: "handshake" },
      { stage: "Active Grant", actor: "Finance + PO", sla: "Per milestones", icon: "rocket_launch" },
      { stage: "Quarterly Reporting", actor: "Applicant / PO", sla: "Quarterly", icon: "assessment" },
      { stage: "Closed", actor: "Program Officer", sla: "On final report", icon: "verified" },
    ],
    reportingSchedule: "3 × Quarterly Reports, 1 × Mid-Project Report (month 12), 1 × Final Report",
  },
  {
    id: 'ECAG',
    slug: 'ecag',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc-DGLOJ49OIxv_AGnA8myVZz4-tBbKW_r2XPsYIt_aWH5Nb4j6xBLEV3tB3Ackq2CBhsIGU-aRhpYhwf89M32_LSOrUWHDM02L5cc6U3PZVEUYr9-qnvy9EBKqMO0_C720M0xCRHw509F03yC9z752wQHBOvGdswAWJVr-xxljJqXKvFquoWySL5vHvBVFowObrFiUKd8hFGcrGB9zstWB-rD8QDM4UNnYh2KUAhyMCRYl_wqFa13lDNCgg2Wb6VPoQCyIwT-TEY",
    imageAlt: "Environment & Climate Action",
    category: "Environment",
    categoryColor: "bg-emerald-600 text-white",
    mobileIcon: "eco",
    title: "Environment & Climate Action Grant (ECAG)",
    shortTitle: "ECAG",
    purpose: "Fund grassroots environmental conservation, climate resilience, and clean energy access projects",
    description: "Empowering grassroots movements to combat climate change through direct conservation action, climate resilience building, and clean energy access initiatives across climate-vulnerable regions.",
    fundingRange: "₹3,00,000 – ₹30,00,000",
    fundingMin: 300000,
    fundingMax: 3000000,
    duration: "6 to 24 months",
    durationMin: 6,
    durationMax: 24,
    eligibleApplicants: "NGOs, Farmer Producer Organisations (FPOs), Panchayat bodies, Research institutions",
    eligibleTypes: ["NGO", "FPO", "Panchayat", "Research Institution"],
    minYears: 0,
    geographicFocus: "India — priority given to climate-vulnerable districts",
    annualCycle: "Applications open twice yearly: Jan 1–Feb 28 and Jul 1–Aug 31",
    deadline: "Aug 31, 2026",
    maxAwards: 15,
    totalBudget: "₹3 Crore per year",
    reviewerCount: 1,
    meta: [
      { label: "Funding Range", value: "₹3L – ₹30L", highlight: true },
      { label: "Duration", value: "6–24 Months" },
      { label: "Deadline", value: "Aug 31, 2026", danger: true },
      { label: "Eligibility", value: "NGOs/FPOs" },
    ],
    eligibilityCriteria: [
      { code: "E1", label: "Organisation Type", rule: "NGO / FPO / Panchayat / Research Institution only" },
      { code: "E2", label: "Funding Range", rule: "₹3L – ₹30L" },
      { code: "E3", label: "Duration", rule: "6–24 months" },
      { code: "E4", label: "Budget Overhead Cap", rule: "Overheads ≤ 15% of total" },
      { code: "E5", label: "Budget Total Match", rule: "Budget lines sum to requested total (±₹500)" },
      { code: "E6", label: "Geographic Priority (AI)", rule: "Project location checked against climate-vulnerable district list", ai: true },
      { code: "E7", label: "Environmental Theme (AI)", rule: "AI score for environmental / climate themes ≥ 60%", ai: true },
      { code: "E8", label: "Community Involvement (AI)", rule: "AI checks community involvement plan exists and is substantive", ai: true },
    ],
    scoringRubric: [
      { dimension: "Environmental Impact & Urgency", weight: 30 },
      { dimension: "Community Ownership & Inclusion", weight: 25 },
      { dimension: "Technical Soundness", weight: 20 },
      { dimension: "Organisation & Team Capacity", weight: 15 },
      { dimension: "Budget Realism & Sustainability", weight: 10 },
    ],
    requiredDocuments: [
      { label: "Registration Certificate", notes: "Official registration document" },
      { label: "Last 2 Years Audited Financials", notes: "Signed by CA" },
      { label: "Land / Site Permission Letter", notes: "From Gram Panchayat / Forest Dept / CRZ authority" },
      { label: "Community Consent Documentation", notes: "Gram Sabha resolution or community meeting minutes" },
      { label: "Environmental Baseline Data", notes: "Site photos, existing environmental assessment" },
      { label: "Detailed Budget Breakdown", notes: "Line-item with quantities and unit rates" },
      { label: "Prior environmental project report", notes: "Strongly recommended", optional: true },
    ],
    workflowStages: [
      { stage: "Submitted", actor: "System", sla: "Instant", icon: "check_circle" },
      { stage: "Eligibility Screening", actor: "AI Agent", sla: "1 day", icon: "smart_toy" },
      { stage: "Under Review", actor: "Grant Reviewer", sla: "7 days", icon: "rate_review" },
      { stage: "Award Decision", actor: "Program Officer", sla: "3 days", icon: "gavel" },
      { stage: "Agreement Sent", actor: "System", sla: "1 day", icon: "handshake" },
      { stage: "Active Grant", actor: "Finance Officer", sla: "Ongoing", icon: "rocket_launch" },
      { stage: "Reporting", actor: "Applicant / PO", sla: "At 6 months + end", icon: "assessment" },
      { stage: "Closed", actor: "Program Officer", sla: "On final report", icon: "verified" },
    ],
    reportingSchedule: "Varies by duration: Mid-point + Final (6-12mo) or 6mo + 12mo + Final (13-24mo)",
  },
];

// Organisation types for eligibility pre-check
export const ORG_TYPES = [
  "NGO",
  "Trust",
  "Section 8 Company",
  "FPO",
  "Panchayat",
  "Research Institution",
  "University",
  "EdTech Non-profit",
  "Other",
];

// Indian states for location selection
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

export const checkEligibility = (grantId, orgType, fundingAmount, yearsOfOperation) => {
  const grant = GRANTS_DATA.find(g => g.id === grantId);
  if (!grant) return { eligible: false, reasons: ["Grant programme not found"] };

  const results = [];
  let eligible = true;

  // Check org type
  const typeMatch = grant.eligibleTypes.some(t => t.toLowerCase() === orgType.toLowerCase());
  if (!typeMatch) {
    eligible = false;
    results.push({ pass: false, criterion: "Organisation Type", reason: `${orgType} is not eligible for ${grant.shortTitle}. Required: ${grant.eligibleTypes.join(', ')}` });
  } else {
    results.push({ pass: true, criterion: "Organisation Type", reason: `${orgType} is eligible` });
  }

  // Check min years
  if (grant.minYears > 0 && yearsOfOperation < grant.minYears) {
    eligible = false;
    results.push({ pass: false, criterion: "Minimum Operation Period", reason: `Minimum ${grant.minYears} years required. You have ${yearsOfOperation} year(s).` });
  } else {
    results.push({ pass: true, criterion: "Minimum Operation Period", reason: `${yearsOfOperation} years meets the minimum requirement` });
  }

  // Check funding range
  if (fundingAmount < grant.fundingMin || fundingAmount > grant.fundingMax) {
    eligible = false;
    results.push({ pass: false, criterion: "Funding Range", reason: `Requested ₹${fundingAmount.toLocaleString('en-IN')} is outside the range of ${grant.fundingRange}` });
  } else {
    results.push({ pass: true, criterion: "Funding Range", reason: `₹${fundingAmount.toLocaleString('en-IN')} is within the eligible range` });
  }

  return { eligible, results, grant };
};
