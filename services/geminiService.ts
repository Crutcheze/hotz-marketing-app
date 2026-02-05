export const generateProductIdeas = async (category: string, stage: string) => {
  const res = await fetch("/api/generateProductIdeas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, stage }),
  });

  if (!res.ok) {
    return [
      {
        title: "AI Error",
        pitch: "Server error. Check Vercel logs.",
        score: 0,
        difficulty: "Error",
        visuals: "N/A",
      },
    ];
  }

  return await res.json();
};

export const generateNanoBananaVisual = async (context: string) => {
  return "visual_placeholder";
};
