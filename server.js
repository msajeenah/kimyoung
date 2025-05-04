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
  const userMessage = req.body.message;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    });

    const reply = chatResponse?.choices?.[0]?.message?.content || "⚠️ No response from OpenAI.";
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
