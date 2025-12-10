import React from 'react';
import { ArrowRight, BrainCircuit } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600 rounded-full shadow-lg">
            <BrainCircuit className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          AI ROI & Roadmap Agent
        </h1>
        
        <p className="text-lg text-slate-600 leading-relaxed">
          I will help you capture high-impact AI use cases, mathematically prove their value (ROI, NPV), 
          select an optimal portfolio, and generate a strategic roadmap canvas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">1. Capture</h3>
            <p className="text-sm text-slate-500">Interview user for at least 5 AI use cases with standardized metrics.</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">2. Compute</h3>
            <p className="text-sm text-slate-500">Auto-calculate ROI, Payback, and NPV @ 10%.</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">3. Visualize</h3>
            <p className="text-sm text-slate-500">Get a professional Strategy Canvas & JSON export.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl"
        >
          Start Session
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;