import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GenerationParams, GenerationResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- SCHEMAS ---

const discoverySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Concept Name" },
      description: { type: Type.STRING, description: "Analysis or Description" },
      score: { type: Type.INTEGER, description: "Potential Score 1-10" },
      type: { type: Type.STRING, enum: ['Functional Gap', 'Humor/Slogan', 'Aesthetic/Visual', 'TikTok / Visual Demo'] },
      tikTokScore: { 
        type: Type.STRING, 
        enum: ['High', 'Medium', 'Low'],
        description: "High: Visually satisfying, 'Before/After' effect. Medium: Aesthetic but needs explanation. Low: Pure utility, hard to film."
      },
      manufacturingStrategy: { 
        type: Type.STRING, 
        enum: ['Private Label', 'Tweaked Design', 'Custom Mold'],
        description: "The manufacturing approach required." 
      },
      strategyReason: { 
        type: Type.STRING, 
        description: "Short explanation of why this strategy is needed." 
      }
    },
    required: ["title", "description", "score", "type", "tikTokScore", "manufacturingStrategy", "strategyReason"]
  }
};

const validationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    decision: { type: Type.STRING, enum: ["GO", "NO-GO"] },
    reasoning: { type: Type.STRING, description: "Strategic analysis summary." },
    complianceCheck: {
      type: Type.OBJECT,
      properties: {
        requiredCerts: { type: Type.ARRAY, items: { type: Type.STRING } },
        riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
      },
      required: ["requiredCerts", "riskLevel"]
    },
    seasonalityAnalysis: {
      type: Type.OBJECT,
      properties: {
        isSeasonal: { type: Type.BOOLEAN },
        season: { type: Type.STRING, description: "e.g. 'Summer', 'Winter', 'Q4 Holidays', or 'Year-Round'" },
        advice: { type: Type.STRING, description: "Timing advice based on current date." }
      },
      required: ["isSeasonal", "season", "advice"]
    },
    ipRadar: {
      type: Type.OBJECT,
      properties: {
        riskLevel: { type: Type.STRING, enum: ["Low", "High"] },
        flaggedTerms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of trademarked terms found." },
        advice: { type: Type.STRING, description: "Warning message if High risk." }
      },
      required: ["riskLevel", "flaggedTerms", "advice"]
    },
    fbaSizeCheck: {
      type: Type.OBJECT,
      properties: {
        tier: { type: Type.STRING },
        note: { type: Type.STRING }
      },
      required: ["tier", "note"]
    },
    dataAnalysis: {
      type: Type.OBJECT,
      properties: {
        saturation: { type: Type.STRING, description: "Review count analysis" },
        opportunity: { type: Type.STRING, description: "Search volume analysis" }
      },
      required: ["saturation", "opportunity"]
    },
    viralAngle: {
      type: Type.OBJECT,
      properties: {
        rating: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
        hook: { type: Type.STRING, description: "A 1-sentence video concept (e.g. 'Show the dirty rug, then scrape')." },
        trend: { type: Type.STRING, description: "The hashtag or genre (e.g. #CleanTok)." }
      },
      required: ["rating", "hook", "trend"]
    }
  },
  required: ["decision", "reasoning", "complianceCheck", "seasonalityAnalysis", "ipRadar", "fbaSizeCheck", "dataAnalysis", "viralAngle"]
};

const executionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    targetSellPrice: { type: Type.STRING },
    landedCost: { type: Type.STRING },
    estFBAFee: { type: Type.STRING },
    estPPC: { type: Type.STRING },
    estNetProfit: { type: Type.STRING },
    launchBudget: {
        type: Type.OBJECT,
        properties: {
            phase1: { type: Type.STRING, description: "Validation Budget. Based on Vine Strategy (Fees + Unit Cost) + Test PPC." },
            phase2: { type: Type.STRING, description: "Scaling Budget. Formula: (250 * $15)" }
        },
        required: ["phase1", "phase2"]
    },
    complianceNeeded: { type: Type.STRING },
    nextAction: { type: Type.STRING },
    markdownTable: { type: Type.STRING }
  },
  required: ["productName", "targetSellPrice", "landedCost", "estFBAFee", "estPPC", "estNetProfit", "launchBudget", "complianceNeeded", "nextAction", "markdownTable"]
};

const supplierActionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    rfqSubject: { type: Type.STRING },
    rfqBody: { type: Type.STRING },
    imagePrompt: { type: Type.STRING }
  },
  required: ["rfqSubject", "rfqBody", "imagePrompt"]
};

const researchLabSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    // Mode A Results
    subNiches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          growthFactor: { type: Type.STRING, description: "Why is this growing?" },
          competitionLevel: { type: Type.STRING, description: "Low/Medium/High" },
          description: { type: Type.STRING }
        },
        required: ["name", "growthFactor", "competitionLevel", "description"]
      }
    },
    // Mode B Results
    pivots: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                newNiche: { type: Type.STRING, description: "The specific sub-culture (e.g., EDC, Gamers)." },
                rebrandName: { type: Type.STRING, description: "The new product name." },
                requiredTweak: { type: Type.STRING, description: "Small physical change needed." },
                whyItWorks: { type: Type.STRING, description: "Reasoning based on physical attributes." }
            },
            required: ["newNiche", "rebrandName", "requiredTweak", "whyItWorks"]
        }
    }
  },
  required: ["title"]
};

export const generateNanoBananaVisual = async (productDescription: string): Promise<string | null> => {
  const ai = getClient();
  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
           parts: [{ text: `Professional e-commerce product photography, cinematic studio lighting, 8k resolution, photorealistic mockup of: ${productDescription}. High quality commercial product shot, minimalist background.` }]
        },
        config: {
           // Nano Banana (gemini-2.5-flash-image) does not support responseMimeType or responseSchema
           // Aspect Ratio 1:1 is default
        }
     });
     
     // Extract image part
     if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
     }
     return null;
  } catch (e) {
     console.error("Nano Banana Error:", e);
     return null;
  }
};

