// pages/api/tts.js — OpenAI TTS (replaces ElevenLabs)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text, voice = 'nova' } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' })

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        input: text,
        voice,           // nova | alloy | echo | fable | onyx | shimmer
        instructions:
          'Speak warmly and naturally, like a knowledgeable professional assistant. ' +
          'Use a confident, friendly tone with clear pronunciation. ' +
          'Be expressive and vary your intonation naturally — avoid sounding robotic.',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI TTS error:', response.status, err)
      return res.status(response.status).json({ error: `OpenAI TTS error: ${response.status}` })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audioBuffer.byteLength)
    return res.status(200).send(Buffer.from(audioBuffer))

  } catch (err) {
    console.error('TTS handler error:', err)
    return res.status(500).json({ error: err.message || 'TTS failed' })
  }
}
