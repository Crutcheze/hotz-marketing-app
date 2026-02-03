import React, { useState, useEffect } from 'react';
import { Package, Truck, Target, Search, Loader2, AlertCircle, Layers, Factory, Beaker, HelpCircle, Briefcase, DollarSign, Tag, Archive } from 'lucide-react';
import { GenerationParams, ProductStage, DiscoveryItem, ValidationResult, ExecutionResult, SupplierActionResult, AppMode, ResearchLabResult, ProjectState, StageResults, VaultItem } from './types';
import { generateProductIdeas } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultDisplay from './components/IdeaCard';
import GuideModal from './components/GuideModal';
import SkeletonLoader from './components/SkeletonLoader';
import IdeaVault from './components/IdeaVault';
import { SAVED_IDEAS } from './services/database';

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [stage, setStage] = useState<ProductStage>('DISCOVERY');
  const [mode, setMode] = useState<AppMode>('FUNNEL');
  const [view, setView] = useState<'WORKFLOW' | 'VAULT'>('WORKFLOW');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // --- FORM STATE (LIFTED) ---
  const [projectState, setProjectState] = useState<ProjectState>({
    broadSector: "",
    sector: "",
    manualOverride: "",
    conceptType: 'Functional Gap',
    targetAudience: "",
    priceTier: '<$20',
    researchMode: 'Auto-Discovery',
    dataInput: "",
    productIdea: "",
    priceTarget: "",
    modificationType: 'Physical Tweak',
    vineStrategy: 'Cost Saver (1-2 Units)',
    launchQuantity: '200',
    verifiedLandedCost: "",
    verifiedFBAFee: "",
    labMode: 'Niche Explorer',
    baseProduct: ""
  });

  // --- RESULT STATE (PERSISTENT) ---
  const [stageResults, setStageResults] = useState<StageResults>({
    DISCOVERY: null,
    VALIDATION: null,
    EXECUTION: null,
    SUPPLIER_ACTION: null,
    RESEARCH_LAB: null
  });

  // --- VAULT STATE (LOCAL STORAGE ONLY) ---
  // We only load local drafts here. Static items are passed directly to IdeaVault.
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('ideaVault');
      if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
              return parsed;
          }
      }
      return []; // Default to empty if no local data
    } catch (e) {
      console.error("Failed to load vault items", e);
      return [];
    }
  });

  // Save to local storage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('ideaVault', JSON.stringify(vaultItems));
    } catch (e) {
      console.error("Failed to save vault items", e);
    }
  }, [vaultItems]);

  const handleGenerate = async (params: GenerationParams) => {
    setLoading(true);
    setError(null);
    setStage(params.stage || 'DISCOVERY');
    setMode(params.mode);
    setView('WORKFLOW');

    // Clear ONLY the result for the current stage/mode being run to show fresh data
    // We keep other stages intact
    if (params.mode === 'RESEARCH_LAB') {
        setStageResults(prev => ({ ...prev, RESEARCH_LAB: null }));
    } else if (params.stage) {
        setStageResults(prev => ({ ...prev, [params.stage!]: null }));
    }
    
    // Reset Verification State when regenerating Stage 3
    if (params.stage === 'EXECUTION') {
        setProjectState(prev => ({ ...prev, verifiedLandedCost: "", verifiedFBAFee: "" }));
    }

    try {
      const data = await generateProductIdeas(params);
      
      // Save data to the correct slot
      if (params.mode === 'RESEARCH_LAB') {
          setStageResults(prev => ({ ...prev, RESEARCH_LAB: data as ResearchLabResult }));
      } else if (params.stage) {
          setStageResults(prev => ({ ...prev, [params.stage]: data }));
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate ideas. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (idea: string) => {
      // 1. Update the project state with the selected idea
      setProjectState(prev => ({ ...prev, productIdea: idea }));
      // 2. Advance to Validation Stage
      setStage('VALIDATION'); 
      // 3. Clear existing validation result (since we have a new idea)
      setStageResults(prev => ({ ...prev, VALIDATION: null }));
  };

  const handleSaveToVault = (item: any, type: VaultItem['type'], visual?: string) => {
      const newItem: VaultItem = {
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleDateString(),
          type,
          title: item.title || item.productName || item.rebrandName || "Untitled Idea",
          data: item,
          visual: visual
      };
      setVaultItems(prev => [newItem, ...prev]);
  };

  const handleRemoveFromVault = (id: string) => {
      setVaultItems(prev => prev.filter(i => i.id !== id));
  };

  // Helper to determine what to display
  const currentResult = mode === 'RESEARCH_LAB' ? stageResults.RESEARCH_LAB : stageResults[stage];

  // Calculate total items (Drafts + Static) for badge
  const totalVaultCount = vaultItems.length + SAVED_IDEAS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-lg ${mode === 'FUNNEL' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20' : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/20'}`}>
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Product Lifecycle AI</h1>
              <p className="text-xs text-slate-400">Head of Product Portfolio Manager</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-6 text-sm font-medium text-slate-400">
                <button 
                    onClick={() => setView('WORKFLOW')}
                    className={`flex items-center gap-2 transition-colors hover:text-white ${view === 'WORKFLOW' ? 'text-white font-bold' : ''}`}
                >
                    <Layers className="w-4 h-4" /> Workflow
                </button>
                <button 
                    onClick={() => setView('VAULT')}
                    className={`flex items-center gap-2 transition-colors hover:text-white ${view === 'VAULT' ? 'text-white font-bold' : ''}`}
                >
                    <Archive className="w-4 h-4" /> Idea Vault 
                    {totalVaultCount > 0 && (
                        <span className="bg-indigo-600 text-[10px] text-white px-1.5 py-0.5 rounded-full">{totalVaultCount}</span>
                    )}
                </button>
            </div>

            <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-all border border-slate-700 hover:border-slate-600 shadow-sm"
                title="Open User Guide"
            >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline font-medium text-sm">Guide</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {view === 'VAULT' ? (
            <IdeaVault 
                localItems={vaultItems}
                staticItems={SAVED_IDEAS}
                onRemove={handleRemoveFromVault} 
                onClose={() => setView('WORKFLOW')}
            />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar / Input Area */}
            <div className="lg:col-span-4 space-y-6">
                
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-1 text-white flex items-center gap-2">
                    <Package className="w-5 h-5" /> {mode === 'FUNNEL' ? 'Stage Controller' : 'Lab Controls'}
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                    {mode === 'FUNNEL' ? 'Select active workflow stage.' : 'Define research parameters.'}
                </p>
                <InputForm 
                    onGenerate={handleGenerate} 
                    isLoading={loading} 
                    currentStage={stage} 
                    setStage={setStage}
                    currentMode={mode}
                    setMode={setMode}
                    projectState={projectState}
                    setProjectState={setProjectState}
                />
                </section>
                
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 text-sm text-slate-500">
                <h3 className="text-slate-300 font-medium mb-2">Current Protocol</h3>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                        {mode === 'RESEARCH_LAB' && (
                            <>
                                <strong className="text-purple-400 block mb-1">Research Lab</strong>
                                {projectState.labMode === 'Pivot Engine' 
                                    ? "Lateral thinking engine for finding new markets for generic items." 
                                    : "Exploratory mode for identifying blue ocean niches before starting the funnel."
                                }
                            </>
                        )}
                        {mode === 'FUNNEL' && stage === 'DISCOVERY' && (
                            <>
                                <strong className="text-blue-400 block mb-1">Stage 1: Trend Hunter</strong>
                                Scanning for gaps without biased data. Pure qualitative research.
                            </>
                        )}
                        {mode === 'FUNNEL' && stage === 'VALIDATION' && (
                            <>
                                <strong className="text-amber-400 block mb-1">Stage 2: The Analyst</strong>
                                Rigorous checking of Search Volume vs. Review Count saturation.
                            </>
                        )}
                        {mode === 'FUNNEL' && stage === 'EXECUTION' && (
                            <>
                                <strong className="text-emerald-400 block mb-1">Stage 3: Project Manager</strong>
                                Building launch timelines, margin estimations, and logistics tracking.
                            </>
                        )}
                        {mode === 'FUNNEL' && stage === 'SUPPLIER_ACTION' && (
                            <>
                                <strong className="text-rose-400 block mb-1">Stage 4: Sourcing Agent</strong>
                                Drafting professional RFQs to suppliers using industry-standard terminology.
                            </>
                        )}
                </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-8">
                
                {/* PROJECT STATUS BAR (MOVED FROM SIDEBAR) */}
                {mode === 'FUNNEL' && (
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl mb-6 p-1 shadow-lg">
                        <div className="flex items-center divide-x divide-slate-800/50">
                            {/* Active Product */}
                            <div className="flex-1 px-4 py-3 flex items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                                    <Tag className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Active Product</div>
                                    <div className="text-sm font-medium text-slate-200 truncate">
                                        {projectState.productIdea || <span className="text-slate-600 italic">Not Selected</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Target Price */}
                            <div className="hidden sm:flex px-6 py-3 items-center gap-3 shrink-0">
                                <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Target Price</div>
                                    <div className="text-sm font-medium text-slate-200">
                                        {projectState.priceTarget ? `$${projectState.priceTarget}` : <span className="text-slate-600 italic">--</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="hidden md:flex px-6 py-3 items-center gap-3 shrink-0">
                                <div className="bg-purple-500/10 p-2 rounded-lg shrink-0">
                                    <Layers className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="min-w-0 max-w-[150px]">
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Category</div>
                                    <div className="text-sm font-medium text-slate-200 truncate">
                                        {projectState.sector || projectState.manualOverride || <span className="text-slate-600 italic">--</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                    <h3 className="font-semibold">Workflow Error</h3>
                    <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
                )}

                {/* LOADING SKELETON */}
                {loading && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            <h2 className="text-2xl font-bold text-white">Analyzing Data...</h2>
                        </div>
                        <SkeletonLoader mode={mode} stage={stage} />
                    </div>
                )}

                {/* IDLE STATE */}
                {!loading && !currentResult && !error && (
                <div className="flex flex-col items-center justify-center h-96 text-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                    <Layers className="w-12 h-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-400">Workflow Idle</h3>
                    <p className="max-w-md mx-auto mt-1">Select a stage and run the protocol to begin.</p>
                </div>
                )}

                {/* RESULTS DISPLAY */}
                {!loading && currentResult && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'RESEARCH_LAB' ? 'Lab Report' :
                            stage === 'DISCOVERY' ? 'Discovery Report' : 
                            stage === 'VALIDATION' ? 'Validation Decision' : 
                            stage === 'EXECUTION' ? 'Execution Plan' :
                            'Supplier RFQ'}
                        </h2>
                    </div>
                    
                    {mode === 'RESEARCH_LAB' && (
                        <ResultDisplay 
                            data={currentResult as ResearchLabResult} 
                            stage="RESEARCH_LAB" 
                            onSave={handleSaveToVault}
                        />
                    )}

                    {mode === 'FUNNEL' && stage === 'DISCOVERY' && Array.isArray(currentResult) && (
                        <div className="grid grid-cols-1 gap-6">
                            {(currentResult as DiscoveryItem[]).map((item, index) => (
                            <ResultDisplay 
                                key={index} 
                                data={item} 
                                stage="DISCOVERY" 
                                index={index} 
                                onSelectIdea={handleSelectIdea}
                                onSave={handleSaveToVault}
                            />
                            ))}
                        </div>
                    )}

                    {mode === 'FUNNEL' && stage === 'VALIDATION' && !Array.isArray(currentResult) && (
                        <ResultDisplay 
                            data={currentResult as ValidationResult} 
                            stage="VALIDATION" 
                            onSave={handleSaveToVault}
                        />
                    )}

                    {mode === 'FUNNEL' && stage === 'EXECUTION' && !Array.isArray(currentResult) && (
                        <ResultDisplay 
                            data={currentResult as ExecutionResult} 
                            stage="EXECUTION" 
                            projectState={projectState}
                            setProjectState={setProjectState}
                            onSave={handleSaveToVault}
                        />
                    )}

                    {mode === 'FUNNEL' && stage === 'SUPPLIER_ACTION' && !Array.isArray(currentResult) && (
                        <ResultDisplay 
                            data={currentResult as SupplierActionResult} 
                            stage="SUPPLIER_ACTION" 
                            onSave={handleSaveToVault}
                        />
                    )}
                    </div>
                )}
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;