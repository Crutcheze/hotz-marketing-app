import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (category: string, stage: string) => {
  if (!API_KEY) {
    return [{ 
      title: "Missing API Key", 
      pitch: "Check Vercel settings.", 
      score: 0, 
      difficulty: "Error" 
    }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using Flash with the new SDK
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a product strategist. 
      Generate 3 ideas for category: "${category}". 
      Return ONLY a JSON array. No markdown.
      
      Structure:
      [
        { 
          "title": "Idea Name", 
          "pitch": "Short description", 
          "score": 8, 
          "difficulty": "Easy",
          "visuals": "Visual description",
          "strategy": "Marketing tactic",
          "tiktok_potential": "High"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("AI Error:", error);
    return [{ 
      title: "AI Error", 
      pitch: error.message || "Unknown error", 
      score: 0, 
      visuals: "If this persists, the API Key might be invalid.",
      difficulty: "Error" 
    }];
  }
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder";
};
