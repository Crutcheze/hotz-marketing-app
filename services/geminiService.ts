import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  if (!API_KEY) {
    return [{ title: "Configuration Error", pitch: "Missing API Key", difficulty: "Critical" }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // *** UPDATED: Using the most powerful PRO model ***
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert product strategist.
      Task: Generate 3 high-quality product ideas for the category "${category}".
      Context: The product is in the "${stage}" lifecycle stage.
      
      CRITICAL: Return ONLY a valid JSON array. Do not wrap in markdown code blocks.
      
      Format:
      [
        { 
          "title": "Name of Idea", 
          "pitch": "A compelling 2-sentence pitch.", 
          "difficulty": "Medium" 
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleaning logic to handle cases where the AI adds "```json" anyway
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("AI Error:", error);
    return [
      { 
        title: "Generation Failed", 
        pitch: error.message || "The Pro model is thinking too hard. Try again.", 
        difficulty: "Error" 
      }
    ];
  }
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder_data";
};
