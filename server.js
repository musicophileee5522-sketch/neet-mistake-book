// NEET Mistake Book server: serves the page and proxies AI test generation.
// Your Anthropic API key stays here, never in the browser.
const express = require("express");
const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const GKEY = process.env.GEMINI_API_KEY;            // free option
const KEY = process.env.ANTHROPIC_API_KEY;          // paid option
const MODEL = process.env.MODEL || "claude-sonnet-5-5";
const GMODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const LIMIT = +process.env.BATCHES_PER_HOUR || (GKEY ? 12 : 40); // 1 batch = 15 questions
const hits = new Map();

function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 36e5);
  if (arr.length >= LIMIT) return true;
  arr.push(now); hits.set(ip, arr); return false;
}

app.post("/api/generate", async (req, res) => {
  if (!KEY && !GKEY) return res.status(500).json({ error: "Server API key is not set." });
  const prompt = String(req.body.prompt || "");
  if (prompt.length < 50 || prompt.length > 4000 || !prompt.includes("NEET"))
    return res.status(400).json({ error: "Bad request." });
  if (limited(req.ip)) return res.status(429).json({ error: "Hourly test limit reached. Please try again later." });
  try {
    let txt;
    if (GKEY) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GMODEL}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": GKEY, "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      if (r.status === 429) return res.status(429).json({ error: "Free AI quota is busy. Please try again in a few minutes." });
      const d = await r.json();
      if (!r.ok) return res.status(502).json({ error: "AI service error." });
      txt = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("");
    } else {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      if (!r.ok) return res.status(502).json({ error: "AI service error." });
      txt = (d.content || []).map(c => c.text || "").join("");
    }
    const a = txt.indexOf("["), b = txt.lastIndexOf("]");
    res.json({ questions: JSON.parse(txt.slice(a, b + 1)) });
  } catch (e) { res.status(502).json({ error: "Could not generate questions." }); }
});

app.listen(process.env.PORT || 3000, () => console.log("Running"));
