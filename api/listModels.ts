export default async function handler(req: any, res: any) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  );
  const text = await r.text();
  return res.status(r.status).send(text);
}
