import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ContextForm from './components/ContextForm';
import UseCaseWizard from './components/UseCaseWizard';
import CanvasView from './components/CanvasView';
import ConfirmationScreen from './components/ConfirmationScreen';
import { Step, BusinessContext, UseCaseRaw, FinalCanvasData } from './types';
import { processPortfolio } from './utils/calculations';
import { generateCanvasInsights } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const REQUIRED_USE_CASES = 5;

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.WELCOME);
  const [context, setContext] = useState<BusinessContext | null>(null);
  const [useCases, setUseCases] = useState<UseCaseRaw[]>([]);
  const [finalData, setFinalData] = useState<FinalCanvasData | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleStart = () => setCurrentStep(Step.CONTEXT);

  const handleContextSubmit = (data: BusinessContext) => {
    setContext(data);
    setCurrentStep(Step.USE_CASES);
  };

  const handleUseCaseComplete = (data: UseCaseRaw) => {
    const newUseCases = [...useCases, data];
    setUseCases(newUseCases);

    if (newUseCases.length >= REQUIRED_USE_CASES) {
      setCurrentStep(Step.CONFIRMATION);
    }
  };

  const handleCompute = () => {
    handleProcessing(useCases);
  };

  const handleAddMore = () => {
    setCurrentStep(Step.USE_CASES);
  };

  const handleProcessing = async (allUseCases: UseCaseRaw[]) => {
    if (!context) return;
    setCurrentStep(Step.CALCULATING);

    // 1. Core Logic Computation
    const { canvasData } = processPortfolio(allUseCases, context);
    
    // Set initial data 
    const partialData: FinalCanvasData = {
      ...canvasData as FinalCanvasData,
      Final_Notes: {
        Risks_and_Mitigations: "Generating...",
        Data_and_Infra_Requirements: "Generating...",
        Organizational_Considerations: "Generating..."
      },
      Inputs: { Resources: "Generating...", Personnel: "Generating...", ExternalSupport: "Generating..." },
      Impacts: { HardBenefits: "Generating...", SoftBenefits: "Generating..." },
      Capabilities: { Skills: "Generating...", Technology: "Generating..." }
    };
    
    setFinalData(partialData);
    setCurrentStep(Step.RESULTS);

    // 2. AI Enhancement
    setIsProcessingAI(true);
    const insights = await generateCanvasInsights(partialData);
    
    setFinalData(prev => prev ? ({
        ...prev,
        Business_Context: {
            ...prev.Business_Context,
            StrategicFocus: insights.strategicFocus
        },
        Final_Notes: {
            Risks_and_Mitigations: insights.finalNotes.risks,
            Data_and_Infra_Requirements: insights.finalNotes.dataInfra,
            Organizational_Considerations: insights.finalNotes.org
        },
        Inputs: {
          Resources: insights.inputs.resources,
          Personnel: insights.inputs.personnel,
          ExternalSupport: insights.inputs.externalSupport
        },
        Impacts: {
          HardBenefits: insights.impacts.hardBenefits,
          SoftBenefits: insights.impacts.softBenefits
        },
        Capabilities: {
          Skills: insights.capabilities.skills,
          Technology: insights.capabilities.technology
        }
    }) : null);
    
    setIsProcessingAI(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentStep === Step.WELCOME && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {currentStep === Step.CONTEXT && (
        <ContextForm onSubmit={handleContextSubmit} />
      )}

      {currentStep === Step.USE_CASES && (
        <UseCaseWizard 
          useCaseIndex={useCases.length}
          totalRequired={REQUIRED_USE_CASES}
          onComplete={handleUseCaseComplete}
        />
      )}

      {currentStep === Step.CONFIRMATION && (
        <ConfirmationScreen 
          count={useCases.length}
          onCompute={handleCompute}
          onAddMore={handleAddMore}
        />
      )}

      {currentStep === Step.CALCULATING && (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-bold">Computing ROI & Portfolio Logic...</h2>
        </div>
      )}

      {currentStep === Step.RESULTS && finalData && (
        <CanvasView data={finalData} isLoadingAI={isProcessingAI} />
      )}
    </div>
  );
};

export default App;