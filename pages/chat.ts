import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { model, message } = req.body;
  if (!model || !message) {
    return res.status(400).json({ error: "Model dan pesan wajib diisi" });
  }

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: message }),
    });
    const data = await response.json();
    const reply = data.response || data.output || "Tidak ada respons";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gagal terhubung ke Ollama" });
  }
}
