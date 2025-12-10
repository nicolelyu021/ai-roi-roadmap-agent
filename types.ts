export enum EffortLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum Step {
  WELCOME = 'WELCOME',
  CONTEXT = 'CONTEXT',
  USE_CASES = 'USE_CASES',
  CONFIRMATION = 'CONFIRMATION',
  CALCULATING = 'CALCULATING',
  RESULTS = 'RESULTS'
}

export interface BusinessContext {
  authorName: string; // Designed By
  industry: string;   // Designed For
  objective: string;
  kpis: string;
  constraints: string;
  date: string;       // Added: Date
  version: string;    // Added: Version
}

export interface UseCaseRaw {
  id: string;
  name: string;
  problem: string;
  kpi: string;
  benefitLow: number;
  benefitHigh: number;
  costLow: number;
  costHigh: number;
  effort: EffortLevel;
  risk: RiskLevel;
  dependencies: string;
  type: 'Automation' | 'Augmentation';
}

export interface UseCaseComputed extends UseCaseRaw {
  benefitMid: number;
  costMid: number;
  roi: number;
  npv: number;
  payback: number;
  effortScore: number;
  riskMultiplier: number;
  valueScore: number;
  selected: boolean;
  roadmapTimeline: 'Q1' | '1-year' | '3-year' | 'N/A';
  startDate: string;
  endDate: string;
  milestone: string;
}

export interface FinalCanvasData {
  Header: {
    Title: string;
    DesignedBy: string;
    DesignedFor: string;
    Date: string;
    Version: string;
  };
  Business_Context: {
    Objective: string;
    StrategicFocus: string;
    KPIs: string;
    Constraints: string;
  };
  Inputs: {
    Resources: string;
    Personnel: string;
    ExternalSupport: string;
  };
  Impacts: {
    HardBenefits: string;
    SoftBenefits: string;
  };
  Capabilities: {
    Skills: string;
    Technology: string;
  };
  Use_Cases: Array<{
    Name: string;
    Problem: string;
    KPI: string;
    Benefit_midpoint: number;
    Cost_midpoint: number;
    ROI: string;
    NPV_3yr_10pct: number;
    Payback_Years: number;
    Effort_Level: string;
    Risk_Level: string;
    Value_Score: number;
    Dependencies: string;
    Automation_or_Augmentation: string;
    Selected_for_Portfolio: string;
    Roadmap_Timeline: string;
    Start_Date: string;
    End_Date: string;
    Milestone: string;
  }>;
  Selected_Portfolio_Summary: {
    Total_Use_Cases_Selected: number;
    Primary_Justification: string;
    Total_Effort: number;
    Total_Portfolio_NPV: number;
  };
  Aggregated_Financials: {
    Near_Term_Cost: number;
    Long_Term_Cost: number;
    Annual_Maintenance: number;
    Near_Term_Benefits: number;
    Long_Term_Benefits: number;
    Total_Costs: number;
    Total_Benefits: number;
    Near_Term_ROI: string;
    Long_Term_ROI: string;
    Total_Portfolio_ROI: string;
  };
  Roadmap: {
    Q1: Array<{ name: string, start: string, end: string, milestone: string }>;
    "1_year": Array<{ name: string, start: string, end: string, milestone: string }>;
    "3_year": Array<{ name: string, start: string, end: string, milestone: string }>;
  };
  Final_Notes: {
    Risks_and_Mitigations: string;
    Data_and_Infra_Requirements: string;
    Organizational_Considerations: string;
  };
}