export type ProductStage = 'DISCOVERY' | 'VALIDATION' | 'EXECUTION' | 'SUPPLIER_ACTION';
export type AppMode = 'FUNNEL' | 'RESEARCH_LAB';

export type ModificationType = 'Physical Tweak' | 'Print/Design' | 'Bundle';
export type ConceptType = 'Functional Gap' | 'Humor/Slogan' | 'Aesthetic/Visual' | 'TikTok / Visual Demo';
export type PriceTier = '<$20' | '$20-$50';
export type ResearchMode = 'Auto-Discovery' | 'Manual Input' | 'Helium 10 Data';
export type VineStrategy = 'Cost Saver (1-2 Units)' | 'Balanced (3-10 Units)' | 'Aggressive (11-30 Units)';
export type LabMode = 'Niche Explorer' | 'Pivot Engine';

// Centralized State for all inputs
export interface ProjectState {
  broadSector: string;
  sector: string;
  manualOverride: string;
  conceptType: ConceptType;
  targetAudience: string;
  priceTier: PriceTier;
  researchMode: ResearchMode;
  dataInput: string;
  productIdea: string;
  priceTarget: string;
  modificationType: ModificationType;
  // Execution Stage Params
  vineStrategy: VineStrategy;
  launchQuantity: string;
  // Cost Verification
  verifiedLandedCost?: string;
  verifiedFBAFee?: string;
  // Research Lab Params
  labMode: LabMode;
  baseProduct: string;
}

export interface GenerationParams {
  mode: AppMode;
  stage?: ProductStage;
  isShuffle?: boolean; 
  
  // Research Lab Params
  broadSector?: string;
  labMode?: LabMode;
  baseProduct?: string;

  // Funnel Params
  sector?: string;       
  conceptType?: ConceptType; 
  targetAudience?: string; 
  priceTier?: PriceTier;   
  manualOverride?: string; 
  
  researchMode?: ResearchMode; 
  dataInput?: string;    
  
  productIdea?: string;  
  priceTarget?: string;
  
  // Execution Params
  vineStrategy?: VineStrategy;
  launchQuantity?: string;

  modificationType?: ModificationType; 
}

// Stage 1: Discovery Result
export interface DiscoveryItem {
  title: string; 
  description: string; 
  score: number; 
  type: ConceptType;
  tikTokScore: 'High' | 'Medium' | 'Low';
  manufacturingStrategy: 'Private Label' | 'Tweaked Design' | 'Custom Mold';
  strategyReason: string;
}

// Stage 2: Validation Result
export interface ValidationResult {
  decision: 'GO' | 'NO-GO';
  reasoning: string;
  complianceCheck: {
    requiredCerts: string[];
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  seasonalityAnalysis: {
    isSeasonal: boolean;
    season: string;
    advice: string;
  };
  ipRadar: {
    riskLevel: 'Low' | 'High';
    flaggedTerms: string[];
    advice: string;
  };
  fbaSizeCheck: {
    tier: string;
    note: string;
  };
  dataAnalysis: {
    saturation: string;
    opportunity: string;
  };
  viralAngle: {
    rating: 'High' | 'Medium' | 'Low';
    hook: string;
    trend: string;
  };
}

// Stage 3: Execution Result
export interface ExecutionResult {
  productName: string;
  targetSellPrice: string;
  landedCost: string;
  estFBAFee: string;
  estPPC: string; 
  estNetProfit: string;
  launchBudget: {
    phase1: string; // Validation Budget
    phase2: string; // Scaling Budget
  };
  complianceNeeded: string;
  nextAction: string;
  markdownTable: string; 
}

// Stage 4: Supplier Action Result
export interface SupplierActionResult {
  rfqSubject: string;
  rfqBody: string;
  imagePrompt: string;
}

// Research Lab Result
export interface ResearchLabResult {
  title: string; // Main title (Sector or Base Product)
  // Mode A: Niche Explorer Results
  subNiches?: {
    name: string;
    growthFactor: string;
    competitionLevel: string;
    description: string;
  }[];
  // Mode B: Pivot Engine Results
  pivots?: {
    newNiche: string;
    rebrandName: string;
    requiredTweak: string;
    whyItWorks: string;
  }[];
}

// Union type for generic passing
export type GenerationResult = DiscoveryItem[] | ValidationResult | ExecutionResult | SupplierActionResult | ResearchLabResult;

// Persistent Results Map
export interface StageResults {
  DISCOVERY: DiscoveryItem[] | null;
  VALIDATION: ValidationResult | null;
  EXECUTION: ExecutionResult | null;
  SUPPLIER_ACTION: SupplierActionResult | null;
  RESEARCH_LAB: ResearchLabResult | null;
}

// Idea Vault Item
export interface VaultItem {
  id: string;
  timestamp: string;
  type: 'DISCOVERY' | 'EXECUTION' | 'PIVOT' | 'VALIDATION' | 'SUPPLIER';
  title: string;
  visual?: string; // Base64 image
  data: any; // Store the full object (DiscoveryItem, etc.)
  notes?: string;
}