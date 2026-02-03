import React, { useState } from 'react';
import { GenerationParams, ProductStage, ModificationType, ConceptType, PriceTier, ResearchMode, AppMode, ProjectState } from '../types';
import { ArrowRight, Loader2, Telescope, ShieldCheck, ClipboardCheck, Factory, Beaker, FileSpreadsheet, Edit3, RefreshCw, X, AlertTriangle, Repeat, Globe } from 'lucide-react';

interface InputFormProps {
  onGenerate: (params: GenerationParams) => void;
  isLoading: boolean;
  currentStage: ProductStage; 
  currentMode: AppMode; 
  setStage: (stage: ProductStage) => void;
  setMode: (mode: AppMode) => void;
  projectState: ProjectState;
  setProjectState: React.Dispatch<React.SetStateAction<ProjectState>>;
}

const InputForm: React.FC<InputFormProps> = ({ 
    onGenerate, 
    isLoading, 
    currentStage, 
    currentMode, 
    setStage, 
    setMode, 
    projectState, 
    setProjectState 
}) => {
  
  // Track the last submitted parameters to detect if inputs have changed
  const [lastSubmittedHash, setLastSubmittedHash] = useState<string>("");

  // Helper to update specific fields in projectState
  const updateField = (field: keyof ProjectState, value: any) => {
      setProjectState(prev => ({ ...prev, [field]: value }));
  };

  // Generate a fingerprint of the current inputs
  const getCurrentHash = () => {
    return JSON.stringify({
      mode: currentMode,
      stage: currentStage,
      ...projectState
    });
  };

  const getParams = (isShuffle = false): GenerationParams => {
    return {
      mode: currentMode,
      stage: currentStage,
      isShuffle: isShuffle,
      // Research Params
      broadSector: currentMode === 'RESEARCH_LAB' ? projectState.broadSector : undefined,
      labMode: currentMode === 'RESEARCH_LAB' ? projectState.labMode : undefined,
      baseProduct: currentMode === 'RESEARCH_LAB' ? projectState.baseProduct : undefined,
      // Funnel Params
      sector: currentStage === 'DISCOVERY' ? projectState.sector : undefined,
      manualOverride: currentStage === 'DISCOVERY' && projectState.manualOverride ? projectState.manualOverride : undefined,
      conceptType: currentStage === 'DISCOVERY' ? projectState.conceptType : undefined,
      targetAudience: currentStage === 'DISCOVERY' ? projectState.targetAudience : undefined,
      priceTier: currentStage === 'DISCOVERY' ? projectState.priceTier : undefined,
      researchMode: currentStage === 'VALIDATION' ? projectState.researchMode : undefined,
      dataInput: currentStage === 'VALIDATION' ? projectState.dataInput : undefined,
      productIdea: (currentStage === 'VALIDATION' || currentStage === 'EXECUTION' || currentStage === 'SUPPLIER_ACTION') ? projectState.productIdea : undefined,
      priceTarget: currentStage === 'EXECUTION' ? projectState.priceTarget : undefined,
      vineStrategy: currentStage === 'EXECUTION' ? projectState.vineStrategy : undefined,
      launchQuantity: currentStage === 'EXECUTION' ? projectState.launchQuantity : undefined,
      modificationType: currentStage === 'SUPPLIER_ACTION' ? projectState.modificationType : undefined,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentHash = getCurrentHash();
    
    // If inputs are identical to last run AND we are in Discovery, it's a Shuffle
    const isShuffle = currentHash === lastSubmittedHash && currentStage === 'DISCOVERY';
    
    setLastSubmittedHash(currentHash);
    onGenerate(getParams(isShuffle));
  };

  // Determine button label and icon
  const currentHash = getCurrentHash();
  const isInputsChanged = currentHash !== lastSubmittedHash;
  
  let buttonText = "";
  let ButtonIcon = ArrowRight;

  if (currentMode === 'RESEARCH_LAB') {
      if (projectState.labMode === 'Pivot Engine') {
          buttonText = "Find New Markets";
          ButtonIcon = Repeat;
      } else {
          buttonText = "Explore Niches";
          ButtonIcon = Globe;
      }
  } else if (currentStage === 'DISCOVERY') {
      if (lastSubmittedHash && !isInputsChanged) {
          buttonText = "Generate New Ideas";
          ButtonIcon = RefreshCw;
      } else {
          buttonText = "Find Product Ideas";
      }
  } else {
      buttonText = `Run Stage ${currentStage === 'VALIDATION' ? '2' : currentStage === 'EXECUTION' ? '3' : '4'}`;
  }

  // Warning logic for Stage 3
  const showInventoryWarning = currentStage === 'EXECUTION' && 
                               projectState.vineStrategy === 'Aggressive (11-30 Units)' && 
                               parseInt(projectState.launchQuantity || '0') < 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Mode Switcher */}
      <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-xl mb-4">
        <button
            type="button"
            onClick={() => setMode('FUNNEL')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                currentMode === 'FUNNEL' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            <Telescope className="w-4 h-4" /> Product Funnel
        </button>
        <button
            type="button"
            onClick={() => setMode('RESEARCH_LAB')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                currentMode === 'RESEARCH_LAB' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            <Beaker className="w-4 h-4" /> Research Lab
        </button>
      </div>

      {currentMode === 'FUNNEL' && (
      <>
        {/* Stage Selector */}
        <div className="grid grid-cols-4 gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
            <button
            type="button"
            onClick={() => setStage('DISCOVERY')}
            className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-all ${
                currentStage === 'DISCOVERY' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            >
            <Telescope className="w-4 h-4" /> 
            <span className="hidden sm:inline">1. Discover</span>
            <span className="sm:hidden">1</span>
            </button>
            <button
            type="button"
            onClick={() => setStage('VALIDATION')}
            className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-all ${
                currentStage === 'VALIDATION' 
                ? 'bg-amber-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            >
            <ShieldCheck className="w-4 h-4" /> 
            <span className="hidden sm:inline">2. Validate</span>
            <span className="sm:hidden">2</span>
            </button>
            <button
            type="button"
            onClick={() => setStage('EXECUTION')}
            className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-all ${
                currentStage === 'EXECUTION' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            >
            <ClipboardCheck className="w-4 h-4" /> 
            <span className="hidden sm:inline">3. Execute</span>
            <span className="sm:hidden">3</span>
            </button>
            <button
            type="button"
            onClick={() => setStage('SUPPLIER_ACTION')}
            className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-all ${
                currentStage === 'SUPPLIER_ACTION' 
                ? 'bg-rose-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            >
            <Factory className="w-4 h-4" /> 
            <span className="hidden sm:inline">4. Source</span>
            <span className="sm:hidden">4</span>
            </button>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 min-h-[220px]">
            {/* STAGE 1: DISCOVERY */}
            {currentStage === 'DISCOVERY' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                    <Telescope className="w-4 h-4" /> The Trend Hunter
                </div>

                {/* 1. Category Input */}
                <div className={`space-y-2 transition-opacity duration-200 ${projectState.manualOverride ? 'opacity-50' : 'opacity-100'}`}>
                    <label className="text-sm font-medium text-slate-300">
                        Category / Niche {projectState.manualOverride && <span className="text-xs ml-2 text-slate-500">(Ignored)</span>}
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Scented Candles, Nurse Accessories"
                        value={projectState.sector}
                        onChange={(e) => updateField('sector', e.target.value)}
                        disabled={!!projectState.manualOverride}
                        className={`w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-slate-500 ${projectState.manualOverride ? 'cursor-not-allowed' : ''}`}
                        required={currentStage === 'DISCOVERY' && !projectState.manualOverride}
                    />
                </div>

                {/* 2. Manual Product Idea (Optional Override) */}
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl relative">
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                        <Edit3 className="w-4 h-4 text-blue-400" /> 
                        Manual Product Idea <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="e.g. 'Dog Leash' (Leave empty to find new ideas)"
                            value={projectState.manualOverride}
                            onChange={(e) => updateField('manualOverride', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-slate-500 pr-10"
                        />
                        {projectState.manualOverride && (
                            <button
                                type="button"
                                onClick={() => updateField('manualOverride', '')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors"
                                title="Clear"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        <strong className="text-slate-300">Logic:</strong> If you type here, we ignore Category and generate 3 variations of <em>this</em> idea. If empty, we find 3 <em>new</em> ideas for the Category.
                    </p>
                </div>

                {/* 3. Shared Inputs (Concept, Price, Audience) */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Concept Type</label>
                            <select 
                                value={projectState.conceptType}
                                onChange={(e) => updateField('conceptType', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                            >
                                <option value="Functional Gap">Functional Gap</option>
                                <option value="Humor/Slogan">Humor/Slogan</option>
                                <option value="Aesthetic/Visual">Aesthetic/Visual</option>
                                <option value="TikTok / Visual Demo">TikTok / Visual Demo</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Price Tier</label>
                            <select 
                                value={projectState.priceTier}
                                onChange={(e) => updateField('priceTier', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                            >
                                <option value="<$20">{'<$20 (Shoebox Rule)'}</option>
                                <option value="$20-$50">$20 - $50</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Target Audience</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Tired Moms, Night Shift Nurses"
                            value={projectState.targetAudience}
                            onChange={(e) => updateField('targetAudience', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-slate-500"
                        />
                    </div>
                </div>
            </div>
            )}

            {/* STAGE 2: VALIDATION */}
            {currentStage === 'VALIDATION' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-2 text-amber-400 text-sm font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> The Risk Manager
                </div>
                
                <div className="bg-amber-900/20 border border-amber-500/20 p-3 rounded-lg mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase block mb-1">Validating Concept</span>
                    <input 
                        type="text"
                        value={projectState.productIdea}
                        onChange={(e) => updateField('productIdea', e.target.value)}
                        placeholder="Select an idea from Discovery or type here..."
                        className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-slate-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Research Mode</label>
                    <select 
                        value={projectState.researchMode}
                        onChange={(e) => updateField('researchMode', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-3"
                    >
                        <option value="Auto-Discovery">Auto-Discovery (Live Search)</option>
                        <option value="Helium 10 Data">Helium 10 Data (Paste Data)</option>
                        <option value="Manual Input">Manual Input (Notes)</option>
                    </select>
                </div>

                {(projectState.researchMode === 'Helium 10 Data' || projectState.researchMode === 'Manual Input') && (
                    <div className="space-y-2 animate-in fade-in">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            {projectState.researchMode === 'Helium 10 Data' ? <FileSpreadsheet className="w-4 h-4 text-green-400"/> : null}
                            {projectState.researchMode === 'Helium 10 Data' ? 'Paste Helium 10 Data (Search Volume / Reviews)' : 'Idea Description'}
                        </label>
                        <textarea 
                            placeholder={projectState.researchMode === 'Helium 10 Data' ? "Header 1, Header 2\nData 1, Data 2..." : "Describe the product idea to validate..."}
                            value={projectState.dataInput}
                            onChange={(e) => updateField('dataInput', e.target.value)}
                            className={`w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-3 h-32 placeholder-slate-500 resize-none ${projectState.researchMode === 'Helium 10 Data' ? 'whitespace-pre' : ''}`}
                            required={currentStage === 'VALIDATION'}
                        />
                        {projectState.researchMode === 'Helium 10 Data' && (
                            <p className="text-[10px] text-slate-400">Copy/Paste columns from H10 formatted as text or CSV.</p>
                        )}
                    </div>
                )}
            </div>
            )}

            {/* STAGE 3: EXECUTION */}
            {currentStage === 'EXECUTION' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4" /> The CFO
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Product Concept</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Silicone Spill-Proof Mat with Raised Edges"
                        value={projectState.productIdea}
                        onChange={(e) => updateField('productIdea', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 placeholder-slate-500"
                        required={currentStage === 'EXECUTION'}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Target Sell Price ($)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 29.99"
                            value={projectState.priceTarget}
                            onChange={(e) => updateField('priceTarget', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 placeholder-slate-500"
                            required={currentStage === 'EXECUTION'}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Launch Quantity (Units)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 200"
                            value={projectState.launchQuantity}
                            onChange={(e) => updateField('launchQuantity', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 placeholder-slate-500"
                            required={currentStage === 'EXECUTION'}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Vine Strategy</label>
                    <select 
                        value={projectState.vineStrategy}
                        onChange={(e) => updateField('vineStrategy', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                    >
                        <option value="Cost Saver (1-2 Units)">Cost Saver (1-2 Units, $0 Fee)</option>
                        <option value="Balanced (3-10 Units)">Balanced (3-10 Units, $75 Fee)</option>
                        <option value="Aggressive (11-30 Units)">Aggressive (11-30 Units, $200 Fee)</option>
                    </select>
                </div>

                {/* Inventory Warning */}
                {showInventoryWarning && (
                    <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg flex items-start gap-2 animate-in fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                        <p className="text-xs text-red-200">
                            <strong>High Stock Depletion:</strong> This strategy will use {'>'}30% of your initial inventory for reviews. Consider increasing quantity or lowering strategy.
                        </p>
                    </div>
                )}
            </div>
            )}

            {/* STAGE 4: SUPPLIER ACTION */}
            {currentStage === 'SUPPLIER_ACTION' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-2 text-rose-400 text-sm font-semibold uppercase tracking-wider">
                <Factory className="w-4 h-4" /> The Sourcing Agent
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Product Concept</label>
                <input 
                    type="text" 
                    placeholder="e.g. Silicone Mat"
                    value={projectState.productIdea}
                    onChange={(e) => updateField('productIdea', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block p-3 placeholder-slate-500"
                    required={currentStage === 'SUPPLIER_ACTION'}
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Modification Type</label>
                <select 
                    value={projectState.modificationType}
                    onChange={(e) => updateField('modificationType', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block p-3"
                >
                    <option value="Physical Tweak">Physical Tweak (Mold Change)</option>
                    <option value="Print/Design">Print/Design (Logo/Pattern)</option>
                    <option value="Bundle">Bundle (Kitting)</option>
                </select>
                </div>
            </div>
            )}
        </div>
      </>
      )}

      {currentMode === 'RESEARCH_LAB' && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5 min-h-[220px] animate-in fade-in zoom-in">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider">
                    <Beaker className="w-4 h-4" /> Research Lab
                 </div>
                 
                 {/* Tool Toggle */}
                 <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-purple-500/30">
                    <button
                        type="button"
                        onClick={() => updateField('labMode', 'Niche Explorer')}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                            projectState.labMode === 'Niche Explorer' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Explorer
                    </button>
                    <button
                        type="button"
                        onClick={() => updateField('labMode', 'Pivot Engine')}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                            projectState.labMode === 'Pivot Engine' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Pivot Engine
                    </button>
                 </div>
             </div>

             {projectState.labMode === 'Niche Explorer' ? (
                // Niche Explorer Inputs
                <>
                    <p className="text-xs text-slate-400 mb-4">
                        Find high-growth sub-categories within a broad sector.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Broad Sector</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Pet Supplies, Home Office"
                            value={projectState.broadSector}
                            onChange={(e) => updateField('broadSector', e.target.value)}
                            className="w-full bg-slate-900 border border-purple-500/50 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 placeholder-slate-500"
                            required={currentMode === 'RESEARCH_LAB' && projectState.labMode === 'Niche Explorer'}
                        />
                    </div>
                </>
             ) : (
                 // Pivot Engine Inputs
                 <>
                    <p className="text-xs text-slate-400 mb-4 animate-in fade-in">
                        Take a generic item and find new, obsessive niches to rebrand it for.
                    </p>
                    <div className="space-y-2 animate-in fade-in">
                        <label className="text-sm font-medium text-slate-300">Base Product Item</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Squeeze Coin Purse, Silicone Ice Tray"
                            value={projectState.baseProduct}
                            onChange={(e) => updateField('baseProduct', e.target.value)}
                            className="w-full bg-slate-900 border border-pink-500/50 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-3 placeholder-slate-500"
                            required={currentMode === 'RESEARCH_LAB' && projectState.labMode === 'Pivot Engine'}
                        />
                        <div className="flex items-center gap-1.5 mt-2">
                            <Repeat className="w-3 h-3 text-pink-400" />
                            <span className="text-[10px] text-pink-300/80">
                                AI will analyze physical attributes to find alternate uses.
                            </span>
                        </div>
                    </div>
                 </>
             )}
          </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 ${
          currentMode === 'RESEARCH_LAB' ? (
              projectState.labMode === 'Pivot Engine' ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/25' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
          ) :
          currentStage === 'DISCOVERY' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25' :
          currentStage === 'VALIDATION' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25' :
          currentStage === 'EXECUTION' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' :
          'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {buttonText}
            <ButtonIcon className="w-5 h-5" />
          </>
        )}
      </button>

    </form>
  );
};

export default InputForm;