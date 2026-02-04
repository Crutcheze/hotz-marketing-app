import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  if (!API_KEY) {
    return [{ 
      title: "Configuration Error", 
      pitch: "Missing API Key. Check Vercel settings.", 
      score: 0, 
      difficulty: "Error" 
    }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // *** THE FIX: Switch to the classic, universally supported model ***
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a product strategist.
      Generate 3 product ideas for category: "${category}".
      Lifecycle stage: "${stage}".
      
      RETURN JSON ONLY. No markdown. No \`\`\` code blocks.
      
      Required JSON Structure for each idea:
      [
        { 
          "title": "Short Name", 
          "pitch": "One sentence value prop", 
          "score": 8, 
          "difficulty": "Medium",
          "visuals": "Describe the look",
          "strategy": "One tactic",
          "tiktok_potential": "Viral"
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
    return [
      { 
        title: "AI Error", 
        pitch: `Note: ${error.message || "Unknown error"}`, 
        score: 0, 
        visuals: "Try refreshing the page.",
        difficulty: "Error" 
      }
    ];
  }
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder_data";
};
