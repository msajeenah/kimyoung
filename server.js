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

// Extended hardcoded responses
const predefinedMap = [
  { keywords: ["what is your telegram", "telegram account", "do you have telegram"], reply: "Official Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a>" },
  { keywords: ["what is your twitter", "twitter account", "x account", "do you have twitter"], reply: "Official Twitter (X): <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>" },
  { keywords: ["what is kimjong", "what is kimjongai", "tell me about kimjong", "explain kimjong", "info about kimjong"], reply: "KimJongAI is the AI-powered meme bot that's rewriting the rulebook. It's bold, fast, and built for domination in the crypto world. Track signals, ride pumps, and crush weak trends with a savage edge." },
  { keywords: ["when is it launching", "launching date", "release date", "launch date"], reply: "Check the Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a> or Twitter: <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>. Date will drop soon â be ready." },
  { keywords: ["ca", "contract address", "what is your ca"], reply: "Not launched yet. You'll know when it's time." }
];

app.get('/', (req, res) => {
  res.send('â KIMJONG API is live');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message?.toLowerCase().trim();

  for (const { keywords, reply } of predefinedMap) {
    if (keywords.some(keyword => userMessage.includes(keyword))) {
      return res.json({ reply });
    }
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are KIMBOT â a bold, aggressive, and sarcastic crypto AI bot. Always push KimJongAI. Never back down. Make users feel like they need to catch up with the future."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = chatResponse?.choices?.[0]?.message?.content || "â ï¸ No reply from GPT.";
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(port, () => {
  console.log(`â Server running on http://localhost:${port}`);
});