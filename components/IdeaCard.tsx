import React, { useState } from 'react';
import { DiscoveryItem, ValidationResult, ExecutionResult, SupplierActionResult, ResearchLabResult, ProjectState, VaultItem } from '../types';
import { generateNanoBananaVisual } from '../services/geminiService';
import { TrendingUp, AlertTriangle, CheckCircle2, XCircle, DollarSign, Package, Activity, FileText, ArrowRightCircle, Mail, MessageSquare, ImageIcon, Scale, ShieldAlert, Check, BarChart3, Beaker, Wrench, CalendarClock, Siren, Flame, ShieldCheck, Music, Pencil, Save, Lightbulb, Users, Tag, Repeat, Image as IconImage, Loader2 } from 'lucide-react';

interface ResultDisplayProps {
  data: DiscoveryItem | ValidationResult | ExecutionResult | SupplierActionResult | ResearchLabResult;
  stage: 'DISCOVERY' | 'VALIDATION' | 'EXECUTION' | 'SUPPLIER_ACTION' | 'RESEARCH_LAB';
  index?: number;
  onSelectIdea?: (idea: string) => void;
  projectState?: ProjectState;
  setProjectState?: React.Dispatch<React.SetStateAction<ProjectState>>;
  onSave?: (item: any, type: VaultItem['type'], visual?: string) => void;
}

// Helper to parse currency strings "$12.50" -> 12.50
const parseCurrency = (val: string): number => {
    if (!val) return 0;
    return parseFloat(val.replace(/[^0-9.]/g, ''));
};

