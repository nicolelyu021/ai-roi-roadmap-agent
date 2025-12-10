import React, { useState } from 'react';
import { ArrowRight, Briefcase, Target, Gauge, ShieldAlert, User, Calendar, GitBranch } from 'lucide-react';
import { BusinessContext } from '../types';

interface ContextFormProps {
  onSubmit: (context: BusinessContext) => void;
}

const ContextForm: React.FC<ContextFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BusinessContext>({
    authorName: '',
    industry: '',
    objective: '',
    kpis: '',
    constraints: '',
    date: new Date().toISOString().split('T')[0], // Default to YYYY-MM-DD
    version: '1.0'
  });

  const handleChange = (field: keyof BusinessContext, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(formData).every(val => (val as string).trim().length > 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Step 1: Business Context</h2>
        <p className="text-slate-500">First, let's set the stage for your AI Roadmap.</p>
      </div>

      <div className="space-y-6">
        {/* Metadata Row: Author, Date, Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Author */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                    <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Designed By
                    </label>
                    <input
                        type="text"
                        className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                        placeholder="Your Name"
                        value={formData.authorName}
                        onChange={(e) => handleChange('authorName', e.target.value)}
                    />
                    </div>
                </div>
            </div>

            {/* Date and Version */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <Calendar className="w-4 h-4" /> Date
                        </label>
                        <input
                            type="date"
                            className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                    </div>
                    <div className="w-px bg-slate-200 mx-2"></div>
                    <div className="w-24">
                         <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <GitBranch className="w-4 h-4" /> Ver
                        </label>
                        <input
                            type="text"
                            className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                            placeholder="1.0"
                            value={formData.version}
                            onChange={(e) => handleChange('version', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Designed For (Industry / Org)
              </label>
              <input
                type="text"
                className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                placeholder="e.g., Retail - Supply Chain Division"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Strategic Objective
              </label>
              <textarea
                className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0 resize-none"
                placeholder="e.g., Reduce operational costs by 20% within 2 years"
                rows={2}
                value={formData.objective}
                onChange={(e) => handleChange('objective', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Gauge className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Primary KPIs
              </label>
              <input
                type="text"
                className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                placeholder="e.g., Margin impact, CSAT, Cycle time"
                value={formData.kpis}
                onChange={(e) => handleChange('kpis', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Constraints (Budget, Timeline, etc.)
              </label>
              <input
                type="text"
                className="w-full border-none p-0 text-lg text-slate-900 placeholder-slate-300 focus:ring-0"
                placeholder="e.g., $1M Budget, Q4 Deadline"
                value={formData.constraints}
                onChange={(e) => handleChange('constraints', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={() => isComplete && onSubmit(formData)}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all ${
              isComplete 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue to Use Cases
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextForm;