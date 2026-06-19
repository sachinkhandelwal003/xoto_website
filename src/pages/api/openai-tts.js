// pages/api/openai-tts.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice = 'nova' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS API error:', response.status, errorText);
      return res.status(response.status).json({ error: `OpenAI error: ${response.status}` });
    }

    // Get the audio array buffer
    const audioBuffer = await response.arrayBuffer();

    // Set correct headers and send binary data
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('OpenAI TTS handler error:', error);
    return res.status(500).json({ error: 'Failed to process OpenAI TTS' });
  }
}
