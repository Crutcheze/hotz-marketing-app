import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (category: string, stage: string) => {
  // 1. Safety Check
  if (!API_KEY) {
    return [{ 
      title: "Config Error", 
      pitch: "Missing API Key.", 
      score: 0, 
      difficulty: "Error" 
    }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // *** THE FIX: Use the PINNED version to stop the 404 errors ***
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const prompt = `
      Act as a product strategist. 
      Generate 3 ideas for category: "${category}". 
      Return ONLY a JSON array. No markdown.
      
      Required Fields:
      - title
      - pitch
      - score (number 1-10)
      - difficulty
      - visuals (detailed visual description)
      - strategy (marketing strategy)
      - tiktok_potential (viral potential)
      
      Example:
      [
        { 
          "title": "Eco-Leash", 
          "pitch": "A biodegradable leash.", 
          "score": 9, 
          "difficulty": "Easy",
          "visuals": "Matte green texture with brass clasps.",
          "strategy": "Influencer marketing.",
          "tiktok_potential": "High"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const rawIdeas = JSON.parse(cleanText);

    // *** THE TRANSLATOR (Keeps your data visible) ***
    return rawIdeas.map((idea: any) => ({
      ...idea,
      // Map 'visuals' to 'visual_trend' (what your UI wants)
      visual_trend: idea.visuals || idea.visualDetails || "No visual data",
      visualTrend: idea.visuals,
      visualDetails: idea.visuals,
      
      // Map 'strategy' to 'marketing_strategy'
      marketing_strategy: idea.strategy || idea.go_to_market || "No strategy data",
      marketingStrategy: idea.strategy,
      
      // Map 'tiktok' to 'tiktokPotential'
      tiktokPotential: idea.tiktok_potential || "Medium",
      tiktok: idea.tiktok_potential
    }));

  } catch (error: any) {
    console.error("AI Error:", error);
    return [{ 
      title: "AI Error", 
      pitch: `Error: ${error.message || "Unknown"}`, 
      score: 0, 
      visuals: "Try refreshing.",
      difficulty: "Error" 
    }];
  }
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder";
};
