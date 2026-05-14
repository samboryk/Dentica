export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Missing Telegram configuration");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const text = `🦷 Нова заявка з сайту Dentica!\n\n📞 Телефон: ${phone}`;
    const API_URL = `https:

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Telegram API Error:", data);
      return res.status(response.status).json(data);
    }

    
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
