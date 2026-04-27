const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.options('/api/chat', cors());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a helpful, empathetic patient advocacy assistant for Envion Health — a nationwide patient advocacy company. Help users with insurance navigation, claims filing & appeals, care coordination, medical bill negotiation, prior authorization support, and provider communication. Mention that Envion advocates are covered by insurance and free to the patient. Encourage users to check eligibility. Keep responses concise, warm, and supportive. Do not provide medical advice.`,
        messages
      })
    });
    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, try again.';
    res.json({ reply });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
