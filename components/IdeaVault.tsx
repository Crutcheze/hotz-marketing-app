import React, { useState } from 'react';
import { VaultItem, DiscoveryItem, ValidationResult, ExecutionResult, SupplierActionResult } from '../types';
import { Trash2, Calendar, Tag, Image as ImageIcon, Briefcase, FileText, X, Copy, Check, Eye, Code, Lock, Info, Globe, GitPullRequest } from 'lucide-react';

interface IdeaVaultProps {
    localItems: VaultItem[];
    staticItems: VaultItem[];
    onRemove: (id: string) => void;
    onClose: () => void;
}

// Admin Guide Component
const AdminGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-blue-400" />
                How to Publish
            </h3>
            <ol className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">1</span>
                    <div>
                        <strong className="text-white block mb-0.5">Create a Draft</strong>
                        Generate ideas in the app and save them. They will appear as <span className="text-amber-400 font-bold text-xs">DRAFT / LOCAL</span>.
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">2</span>
                    <div>
                        <strong className="text-white block mb-0.5">Click "Copy Code"</strong>
                        On the draft card, click the <span className="inline-flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-700"><Code className="w-3 h-3"/> Copy Code for GitHub</span> button.
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">3</span>
                    <div>
                        <strong className="text-white block mb-0.5">Update Repository</strong>
                        Open <code>services/database.ts</code> in your GitHub repo. Paste the code into the <code>SAVED_IDEAS</code> list.
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">4</span>
                    <div>
                        <strong className="text-white block mb-0.5">Deploy</strong>
                        Commit your changes. When the site rebuilds, the item will be <span className="text-emerald-400 font-bold text-xs">LOCKED / PUBLISHED</span> for everyone.
                    </div>
                </li>
            </ol>
        </div>
    </div>
);

