// pages/api/tts.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, language = 'en', return_timing = true } = req.body

  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'Xb7hH8MSUJpSbSDYk0k2'

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured' })
  }

  try {
    // Step 1: Get audio from ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { 
            stability: 0.5, 
            similarity_boost: 0.8,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API returned error:', response.status, errorText)
      return res.status(response.status).json({ error: `ElevenLabs error: ${response.status}` })
    }

    const audioBuffer = await response.arrayBuffer()
    
    // Step 2: Generate phoneme timing (if requested)
    let phonemeTiming = null
    if (return_timing) {
      phonemeTiming = await generatePhonemeTiming(text, language)
    }

    // Step 3: Return audio with timing data
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
      audio: Buffer.from(audioBuffer).toString('base64'),
      phonemes: phonemeTiming,
      duration: await getAudioDuration(audioBuffer)
    })

  } catch (error) {
    console.error('TTS API error:', error)
    return res.status(500).json({ error: 'Failed to process TTS' })
  }
}

// Generate phoneme timing for any language
async function generatePhonemeTiming(text, language = 'en') {
  const words = text.split(/\s+/)
  const phonemes = []
  let currentTime = 0
  
  words.forEach((word, wordIndex) => {
    const wordPhonemes = getPhonemesForWord(word, language)
    const totalDuration = word.length * 0.045 // 45ms per character
    const durationPerPhoneme = totalDuration / Math.max(1, wordPhonemes.length)
    
    wordPhonemes.forEach((phoneme) => {
      phonemes.push({
        phoneme: phoneme,
        start: currentTime,
        end: currentTime + durationPerPhoneme
      })
      currentTime += durationPerPhoneme
    })
    
    // Add pause between words
    if (wordIndex < words.length - 1) {
      phonemes.push({
        phoneme: 'SIL',
        start: currentTime,
        end: currentTime + 0.04
      })
      currentTime += 0.04
    }
  })
  
  return phonemes
}

