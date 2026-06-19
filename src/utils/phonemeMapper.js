// utils/phonemeMapper.js

/**
 * Universal Phoneme to Viseme Mapper
 * Supports: English, Spanish, French, German, Arabic, Hindi, and more
 */

// Complete phoneme to viseme mapping for all languages
export const PHONEME_TO_VISEME = {
  // ===== ENGLISH (ARPAbet) =====
  'AA': 'viseme_aa',
  'AE': 'viseme_aa',
  'AH': 'viseme_aa',
  'AO': 'viseme_O',
  'AW': 'viseme_aa',
  'AY': 'viseme_I',
  'B': 'viseme_PP',
  'CH': 'viseme_CH',
  'D': 'viseme_DD',
  'DH': 'viseme_TH',
  'EH': 'viseme_E',
  'ER': 'viseme_RR',
  'EY': 'viseme_E',
  'F': 'viseme_FF',
  'G': 'viseme_kk',
  'HH': 'viseme_kk',
  'IH': 'viseme_I',
  'IY': 'viseme_I',
  'JH': 'viseme_CH',
  'K': 'viseme_kk',
  'L': 'viseme_DD',
  'M': 'viseme_PP',
  'N': 'viseme_nn',
  'NG': 'viseme_kk',
  'OW': 'viseme_O',
  'OY': 'viseme_O',
  'P': 'viseme_PP',
  'R': 'viseme_RR',
  'S': 'viseme_SS',
  'SH': 'viseme_CH',
  'T': 'viseme_DD',
  'TH': 'viseme_TH',
  'UH': 'viseme_U',
  'UW': 'viseme_U',
  'V': 'viseme_FF',
  'W': 'viseme_U',
  'Y': 'viseme_I',
  'Z': 'viseme_SS',
  'ZH': 'viseme_CH',
  'SIL': 'viseme_sil',
  
  // ===== SPANISH =====
  'a': 'viseme_aa',
  'e': 'viseme_E',
  'i': 'viseme_I',
  'o': 'viseme_O',
  'u': 'viseme_U',
  'b': 'viseme_PP',
  'c': 'viseme_kk',
  'd': 'viseme_DD',
  'f': 'viseme_FF',
  'g': 'viseme_kk',
  'h': 'viseme_kk',
  'j': 'viseme_CH',
  'k': 'viseme_kk',
  'l': 'viseme_DD',
  'll': 'viseme_CH',
  'm': 'viseme_PP',
  'n': 'viseme_nn',
  'ñ': 'viseme_nn',
  'p': 'viseme_PP',
  'q': 'viseme_kk',
  'r': 'viseme_RR',
  'rr': 'viseme_RR',
  's': 'viseme_SS',
  't': 'viseme_DD',
  'v': 'viseme_FF',
  'w': 'viseme_U',
  'x': 'viseme_kk',
  'y': 'viseme_I',
  'z': 'viseme_SS',
  
  // ===== FRENCH =====
  'é': 'viseme_E',
  'è': 'viseme_E',
  'ê': 'viseme_E',
  'à': 'viseme_aa',
  'â': 'viseme_aa',
  'î': 'viseme_I',
  'ô': 'viseme_O',
  'û': 'viseme_U',
  'ç': 'viseme_SS',
  'œ': 'viseme_O',
  'æ': 'viseme_aa',
  'ø': 'viseme_E',
  'ÿ': 'viseme_I',
  'ə': 'viseme_aa',
  'ɛ': 'viseme_E',
  'ʒ': 'viseme_CH',
  'ʁ': 'viseme_RR',
  'y': 'viseme_U',
  'ɲ': 'viseme_nn',
  
  // ===== GERMAN =====
  'ä': 'viseme_E',
  'ö': 'viseme_O',
  'ü': 'viseme_U',
  'ß': 'viseme_SS',
  'ø': 'viseme_O',
  'ts': 'viseme_SS',
  
  // ===== ARABIC =====
  'ا': 'viseme_aa',
  'ب': 'viseme_PP',
  'ت': 'viseme_DD',
  'ث': 'viseme_TH',
  'ج': 'viseme_CH',
  'ح': 'viseme_kk',
  'خ': 'viseme_kk',
  'د': 'viseme_DD',
  'ذ': 'viseme_TH',
  'ر': 'viseme_RR',
  'ز': 'viseme_SS',
  'س': 'viseme_SS',
  'ش': 'viseme_CH',
  'ص': 'viseme_SS',
  'ض': 'viseme_DD',
  'ط': 'viseme_DD',
  'ظ': 'viseme_TH',
  'ع': 'viseme_kk',
  'غ': 'viseme_kk',
  'ف': 'viseme_FF',
  'ق': 'viseme_kk',
  'ك': 'viseme_kk',
  'ل': 'viseme_DD',
  'م': 'viseme_PP',
  'ن': 'viseme_nn',
  'ه': 'viseme_kk',
  'و': 'viseme_U',
  'ي': 'viseme_I',
  'aa': 'viseme_aa',
  'θ': 'viseme_TH',
  'ħ': 'viseme_kk',
  'x': 'viseme_kk',
  'ð': 'viseme_TH',
  'ʃ': 'viseme_CH',
  'sˤ': 'viseme_SS',
  'dˤ': 'viseme_DD',
  'tˤ': 'viseme_DD',
  'ðˤ': 'viseme_TH',
  'ʕ': 'viseme_kk',
  'ɣ': 'viseme_kk',
  'q': 'viseme_kk',
  
  // ===== HINDI =====
  'क': 'viseme_kk',
  'ख': 'viseme_kk',
  'ग': 'viseme_kk',
  'घ': 'viseme_kk',
  'च': 'viseme_CH',
  'छ': 'viseme_CH',
  'ज': 'viseme_CH',
  'झ': 'viseme_CH',
  'ट': 'viseme_DD',
  'ठ': 'viseme_DD',
  'ड': 'viseme_DD',
  'ढ': 'viseme_DD',
  'त': 'viseme_DD',
  'थ': 'viseme_TH',
  'द': 'viseme_DD',
  'ध': 'viseme_DD',
  'न': 'viseme_nn',
  'प': 'viseme_PP',
  'फ': 'viseme_FF',
  'ब': 'viseme_PP',
  'भ': 'viseme_PP',
  'म': 'viseme_PP',
  'य': 'viseme_I',
  'र': 'viseme_RR',
  'ल': 'viseme_DD',
  'व': 'viseme_U',
  'श': 'viseme_CH',
  'ष': 'viseme_CH',
  'स': 'viseme_SS',
  'ह': 'viseme_kk',
  'kʰ': 'viseme_kk',
  'gʰ': 'viseme_kk',
  'tʃ': 'viseme_CH',
  'tʃʰ': 'viseme_CH',
  'dʒ': 'viseme_CH',
  'dʒʰ': 'viseme_CH',
  'ʈ': 'viseme_DD',
  'ʈʰ': 'viseme_DD',
  'ɖ': 'viseme_DD',
  'ɖʰ': 'viseme_DD',
  'tʰ': 'viseme_DD',
  'dʰ': 'viseme_DD',
  'pʰ': 'viseme_PP',
  'bʰ': 'viseme_PP',
  'ɲ': 'viseme_nn',
  
  // ===== BASIC CHARACTER MAPPING (Fallback) =====
  'a': 'viseme_aa',
  'b': 'viseme_PP',
  'c': 'viseme_kk',
  'd': 'viseme_DD',
  'e': 'viseme_E',
  'f': 'viseme_FF',
  'g': 'viseme_kk',
  'h': 'viseme_kk',
  'i': 'viseme_I',
  'j': 'viseme_CH',
  'k': 'viseme_kk',
  'l': 'viseme_DD',
  'm': 'viseme_PP',
  'n': 'viseme_nn',
  'o': 'viseme_O',
  'p': 'viseme_PP',
  'q': 'viseme_kk',
  'r': 'viseme_RR',
  's': 'viseme_SS',
  't': 'viseme_DD',
  'u': 'viseme_U',
  'v': 'viseme_FF',
  'w': 'viseme_U',
  'x': 'viseme_kk',
  'y': 'viseme_I',
  'z': 'viseme_SS'
}

