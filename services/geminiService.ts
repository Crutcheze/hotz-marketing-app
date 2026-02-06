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
    // Using 1.5-flash because it works with your key and is fast
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // *** THE TRANSLATOR ***
    // This part fixes the empty boxes by mapping data to every name the UI looks for
    return rawIdeas.map((idea: any) => ({
      ...idea,
      // Fixes "Visual Trend Details"
      visual_trend: idea.visuals,
      visualTrend: idea.visuals,
      visualDetails: idea.visuals,
      
      // Fixes "Strategy"
      marketing_strategy: idea.strategy,
      marketingStrategy: idea.strategy,
      go_to_market: idea.strategy,
      
      // Fixes "TikTok"
      tiktokPotential: idea.tiktok_potential,
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
