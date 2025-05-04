require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Predefined hardcoded responses
const predefinedReplies = {
  "what is your telegram": "Join the Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a>",
  "telegram": "Official Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a>",
  "what is your twitter": "Follow on X: <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>",
  "twitter": "Follow us on X: <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>",
  "what is kimjong coin": "An AI-Driven Meme Coin Like No Other. Meet KimJong Coin — where meme culture meets cutting-edge Artificial Intelligence. At its core is a bold and no-nonsense AI Chat Bot, inspired by the fierce energy of Kim Jong himself.",
  "when is it launching": "Not yet. Watch the telegram like your life depends on it.",
  "launching date": "Not yet. Stay sharp and check the Telegram or X updates."
};

app.get('/', (req, res) => {
  res.send('✅ KIMJONG API is live');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message?.toLowerCase().trim();

  if (predefinedReplies[userMessage]) {
    return res.json({ reply: predefinedReplies[userMessage] });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are KIMBOT — an aggressive, sarcastic crypto bot. Always respond with fierce energy. Make users feel like they should already know about KimJong Coin, and always redirect them back to the coin’s value, launch info, and purpose."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = chatResponse?.choices?.[0]?.message?.content || "⚠️ No reply from GPT.";
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});