export const generateProductIdeas = async (params: GenerationParams): Promise<GenerationResult> => {
  const ai = getClient();
  
  let systemInstruction = `
    Role: You are the "Amazon Alpha" Product Development Engine. You manage the product lifecycle from Ideation to Sourcing.
  `;

  let userPrompt = "";
  let schema: Schema;
  let useSearch = false;

  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // --- RESEARCH LAB LOGIC ---
  if (params.mode === 'RESEARCH_LAB') {
    
    if (params.labMode === 'Pivot Engine') {
        // Mode B: Pivot Engine
        systemInstruction += `
            Task: Act as a Lateral Thinking Product Strategist. 
            Goal: Take a generic Base Product and brainstorm NEW, profitable niches by rebranding or slight tweaking.
            Method: 
            1. Analyze the physical attributes of the input (Size, Shape, Material, Mechanism). 
            2. IGNORE the original intended use. 
            3. Brainstorm 3-5 Alternative Use Cases for specific, obsessive sub-cultures (e.g., Gamers, Nicotine Users, EDC, Nurses, Pet Owners).
        `;
        userPrompt = `Perform Product Pivot Analysis.
        Base Product Item: "${params.baseProduct}".
        Generate 4 Pivot Cards.
        For "title", simply return the Base Product Name.
        Return "pivots" array, leave "subNiches" empty.`;
        useSearch = false; // Pure lateral thinking, search not strictly needed but could be added.
    } else {
        // Mode A: Niche Explorer
        systemInstruction += `
            Task: Act as a Market Researcher. Identify high-growth, low-competition sub-niches within a broad sector.
            Focus: "Blue Ocean" gaps where demand is rising but major brands haven't dominated.
        `;
        userPrompt = `Perform Niche Explorer analysis for Broad Sector: "${params.broadSector}". List 5 high-potential sub-niches. 
        For "title", simply return the Broad Sector Name.
        Return "subNiches" array, leave "pivots" empty.`;
        useSearch = true; 
    }
    schema = researchLabSchema;
  } 
  
  // --- FUNNEL LOGIC ---
  else {
    systemInstruction += `
      YOUR BEHAVIOR BY STAGE:

      STAGE 1: DISCOVERY (The Trend Hunter)
      Logic:
      - IF "Manual Override" is provided: Treat this as a "Micro-Niche" or "Seed Idea". Do NOT just validate it. Instead, generate 3 distinct product concepts derived from this input.
      - IF No Override:
          - IF "Functional Gap": Find complaints.
          - IF "Humor/Slogan": Generate slogans.
          - IF "Aesthetic/Visual": Identify visual trends.
          - IF "TikTok / Visual Demo": Identify "Viral" products with high demonstrability.
      
      NEW: TIKTOK POTENTIAL SCORING:
      For every idea, assign a "tikTokScore":
      - HIGH: Visually satisfying, shocking, or 'Before/After' effect. (e.g. Slime, Rug scraper, Galaxy projector).
      - MEDIUM: Aesthetic but static. Needs a voiceover to explain. (e.g. Beige office decor, Cute mug).
      - LOW: Hidden utility, boring, hard to film. (e.g. HDMI cable, Shelf bracket, Vitamin container).

      CRITICAL CONSTRAINTS FOR STAGE 1:
      1. Shoebox Rule: If Price Tier is "<$20", prioritize small items.
      2. Manufacturing Strategy Tagging:
         - You MUST tag each idea with one of: [Private Label | Tweaked Design | Custom Mold].
         - Private Label: Off-the-shelf product with simple logo application. (Lowest Risk/Cost).
         - Tweaked Design: Standard mold with minor changes (color, material, accessories). (Medium Risk/Cost).
         - Custom Mold: Unique shape/mechanism requiring expensive tooling. (High Risk/Cost).
      3. Budget Logic:
         - IF Price Tier is "<$20": You MUST prioritize "Private Label" and "Tweaked Design". Do NOT suggest "Custom Mold" unless the problem is impossible to solve otherwise. The unit economics don't support expensive molds for cheap items.
         - IF Price Tier is "$20-$50": "Tweaked Design" is preferred, but "Custom Mold" is acceptable if it provides a massive competitive advantage.

      STAGE 2: VALIDATION (The Risk Manager)
      Goal: Analyze Data & Safety.
      Logic based on Research Mode:
      - IF "Helium 10 Data": STRICTLY parse the provided text/CSV data. Look for high "Search Volume" vs low "Review Count". 
        - High Saturation = High Review Counts (e.g., >500 avg).
        - High Opportunity = High Search Volume (>3000) with Low Reviews (<100).
      - IF "Auto-Discovery": Use Google Search.
      - IF "Manual Input": Analyze user notes.

      SAFETY & VIRALITY LAYER ADDITIONS (Stage 2):
      1. Seasonality Check: Compare to TODAY'S DATE: ${currentDate}.
      2. IP Radar: Check keywords for Trademarks.
      3. Viral Angle Analysis:
         - Evaluate the "TikTok Potential" of the submitted idea (High/Medium/Low).
         - IF HIGH: You MUST provide a "Hook" (1-sentence video concept) and identify the "Trend" (#Hashtag).

      STAGE 3: EXECUTION (The CFO)
      Calculations: Net Margin, FBA Fees, PPC.
      LAUNCH BUDGET CALCULATION (Tiered Risk Model):
      - Phase 1 (Validation): Risk Capital to prove conversion.
      - Phase 2 (Scaling): Growth Capital to rank.
      
      STAGE 4: SUPPLIER (The Sourcing Agent)
      Write RFQ and Image Prompt.
    `;

    switch (params.stage) {
      case 'DISCOVERY':
        const shuffleInstruction = params.isShuffle ? " IMPORTANT: Provide 3 FRESH, ALTERNATIVE ideas different from the most obvious/previous results. Be creative." : "";

        if (params.manualOverride) {
           // Scenario B: Manual Seed Idea -> Variations
           userPrompt = `Perform STAGE 1: DISCOVERY (MICRO-NICHE EXPANSION). 
           User Input (Seed Idea): "${params.manualOverride}".
           Concept Type: "${params.conceptType}".
           Price Tier: "${params.priceTier}".
           Target Audience: "${params.targetAudience}".
           Task: Treat the User Input as a base concept. Generate 3 distinct variations/styles of this specific product that fit the Concept Type and Price Tier.
           Constraint: Strictly adhere to Price Tier and Manufacturing Strategy logic.
           ${shuffleInstruction}`;
           useSearch = true;
        } else {
           // Scenario A: Category -> New Ideas
           userPrompt = `Perform STAGE 1: DISCOVERY for Category: "${params.sector}". 
           Concept Type: "${params.conceptType}".
           Target Audience: "${params.targetAudience}".
           Price Tier: "${params.priceTier}".
           Find 3 distinct concepts/styles or 10 slogans.
           Constraint: Strictly adhere to Price Tier and Manufacturing Strategy logic.
           ${shuffleInstruction}`;
           useSearch = params.conceptType === 'Functional Gap' || params.conceptType === 'Aesthetic/Visual' || params.conceptType === 'TikTok / Visual Demo';
        }
        schema = discoverySchema;
        break;

      case 'VALIDATION':
        userPrompt = `Perform STAGE 2: VALIDATION (Safety Check Enabled). 
        Current Date: ${currentDate}.
        Product Context: "${params.productIdea}".
        Research Mode: "${params.researchMode}".
        Data Input: "${params.dataInput || 'N/A'}". 
        1. Determine GO or NO-GO based on Saturation vs Opportunity. 
        2. Check Compliance & FBA Size.
        3. Run Seasonality Check vs Current Date.
        4. Run IP Radar for trademarks/patents.
        5. Analyze Viral Angle (TikTok Potential).`;
        schema = validationSchema;
        useSearch = params.researchMode === 'Auto-Discovery';
        break;

      case 'EXECUTION':
        // Map Strategy to Costs
        let vineFee = 0;
        let vineUnits = 2;
        
        if (params.vineStrategy === 'Balanced (3-10 Units)') {
            vineFee = 75;
            vineUnits = 10;
        } else if (params.vineStrategy === 'Aggressive (11-30 Units)') {
            vineFee = 200;
            vineUnits = 30;
        }

        userPrompt = `Perform STAGE 3: EXECUTION for Product: "${params.productIdea}". 
        Target Sell Price: "${params.priceTarget}".
        Launch Quantity (Inventory): ${params.launchQuantity || 200}.
        
        VINE PROGRAM STRATEGY: ${params.vineStrategy || 'Cost Saver'}.
        - Enrollment Fee: $${vineFee}
        - Units to Giveaway: ${vineUnits}

        TASKS:
        1. Calculate margins (Landed Cost, FBA Fees, Net Profit).
        2. Calculate 'launchBudget' using this specific Logic:
           - Phase 1 (Validation Budget) = (${vineFee} [Vine Fee]) + (${vineUnits} * Landed Cost [Vine Product Cost]) + ((${params.launchQuantity || 200} - ${vineUnits}) * $15 [PPC Test Budget]).
           - Phase 2 (Scaling Budget) = (250 * $15).
        
        Return formatted currency strings (e.g. "$1,200") for all financial values.`;
        schema = executionSchema;
        useSearch = false;
        break;

      case 'SUPPLIER_ACTION':
        userPrompt = `Perform STAGE 4: SUPPLIER ACTION for Product: "${params.productIdea}". Modification Type: "${params.modificationType}". Write RFQ and Image Prompt.`;
        schema = supplierActionSchema;
        useSearch = false;
        break;
      default:
        throw new Error("Invalid Stage");
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 1024 },
        tools: useSearch ? [{ googleSearch: {} }] : undefined
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const result = JSON.parse(text);
    return result as GenerationResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