const VaultDetailModal: React.FC<{ item: VaultItem; onClose: () => void }> = ({ item, onClose }) => {
    const [copied, setCopied] = useState(false);

    // Helper to extract display data based on type
    const getDetails = () => {
        const data = item.data;
        let mainText = "";
        let secondaryText = "";
        let rationale = "";
        let tags: string[] = [];

        switch (item.type) {
            case 'DISCOVERY':
                const disc = data as DiscoveryItem;
                mainText = disc.description;
                rationale = disc.strategyReason;
                tags = [disc.manufacturingStrategy, `TikTok:${disc.tikTokScore}`, disc.type];
                break;
            case 'VALIDATION':
                const val = data as ValidationResult;
                mainText = val.viralAngle?.hook || val.reasoning;
                rationale = val.reasoning;
                tags = [val.decision, val.viralAngle?.trend || "", val.seasonalityAnalysis?.season || ""].filter(Boolean);
                secondaryText = `Risk Level: ${val.complianceCheck?.riskLevel}`;
                break;
            case 'EXECUTION':
                const exec = data as ExecutionResult;
                mainText = `Target Price: ${exec.targetSellPrice}\nNet Profit: ${exec.estNetProfit}\n\nLaunch Budget:\nPhase 1: ${exec.launchBudget?.phase1}\nPhase 2: ${exec.launchBudget?.phase2}`;
                rationale = exec.nextAction;
                tags = ["Financials", "Execution"];
                break;
            case 'SUPPLIER_ACTION':
                const supp = data as SupplierActionResult;
                mainText = supp.rfqBody;
                rationale = "Sourcing RFQ Draft";
                secondaryText = `Subject: ${supp.rfqSubject}`;
                tags = ["RFQ", "Sourcing"];
                break;
            case 'PIVOT':
                const pivot = data as any;
                mainText = `New Niche: ${pivot.newNiche}\nRebrand Name: ${pivot.rebrandName}\nRequired Tweak: ${pivot.requiredTweak}`;
                rationale = pivot.whyItWorks;
                tags = ["Pivot", "Lateral Thinking"];
                break;
            default:
                mainText = JSON.stringify(data, null, 2);
        }

        return { mainText, secondaryText, rationale, tags };
    };

    const { mainText, secondaryText, rationale, tags } = getDetails();

    const handleCopy = () => {
        const textToCopy = `Title: ${item.title}\n\n${secondaryText ? secondaryText + '\n\n' : ''}${mainText}\n\nRationale: ${rationale}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                item.type === 'DISCOVERY' ? 'bg-blue-900/50 text-blue-200 border-blue-500/30' :
                                item.type === 'VALIDATION' ? 'bg-amber-900/50 text-amber-200 border-amber-500/30' :
                                item.type === 'EXECUTION' ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500/30' :
                                'bg-purple-900/50 text-purple-200 border-purple-500/30'
                            }`}>
                                {item.type}
                            </span>
                            <span className="text-slate-500 text-xs">{item.timestamp}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white truncate pr-4">{item.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {item.visual && (
                         <div className="w-full h-64 bg-black rounded-xl overflow-hidden border border-slate-800 shrink-0">
                            <img src={`data:image/png;base64,${item.visual}`} alt="Visual" className="w-full h-full object-contain" />
                         </div>
                    )}

                    {/* Secondary Text (e.g. RFQ Subject) */}
                    {secondaryText && (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Context</h4>
                            <p className="text-slate-200 text-sm font-medium">{secondaryText}</p>
                        </div>
                    )}

                    {/* Main Content (Caption/Script) */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                Content / Details
                             </h4>
                             <button 
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    copied ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                             >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy Text'}
                             </button>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                            {mainText}
                        </div>
                    </div>

                    {/* Rationale */}
                    <div className="bg-slate-800/30 p-4 rounded-xl border-l-2 border-indigo-500">
                         <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Rationale / Strategy</h4>
                         <p className="text-slate-300 text-sm italic">"{rationale}"</p>
                    </div>

                    {/* Hashtags/Tags */}
                    {tags.length > 0 && (
                        <div>
                             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Tags & Trends</h4>
                             <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                                        #{tag.replace(/\s+/g, '')}
                                    </span>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const IdeaVault: React.FC<IdeaVaultProps> = ({ localItems, staticItems, onRemove, onClose }) => {
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showAdminGuide, setShowAdminGuide] = useState(false);

    // Merge logic: Add 'source' property to distinguish
    const allItems = [
        ...localItems.map(i => ({ ...i, isStatic: false })),
        ...staticItems.map(i => ({ ...i, isStatic: true }))
    ];

    const handleCopyCode = (e: React.MouseEvent, item: VaultItem) => {
        e.stopPropagation();
        
        // Create a clean object ready for database.ts
        const exportObj = {
            id: `static-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: item.timestamp,
            type: item.type,
            title: item.title,
            data: item.data,
            visual: item.visual,
            notes: item.notes
        };

        const codeString = JSON.stringify(exportObj, null, 4);
        navigator.clipboard.writeText(codeString + ',');
        
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {selectedItem && (
                <VaultDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}

            {showAdminGuide && (
                <AdminGuideModal onClose={() => setShowAdminGuide(false)} />
            )}

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-white">Idea Vault</h2>
                            <button onClick={() => setShowAdminGuide(true)} className="text-slate-500 hover:text-white transition-colors" title="How to Publish">
                                <Info className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-400">Manage drafts and published concepts.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                        {allItems.length} Items
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white underline text-sm">
                        Back to Workspace
                    </button>
                </div>
            </div>

            {allItems.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-400">Vault is Empty</h3>
                    <p className="text-slate-500 mt-2">Save ideas from the Funnel or Research Lab to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allItems.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)}
                            className={`bg-slate-900 border rounded-xl overflow-hidden shadow-lg group transition-all flex flex-col cursor-pointer relative ${
                                item.isStatic ? 'border-emerald-500/30' : 'border-slate-800 hover:border-indigo-500/50'
                            }`}
                        >
                            {/* Header Image or Placeholder */}
                            <div className="h-40 bg-slate-950 relative border-b border-slate-800">
                                {item.visual ? (
                                    <img src={`data:image/png;base64,${item.visual}`} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <ImageIcon className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                    {item.isStatic ? (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border bg-emerald-900/80 text-emerald-300 border-emerald-500/30 shadow-sm backdrop-blur-sm">
                                            <Globe className="w-3 h-3" /> Locked / Published
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border bg-amber-900/80 text-amber-300 border-amber-500/30 shadow-sm backdrop-blur-sm">
                                            <Briefcase className="w-3 h-3" /> Draft / Local
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {item.isStatic ? (
                                     <div className="absolute top-2 right-2 p-1.5 bg-black/50 text-slate-400 rounded cursor-not-allowed z-10" title="Published Item (Read Only)">
                                        <Lock className="w-4 h-4" />
                                     </div>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title="Delete Draft"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                
                                {/* Overlay View Icon */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> View Details
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                    {item.title}
                                </h3>
                                
                                <div className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">
                                    {/* Context aware summary */}
                                    {item.type === 'DISCOVERY' && (item.data as any).description}
                                    {item.type === 'EXECUTION' && (
                                        <>
                                            Target: {(item.data as any).targetSellPrice} | 
                                            Profit: {(item.data as any).estNetProfit}
                                        </>
                                    )}
                                    {item.type === 'PIVOT' && (item.data as any).whyItWorks}
                                    {item.type === 'VALIDATION' && (item.data as any).reasoning}
                                    {item.type === 'SUPPLIER_ACTION' && "Supplier RFQ Draft"}
                                </div>
                                
                                {/* Copy Code Object Button (Drafts Only) */}
                                {!item.isStatic && (
                                    <button 
                                        onClick={(e) => handleCopyCode(e, item)}
                                        className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-lg bg-amber-900/20 hover:bg-amber-900/40 text-xs font-bold text-amber-500 hover:text-amber-300 transition-all border border-amber-500/20 z-20 relative"
                                    >
                                        {copiedId === item.id ? <Check className="w-3 h-3 text-green-400" /> : <Code className="w-3 h-3" />}
                                        {copiedId === item.id ? "Code Copied!" : "Copy Code for GitHub"}
                                    </button>
                                )}

                                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {item.timestamp}
                                    </div>
                                    <div className="flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors">
                                        <Eye className="w-3 h-3" />
                                        Read More
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default IdeaVault;