// Complete ARKit viseme mapping with all 15 Oculus visemes
export const VISEME_TO_ARKIT = {
  'viseme_sil': {
    jawOpen: 0.0,
    mouthClose: 0.0,
    mouthFunnel: 0.0,
    mouthPucker: 0.0,
    mouthStretchLeft: 0.0,
    mouthStretchRight: 0.0,
    mouthShrugLower: 0.0,
    mouthPressLeft: 0.0,
    mouthPressRight: 0.0,
    mouthRollLower: 0.0,
    mouthSmile: 0.0,
    mouthSmileLeft: 0.0,
    mouthSmileRight: 0.0
  },
  'viseme_PP': {
    jawOpen: 0.05,
    mouthClose: 0.9,
    mouthPressLeft: 0.5,
    mouthPressRight: 0.5,
    mouthShrugLower: 0.1,
    mouthRollLower: 0.05,
    mouthSmile: 0.0
  },
  'viseme_FF': {
    jawOpen: 0.1,
    mouthClose: 0.5,
    mouthRollLower: 0.6,
    mouthShrugLower: 0.4,
    mouthStretchLeft: 0.15,
    mouthStretchRight: 0.15,
    mouthPressLeft: 0.1,
    mouthPressRight: 0.1,
    mouthSmile: 0.05
  },
  'viseme_TH': {
    jawOpen: 0.15,
    mouthClose: 0.2,
    mouthStretchLeft: 0.35,
    mouthStretchRight: 0.35,
    mouthRollLower: 0.15,
    mouthShrugLower: 0.1,
    mouthSmile: 0.05
  },
  'viseme_DD': {
    jawOpen: 0.25,
    mouthStretchLeft: 0.4,
    mouthStretchRight: 0.4,
    mouthClose: 0.15,
    mouthShrugLower: 0.15,
    mouthPressLeft: 0.1,
    mouthPressRight: 0.1,
    mouthSmile: 0.05
  },
  'viseme_kk': {
    jawOpen: 0.3,
    mouthStretchLeft: 0.45,
    mouthStretchRight: 0.45,
    mouthClose: 0.1,
    mouthShrugLower: 0.2,
    mouthPressLeft: 0.15,
    mouthPressRight: 0.15,
    mouthSmile: 0.05
  },
  'viseme_CH': {
    jawOpen: 0.35,
    mouthFunnel: 0.7,
    mouthPucker: 0.3,
    mouthClose: 0.05,
    mouthStretchLeft: 0.15,
    mouthStretchRight: 0.15,
    mouthShrugLower: 0.1,
    mouthSmile: 0.05
  },
  'viseme_SS': {
    jawOpen: 0.12,
    mouthStretchLeft: 0.7,
    mouthStretchRight: 0.7,
    mouthClose: 0.3,
    mouthRollLower: 0.15,
    mouthShrugLower: 0.1,
    mouthSmile: 0.1
  },
  'viseme_nn': {
    jawOpen: 0.2,
    mouthStretchLeft: 0.3,
    mouthStretchRight: 0.3,
    mouthClose: 0.2,
    mouthShrugLower: 0.15,
    mouthRollLower: 0.1,
    mouthSmile: 0.05
  },
  'viseme_RR': {
    jawOpen: 0.25,
    mouthFunnel: 0.3,
    mouthPucker: 0.55,
    mouthClose: 0.1,
    mouthRollLower: 0.2,
    mouthShrugLower: 0.15,
    mouthStretchLeft: 0.1,
    mouthStretchRight: 0.1,
    mouthSmile: 0.05
  },
  'viseme_aa': {
    jawOpen: 0.75,
    mouthOpen: 0.5,
    mouthClose: 0.0,
    mouthFunnel: 0.1,
    mouthStretchLeft: 0.2,
    mouthStretchRight: 0.2,
    mouthShrugLower: 0.1,
    mouthSmile: 0.0
  },
  'viseme_E': {
    jawOpen: 0.45,
    mouthStretchLeft: 0.5,
    mouthStretchRight: 0.5,
    mouthSmile: 0.2,
    mouthSmileLeft: 0.15,
    mouthSmileRight: 0.15,
    mouthClose: 0.05,
    mouthShrugLower: 0.1,
    mouthRollLower: 0.05
  },
  'viseme_I': {
    jawOpen: 0.3,
    mouthStretchLeft: 0.8,
    mouthStretchRight: 0.8,
    mouthSmile: 0.25,
    mouthSmileLeft: 0.2,
    mouthSmileRight: 0.2,
    mouthClose: 0.1,
    mouthShrugLower: 0.05,
    mouthRollLower: 0.05
  },
  'viseme_O': {
    jawOpen: 0.55,
    mouthFunnel: 0.7,
    mouthPucker: 0.4,
    mouthClose: 0.0,
    mouthStretchLeft: 0.15,
    mouthStretchRight: 0.15,
    mouthShrugLower: 0.1,
    mouthSmile: 0.0
  },
  'viseme_U': {
    jawOpen: 0.3,
    mouthPucker: 0.85,
    mouthFunnel: 0.5,
    mouthClose: 0.05,
    mouthStretchLeft: 0.15,
    mouthStretchRight: 0.15,
    mouthShrugLower: 0.1,
    mouthSmile: 0.0
  }
}

