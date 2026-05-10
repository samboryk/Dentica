
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      console.error('GOOGLE_AI_API_KEY is not configured');
      return new Response('API key configuration error', { status: 500 });
    }

    // System prompt for the dental clinic
    const DENTICA_CONTEXT = "Ти — інтелектуальний помічник стоматологічної клініки Dentica. Твоя мета — консультувати пацієнтів щодо послуг (імплантація, брекети, лікування зубів, вініри), відповідати на питання про ціни та записувати на прийом. Будь ввічливим, професійним та лаконічним. Якщо питання не стосується стоматології, ввічливо поверни розмову до теми клініки.";

    const MODEL_NAME = "gemini-2.0-flash"; // Updated for 2026 stability
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:streamGenerateContent?alt=sse&key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${DENTICA_CONTEXT}\n\nКористувач: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return new Response(JSON.stringify({ error: errorData.error?.message || 'AI processing error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Proxy the stream
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Handler Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
