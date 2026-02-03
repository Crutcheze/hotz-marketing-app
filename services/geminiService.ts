import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  if (!API_KEY) {
    console.error("Missing API Key");
    return [{ title: "Config Error", pitch: "Add VITE_GEMINI_API_KEY to Vercel", difficulty: "High" }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Using the Pro model for smarter logic
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert product strategist.
      Generate 3 high-quality product ideas for the category "${category}".
      The product is in the "${stage}" lifecycle stage.
      
      CRITICAL: The output must be a raw JSON array.
      Each idea MUST have these exact fields to work with the dashboard:
      - title (String): catchy name
      - pitch (String): 2 sentence value prop
      - score (Number): 1-10 potential score
      - difficulty (String): "Easy", "Medium", or "Hard"
      - visuals (String): Detailed description of the product aesthetic
      - strategy (String): One distinct go-to-market tactic
      - tiktok_potential (String): "Viral", "Moderate", or "Niche"

      Example JSON:
      [
        { 
          "title": "Eco-Leash", 
          "pitch": "A biodegradable leash made from algae.", 
          "score": 9, 
          "difficulty": "Medium",
          "visuals": "Matte green texture with recycled brass clasps.",
          "strategy": "Partner with eco-conscious dog influencers.",
          "tiktok_potential": "Viral"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown formatting if the AI adds it
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("AI Error:", error);
    return [
      { 
        title: "Generation Failed", 
        pitch: error.message || "Could not generate ideas.", 
        score: 0,
        visuals: "Check API Key and Model status.",
        difficulty: "Error" 
      }
    ];
  }
};

// Placeholder to prevent build errors
export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder_data";
};
