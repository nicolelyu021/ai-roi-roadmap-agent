import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import { EffortLevel, RiskLevel, UseCaseRaw } from '../types';

interface UseCaseWizardProps {
  useCaseIndex: number;
  totalRequired: number;
  onComplete: (data: UseCaseRaw) => void;
}

// Helper to get initial empty state
const getInitialState = (id: string): UseCaseRaw => ({
  id,
  name: '',
  problem: '',
  kpi: '',
  benefitLow: 0,
  benefitHigh: 0,
  costLow: 0,
  costHigh: 0,
  effort: EffortLevel.Low,
  risk: RiskLevel.Low,
  dependencies: '',
  type: 'Automation'
});

const questions = [
  { id: 'name', label: "Use Case Name?", type: 'text', placeholder: "e.g., Predictive Maintenance" },
  { id: 'problem', label: "What business problem does it solve?", type: 'textarea', placeholder: "Current downtime costs $1M/year..." },
  { id: 'kpi', label: "What KPI does it improve?", type: 'text', placeholder: "e.g., Uptime %" },
  { id: 'benefit', label: "Estimated annual benefit range ($)?", type: 'range', subLabels: ['Low Estimate', 'High Estimate'] },
  { id: 'cost', label: "Estimated implementation cost range ($)?", type: 'range', subLabels: ['Low Estimate', 'High Estimate'] },
  { id: 'effort', label: "Effort level?", type: 'select', options: Object.values(EffortLevel) },
  { id: 'risk', label: "Risk level?", type: 'select', options: Object.values(RiskLevel) },
  { id: 'dependencies', label: "Any major dependencies or prerequisites?", type: 'text', placeholder: "e.g., Data Lake migration" },
  { id: 'type', label: "Is this Automation or Augmentation?", type: 'select', options: ['Automation', 'Augmentation'] },
];

const UseCaseWizard: React.FC<UseCaseWizardProps> = ({ useCaseIndex, totalRequired, onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [data, setData] = useState<UseCaseRaw>(getInitialState(`uc-${useCaseIndex}`));
  const [inputValue, setInputValue] = useState<string | number>('');
  const [rangeValues, setRangeValues] = useState<{ low: string, high: string }>({ low: '', high: '' });

  // Reset when moving to a new use case
  useEffect(() => {
    setQIndex(0);
    setData(getInitialState(`uc-${useCaseIndex}`));
    setInputValue('');
    setRangeValues({ low: '', high: '' });
  }, [useCaseIndex]);

  const currentQ = questions[qIndex];

  const handleNext = () => {
    // Save current answer
    const newData = { ...data };

    if (currentQ.id === 'benefit') {
      newData.benefitLow = parseFloat(rangeValues.low) || 0;
      newData.benefitHigh = parseFloat(rangeValues.high) || 0;
    } else if (currentQ.id === 'cost') {
      newData.costLow = parseFloat(rangeValues.low) || 0;
      newData.costHigh = parseFloat(rangeValues.high) || 0;
    } else {
      // @ts-ignore - dynamic assignment
      newData[currentQ.id] = inputValue;
    }

    setData(newData);

    // If last question, complete the use case
    if (qIndex === questions.length - 1) {
      onComplete(newData);
    } else {
      // Move to next question
      setQIndex(prev => prev + 1);
      
      // Reset inputs for next question
      const nextQ = questions[qIndex + 1];
      if (nextQ.type === 'range') {
        setRangeValues({ low: '', high: '' });
      } else if (nextQ.type === 'select') {
        setInputValue(nextQ.options?.[0] || '');
      } else {
        setInputValue('');
      }
    }
  };

  // Auto-set default select value
  useEffect(() => {
    if (currentQ.type === 'select' && !inputValue) {
      setInputValue(currentQ.options?.[0] || '');
    }
  }, [qIndex, currentQ.type, currentQ.options, inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentQ.type !== 'textarea') {
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Use Case #{useCaseIndex + 1}</h2>
          <p className="text-slate-500 text-sm">Collecting {totalRequired} use cases minimum.</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalRequired }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-colors ${i < useCaseIndex ? 'bg-green-500' : i === useCaseIndex ? 'bg-blue-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[400px] flex flex-col relative overflow-hidden">
         {/* Question Progress inside card */}
         <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${((qIndex) / questions.length) * 100}%` }}
            />
         </div>

        <div className="flex-1 flex flex-col justify-center animate-fadeIn">
          <label className="text-slate-500 uppercase tracking-wider text-xs font-semibold mb-4">
            Question {qIndex + 1} of {questions.length}
          </label>
          <h3 className="text-3xl font-bold text-slate-800 mb-8 leading-tight">
            {currentQ.label}
          </h3>

          {currentQ.type === 'text' && (
            <input
              autoFocus
              type="text"
              className="w-full text-2xl border-b-2 border-slate-200 py-2 focus:border-blue-600 focus:outline-none transition-colors bg-transparent"
              placeholder={currentQ.placeholder}
              value={inputValue as string}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

          {currentQ.type === 'textarea' && (
            <textarea
              autoFocus
              className="w-full text-xl border-2 border-slate-200 rounded-xl p-4 focus:border-blue-600 focus:outline-none transition-colors bg-transparent resize-none"
              rows={4}
              placeholder={currentQ.placeholder}
              value={inputValue as string}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}

          {currentQ.type === 'range' && (
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-600 mb-2">{currentQ.subLabels?.[0]}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-xl"
                    placeholder="0"
                    value={rangeValues.low}
                    onChange={(e) => setRangeValues(prev => ({ ...prev, low: e.target.value }))}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-600 mb-2">{currentQ.subLabels?.[1]}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-xl"
                    placeholder="0"
                    value={rangeValues.high}
                    onChange={(e) => setRangeValues(prev => ({ ...prev, high: e.target.value }))}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
          )}

          {currentQ.type === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQ.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setInputValue(opt)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    inputValue === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{opt}</span>
                    {inputValue === opt && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-all font-medium"
          >
            {qIndex === questions.length - 1 ? 'Finish Use Case' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseCaseWizard;