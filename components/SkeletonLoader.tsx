import React from 'react';
import { AppMode, ProductStage } from '../types';

interface SkeletonLoaderProps {
  mode: AppMode;
  stage: ProductStage;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ mode, stage }) => {
  
  // Helper for shimmering lines
  const ShimmerLine = ({ width = "w-full", height = "h-4" }) => (
    <div className={`${height} ${width} bg-slate-800 rounded animate-pulse`} />
  );

  // Helper for shimmering box
  const ShimmerBox: React.FC<{ className: string }> = ({ className }) => (
    <div className={`${className} bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50`} />
  );

  // --- RESEARCH LAB SKELETON ---
  if (mode === 'RESEARCH_LAB') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="h-24 w-full bg-slate-800/50 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-2 border border-slate-700">
           <div className="h-8 w-1/3 bg-slate-700 rounded" />
           <div className="h-4 w-1/4 bg-slate-700/50 rounded" />
        </div>
        {/* List of Niches */}
        <div className="grid grid-cols-1 gap-4">
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 flex justify-between items-center">
                <div className="space-y-2 w-2/3">
                    <div className="h-6 w-1/3 bg-slate-800 rounded" />
                    <div className="h-4 w-full bg-slate-800/50 rounded" />
                </div>
                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-800 rounded" />
                    <div className="h-6 w-16 bg-slate-800 rounded" />
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // --- STAGE 1: DISCOVERY SKELETON (Cards) ---
  if (stage === 'DISCOVERY') {
    return (
      <div className="space-y-6">
         <div className="h-8 w-1/4 bg-slate-800 rounded animate-pulse mb-6" />
         <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                 {/* Header Line */}
                 <div className="flex justify-between items-start">
                    <div className="h-6 w-1/3 bg-slate-800 rounded animate-pulse" />
                    <div className="h-6 w-12 bg-slate-800 rounded animate-pulse" />
                 </div>
                 {/* Badge */}
                 <div className="h-8 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
                 {/* Body */}
                 <div className="space-y-2 pt-2">
                    <ShimmerLine />
                    <ShimmerLine />
                    <ShimmerLine width="w-3/4" />
                 </div>
                 {/* Button */}
                 <div className="h-10 w-full bg-slate-800/30 rounded-lg animate-pulse mt-4" />
              </div>
            ))}
         </div>
      </div>
    );
  }

  // --- STAGE 2: VALIDATION SKELETON (Dashboard) ---
  if (stage === 'VALIDATION') {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-6" />
        {/* Decision Box */}
        <div className="h-48 w-full bg-slate-800/30 rounded-2xl animate-pulse border border-slate-800 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-slate-800" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ShimmerBox className="h-64" />
            <div className="space-y-4">
                <ShimmerBox className="h-24" />
                <ShimmerBox className="h-24" />
                <ShimmerBox className="h-24" />
            </div>
        </div>
      </div>
    );
  }

  // --- STAGE 3: EXECUTION SKELETON (Financials) ---
  if (stage === 'EXECUTION') {
    return (
      <div className="space-y-6">
        <div className="h-32 w-full bg-slate-800/30 rounded-2xl animate-pulse border border-slate-800" />
        
        {/* Alert Bar */}
        <div className="h-16 w-full bg-slate-800/50 rounded-xl animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map(i => <ShimmerBox key={i} className="h-24" />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShimmerBox className="h-20" />
            <ShimmerBox className="h-20" />
        </div>

        <ShimmerBox className="h-40" />
      </div>
    );
  }

  // --- STAGE 4: SUPPLIER SKELETON (Document) ---
  if (stage === 'SUPPLIER_ACTION') {
      return (
        <div className="space-y-6">
            <div className="h-32 w-full bg-slate-800/30 rounded-2xl animate-pulse border border-slate-800" />
            <ShimmerBox className="h-32" />
            <div className="h-96 w-full bg-white/5 rounded-xl animate-pulse border border-slate-800 p-6 space-y-4">
                <div className="h-8 w-1/3 bg-slate-800 rounded" />
                <div className="space-y-2">
                     <ShimmerLine />
                     <ShimmerLine />
                     <ShimmerLine />
                     <ShimmerLine width="w-1/2" />
                </div>
            </div>
        </div>
      );
  }

  return null;
};

export default SkeletonLoader;