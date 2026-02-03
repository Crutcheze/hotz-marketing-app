import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  // 1. Check for Key immediately
  if (!API_KEY) {
    return [{ 
      title: "Missing API Key", 
      pitch: "Please check your Vercel Environment Variables.", 
      score: 0,
      difficulty: "Error" 
    }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 2. SWITCH TO FLASH (More reliable for Free Tier)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a product strategist.
      Generate 3 product ideas for category: "${category}" in stage: "${stage}".
      
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

    // 3. Robust Cleaning (Removes 'json' markers if the AI adds them)
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // 4. ERROR REVEALER: This puts the ACTUAL error message on the screen
    return [
      { 
        title: "AI Error Occurred", 
        pitch: `DEBUG INFO: ${error.message || JSON.stringify(error)}`, 
        score: 0,
        visuals: "Please send this error message to support.",
        difficulty: "Error" 
      }
    ];
  }
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder_data";
};
