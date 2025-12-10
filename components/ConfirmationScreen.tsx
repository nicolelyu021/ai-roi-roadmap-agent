import React from 'react';
import { ArrowRight, PlusCircle, CheckCircle } from 'lucide-react';

interface ConfirmationScreenProps {
  count: number;
  onCompute: () => void;
  onAddMore: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ count, onCompute, onAddMore }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 animate-fadeIn">
      <div className="max-w-2xl text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full shadow-sm">
             <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Great! I have gathered {count} use cases.
        </h2>
        
        <p className="text-lg text-slate-600">
          I can now compute the ROI metrics and generate your strategic roadmap, 
          or you can continue adding more use cases to the portfolio to expand your options.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <button 
            onClick={onCompute}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Compute & Generate Report
            <ArrowRight className="w-5 h-5" />
          </button>

          <button 
            onClick={onAddMore}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-medium text-lg hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add Another Use Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;