const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, stage, index, onSelectIdea, projectState, setProjectState, onSave }) => {
  
  // --- NANO BANANA VISUALS STATE ---
  const [isNanoEnabled, setIsNanoEnabled] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleNano = async (prompt: string) => {
      if (isNanoEnabled) {
          // Toggle Off
          setIsNanoEnabled(false);
      } else {
          // Toggle On
          setIsNanoEnabled(true);
          if (!generatedVisual) {
              setIsGenerating(true);
              const base64 = await generateNanoBananaVisual(prompt);
              setGeneratedVisual(base64);
              setIsGenerating(false);
          }
      }
  };

  const handleSaveClick = (itemData: any, type: VaultItem['type']) => {
      if (onSave) {
          onSave(itemData, type, generatedVisual || undefined);
      }
  };

  // --- RESEARCH LAB ---
  if (stage === 'RESEARCH_LAB') {
      const lab = data as ResearchLabResult;
      
      // Determine if showing Pivot Results or Niche Explorer Results
      const isPivotMode = lab.pivots && lab.pivots.length > 0;

      return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             <div className={`border rounded-2xl p-6 text-center ${
                 isPivotMode 
                 ? 'bg-gradient-to-r from-pink-900/20 to-rose-900/20 border-pink-500/30' 
                 : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30'
             }`}>
                <h2 className="text-3xl font-bold text-white mb-2">{lab.title}</h2>
                <div className={`text-sm font-medium tracking-widest uppercase ${isPivotMode ? 'text-pink-300' : 'text-purple-300'}`}>
                    {isPivotMode ? "Product Pivot Engine Results" : "Niche Explorer Results"}
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {/* MODE A: NICHE EXPLORER */}
                {!isPivotMode && lab.subNiches?.map((niche, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-purple-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-white text-purple-100">{niche.name}</h3>
                            <div className="flex gap-2">
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                                    {niche.growthFactor}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded border ${
                                    niche.competitionLevel.toLowerCase().includes('low') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                    Comp: {niche.competitionLevel}
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">{niche.description}</p>
                    </div>
                ))}

                {/* MODE B: PIVOT ENGINE */}
                {isPivotMode && lab.pivots?.map((pivot, i) => (
                    <div key={i} className="bg-slate-800 border border-pink-900/30 p-6 rounded-xl hover:border-pink-500/50 transition-all shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Repeat className="w-24 h-24 text-pink-500" />
                        </div>
                        
                        {/* Save Button for Pivot */}
                        <div className="absolute top-2 right-2 z-20">
                             <button
                                onClick={() => handleSaveClick(pivot, 'PIVOT')}
                                className="p-2 bg-slate-900/80 hover:bg-pink-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700"
                                title="Save to Idea Vault"
                             >
                                <Save className="w-4 h-4" />
                             </button>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            {/* Rebrand Name */}
                            <div className="flex items-start gap-3">
                                <div className="bg-pink-500/10 p-2 rounded-lg shrink-0">
                                    <Tag className="w-5 h-5 text-pink-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-pink-400 font-bold tracking-wider">Rebrand Name</div>
                                    <h3 className="text-xl font-bold text-white">{pivot.rebrandName}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {/* New Niche */}
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                     <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase">Target Niche</span>
                                     </div>
                                     <div className="text-sm font-medium text-slate-200">{pivot.newNiche}</div>
                                </div>
                                {/* Required Tweak */}
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                     <div className="flex items-center gap-2 mb-1">
                                        <Wrench className="w-4 h-4 text-amber-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase">Required Tweak</span>
                                     </div>
                                     <div className="text-sm font-medium text-slate-200">{pivot.requiredTweak}</div>
                                </div>
                            </div>

                            {/* Why it Works */}
                            <div className="bg-slate-700/30 p-4 rounded-lg border-l-2 border-green-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-green-400" />
                                    <span className="text-xs font-bold text-green-400 uppercase">Why It Works</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "{pivot.whyItWorks}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      );
  }

  // --- STAGE 1: DISCOVERY ---
  if (stage === 'DISCOVERY') {
    const discovery = data as DiscoveryItem;

    // Determine badge color based on Manufacturing Strategy
    const strategyColor = 
        discovery.manufacturingStrategy === 'Private Label' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        discovery.manufacturingStrategy === 'Tweaked Design' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
        'bg-red-500/20 text-red-400 border-red-500/30';

    // TikTok Badge Logic
    const tikTokColor = 
        discovery.tikTokScore === 'High' ? 'bg-black border-pink-500 text-pink-400 shadow-sm shadow-pink-900/50' :
        discovery.tikTokScore === 'Medium' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' :
        'bg-slate-800 text-slate-500 border-slate-700';

    return (
      <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/50 transition-all group flex flex-col h-full">
        {/* NANO BANANA IMAGE AREA */}
        {isNanoEnabled && (
            <div className="w-full aspect-square bg-black border-b border-slate-700 relative overflow-hidden group/image">
                {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                        <span className="text-xs font-mono text-blue-300">Nano Banana Rendering...</span>
                    </div>
                ) : generatedVisual ? (
                     <img 
                        src={`data:image/png;base64,${generatedVisual}`} 
                        alt="Nano Banana Render" 
                        className="w-full h-full object-cover animate-in fade-in duration-700"
                     />
                ) : null}
            </div>
        )}

        <div className="p-6 flex-1 relative">
          
          {/* Top Actions: Nano Toggle & Save */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
             <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Visuals</span>
                <button 
                    onClick={() => handleToggleNano(`${discovery.title}, ${discovery.manufacturingStrategy} product, studio lighting`)}
                    className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${isNanoEnabled ? 'bg-blue-600' : 'bg-slate-600'}`}
                    title="Toggle Nano Banana Auto-Visuals"
                >
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isNanoEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
             </div>
             
             <button 
                onClick={() => handleSaveClick(discovery, 'DISCOVERY')}
                className="p-2 bg-slate-900/80 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700"
                title="Save to Idea Vault"
             >
                <Save className="w-4 h-4" />
             </button>
          </div>

          <div className="flex items-start justify-between mb-4 pr-24">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
              {discovery.title}
            </h3>
          </div>
          
          <div className="flex flex-col items-start gap-1 mb-4">
                 {/* Score Badge */}
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                    discovery.score >= 8 ? 'bg-green-500/20 text-green-400' : 
                    discovery.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                }`}>
                    Score: {discovery.score}/10
                </span>
            </div>

          <div className="space-y-4">
             {/* Tag Row */}
             <div className="flex flex-wrap gap-2">
                 {/* Manufacturing Strategy Badge */}
                 <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold border ${strategyColor}`}>
                      <Wrench className="w-3 h-3" />
                      {discovery.manufacturingStrategy}
                 </div>
                 
                 {/* TikTok Badge */}
                 <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold border ${tikTokColor}`}>
                      📱 TikTok Potential: {discovery.tikTokScore}
                 </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm font-semibold">
                {discovery.type === 'Functional Gap' ? <AlertTriangle className="w-4 h-4" /> :
                 discovery.type === 'Humor/Slogan' ? <MessageSquare className="w-4 h-4" /> :
                 discovery.type === 'TikTok / Visual Demo' ? <Music className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
                
                {discovery.type === 'Functional Gap' ? 'Market Gap Analysis' :
                 discovery.type === 'Humor/Slogan' ? 'Generated Slogans' :
                 discovery.type === 'TikTok / Visual Demo' ? 'Viral Mechanism' :
                 'Visual Trend Details'}
              </div>
              
              {discovery.type === 'Humor/Slogan' ? (
                <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-4 space-y-1">
                  {discovery.description.split('\n').filter(s => s.trim().length > 0).map((s, i) => (
                    <li key={i}>{s.replace(/^\d+\.\s*/, '').replace(/^- /, '')}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed italic whitespace-pre-wrap">"{discovery.description}"</p>
              )}
            </div>
            
            <p className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-2">
                Strategy: {discovery.strategyReason}
            </p>
          </div>
        </div>
        
        {/* Select Action */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-700">
            <button 
                onClick={() => onSelectIdea && onSelectIdea(discovery.title)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all font-semibold text-sm border border-blue-600/30"
            >
                <Check className="w-4 h-4" /> Select for Validation
            </button>
        </div>
      </div>
    );
  }

  // --- STAGE 2: VALIDATION ---
  if (stage === 'VALIDATION') {
    const validation = data as ValidationResult;
    // Defensive defaults
    const complianceCheck = validation.complianceCheck || { requiredCerts: [], riskLevel: 'Low' };
    const fbaSizeCheck = validation.fbaSizeCheck || { tier: 'Standard', note: 'Data pending' };
    const dataAnalysis = validation.dataAnalysis || { saturation: 'N/A', opportunity: 'N/A' };
    const seasonality = validation.seasonalityAnalysis || { isSeasonal: false, season: 'Year-Round', advice: 'Safe to launch anytime' };
    const ipRadar = validation.ipRadar || { riskLevel: 'Low', flaggedTerms: [], advice: 'No immediate red flags.' };
    const viralAngle = validation.viralAngle || { rating: 'Low', hook: 'N/A', trend: 'N/A' };
    
    const isGo = validation.decision === 'GO';
    const isHighRisk = complianceCheck.riskLevel === 'High';
    const isIpRisk = ipRadar.riskLevel === 'High';
    const isViralHigh = viralAngle.rating === 'High';
    
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500 relative">
        {/* Save Button */}
        <div className="absolute top-0 right-0 z-10">
            <button 
                onClick={() => handleSaveClick(validation, 'VALIDATION')}
                className="p-2 bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700 shadow-xl"
                title="Save Report to Vault"
            >
                <Save className="w-5 h-5" />
            </button>
        </div>

        <div className={`border rounded-2xl p-8 text-center shadow-2xl ${
            isGo ? 'bg-green-900/20 border-green-500/50 shadow-green-900/20' : 'bg-red-900/20 border-red-500/50 shadow-red-900/20'
        }`}>
            {isGo ? (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <h2 className="text-4xl font-bold text-white">GO</h2>
                    <p className="text-green-300 text-lg font-medium tracking-wide">GOLDEN OPPORTUNITY APPROVED</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <h2 className="text-4xl font-bold text-white">NO-GO</h2>
                    <p className="text-red-300 text-lg font-medium tracking-wide">MARKET SATURATED - REJECT</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Risk Manager Report</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">{validation.reasoning}</p>
            
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Saturation:</span>
                 <span className="text-white font-medium">{dataAnalysis.saturation}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Opportunity:</span>
                 <span className="text-white font-medium">{dataAnalysis.opportunity}</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             
             {/* VIRAL ANGLE (Only if High) */}
             {isViralHigh && (
                 <div className="p-5 rounded-xl border bg-gradient-to-r from-pink-900/20 to-cyan-900/20 border-pink-500/30">
                     <div className="flex items-center gap-2 mb-3">
                         <Music className="w-5 h-5 text-pink-400" />
                         <h4 className="font-bold text-pink-200">Viral Strategy</h4>
                         <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded ml-auto border border-pink-500/30">HIGH POTENTIAL</span>
                     </div>
                     <div className="space-y-3">
                         <div>
                             <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">The Hook</span>
                             <p className="text-sm text-slate-200 font-medium leading-snug">"{viralAngle.hook}"</p>
                         </div>
                         <div>
                             <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">The Trend</span>
                             <p className="text-sm text-slate-400">{viralAngle.trend}</p>
                         </div>
                     </div>
                 </div>
             )}

             {/* SAFETY INTELLIGENCE */}
             <div className="grid grid-cols-2 gap-4">
                {/* Seasonality */}
                <div className={`p-4 rounded-xl border ${seasonality.isSeasonal ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarClock className={`w-4 h-4 ${seasonality.isSeasonal ? 'text-yellow-400' : 'text-slate-400'}`} />
                        <h4 className="font-bold text-xs text-slate-300 uppercase">Seasonality</h4>
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{seasonality.season}</div>
                    <p className="text-xs text-slate-400">{seasonality.advice}</p>
                </div>

                {/* IP Radar */}
                <div className={`p-4 rounded-xl border ${isIpRisk ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Siren className={`w-4 h-4 ${isIpRisk ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                        <h4 className="font-bold text-xs text-slate-300 uppercase">IP Radar</h4>
                    </div>
                    {isIpRisk ? (
                        <>
                            <div className="text-sm font-bold text-red-400 mb-1">TRADEMARK RISK</div>
                            <div className="flex flex-wrap gap-1 mb-1">
                                {ipRadar.flaggedTerms.map((term, i) => (
                                    <span key={i} className="text-[10px] bg-red-500/20 text-red-300 px-1 rounded">{term}</span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-sm font-semibold text-white">Safe</div>
                    )}
                    <p className="text-xs text-slate-400">{ipRadar.advice}</p>
                </div>
             </div>

             {/* Compliance Check */}
             <div className={`p-5 rounded-xl border ${isHighRisk ? 'bg-red-950/30 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className={`w-5 h-5 ${isHighRisk ? 'text-red-400' : 'text-slate-400'}`} />
                  <h4 className="font-bold text-slate-200">Compliance Check</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ml-auto font-bold ${
                    complianceCheck.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                    complianceCheck.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {complianceCheck.riskLevel || 'Low'} Risk
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                   {complianceCheck.requiredCerts && complianceCheck.requiredCerts.length > 0 ? (
                     complianceCheck.requiredCerts.map((cert, i) => (
                       <span key={i} className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded">
                         {cert}
                       </span>
                     ))
                   ) : (
                     <span className="text-xs text-slate-500 italic">No major certs detected.</span>
                   )}
                </div>
             </div>

             {/* FBA Size Check */}
             <div className="p-5 rounded-xl border bg-slate-800 border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-slate-200">FBA Size Tier</h4>
                </div>
                <div className="text-lg font-semibold text-white mb-1">{fbaSizeCheck.tier || 'Standard'}</div>
                <p className="text-xs text-slate-400">{fbaSizeCheck.note}</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 3: EXECUTION ---
  if (stage === 'EXECUTION' && projectState && setProjectState) {
    const execution = data as ExecutionResult;
    
    // Base Values from AI
    const baseLanded = parseCurrency(execution.landedCost);
    const baseFBA = parseCurrency(execution.estFBAFee);
    const targetPrice = parseCurrency(execution.targetSellPrice);
    
    // Verified Values (if any)
    const verLanded = projectState.verifiedLandedCost ? parseFloat(projectState.verifiedLandedCost) : 0;
    const verFBA = projectState.verifiedFBAFee ? parseFloat(projectState.verifiedFBAFee) : 0;
    
    // Current Operational Values (Verified takes precedence)
    const currentLanded = verLanded || baseLanded;
    const currentFBA = verFBA || baseFBA;

    // --- RANGE CALCULATIONS ---
    const landedRange = {
        min: baseLanded * 0.85,
        max: baseLanded * 1.25
    };
    const fbaRange = {
        min: baseFBA * 0.90,
        max: baseFBA * 1.20
    };

    // --- DYNAMIC PROFIT CALCULATIONS ---
    const estPPC = targetPrice * 0.15; // 15% PPC assumption derived from standard
    const netProfitVal = targetPrice - currentLanded - currentFBA - estPPC;
    const netProfitStr = formatCurrency(netProfitVal);
    
    // Profit Range (if not verified)
    const minProfit = targetPrice - landedRange.max - fbaRange.max - estPPC;
    const maxProfit = targetPrice - landedRange.min - fbaRange.min - estPPC;
    const profitRangeStr = `${formatCurrency(minProfit)} - ${formatCurrency(maxProfit)}`;

    // Margin Percentage
    const marginPct = ((netProfitVal / targetPrice) * 100).toFixed(0) + '%';
    const minMarginPct = ((minProfit / targetPrice) * 100).toFixed(0) + '%';
    const maxMarginPct = ((maxProfit / targetPrice) * 100).toFixed(0) + '%';
    const marginDisplay = (verLanded || verFBA) ? marginPct : `${minMarginPct} - ${maxMarginPct}`;

    // --- DYNAMIC LAUNCH BUDGET CALCULATIONS ---
    const vineStrategy = projectState.vineStrategy || 'Cost Saver (1-2 Units)';
    const launchQty = parseInt(projectState.launchQuantity || '200');
    
    let vineFee = 0;
    let vineUnits = 2;
    if (vineStrategy.includes('Balanced')) { vineFee = 75; vineUnits = 10; }
    if (vineStrategy.includes('Aggressive')) { vineFee = 200; vineUnits = 30; }

    const phase1Budget = vineFee + (vineUnits * currentLanded) + ((launchQty - vineUnits) * 15); // $15 CPA assumption
    const phase2Budget = 250 * 15; // $15 CPA for 250 units
    const phase1Str = formatCurrency(phase1Budget);
    
    // Component for Editable Cost Row
    const CostRow = ({ label, baseVal, verifiedVal, setVerified, range, icon: Icon, colorClass }: any) => {
        const [isEditing, setIsEditing] = useState(false);
        const [tempVal, setTempVal] = useState(verifiedVal || baseVal);

        const handleSave = () => {
            setVerified(tempVal.toString());
            setIsEditing(false);
        };

        const hasVerified = !!verifiedVal;

        return (
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                <div className={`flex items-center gap-2 ${colorClass} mb-2`}>
                    <Icon className="w-4 h-4" /> <span className="text-xs font-bold uppercase">{label}</span>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="ml-auto text-slate-500 hover:text-white transition-colors"
                        title="Verify Cost with Supplier Quote"
                    >
                        <Pencil className="w-3 h-3" />
                    </button>
                </div>
                
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">$</span>
                        <input 
                            type="number" 
                            step="0.01"
                            value={tempVal}
                            onChange={(e) => setTempVal(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white p-1 rounded">
                            <Save className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div>
                        {hasVerified ? (
                            <div className="text-xl font-bold text-green-400 flex items-center gap-2">
                                {formatCurrency(parseFloat(verifiedVal))}
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        ) : (
                            <div className="group relative cursor-help">
                                <div className="text-lg font-bold text-white opacity-90">
                                    {formatCurrency(range.min)} - {formatCurrency(range.max)}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Est. Base: {formatCurrency(baseVal)}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-black text-xs text-slate-300 p-2 rounded border border-slate-700 shadow-xl z-10">
                                    AI Estimate (+25% / -15% Range). Verify with Supplier.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             {/* NANO BANANA HEADER FOR EXECUTION STAGE */}
             {isNanoEnabled && (
                <div className="w-full h-48 bg-black border-b border-slate-700 relative overflow-hidden group/image rounded-2xl mb-4">
                    {isGenerating ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                            <span className="text-xs font-mono text-emerald-300">Nano Banana Rendering...</span>
                        </div>
                    ) : generatedVisual ? (
                        <img 
                            src={`data:image/png;base64,${generatedVisual}`} 
                            alt="Nano Banana Render" 
                            className="w-full h-full object-cover animate-in fade-in duration-700"
                        />
                    ) : null}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-6 text-center flex-1 mr-4">
                    <h2 className="text-3xl font-bold text-white mb-2">{execution.productName}</h2>
                    <div className="text-emerald-300 text-sm font-medium tracking-widest uppercase">CFO Profit Analysis</div>
                </div>
                
                 {/* Top Actions: Nano Toggle & Save */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Visuals</span>
                        <button 
                            onClick={() => handleToggleNano(`${execution.productName}, e-commerce shot, high detail`)}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${isNanoEnabled ? 'bg-emerald-600' : 'bg-slate-600'}`}
                            title="Toggle Nano Banana Auto-Visuals"
                        >
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isNanoEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <button 
                        onClick={() => handleSaveClick(execution, 'EXECUTION')}
                        className="p-2 bg-slate-900/80 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700 text-center"
                        title="Save to Idea Vault"
                    >
                        <Save className="w-4 h-4 mx-auto" />
                    </button>
                </div>
            </div>

            {/* Launch Budget 2-Phase Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phase 1 */}
                <div className="bg-emerald-900/20 border border-emerald-500/50 p-5 rounded-xl relative overflow-hidden shadow-lg shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <ShieldCheck className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">Phase 1: Validation</h3>
                    </div>
                    {/* DYNAMIC BUDGET DISPLAY */}
                    <div className="text-2xl font-bold text-white mb-1">{phase1Str}</div>
                    
                    <p className="text-xs text-emerald-200/70 mb-4">Required Initial Risk Capital (Dynamic)</p>
                    <div className="text-[10px] text-emerald-400/80 font-mono bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                         Breakdown: {vineUnits} Vine Units (Cost+${vineFee}) + {launchQty - vineUnits} Test Sales (PPC)
                    </div>
                </div>

                {/* Phase 2 */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl relative overflow-hidden opacity-90">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <TrendingUp className="w-12 h-12 text-slate-300" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Phase 2: Scaling</h3>
                    </div>
                    <div className="text-2xl font-bold text-slate-300 mb-1">{formatCurrency(phase2Budget)}</div>
                    <p className="text-xs text-slate-500 mb-4">Conditional Growth Capital</p>
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-900/50 p-2 rounded border border-slate-700/30">
                        Breakdown: 250 Units @ $15 CPA (Rank to Page 1)
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <DollarSign className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Target Price</span>
                    </div>
                    <div className="text-xl font-bold text-white">{execution.targetSellPrice}</div>
                </div>
                
                {/* Landed Cost with Verification */}
                <CostRow 
                    label="Landed Cost" 
                    baseVal={baseLanded} 
                    verifiedVal={projectState.verifiedLandedCost}
                    setVerified={(val: string) => setProjectState && setProjectState(prev => ({ ...prev, verifiedLandedCost: val }))}
                    range={landedRange}
                    icon={Package}
                    colorClass="text-blue-400"
                />

                {/* FBA Fee with Verification */}
                <CostRow 
                    label="Est. FBA Fee" 
                    baseVal={baseFBA} 
                    verifiedVal={projectState.verifiedFBAFee}
                    setVerified={(val: string) => setProjectState && setProjectState(prev => ({ ...prev, verifiedFBAFee: val }))}
                    range={fbaRange}
                    icon={Scale}
                    colorClass="text-orange-400"
                />

                 <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-2 text-emerald-300 mb-2">
                        <Activity className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Net Profit</span>
                    </div>
                    {/* Dynamic Profit Display */}
                    {(verLanded || verFBA) ? (
                        <div className="text-2xl font-bold text-emerald-400">{netProfitStr}</div>
                    ) : (
                        <div className="text-lg font-bold text-emerald-300/80">{profitRangeStr}</div>
                    )}
                    <div className="text-xs text-emerald-500 font-bold mt-1">Margin: {marginDisplay}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-2">Est. PPC Cost (15%)</div>
                  <div className="text-white">{formatCurrency(estPPC)}</div>
               </div>
               <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-2">Compliance Action</div>
                  <div className="text-white text-sm">{execution.complianceNeeded}</div>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                    <FileText className="w-4 h-4" /> Master Tracker Row (Copy for Excel)
                </div>
                <div className="relative">
                    <pre className="bg-black/50 p-4 rounded-lg text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap selection:bg-emerald-900 selection:text-white">
                        {execution.markdownTable}
                    </pre>
                </div>
            </div>
        </div>
    );
  }

  // --- STAGE 4: SUPPLIER ACTION ---
  if (stage === 'SUPPLIER_ACTION') {
    const rfq = data as SupplierActionResult;
    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-gradient-to-r from-rose-900/20 to-pink-900/20 border border-rose-500/30 rounded-2xl p-6 text-center relative">
                 <div className="absolute top-2 right-2 z-20">
                    <button 
                        onClick={() => handleSaveClick(rfq, 'SUPPLIER')}
                        className="p-2 bg-slate-900/80 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700"
                        title="Save to Idea Vault"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                 </div>
                <h2 className="text-3xl font-bold text-white mb-2">Sourcing Packet</h2>
                <div className="text-rose-300 text-sm font-medium tracking-widest uppercase">RFQ & Visualization</div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                 <div className="flex items-center gap-2 text-purple-400 mb-3">
                     <ImageIcon className="w-5 h-5" />
                     <h3 className="font-bold">AI Image Prompt (Midjourney / DALL-E)</h3>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20 text-slate-300 text-sm font-mono leading-relaxed select-all">
                  {rfq.imagePrompt}
                </div>
            </div>

            <div className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-1">
                        <Mail className="w-4 h-4" /> Subject Line
                    </div>
                    <div className="text-lg font-semibold text-slate-800">{rfq.rfqSubject}</div>
                </div>

                <div>
                     <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-2">
                        <FileText className="w-4 h-4" /> Email Body
                    </div>
                    <pre className="font-sans whitespace-pre-wrap text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {rfq.rfqBody}
                    </pre>
                </div>
            </div>
        </div>
    );
  }

  return null;
};

export default ResultDisplay;