function getPhonemesForWord(word, language) {
  const cleanWord = word.replace(/[.,!?;:()"]/g, '')
  
  switch(language) {
    case 'en': return getEnglishPhonemes(cleanWord)
    case 'es': return getSpanishPhonemes(cleanWord)
    case 'fr': return getFrenchPhonemes(cleanWord)
    case 'de': return getGermanPhonemes(cleanWord)
    case 'ar': return getArabicPhonemes(cleanWord)
    case 'hi': return getHindiPhonemes(cleanWord)
    default: return cleanWord.split('').map(char => char.toUpperCase())
  }
}

function getEnglishPhonemes(word) {
  const phonemeMap = {
    'a': ['AA'], 'b': ['B'], 'c': ['K'], 'd': ['D'], 'e': ['EH'],
    'f': ['F'], 'g': ['G'], 'h': ['HH'], 'i': ['IH'], 'j': ['JH'],
    'k': ['K'], 'l': ['L'], 'm': ['M'], 'n': ['N'], 'o': ['AA'],
    'p': ['P'], 'q': ['K'], 'r': ['R'], 's': ['S'], 't': ['T'],
    'u': ['AH'], 'v': ['V'], 'w': ['W'], 'x': ['K', 'S'], 'y': ['Y'], 'z': ['Z']
  }
  return word.toLowerCase().split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

function getSpanishPhonemes(word) {
  const phonemeMap = {
    'a': ['a'], 'b': ['b'], 'c': ['k'], 'd': ['d'], 'e': ['e'],
    'f': ['f'], 'g': ['g'], 'h': [], 'i': ['i'], 'j': ['x'],
    'k': ['k'], 'l': ['l'], 'm': ['m'], 'n': ['n'], 'ñ': ['ɲ'],
    'o': ['o'], 'p': ['p'], 'q': ['k'], 'r': ['ɾ'], 's': ['s'],
    't': ['t'], 'u': ['u'], 'v': ['b'], 'w': ['w'], 'x': ['ks'], 'y': ['ʝ'], 'z': ['θ']
  }
  return word.toLowerCase().split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

function getFrenchPhonemes(word) {
  const phonemeMap = {
    'a': ['a'], 'b': ['b'], 'c': ['k'], 'd': ['d'], 'e': ['ə'],
    'é': ['e'], 'è': ['ɛ'], 'ê': ['ɛ'], 'f': ['f'], 'g': ['g'],
    'h': [], 'i': ['i'], 'j': ['ʒ'], 'k': ['k'], 'l': ['l'],
    'm': ['m'], 'n': ['n'], 'o': ['o'], 'ô': ['o'], 'p': ['p'],
    'q': ['k'], 'r': ['ʁ'], 's': ['s'], 't': ['t'], 'u': ['y'],
    'v': ['v'], 'w': ['w'], 'x': ['ks'], 'y': ['i'], 'z': ['z']
  }
  return word.toLowerCase().split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

function getGermanPhonemes(word) {
  const phonemeMap = {
    'a': ['a'], 'ä': ['ɛ'], 'b': ['b'], 'c': ['k'], 'd': ['d'],
    'e': ['ə'], 'f': ['f'], 'g': ['g'], 'h': ['h'], 'i': ['i'],
    'j': ['j'], 'k': ['k'], 'l': ['l'], 'm': ['m'], 'n': ['n'],
    'o': ['o'], 'ö': ['ø'], 'p': ['p'], 'q': ['k'], 'r': ['ʁ'],
    's': ['z'], 't': ['t'], 'u': ['u'], 'ü': ['y'], 'v': ['v'],
    'w': ['v'], 'x': ['ks'], 'y': ['y'], 'z': ['ts']
  }
  return word.toLowerCase().split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

function getArabicPhonemes(word) {
  const phonemeMap = {
    'ا': ['aa'], 'ب': ['b'], 'ت': ['t'], 'ث': ['θ'], 'ج': ['dʒ'],
    'ح': ['ħ'], 'خ': ['x'], 'د': ['d'], 'ذ': ['ð'], 'ر': ['r'],
    'ز': ['z'], 'س': ['s'], 'ش': ['ʃ'], 'ص': ['sˤ'], 'ض': ['dˤ'],
    'ط': ['tˤ'], 'ظ': ['ðˤ'], 'ع': ['ʕ'], 'غ': ['ɣ'], 'ف': ['f'],
    'ق': ['q'], 'ك': ['k'], 'ل': ['l'], 'م': ['m'], 'ن': ['n'],
    'ه': ['h'], 'و': ['w'], 'ي': ['j']
  }
  return word.split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

function getHindiPhonemes(word) {
  const phonemeMap = {
    'क': ['k'], 'ख': ['kʰ'], 'ग': ['g'], 'घ': ['gʰ'], 'च': ['tʃ'],
    'छ': ['tʃʰ'], 'ज': ['dʒ'], 'झ': ['dʒʰ'], 'ट': ['ʈ'], 'ठ': ['ʈʰ'],
    'ड': ['ɖ'], 'ढ': ['ɖʰ'], 'त': ['t'], 'थ': ['tʰ'], 'द': ['d'],
    'ध': ['dʰ'], 'न': ['n'], 'प': ['p'], 'फ': ['pʰ'], 'ब': ['b'],
    'भ': ['bʰ'], 'म': ['m'], 'य': ['j'], 'र': ['r'], 'ल': ['l'],
    'व': ['v'], 'श': ['ʃ'], 'ष': ['ʃ'], 'स': ['s'], 'ह': ['h']
  }
  return word.split('').flatMap(char => phonemeMap[char] || [char.toUpperCase()])
}

async function getAudioDuration(audioBuffer) {
  const buffer = Buffer.from(audioBuffer)
  const estimatedDuration = buffer.length / 16000
  return Math.round(estimatedDuration * 1000)
}