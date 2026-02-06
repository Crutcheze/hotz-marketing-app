// services/geminiService.ts
export type ProductIdea = {
  title: string;
  pitch: string;
  score: number;
  difficulty: string;
  visuals?: string;
  strategy?: string;
  tiktok_potential?: string;
};

export const generateProductIdeas = async (category: string, stage: string) => {
  const res = await fetch("/api/generateProductIdeas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, stage }),
  });

  // Always try to read JSON error body
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return [{
      title: "AI Error",
      pitch: (data?.error as string) || `Server error (${res.status}). Check Vercel logs.`,
      score: 0,
      difficulty: "Error",
      visuals: "N/A",
      strategy: "N/A",
      tiktok_potential: "N/A",
    }];
  }

  // Expect the API to return an array
  return Array.isArray(data) ? data : (data?.ideas ?? []);
};

export const generateNanoBananaVisual = async (context: string) => {
  // placeholder until you implement server-side image gen
  return "visual_placeholder";
};
