import React from 'react';
import { FinalCanvasData } from '../types';
import { Download, Calendar, Users, Cpu, Layers, Target, FileText, Printer } from 'lucide-react';

interface CanvasViewProps {
  data: FinalCanvasData;
  isLoadingAI: boolean;
}

const CanvasView: React.FC<CanvasViewProps> = ({ data, isLoadingAI }) => {
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify({ AI_ROI_Roadmap_Canvas: data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_ROI_Roadmap_Canvas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    // @ts-ignore
    const element = document.getElementById('canvas-pdf-target');
    if (!element) return;

    // @ts-ignore
    if (typeof window.html2pdf === 'function') {
        const opt = {
            margin:       [0.2, 0.2, 0.2, 0.2], // top, left, bottom, right
            filename:     'AI_ROI_Roadmap_Canvas.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
            jsPDF:        { unit: 'in', format: 'a3', orientation: 'landscape' } // A3 to accommodate the wide layout
        };
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save();
    } else {
        // Fallback to window.print if library not loaded
        window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{data.Header.Title}</h1>
            <p className="text-slate-500">Strategic Portfolio Analysis for {data.Header.DesignedFor}</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handlePrintPDF}
                className="flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors font-semibold shadow-sm"
            >
                <Printer className="w-4 h-4" />
                Download Report PDF
            </button>
            <button 
                onClick={downloadJSON}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
                <Download className="w-4 h-4" />
                Download JSON
            </button>
          </div>
        </div>

        {/* The Canvas Grid - Extended Layout */}
        <div id="canvas-pdf-target" className="canvas-container bg-white shadow-2xl rounded-sm border-4 border-slate-900 overflow-hidden text-sm">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 border-b-2 border-slate-900 bg-slate-50">
             <div className="p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <span className="block text-xs uppercase text-slate-400 font-bold">Designed For</span>
                <span className="font-semibold text-base">{data.Header.DesignedFor}</span>
             </div>
             <div className="p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <span className="block text-xs uppercase text-slate-400 font-bold">Designed By</span>
                <span className="font-semibold text-base">{data.Header.DesignedBy}</span>
             </div>
             <div className="p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <span className="block text-xs uppercase text-slate-400 font-bold">Date</span>
                <span className="font-semibold text-base">{data.Header.Date}</span>
             </div>
             <div className="p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <span className="block text-xs uppercase text-slate-400 font-bold">Version</span>
                <span className="font-semibold text-base">{data.Header.Version}</span>
             </div>
             <div className="p-4">
                <span className="block text-xs uppercase text-slate-400 font-bold">Primary Goal</span>
                <span className="font-semibold text-xs leading-tight block">{data.Business_Context.Objective}</span>
             </div>
          </div>

          {/* Strategic Focus Banner */}
          <div className="bg-slate-50 border-b-2 border-slate-900 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/2">
                    <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Strategic Focus</span>
                    <p className="italic text-slate-700">{isLoadingAI ? 'Generating...' : data.Business_Context.StrategicFocus}</p>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold mb-1">KPIs</span>
                        <p className="text-xs text-slate-700">{data.Business_Context.KPIs}</p>
                    </div>
                    <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Constraints</span>
                        <p className="text-xs text-slate-700">{data.Business_Context.Constraints}</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
            
            {/* Column 1: Inputs & Capabilities & Impacts */}
            <div className="col-span-1 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900 flex flex-col">
               
               {/* Inputs */}
               <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-sm uppercase mb-2 flex items-center gap-2 text-slate-800">
                    <Users className="w-4 h-4" /> Inputs
                  </h3>
                  <div className="space-y-3">
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Resources</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Inputs.Resources}</p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Personnel</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Inputs.Personnel}</p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">External Support</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Inputs.ExternalSupport}</p>
                     </div>
                  </div>
               </div>

               {/* Capabilities */}
               <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-bold text-sm uppercase mb-2 flex items-center gap-2 text-slate-800">
                    <Cpu className="w-4 h-4" /> Capabilities
                  </h3>
                  <div className="space-y-3">
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Skills Needed</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Capabilities.Skills}</p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Technology</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Capabilities.Technology}</p>
                     </div>
                  </div>
               </div>

               {/* Impacts */}
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-sm uppercase mb-2 flex items-center gap-2 text-slate-800">
                    <Target className="w-4 h-4" /> Impacts
                  </h3>
                  <div className="space-y-3">
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Hard Benefits</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Impacts.HardBenefits}</p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Soft Benefits</span>
                        <p className="text-xs text-slate-700">{isLoadingAI ? '...' : data.Impacts.SoftBenefits}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Column 2 & 3: Portfolio Selection */}
            <div className="col-span-1 lg:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900 p-4 flex flex-col">
               <h3 className="font-bold text-sm uppercase mb-4 flex items-center gap-2">
                 <Layers className="w-4 h-4" /> Selected Portfolio Use Cases
                 <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{data.Selected_Portfolio_Summary.Total_Use_Cases_Selected} Selected</span>
               </h3>
               
               <div className="space-y-3 flex-1 overflow-y-auto">
                 {data.Use_Cases.filter(u => u.Selected_for_Portfolio === 'Yes').map((uc, i) => (
                    <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-blue-900 text-sm">{uc.Name}</span>
                            <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Score: {uc.Value_Score}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-2 italic">{uc.Problem}</p>
                        <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-600 border-t border-slate-200 pt-2">
                            <div><span className="block text-slate-400">ROI</span><span className="font-bold">{uc.ROI}</span></div>
                            <div><span className="block text-slate-400">NPV</span><span className="font-bold">${uc.NPV_3yr_10pct.toLocaleString()}</span></div>
                            <div><span className="block text-slate-400">Effort</span><span className="font-bold">{uc.Effort_Level}</span></div>
                            <div><span className="block text-slate-400">Timeline</span><span className="font-bold">{uc.Roadmap_Timeline}</span></div>
                        </div>
                    </div>
                 ))}
               </div>
            </div>

            {/* Column 4: Roadmap & Milestones */}
            <div className="col-span-1 lg:col-span-1 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900 p-4 flex flex-col bg-slate-50">
              <h3 className="font-bold text-sm uppercase mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Timeline & Milestones
              </h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto">
                {/* Q1 */}
                <div className="bg-white border-l-4 border-emerald-500 p-3 shadow-sm rounded-r-lg">
                    <h4 className="font-bold text-emerald-800 text-xs mb-1">Q1 (Immediate)</h4>
                    {data.Roadmap.Q1.length > 0 ? (
                        <div className="space-y-2">
                            {data.Roadmap.Q1.map((item, idx) => (
                                <div key={idx} className="text-xs">
                                    <div className="font-bold text-emerald-900">{item.name}</div>
                                    <div className="text-emerald-600 text-[10px]">{item.start} — {item.end}</div>
                                    <div className="text-slate-500 text-[10px] mt-0.5">Milestone: {item.milestone}</div>
                                </div>
                            ))}
                        </div>
                    ) : <span className="text-slate-400 italic text-xs">No initiatives</span>}
                </div>

                {/* 1 Year */}
                <div className="bg-white border-l-4 border-blue-500 p-3 shadow-sm rounded-r-lg">
                    <h4 className="font-bold text-blue-800 text-xs mb-1">1 Year (Core)</h4>
                    {data.Roadmap["1_year"].length > 0 ? (
                        <div className="space-y-2">
                            {data.Roadmap["1_year"].map((item, idx) => (
                                <div key={idx} className="text-xs">
                                    <div className="font-bold text-blue-900">{item.name}</div>
                                    <div className="text-blue-600 text-[10px]">{item.start} — {item.end}</div>
                                    <div className="text-slate-500 text-[10px] mt-0.5">Milestone: {item.milestone}</div>
                                </div>
                            ))}
                        </div>
                    ) : <span className="text-slate-400 italic text-xs">No initiatives</span>}
                </div>

                {/* 3 Year */}
                <div className="bg-white border-l-4 border-purple-500 p-3 shadow-sm rounded-r-lg">
                    <h4 className="font-bold text-purple-800 text-xs mb-1">3 Year (Transformational)</h4>
                     {data.Roadmap["3_year"].length > 0 ? (
                        <div className="space-y-2">
                            {data.Roadmap["3_year"].map((item, idx) => (
                                <div key={idx} className="text-xs">
                                    <div className="font-bold text-purple-900">{item.name}</div>
                                    <div className="text-purple-600 text-[10px]">{item.start} — {item.end}</div>
                                    <div className="text-slate-500 text-[10px] mt-0.5">Milestone: {item.milestone}</div>
                                </div>
                            ))}
                        </div>
                    ) : <span className="text-slate-400 italic text-xs">No initiatives</span>}
                </div>
              </div>
            </div>

            {/* Column 5: Strategic Insights */}
            <div className="col-span-1 p-4 flex flex-col bg-white">
                <h3 className="font-bold text-sm uppercase mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Risk & Strategy
                </h3>
                
                <div className="space-y-3 text-xs overflow-y-auto pr-2">
                    <div className="bg-red-50 p-2 rounded border border-red-100">
                        <h4 className="font-bold text-red-800 text-[10px] mb-1">Key Risks</h4>
                        <div className="text-red-700 whitespace-pre-wrap leading-relaxed">{isLoadingAI ? '...' : data.Final_Notes.Risks_and_Mitigations}</div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <h4 className="font-bold text-slate-700 text-[10px] mb-1">Data Requirements</h4>
                        <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{isLoadingAI ? '...' : data.Final_Notes.Data_and_Infra_Requirements}</div>
                    </div>

                     <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <h4 className="font-bold text-slate-700 text-[10px] mb-1">Organizational</h4>
                        <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{isLoadingAI ? '...' : data.Final_Notes.Organizational_Considerations}</div>
                    </div>
                </div>
            </div>

          </div>

          {/* Granular Financial Footer */}
          <div className="bg-slate-900 text-white p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs">
                 
                 {/* Costs */}
                 <div className="col-span-2 border-r border-slate-700 pr-4">
                    <h5 className="font-bold text-slate-400 uppercase mb-2">Portfolio Costs</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between"><span>Near-Term:</span> <span className="text-white font-mono">${data.Aggregated_Financials.Near_Term_Cost.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Long-Term:</span> <span className="text-white font-mono">${data.Aggregated_Financials.Long_Term_Cost.toLocaleString()}</span></div>
                        <div className="flex justify-between col-span-2 text-slate-300"><span>Annual Maint (est):</span> <span className="text-white font-mono">${data.Aggregated_Financials.Annual_Maintenance.toLocaleString()}</span></div>
                    </div>
                 </div>

                 {/* Benefits */}
                 <div className="col-span-2 border-r border-slate-700 pr-4">
                    <h5 className="font-bold text-green-400 uppercase mb-2">Portfolio Benefits</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between"><span>Near-Term:</span> <span className="text-white font-mono">${data.Aggregated_Financials.Near_Term_Benefits.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Long-Term:</span> <span className="text-white font-mono">${data.Aggregated_Financials.Long_Term_Benefits.toLocaleString()}</span></div>
                        <div className="flex justify-between col-span-2 text-green-200"><span>Total Portfolio:</span> <span className="text-white font-mono font-bold">${data.Aggregated_Financials.Total_Benefits.toLocaleString()}</span></div>
                    </div>
                 </div>

                 {/* ROI */}
                 <div className="col-span-2">
                    <h5 className="font-bold text-blue-300 uppercase mb-2">Return on Investment</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between"><span>Near-Term ROI:</span> <span className="text-white font-mono font-bold">{data.Aggregated_Financials.Near_Term_ROI}</span></div>
                        <div className="flex justify-between"><span>Long-Term ROI:</span> <span className="text-white font-mono font-bold">{data.Aggregated_Financials.Long_Term_ROI}</span></div>
                        <div className="flex justify-between col-span-2 text-blue-200"><span>Total Portfolio ROI:</span> <span className="text-white font-mono font-bold text-sm">{data.Aggregated_Financials.Total_Portfolio_ROI}</span></div>
                    </div>
                 </div>

              </div>
          </div>
          
          {/* Footer Credit */}
          <div className="bg-slate-100 p-2 text-center text-[10px] text-slate-400 border-t border-slate-300">
            Created by {data.Header.DesignedBy} with AI ROI & Roadmap Agent
          </div>

        </div>
      </div>
    </div>
  );
};

export default CanvasView;