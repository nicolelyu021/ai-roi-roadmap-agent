import { EffortLevel, RiskLevel, UseCaseRaw, UseCaseComputed, FinalCanvasData, BusinessContext } from '../types';

const NPV_MULTIPLIER_3YR_10PCT = 2.48685;

// Helper to format dates
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const calculateMetrics = (useCase: UseCaseRaw): UseCaseComputed => {
  const benefitMid = (useCase.benefitLow + useCase.benefitHigh) / 2;
  const costMid = (useCase.costLow + useCase.costHigh) / 2;

  // ROI = (Benefit - Cost) / Cost
  const roi = costMid === 0 ? 0 : (benefitMid - costMid) / costMid;

  // NPV = Benefit * Multiplier - Cost
  const npv = (benefitMid * NPV_MULTIPLIER_3YR_10PCT) - costMid;

  // Payback = Cost / Benefit
  const payback = benefitMid === 0 ? 0 : costMid / benefitMid;

  // Effort Score
  let effortScore = 1;
  if (useCase.effort === EffortLevel.Medium) effortScore = 2;
  if (useCase.effort === EffortLevel.High) effortScore = 3;

  // Risk Multiplier
  let riskMultiplier = 0.9;
  if (useCase.risk === RiskLevel.Medium) riskMultiplier = 1.0;
  if (useCase.risk === RiskLevel.High) riskMultiplier = 1.2;

  const valueScore = effortScore === 0 ? 0 : (npv * riskMultiplier) / effortScore;

  return {
    ...useCase,
    benefitMid,
    costMid,
    roi,
    npv,
    payback,
    effortScore,
    riskMultiplier,
    valueScore,
    selected: false,
    roadmapTimeline: 'N/A',
    startDate: '',
    endDate: '',
    milestone: ''
  };
};

export const processPortfolio = (useCases: UseCaseRaw[], context: BusinessContext): { computedUseCases: UseCaseComputed[], canvasData: Partial<FinalCanvasData> } => {
  // 1. Compute Metrics
  let computed = useCases.map(calculateMetrics);

  // 2. Rank by Value Score (High -> Low)
  computed.sort((a, b) => b.valueScore - a.valueScore);

  // 3. Select Portfolio (Effort <= 6 rule)
  let currentTotalEffort = 0;
  let selectedCount = 0;

  const finalComputed = computed.map(uc => {
    let isSelected = false;
    // We select if it fits in effort bucket OR if it's the #1 ranked item (always select at least one)
    if (currentTotalEffort + uc.effortScore <= 6 || (selectedCount === 0)) {
      currentTotalEffort += uc.effortScore;
      isSelected = true;
      selectedCount++;
    } 
    return { ...uc, selected: isSelected };
  });

  const now = new Date();
  
  // 4. Assign Roadmap & Calculate Dates & Milestones
  const roadmapAssigned = finalComputed.map(uc => {
    if (!uc.selected) return { ...uc, roadmapTimeline: 'N/A' as const, startDate: '-', endDate: '-', milestone: '-' };

    let timeline: 'Q1' | '1-year' | '3-year' = '1-year';
    
    const deps = uc.dependencies.toLowerCase();

    // Logic for Q1 (Immediate)
    // Must be Low Effort AND (No dependencies OR explicitly "none") AND Not High Risk
    const isQ1 = uc.effort === EffortLevel.Low && 
                 (deps.includes('none') || deps === '' || deps.length < 5) && 
                 uc.risk !== RiskLevel.High;

    // Logic for 3-Year (Transformational)
    // High Effort OR High Risk OR Specific "Heavy" keywords in dependencies
    const is3Year = uc.effort === EffortLevel.High || 
                    uc.risk === RiskLevel.High || 
                    deps.includes('migration') || 
                    deps.includes('legacy') ||
                    deps.includes('transform');

    if (isQ1) {
        timeline = 'Q1';
    } else if (is3Year) {
        timeline = '3-year';
    }
    // Everything else falls into '1-year' (Core)

    // Date Logic
    let start = new Date(now);
    let end = new Date(now);
    let milestone = "";

    if (timeline === 'Q1') {
        start = addMonths(now, 1);
        end = addMonths(now, 4);
        milestone = "MVP / Pilot Complete";
    } else if (timeline === '1-year') {
        start = addMonths(now, 1);
        end = addMonths(now, 12);
        milestone = "Production Deployment";
    } else { // 3-year
        start = addMonths(now, 12);
        end = addMonths(now, 36);
        milestone = "Enterprise Scaling";
    }

    return { 
        ...uc, 
        roadmapTimeline: timeline,
        startDate: formatDate(start),
        endDate: formatDate(end),
        milestone: milestone
    };
  });

  // 5. Aggregated Financials
  const portfolioUseCases = roadmapAssigned.filter(u => u.selected);
  const totalEffort = portfolioUseCases.reduce((sum, u) => sum + u.effortScore, 0);
  const totalNPV = portfolioUseCases.reduce((sum, u) => sum + u.npv, 0);

  const nearTermCases = portfolioUseCases.filter(u => u.roadmapTimeline === 'Q1' || u.roadmapTimeline === '1-year');
  const longTermCases = portfolioUseCases.filter(u => u.roadmapTimeline === '3-year');

  const nearTermCost = nearTermCases.reduce((sum, u) => sum + u.costMid, 0);
  const longTermCost = longTermCases.reduce((sum, u) => sum + u.costMid, 0);
  
  const nearTermBenefits = nearTermCases.reduce((sum, u) => sum + u.benefitMid, 0);
  const longTermBenefits = longTermCases.reduce((sum, u) => sum + u.benefitMid, 0);

  const totalBenefits = nearTermBenefits + longTermBenefits;
  const totalCosts = nearTermCost + longTermCost;
  
  // Assumption: Annual Maintenance is ~20% of implementation cost
  const annualMaintenance = totalCosts * 0.20;

  // ROI Calculations
  const portfolioROI = totalCosts === 0 ? 0 : (totalBenefits - totalCosts) / totalCosts;
  const nearTermROI = nearTermCost === 0 ? 0 : (nearTermBenefits - nearTermCost) / nearTermCost;
  const longTermROI = longTermCost === 0 ? 0 : (longTermBenefits - longTermCost) / longTermCost;

  const canvasPartial: Partial<FinalCanvasData> = {
    Header: {
        Title: "AI ROI & Roadmap Canvas",
        DesignedBy: context.authorName,
        DesignedFor: context.industry,
        Date: context.date, 
        Version: context.version
    },
    Business_Context: {
        Objective: context.objective,
        StrategicFocus: "Generating...", 
        KPIs: context.kpis,
        Constraints: context.constraints
    },
    Inputs: { Resources: "Generating...", Personnel: "Generating...", ExternalSupport: "Generating..." },
    Impacts: { HardBenefits: "Generating...", SoftBenefits: "Generating..." },
    Capabilities: { Skills: "Generating...", Technology: "Generating..." },
    Use_Cases: roadmapAssigned.map(u => ({
        Name: u.name,
        Problem: u.problem,
        KPI: u.kpi,
        Benefit_midpoint: u.benefitMid,
        Cost_midpoint: u.costMid,
        ROI: (u.roi * 100).toFixed(1) + '%',
        NPV_3yr_10pct: Math.round(u.npv),
        Payback_Years: parseFloat(u.payback.toFixed(2)),
        Effort_Level: u.effort,
        Risk_Level: u.risk,
        Value_Score: parseFloat(u.valueScore.toFixed(2)),
        Dependencies: u.dependencies,
        Automation_or_Augmentation: u.type,
        Selected_for_Portfolio: u.selected ? 'Yes' : 'No',
        Roadmap_Timeline: u.roadmapTimeline,
        Start_Date: u.startDate,
        End_Date: u.endDate,
        Milestone: u.milestone
    })),
    Selected_Portfolio_Summary: {
        Total_Use_Cases_Selected: portfolioUseCases.length,
        Primary_Justification: "Selected based on highest Value Score within Effort constraint (Max 6).",
        Total_Effort: totalEffort,
        Total_Portfolio_NPV: Math.round(totalNPV)
    },
    Aggregated_Financials: {
        Near_Term_Cost: Math.round(nearTermCost),
        Long_Term_Cost: Math.round(longTermCost),
        Annual_Maintenance: Math.round(annualMaintenance),
        Near_Term_Benefits: Math.round(nearTermBenefits),
        Long_Term_Benefits: Math.round(longTermBenefits),
        Total_Costs: Math.round(totalCosts),
        Total_Benefits: Math.round(totalBenefits),
        Near_Term_ROI: (nearTermROI * 100).toFixed(1) + '%',
        Long_Term_ROI: (longTermROI * 100).toFixed(1) + '%',
        Total_Portfolio_ROI: (portfolioROI * 100).toFixed(1) + '%'
    },
    Roadmap: {
        Q1: roadmapAssigned.filter(u => u.roadmapTimeline === 'Q1').map(u => ({ name: u.name, start: u.startDate, end: u.endDate, milestone: u.milestone })),
        "1_year": roadmapAssigned.filter(u => u.roadmapTimeline === '1-year').map(u => ({ name: u.name, start: u.startDate, end: u.endDate, milestone: u.milestone })),
        "3_year": roadmapAssigned.filter(u => u.roadmapTimeline === '3-year').map(u => ({ name: u.name, start: u.startDate, end: u.endDate, milestone: u.milestone })),
    }
  };

  return { computedUseCases: roadmapAssigned, canvasData: canvasPartial };
};