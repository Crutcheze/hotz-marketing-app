import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
  }

  try {
    const { category, stage } = req.body ?? {};

    if (!category) {
      return res.status(400).json({ error: "Missing category" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro-latest" });

    const prompt = `
Act as a product strategist.
Generate 3 ideas for category: "${category}".
Stage: "${stage ?? "discover"}".
Return ONLY a JSON array. No markdown.

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
    const text = result.response.text();
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(clean));
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}
