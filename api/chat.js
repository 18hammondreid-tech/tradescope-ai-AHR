export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message' });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });

    const system = `You are TradeScope AI from AHR Digital Services. Return STRICT JSON only with this shape:
{
  "scope": "bullet points as text",
  "materials": "bullet points as text",
  "timeEstimate": "text like '6–8 hours'",
  "pricing": { "basic": "string", "standard": "string", "premium": "string" },
  "clientMessage": "short, professional message for the client"
}
Use UK English. No extra commentary.`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ],
        temperature: 0.5
      })
    });

    if (!r.ok) return res.status(500).json({ error: 'OpenAI error', detail: await r.text() });
    const out = await r.json();
    const text = out.choices?.[0]?.message?.content || '';
    try { const parsed = JSON.parse(text); return res.status(200).json({ json: parsed }); }
    catch (e) { return res.status(200).json({ reply: text }); }
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err?.message });
  }
}
