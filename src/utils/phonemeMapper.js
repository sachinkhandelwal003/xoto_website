// Standard Oculus Visemes:
// viseme_sil, viseme_PP, viseme_FF, viseme_TH, viseme_DD, viseme_kk, viseme_CH, 
// viseme_SS, viseme_nn, viseme_RR, viseme_aa, viseme_E, viseme_I, viseme_O, viseme_U

// Phonetic spelling overrides for common words in all supported languages
const wordPhonetics = {
  // English
  'through': 'throo',
  'everyone': 'evrywan',
  'hello': 'helow',
  'you': 'yoo',
  'your': 'yor',
  'yours': 'yorsz',
  'are': 'ar',
  'our': 'owr',
  'price': 'prys',
  'luxury': 'luxury',
  'penthouse': 'penthows',
  'downtown': 'downtown',
  'developer': 'develper',
  'developers': 'develpers',
  'amenities': 'amenitez',
  'properties': 'proportez',
  'booking': 'buking',
  'fee': 'fee',
  'office': 'ofis',
  'brochure': 'broshur',
  'contact': 'kontakt',
  'schedule': 'shedule',
  'gym': 'jim',
  'pool': 'pool',
  'pools': 'poolz',
  'security': 'sekurity',
  'system': 'sistem',
  'systems': 'sistemz',
  
  // Spanish
  'hola': 'ola',
  'de': 'de',
  
  // French
  'bonjour': 'bonjour',
  'les': 'le',
  'des': 'de',
  'un': 'un',
  'est': 'e',
  'et': 'e'
}

/**
 * Normalizes and applies phonetic rules to a single word based on language.
 */
function preprocessWord(word, lang = 'en') {
  let w = word.toLowerCase().trim()
  if (!w) return ''

  // 1. Direct dictionary override
  if (wordPhonetics[w]) {
    return wordPhonetics[w]
  }

  // 2. Language-specific spelling-to-sound rules
  if (lang === 'es') {
    // Spanish rules
    w = w.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u')
    // 'ch' is kept, other 'h' is silent
    w = w.replace(/ch/g, '_CH_')
    w = w.replace(/h/g, '')
    w = w.replace(/_CH_/g, 'ch')
    // 'll' behaves like 'y' (/j/)
    w = w.replace(/ll/g, 'y')
    // 'ñ' maps to 'n'
    w = w.replace(/ñ/g, 'n')
    // 'rr' behaves like 'r'
    w = w.replace(/rr/g, 'r')
  } else if (lang === 'fr') {
    // French rules
    // silent final consonants for words > 2 chars
    if (w.length > 2 && /[stxdgpz]$/.test(w)) {
      w = w.slice(0, -1)
    }
    // silent final 'ent' for verbs/words > 4 chars
    if (w.length > 4 && w.endsWith('ent')) {
      w = w.slice(0, -3) + 'e'
    }
    w = w.replace(/ch/g, '_CH_')
    w = w.replace(/h/g, '')
    w = w.replace(/_CH_/g, 'ch')
    w = w.replace(/eau/g, 'o').replace(/au/g, 'o')
    w = w.replace(/ou/g, 'u')
    w = w.replace(/oi/g, 'wa')
    w = w.replace(/qu/g, 'k')
  } else if (lang === 'de') {
    // German rules
    w = w.replace(/sch/g, 'sh')
    w = w.replace(/ch/g, 'sh')
    w = w.replace(/ie/g, 'i')
    w = w.replace(/ei/g, 'ay').replace(/ey/g, 'ay')
    w = w.replace(/eu/g, 'oy').replace(/äu/g, 'oy')
    w = w.replace(/w/g, 'v')
    w = w.replace(/v/g, 'f')
    w = w.replace(/z/g, 'ts')
    w = w.replace(/ä/g, 'e')
    w = w.replace(/ö/g, 'oe')
    w = w.replace(/ü/g, 'u')
  } else {
    // English rules
    // Silent 'gh' (preceded by vowel, either at end or before 't')
    w = w.replace(/([aeiou])gh($|t)/g, '$1$2')
    // Silent starting letters
    if (w.startsWith('kn')) w = w.slice(1)
    if (w.startsWith('wr')) w = w.slice(1)
    if (w.startsWith('wh')) w = 'w' + w.slice(2)
    // Silent ending 'b' in 'mb'
    if (w.endsWith('mb')) w = w.slice(0, -1)
    // Suffix replacements
    w = w.replace(/tion/g, 'shn').replace(/sion/g, 'shn')
    w = w.replace(/ing$/g, 'in')
    // Double consonant simplifications
    w = w.replace(/ck/g, 'k')
    // Silent trailing 'e' (for words > 3 chars)
    if (w.length > 3 && w.endsWith('e') && !w.endsWith('ee') && !w.endsWith('le')) {
      w = w.slice(0, -1)
    }
  }

  return w
}