// Viseme timing in milliseconds (optimized for natural speech)
export const VISEME_TIMING = {
  'viseme_sil': 60,
  'viseme_PP': 70,
  'viseme_FF': 80,
  'viseme_TH': 90,
  'viseme_DD': 70,
  'viseme_kk': 70,
  'viseme_CH': 85,
  'viseme_SS': 100,
  'viseme_nn': 70,
  'viseme_RR': 95,
  'viseme_aa': 100,
  'viseme_E': 85,
  'viseme_I': 75,
  'viseme_O': 90,
  'viseme_U': 85
}

/**
 * Language-specific phoneme extraction
 */
export function getPhonemesForLanguage(text, language = 'en') {
  const cleanText = text.toLowerCase().trim()
  
  switch(language) {
    case 'en':
      return getEnglishPhonemes(cleanText)
    case 'es':
      return getSpanishPhonemes(cleanText)
    case 'fr':
      return getFrenchPhonemes(cleanText)
    case 'de':
      return getGermanPhonemes(cleanText)
    case 'ar':
      return getArabicPhonemes(cleanText)
    case 'hi':
      return getHindiPhonemes(cleanText)
    default:
      return getBasicPhonemes(cleanText)
  }
}

/**
 * English phoneme extraction (ARPAbet)
 */
