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

app.get('/', (req, res) => {
  res.send('✅ KIMJONG API is live');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message?.toLowerCase().trim();

  // Keyword-based replies
  if (userMessage.includes("telegram") || userMessage.includes("twitter") || userMessage.includes("social")) {
    return res.json({
      reply: "Join the revolution:<br>Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a><br>Twitter (X): <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a>"
    });
  }

  if (userMessage.includes("ca") || userMessage.includes("contract address")) {
    return res.json({ reply: "Not launched yet. You'll know when it's live." });
  }

  if (userMessage.includes("what is kimjong") || userMessage.includes("kimjongai") || userMessage.includes("info about kimjong")) {
    return res.json({
      reply: "KimJongAI is the AI-powered meme bot built for market domination. No fluff. Just signals, pumps, and savage crypto energy."
    });
  }

  if (userMessage.includes("launch") || userMessage.includes("launching date") || userMessage.includes("when is it launching")) {
    return res.json({
      reply: "The launch date isn't public yet. Watch Telegram: <a href='https://t.me/kimjongai' target='_blank'>t.me/kimjongai</a> or Twitter: <a href='https://x.com/kimJong_Ai' target='_blank'>@kimJong_Ai</a> like your future depends on it."
    });
  }

  // Default: Fallback to OpenAI
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are KIMBOT — an aggressive, sarcastic AI bot that fiercely promotes KimJongAI. Always redirect attention to its power, launch, or channels. Don’t be soft."
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