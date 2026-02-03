import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Get the key safely
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

// 2. Main Function: Generate Ideas
export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  if (!API_KEY) {
    console.error("API Key is missing.");
    return [{ title: "Error", pitch: "Missing API Key", difficulty: "High" }];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a product strategist.
      Generate 3 unique product ideas for the category: "${category}".
      The current lifecycle stage is: "${stage}".
      
      Return ONLY a raw JSON array.
      Example:
      [
        { "title": "Idea Name", "pitch": "One sentence pitch", "difficulty": "Hard" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Error:", error);
    return [
      { title: "AI Error", pitch: "Could not generate ideas. Try again.", difficulty: "High" }
    ];
  }
};

// 3. The Missing Function (Restored to fix build error)
export const generateNanoBananaVisual = async (context: string) => {
  // This is a placeholder to ensure the app builds successfully.
  // Real visual generation would go here.
  return "visual_placeholder_data";
};