/**
 * Detects if a text contains Hindi (Devanagari) or Arabic characters.
 */
function detectLanguage(text, passedLang = 'en') {
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  return passedLang
}

/**
 * Translates text into standard Oculus speech visemes with durations (in ms).
 * Handles multilingual scripts and silent letters.
 * @param {string} text The sentence to translate
 * @param {string} lang The language code (en, es, fr, de, ar, hi)
 * @returns {Array<{viseme: string, duration: number}>} Array of viseme items
 */
export function textToVisemes(text, lang = 'en') {
  if (!text) return []

  const activeLang = detectLanguage(text, lang)
  const visemes = []

  // Split text into words and punctuation
  const tokens = text.match(/[\u0900-\u097F\u0600-\u06FF\w'\u00C0-\u00FF\u0100-\u017F]+|[^\u0900-\u097F\u0600-\u06FF\w'\u00C0-\u00FF\u0100-\u017F\s]+/g) || []

  for (const token of tokens) {
    // If it's punctuation or spacing, add silence
    if (/^[^\u0900-\u097F\u0600-\u06FF\w']+$/.test(token)) {
      visemes.push({ viseme: 'viseme_sil', duration: 150 })
      continue
    }

    // Process Arabic text
    if (activeLang === 'ar') {
      for (let j = 0; j < token.length; j++) {
        const char = token[j]
        
        // Bilabial
        if ('بم'.includes(char)) {
          visemes.push({ viseme: 'viseme_PP', duration: 110 })
        }
        // Labiodental
        else if ('ف'.includes(char)) {
          visemes.push({ viseme: 'viseme_FF', duration: 130 })
        }
        // Dental/Alveolar
        else if ('تدطضل'.includes(char)) {
          visemes.push({ viseme: 'viseme_DD', duration: 100 })
        }
        // Dental fricatives
        else if ('ثذظ'.includes(char)) {
          visemes.push({ viseme: 'viseme_TH', duration: 120 })
        }
        // Palatal/Postalveolar
        else if ('جش'.includes(char)) {
          visemes.push({ viseme: 'viseme_CH', duration: 150 })
        }
        // Sibilant
        else if ('سصز'.includes(char)) {
          visemes.push({ viseme: 'viseme_SS', duration: 110 })
        }
        // Nasal
        else if ('ن'.includes(char)) {
          visemes.push({ viseme: 'viseme_nn', duration: 110 })
        }
        // Retroflex/Trill
        else if ('ر'.includes(char)) {
          visemes.push({ viseme: 'viseme_RR', duration: 125 })
        }
        // Throat/Velar
        else if ('كقخغحهع'.includes(char)) {
          visemes.push({ viseme: 'viseme_kk', duration: 120 })
        }
        // Vowels & Marks
        else if ('ا\u064e'.includes(char)) { // Alif or Fatha
          visemes.push({ viseme: 'viseme_aa', duration: 140 })
        }
        else if ('و\u064f'.includes(char)) { // Waw or Damma
          visemes.push({ viseme: 'viseme_U', duration: 135 })
        }
        else if ('ي\u0650'.includes(char)) { // Ya or Kasra
          visemes.push({ viseme: 'viseme_I', duration: 120 })
        }
        else {
          // Default consonant placeholder
          visemes.push({ viseme: 'viseme_DD', duration: 90 })
        }
      }
      // Add brief silence/pause between words
      visemes.push({ viseme: 'viseme_sil', duration: 60 })
      continue
    }

    // Process Hindi text
    if (activeLang === 'hi') {
      for (let j = 0; j < token.length; j++) {
        const char = token[j]
        
        // Bilabials
        if ('बभपम'.includes(char)) {
          visemes.push({ viseme: 'viseme_PP', duration: 110 })
        }
        // Labiodentals
        else if ('फ'.includes(char)) {
          visemes.push({ viseme: 'viseme_FF', duration: 130 })
        }
        // Dentals
        else if ('तथदधनल'.includes(char)) {
          visemes.push({ viseme: 'viseme_DD', duration: 100 })
        }
        // Palatals / Shrugs
        else if ('चछजझशष'.includes(char)) {
          visemes.push({ viseme: 'viseme_CH', duration: 150 })
        }
        // Sibilant
        else if ('सज़'.includes(char)) {
          visemes.push({ viseme: 'viseme_SS', duration: 110 })
        }
        // Velar / Throat
        else if ('कखगघह'.includes(char)) {
          visemes.push({ viseme: 'viseme_kk', duration: 120 })
        }
        // Retroflex
        else if ('रड़ढ़'.includes(char)) {
          visemes.push({ viseme: 'viseme_RR', duration: 125 })
        }
        // Vowels
        else if ('अाआा'.includes(char)) {
          visemes.push({ viseme: 'viseme_aa', duration: 140 })
        }
        else if ('एऐेै'.includes(char)) {
          visemes.push({ viseme: 'viseme_E', duration: 140 })
        }
        else if ('इईिी'.includes(char)) {
          visemes.push({ viseme: 'viseme_I', duration: 120 })
        }
        else if ('उऊुू'.includes(char)) {
          visemes.push({ viseme: 'viseme_U', duration: 135 })
        }
        else if ('ओऔोौ'.includes(char)) {
          visemes.push({ viseme: 'viseme_O', duration: 150 })
        }
        else {
          // Default consonant placeholder
          visemes.push({ viseme: 'viseme_DD', duration: 90 })
        }
      }
      visemes.push({ viseme: 'viseme_sil', duration: 60 })
      continue
    }

    // Latin Script Languages (English, Spanish, French, German)
    const phoneticWord = preprocessWord(token, activeLang)
    let i = 0

    while (i < phoneticWord.length) {
      const char = phoneticWord[i]
      const nextChar = phoneticWord[i + 1] || ''
      const twoChars = char + nextChar

      // 1. Digraphs (common multi-letter sounds)
      if (twoChars === 'ph' || twoChars === 'ff') {
        visemes.push({ viseme: 'viseme_FF', duration: 140 })
        i += 2
        continue
      }
      if (twoChars === 'th') {
        visemes.push({ viseme: 'viseme_TH', duration: 120 })
        i += 2
        continue
      }
      if (twoChars === 'ch' || twoChars === 'sh') {
        visemes.push({ viseme: 'viseme_CH', duration: 150 })
        i += 2
        continue
      }
      if (twoChars === 'oo') {
        visemes.push({ viseme: 'viseme_U', duration: 160 })
        i += 2
        continue
      }
      if (twoChars === 'ee' || twoChars === 'ea') {
        visemes.push({ viseme: 'viseme_I', duration: 140 })
        i += 2
        continue
      }
      if (twoChars === 'oe') {
        // German ö placeholder or similar
        visemes.push({ viseme: 'viseme_O', duration: 100 })
        visemes.push({ viseme: 'viseme_E', duration: 80 })
        i += 2
        continue
      }
      if (twoChars === 'ou' || twoChars === 'ow') {
        visemes.push({ viseme: 'viseme_O', duration: 100 })
        visemes.push({ viseme: 'viseme_U', duration: 100 })
        i += 2
        continue
      }
      if (twoChars === 'ay' || twoChars === 'ai') {
        visemes.push({ viseme: 'viseme_I', duration: 140 })
        i += 2
        continue
      }

      // 2. Single characters
      if ('bpm'.includes(char)) {
        visemes.push({ viseme: 'viseme_PP', duration: 110 })
      } else if ('fv'.includes(char)) {
        visemes.push({ viseme: 'viseme_FF', duration: 130 })
      } else if ('szcx'.includes(char)) {
        visemes.push({ viseme: 'viseme_SS', duration: 110 })
      } else if ('tdl'.includes(char)) {
        visemes.push({ viseme: 'viseme_DD', duration: 100 })
      } else if ('kgq'.includes(char)) {
        visemes.push({ viseme: 'viseme_kk', duration: 120 })
      } else if ('r'.includes(char)) {
        visemes.push({ viseme: 'viseme_RR', duration: 125 })
      } else if ('n'.includes(char)) {
        visemes.push({ viseme: 'viseme_nn', duration: 110 })
      } else if ('a'.includes(char)) {
        visemes.push({ viseme: 'viseme_aa', duration: 140 })
      } else if ('e'.includes(char)) {
        visemes.push({ viseme: 'viseme_E', duration: 140 })
      } else if ('i'.includes(char)) {
        visemes.push({ viseme: 'viseme_I', duration: 120 })
      } else if ('o'.includes(char)) {
        visemes.push({ viseme: 'viseme_O', duration: 150 })
      } else if ('uw'.includes(char)) {
        visemes.push({ viseme: 'viseme_U', duration: 135 })
      } else if ('y'.includes(char)) {
        visemes.push({ viseme: 'viseme_I', duration: 120 })
      } else {
        visemes.push({ viseme: 'viseme_DD', duration: 90 })
      }
      i++
    }
    // Small word spacing silence
    visemes.push({ viseme: 'viseme_sil', duration: 60 })
  }

  return visemes
}
