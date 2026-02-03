import React from 'react';
import { X } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📘 Amazon Alpha User Guide
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-300 custom-scrollbar">
            {/* Section 1 */}
            <section className="space-y-3">
                <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">🚀 1. Which Workflow do I need?</h3>
                
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 space-y-6">
                    <div>
                        <h4 className="font-bold text-blue-400 mb-2 text-sm uppercase tracking-wide">A. "I need ideas" (Discovery Mode)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm marker:text-blue-500">
                            <li><strong className="text-slate-200">Goal:</strong> Find a new niche or product gap.</li>
                            <li><strong className="text-slate-200">Settings:</strong> Stage 1, "Auto-Discovery" Mode.</li>
                            <li><strong className="text-slate-200">Action:</strong> Leave "Manual Idea" blank. Fill in Category (e.g., "Pet Supplies") and click Run.</li>
                            <li><strong className="text-slate-200">Result:</strong> AI finds trending gaps and complaints.</li>
                        </ul>
                    </div>
                    <div className="border-t border-slate-700/50 pt-4">
                        <h4 className="font-bold text-amber-400 mb-2 text-sm uppercase tracking-wide">B. "I have an idea" (Validation Mode)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm marker:text-amber-500">
                            <li><strong className="text-slate-200">Goal:</strong> Check if my specific idea is good.</li>
                            <li><strong className="text-slate-200">Settings:</strong> Stage 1 or 2.</li>
                            <li><strong className="text-slate-200">Action:</strong> IGNORE the Category box. Type your product into the "Manual Product Idea" box (e.g., "Silicone Travel Pouch").</li>
                            <li><strong className="text-slate-200">Result:</strong> AI skips brainstorming and immediately analyzes your concept.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xl font-bold text-white">🛠️ 2. Helium 10 SOP</h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">For Stage 2: Validation</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 h-full">
                        <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">A</span>
                            "Is there demand?" (Cerebro)
                        </h4>
                        <ol className="list-decimal pl-5 space-y-2 text-sm marker:text-slate-500">
                            <li>Go to H10 Cerebro.</li>
                            <li>Input 3 main Competitor ASINs.</li>
                            <li>Filter: Search Volume {'>'} 500, Organic Rank 1-10.</li>
                            <li>Export as CSV.</li>
                            <li className="text-emerald-400 font-medium bg-emerald-400/10 p-2 rounded -ml-2">Action: Copy top 50 rows (Keywords + Vol) into "Helium 10 Data" box.</li>
                        </ol>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 h-full">
                        <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                             <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">B</span>
                             "What do people hate?" (Review Insights)
                        </h4>
                        <ol className="list-decimal pl-5 space-y-2 text-sm marker:text-slate-500">
                            <li>Go to Competitor Listing.</li>
                            <li>Open H10 Extension {'>'} Review Insights.</li>
                            <li>Filter: 1, 2, and 3 Stars ONLY.</li>
                            <li>Export/Copy.</li>
                            <li className="text-emerald-400 font-medium bg-emerald-400/10 p-2 rounded -ml-2">Action: Paste text block into "Helium 10 Data" box.</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
                <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">🎛️ 3. Variable Glossary</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-white text-xs mb-2 uppercase tracking-wider bg-slate-800 inline-block px-2 py-1 rounded">Price Tier</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm marker:text-slate-600">
                            <li><span className="text-blue-300 font-medium">{'<$20'}:</span> AI focuses on "Shoebox Size" rules and Bundling (to offset fees).</li>
                            <li><span className="text-blue-300 font-medium">$20-$50:</span> AI focuses on Material Quality, Gifting, and Branding.</li>
                        </ul>
                    </div>
                    <div>
                         <h4 className="font-bold text-white text-xs mb-2 uppercase tracking-wider bg-slate-800 inline-block px-2 py-1 rounded">Concept Type</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm marker:text-slate-600">
                            <li><span className="text-purple-300 font-medium">Functional Gap:</span> Finds problems (Leaks, Breaks).</li>
                            <li><span className="text-purple-300 font-medium">Humor/Slogan:</span> Writes funny text for print-on-demand items.</li>
                            <li><span className="text-purple-300 font-medium">Aesthetic:</span> Finds visual trends (Colors, Patterns).</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
            <button 
                onClick={onClose}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
                Close Guide
            </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
