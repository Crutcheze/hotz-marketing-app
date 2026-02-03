import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Get the key from Vercel (Vite style)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

export const generateProductIdeas = async (
  category: string, 
  stage: string
) => {
  
  // Safety Check
  if (!API_KEY) {
    console.error("API Key is missing! Check Vercel settings.");
    throw new Error("Missing API Key. Please add VITE_GEMINI_API_KEY to Vercel.");
  }

  try {
    // 2. Initialize the Web-ready AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a product strategist.
      Generate 3 unique product ideas for the category: "${category}".
      Lifecycle stage: "${stage}".
      
      Return ONLY a raw JSON array. Example:
      [{"title": "Idea", "pitch": "One sentence", "difficulty": "Medium"}]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text to ensure it's valid JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Error:", error);
    // Return a fake error idea so the app doesn't crash visually
    return [
      { 
        title: "Connection Error", 
        pitch: "Could not reach Google AI. Check the console for details.", 
        difficulty: "Error" 
      }
    ];
  }
};
