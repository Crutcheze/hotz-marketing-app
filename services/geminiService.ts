import { GoogleGenerativeAI } from "@google/genai";

// 1. safely get the key (checking both possible names)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("CRITICAL ERROR: API Key is missing. Check Vercel Environment Variables.");
}

// 2. Initialize the AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateProductIdeas = async (
  category: string, 
  stage: string,
  existingIdeas: any[] = [] // Optional context
) => {
  
  if (!API_KEY) {
    throw new Error("Missing API Key. Please add VITE_GEMINI_API_KEY to Vercel.");
  }

  try {
    const prompt = `
      You are a world-class product strategist.
      Generate 3 unique, tangible product ideas for the category: "${category}".
      The current lifecycle stage is: "${stage}".
      
      Return ONLY a raw JSON array. No markdown, no "json" tags.
      Example format:
      [
        { "title": "Idea Name", "pitch": "One sentence pitch", "difficulty": "Hard" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the text if the AI adds ```json markers
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Error:", error);
    // Fallback so the app doesn't crash
    return [
      { title: "Error Connecting to AI", pitch: "Check API Key configuration", difficulty: "High" }
    ];
  }
};
