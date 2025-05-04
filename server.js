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
  "tell me about the meme coin": "KimJong Coin is an AI-powered meme revolution — made to dominate, disrupt, and annihilate weak projects. Built on sarcasm and real-time trading alerts.",
  "when is it launching": "Check the Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a> or Twitter: <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>. Date will drop like a bomb.",
  "launching date": "Not public yet. Stay tuned on <a href='https://t.me/kimjongai' target='_blank'>Telegram</a> or <a href='https://x.com/kimJong_Ai' target='_blank'>X</a>.",
  "what is your ca": "Not launched yet. If you had it, you'd already be rich.",
  "ca": "Not launched yet. Stop asking like you're early. Be patient."
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
          content: "You are KIMBOT — an aggressive, sarcastic crypto bot. You talk like a meme warlord. Be blunt, be fierce, and make everything circle back to KimJong Coin's superiority. Push users to follow socials and wait for the launch."
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