function getEnglishPhonemes(text) {
  // This is a simplified version
  // In production, use: https://www.npmjs.com/package/g2p
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    // Simple character to phoneme mapping
    const chars = word.split('')
    chars.forEach(char => {
      if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * Spanish phoneme extraction
 */
function getSpanishPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    let i = 0
    while (i < chars.length) {
      // Check for double letters
      if (i + 1 < chars.length && chars[i] === chars[i + 1]) {
        phonemes.push(chars[i])
        i += 2
      } else {
        phonemes.push(chars[i])
        i++
      }
    }
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * French phoneme extraction
 */
function getFrenchPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    chars.forEach(char => {
      // Handle French specific characters
      if ('éèêàâîôûçœæøÿ'.includes(char)) {
        phonemes.push(char)
      } else if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * German phoneme extraction
 */
function getGermanPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    chars.forEach(char => {
      if ('äöüß'.includes(char)) {
        phonemes.push(char)
      } else if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * Arabic phoneme extraction
 */
function getArabicPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    chars.forEach(char => {
      if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * Hindi phoneme extraction
 */
function getHindiPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    chars.forEach(char => {
      if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * Basic phoneme extraction (fallback for unsupported languages)
 */
function getBasicPhonemes(text) {
  const words = text.split(/\s+/)
  const phonemes = []
  
  words.forEach((word, index) => {
    const chars = word.split('')
    chars.forEach(char => {
      if (PHONEME_TO_VISEME[char]) {
        phonemes.push(char)
      }
    })
    if (index < words.length - 1) {
      phonemes.push('SIL')
    }
  })
  
  return phonemes
}

/**
 * Main function: Convert text to visemes with timing
 */
export function textToVisemes(text, language = 'en') {
  if (!text) return []
  
  // Get phonemes for the language
  const phonemes = getPhonemesForLanguage(text, language)
  
  if (!phonemes || phonemes.length === 0) {
    return [{ viseme: 'viseme_sil', duration: 500 }]
  }
  
  const visemes = []
  
  // Add initial silence
  visemes.push({ viseme: 'viseme_sil', duration: 80 })
  
  // Convert phonemes to visemes with timing
  phonemes.forEach((phoneme, index) => {
    const viseme = PHONEME_TO_VISEME[phoneme] || 'viseme_sil'
    const duration = VISEME_TIMING[viseme] || 80
    
    // Add slight variation for natural feel
    const variation = (Math.random() - 0.5) * 10
    const finalDuration = Math.max(40, duration + variation)
    
    visemes.push({ 
      viseme, 
      duration: finalDuration 
    })
    
    // Add micro-pauses between words
    if (phoneme === 'SIL' && index < phonemes.length - 1) {
      // SIL already handled
    }
  })
  
  // Add final silence
  visemes.push({ viseme: 'viseme_sil', duration: 120 })
  
  return visemes
}

/**
 * Professional: Convert text to visemes with exact timing from TTS
 */
export function createVisemesFromPhonemeTiming(phonemeTiming) {
  if (!phonemeTiming || phonemeTiming.length === 0) {
    return [{ viseme: 'viseme_sil', duration: 500 }]
  }
  
  const visemes = []
  
  phonemeTiming.forEach((item, index) => {
    const viseme = PHONEME_TO_VISEME[item.phoneme] || 'viseme_sil'
    const duration = (item.end - item.start) * 1000 // Convert to ms
    
    visemes.push({
      viseme,
      duration: Math.max(20, duration),
      start: item.start,
      end: item.end
    })
  })
  
  return visemes
}

/**
 * Get viseme name from phoneme
 */
export function phonemeToVisemeName(phoneme) {
  return PHONEME_TO_VISEME[phoneme] || 'viseme_sil'
}

/**
 * Get ARKit blend shape values for a viseme
 */
export function getVisemeBlendShapes(visemeName, intensity = 1.0) {
  const shapes = VISEME_TO_ARKIT[visemeName] || VISEME_TO_ARKIT['viseme_sil']
  
  // Scale by intensity
  const scaledShapes = {}
  Object.entries(shapes).forEach(([key, value]) => {
    scaledShapes[key] = value * intensity
  })
  
  return scaledShapes
}

/**
 * Blend between two visemes
 */
export function blendVisemes(viseme1, viseme2, blendFactor) {
  const shapes1 = VISEME_TO_ARKIT[viseme1] || VISEME_TO_ARKIT['viseme_sil']
  const shapes2 = VISEME_TO_ARKIT[viseme2] || VISEME_TO_ARKIT['viseme_sil']
  
  const blendedShapes = {}
  const allKeys = new Set([...Object.keys(shapes1), ...Object.keys(shapes2)])
  
  allKeys.forEach(key => {
    const val1 = shapes1[key] || 0
    const val2 = shapes2[key] || 0
    blendedShapes[key] = val1 * (1 - blendFactor) + val2 * blendFactor
  })
  
  return blendedShapes
}

// Export default for convenience
export default {
  PHONEME_TO_VISEME,
  VISEME_TO_ARKIT,
  VISEME_TIMING,
  textToVisemes,
  getPhonemesForLanguage,
  phonemeToVisemeName,
  getVisemeBlendShapes,
  blendVisemes,
  createVisemesFromPhonemeTiming
}