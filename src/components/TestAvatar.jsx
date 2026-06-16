import React, { useState, useRef, useCallback, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useRouter } from 'next/router'
import Avatar from './Avatar'
import { getAnswer } from '@/answers'

// Error Boundary for the 3D Canvas
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Scene Load Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '24px',
          textAlign: 'center',
          background: 'rgba(15, 15, 30, 0.95)',
          color: '#ef4444',
          borderRadius: 12,
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <h3 style={{ fontSize: 18, color: '#f8fafc', marginBottom: 8 }}>3D Avatar Load Failed</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
            Make sure the avatar model is copied in:
            <code style={{
              display: 'block',
              background: 'rgba(0,0,0,0.3)',
              padding: 10,
              borderRadius: 8,
              margin: '8px 0',
              fontFamily: 'monospace',
              color: '#38bdf8',
              fontSize: 12,
              wordBreak: 'break-all'
            }}>
              public/avatars/brunette.glb
            </code>
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry Loading
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const langSpeechMap = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ar: 'ar-AE',
  hi: 'hi-IN'
}

const welcomeMessages = {
  en: 'Hello! I am Xobia, your AI property assistant from Xoto. How can I help you find your dream property today?',
  es: '¡Hola! Soy Xobia, su asistente de propiedad de IA de Xoto. ¿Cómo puedo ayudarle a encontrar su propiedad ideal hoy?',
  fr: 'Bonjour ! Je suis Xobia, votre assistante immobilière IA de Xoto. Comment puis-je vous aider à trouver votre propriété idéale aujourd\'hui ?',
  de: 'Hallo! Ich bin Xobia, Ihre KI-Immobilienberaterin von Xoto. Wie kann ich Ihnen helfen, Ihre Traumimmobilie zu finden?',
  ar: 'مرحباً! أنا زوبيا (Xobia)، مساعدتك الذكية للعقارات من زوتو. كيف يمكنني مساعدتك في العثور على عقارك المثالي اليوم؟',
  hi: 'नमस्ते! मैं ज़ोब्या (Xobia) हूँ, Xoto से आपकी एआई प्रॉपर्टी सहायक। आज आपके सपनों का घर खोजने में मैं आपकी क्या मदद कर सकती हूँ?'
}

export default function TestAvatar() {
  const router = useRouter()
  const [status, setStatus] = useState('idle')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [avatarText, setAvatarText] = useState('')
  const [inputText, setInputText] = useState('')
  const [selectedLang, setSelectedLang] = useState('en')
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', text: welcomeMessages.en }
  ])
  const [debugMsg, setDebugMsg] = useState('')
  const [analyser, setAnalyser] = useState(null)

  const morphRef = useRef(null)
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)

  // Navigation Intents Matcher
  const checkNavigation = (query) => {
    const q = query.toLowerCase().trim()
    
    // Keywords for different routes
    const navKeywords = {
      store: ['store', 'shop', 'ecommerce', 'product', 'buy product', 'tienda', 'boutique', 'acheter', 'achat', 'kaufen', 'einkaufen', 'متجر', 'تسوق', 'شॉप', 'स्टोर', 'खरीदें'],
      properties: ['buy property', 'buy home', 'buy house', 'buy apartment', 'properties', 'real estate', 'sale', 'propiedades', 'comprar casa', 'acheter maison', 'haus kaufen', 'عقارات للبيع', 'شراء عقار', 'प्रॉपर्टी', 'घर खरीदें'],
      rent: ['rent', 'rental', 'lease', 'alquiler', 'rentar', 'louer', 'location', 'mieten', 'vermietung', 'إيجار', 'عقارات للإيجار', 'किराया', 'किराए'],
      aiPlanner: ['ai planner', 'planner', 'plan property', 'design planner', 'landscape planner', 'interior design tool', 'planificador', 'planificateur', 'planung', 'مخطط ذكي', 'एआई प्लानर'],
      designs: ['designs', 'design showcase', 'interior designs', 'landscaping designs', 'gallery', 'diseños', 'galerie', 'تصاميم', 'डिज़ाइन'],
      mortgages: ['mortgage', 'mortgages', 'loan', 'finance', 'hipoteca', 'préstamo', 'prêt', 'kredit', 'hypothek', 'رهن عقاري', 'تمويل', 'लोन', 'बंधक'],
      contact: ['contact', 'email', 'phone', 'call', 'reach', 'contacto', 'téléphone', 'anrufen', 'telefon', 'اتصال', 'संपर्क', 'कॉल'],
      about: ['about', 'learn more', 'who are you', 'company', 'xoto', 'sobre nosotros', 'à propos', 'über uns', 'من نحن', 'अबाउट', 'बारे में'],
      'how-it-works': ['how it works', 'how does it work', 'process', 'guide', 'cómo funciona', 'comment ça marche', 'funktionsweise', 'كيف يعمل', 'कैसे काम करता है'],
      quotation: ['quote', 'quotation', 'pricing', 'estimate', 'cotización', 'devis', 'angebot', 'تسعير', 'कोटेशन', 'कीमत का अनुमान']
    }

    const navResponses = {
      en: {
        store: "Navigating you to our store page now. Have a great time shopping!",
        properties: "Opening our properties page. Let's find your dream home!",
        rent: "Sure, let me redirect you to our rental listings.",
        aiPlanner: "I will open our AI Planner tool for you now.",
        designs: "Taking you to our design showcase page.",
        mortgages: "Let me redirect you to our mortgages page to explore financing options.",
        contact: "Redirecting you to our contact page to get in touch with our team.",
        about: "Navigating you to our about page to learn more about Xoto.",
        'how-it-works': "Taking you to our how it works page to guide you through the process.",
        quotation: "Sure, redirecting you to our quotation page to request a detailed estimate."
      },
      es: {
        store: "Dirigiéndole a nuestra tienda ahora. ¡Que disfrute de sus compras!",
        properties: "Abriendo nuestra página de propiedades en venta. ¡Encontrará su propiedad ideal!",
        rent: "Le redirijo a nuestros listados de alquiler.",
        aiPlanner: "Le abriré nuestra herramienta de planificador de IA ahora.",
        designs: "Llevándole a nuestra página de exhibición de diseños.",
        mortgages: "Permítame redirigirle a nuestra página de hipotecas.",
        contact: "Redirigiéndole a nuestra página de contacto.",
        about: "Dirigiéndole a nuestra página de información.",
        'how-it-works': "Llevándole a la página de cómo funciona.",
        quotation: "Redirigiéndole a la página de cotización."
      },
      fr: {
        store: "Je vous dirige vers notre boutique en ligne. Bon shopping !",
        properties: "Ouverture de notre page de propriétés. Trouvons la maison de vos rêves !",
        rent: "Laissez-moi vous rediriger vers nos locations disponibles.",
        aiPlanner: "Je vais ouvrir notre outil de planification IA maintenant.",
        designs: "Je vous emmène vers notre galerie de designs.",
        mortgages: "Laissez-moi vous rediriger vers notre page de prêts immobiliers.",
        contact: "Redirection vers notre page de contact.",
        about: "Je vous dirige vers notre page de présentation pour en savoir plus.",
        'how-it-works': "Je vous emmène vers la page explicative de notre fonctionnement.",
        quotation: "Redirection vers notre page de demande de devis."
      },
      de: {
        store: "Ich leite Sie jetzt zu unserem Shop weiter. Viel Spaß beim Einkaufen!",
        properties: "Öffne unsere Immobilienseite. Lassen Sie uns Ihre Traumimmobilie finden!",
        rent: "Ich leite Sie zu unseren Mietangeboten weiter.",
        aiPlanner: "Ich öffne jetzt unser KI-Planungstool für Sie.",
        designs: "Ich bringe Sie zu unserer Design-Galerie.",
        mortgages: "Ich leite Sie zu unserer Hypothekenseite weiter.",
        contact: "Ich leite Sie zu unserer Kontaktseite weiter.",
        about: "Leite Sie zu unserer Über-uns-Seite weiter.",
        'how-it-works': "Ich bringe Sie zu unserer Funktionsweise-Seite.",
        quotation: "Leite Sie zu unserer Angebotsseite weiter."
      },
      ar: {
        store: "سأوجهك الآن إلى صفحة المتجر الخاص بنا. تسوقاً ممتعاً!",
        properties: "أفتح صفحة العقارات المتاحة للبيع الآن. لنجد عقار أحلامك!",
        rent: "بالتأكيد، سأقوم بتوجيهك إلى عقارات الإيجار.",
        aiPlanner: "سأقوم بفتح أداة التخطيط الذكي الخاصة بنا الآن.",
        designs: "أوجهك إلى صفحة معرض التصاميم المتميزة.",
        mortgages: "سأقوم بنقلك إلى صفحة القروض العقارية لمعرفة خيارات التمويل.",
        contact: "أوجهك إلى صفحة اتصل بنا للتواصل مع فريقنا.",
        about: "أنقلك لصفحة من نحن لمعرفة المزيد عن Xoto.",
        'how-it-works': "أوجهك لصفحة كيفية العمل لمساعدتك في فهم العملية.",
        quotation: "بالتأكيد، سأوجهك لصفحة طلب عرض الأسعار."
      },
      hi: {
        store: "मैं आपको हमारे स्टोर पेज पर ले जा रही हूँ। खरीदारी का आनंद लें!",
        properties: "मैं हमारे प्रॉपर्टीज़ पेज को खोल रही हूँ। चलिए आपके सपनों का घर ढूंढते हैं!",
        rent: "ज़रूर, मैं आपको किराए के लिए उपलब्ध घरों की सूची पर ले जाती हूँ।",
        aiPlanner: "मैं आपके लिए हमारा एआई प्लानर टूल खोल रही हूँ।",
        designs: "आपको हमारे डिज़ाइन गैलरी पेज पर ले जा रही हूँ।",
        mortgages: "लोन और फाइनेंस के विकल्पों के लिए मैं आपको हमारे होम लोन पेज पर ले चलती हूँ।",
        contact: "हमारी टीम से संपर्क करने के लिए आपको संपर्क पेज पर ले जा रही हूँ।",
        about: "Xoto के बारे में अधिक जानने के लिए हमारे 'अबाउट' पेज पर चलें।",
        'how-it-works': "यह कैसे काम करता है, यह समझने के लिए मैं आपको गाइड पेज पर ले चलती हूँ।",
        quotation: "ज़रूर, विस्तृत अनुमान के लिए मैं आपको कोटेशन पेज पर ले जाती हूँ।"
      }
    }

    const routeMap = {
      store: '/store',
      properties: '/properties',
      rent: '/rent',
      aiPlanner: '/aiPlanner',
      designs: '/designs',
      mortgages: '/mortgages',
      contact: '/contact',
      about: '/about',
      'how-it-works': '/how-it-works',
      quotation: '/quotation'
    }

    for (const [key, kws] of Object.entries(navKeywords)) {
      if (kws.some(kw => q.includes(kw))) {
        const langRes = navResponses[selectedLang] || navResponses['en']
        return {
          route: routeMap[key],
          response: langRes[key]
        }
      }
    }
    return null
  }
  const visualizerCanvasRef = useRef(null)
  const chatEndRef = useRef(null)

  // Update welcome message when language changes
  useEffect(() => {
    setChatLog([
      { role: 'assistant', text: welcomeMessages[selectedLang] || welcomeMessages.en }
    ])
    setDebugMsg(`Switched language to: ${selectedLang.toUpperCase()}`)
  }, [selectedLang])

  // Scroll to bottom of chat log
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

  // ── Initialize Audio Graph (Single Instance to prevent GC) ────────────────────
  const initAudioGraph = useCallback(() => {
    if (audioRef.current) return

    console.log('Initializing Web Audio Graph...');
    const audio = new Audio()
    audioRef.current = audio

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const analyserNode = ctx.createAnalyser()
      analyserNode.fftSize = 64
      analyserRef.current = analyserNode

      const sourceNode = ctx.createMediaElementSource(audio)
      sourceNode.connect(analyserNode)
      analyserNode.connect(ctx.destination)
      
      sourceRef.current = sourceNode 
      setAnalyser(analyserNode)
      console.log('Audio Graph initialized successfully ✅');
    } catch (e) {
      console.error('Failed to initialize Audio Graph:', e)
    }
  }, [])

  // ── Browser TTS (Fallback) ──────────────────────────────────────
  const browserSpeak = (text) => {
    console.log('Using Browser Speech Synthesis fallback...');
    setDebugMsg('🔊 Playing audio (Browser Speech)...')
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Choose appropriate voice language
    utterance.lang = langSpeechMap[selectedLang] || 'en-US'
    
    utterance.onstart = () => {
      setIsSpeaking(true)
      setStatus('speaking')
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setStatus('idle')
      setAvatarText('')
      setDebugMsg('✅ Done speaking')
    }

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e)
      setIsSpeaking(false)
      setStatus('idle')
      setDebugMsg('❌ Speech synthesis failed')
    }

    window.speechSynthesis.speak(utterance)
  }

  // ── Secure Server-Side TTS calling ──────────────────────────────────────────────
  const speakWithElevenLabs = useCallback(async (text) => {
    setDebugMsg('Calling TTS API...')
    setStatus('speaking')
    // Set text early so Avatar pre-computes visemes, but keep isSpeaking=false
    // so the mouth stays closed while we wait for the audio to load.
    setAvatarText(text)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      console.log('TTS response status:', response.status)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        console.warn('TTS API failed, falling back to browser synthesis. Error:', errData.error || response.statusText)
        setDebugMsg(`⚠️ API unavailable (using browser voice)`)
        browserSpeak(text)
        return
      }

      const blob = await response.blob()
      console.log('Audio blob size:', blob.size)
      setDebugMsg(`✅ Audio received!`)

      const url = URL.createObjectURL(blob)

      initAudioGraph()

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      audioRef.current.pause()
      audioRef.current.src = url

      audioRef.current.onplay = () => {
        // Only start lip sync when audio is actually playing — this is the source of truth.
        setIsSpeaking(true)
        setDebugMsg('🔊 Speaking...')
      }

      audioRef.current.onended = () => {
        setIsSpeaking(false)
        setStatus('idle')
        setAvatarText('')
        setDebugMsg('✅ Done speaking')
        URL.revokeObjectURL(url)
      }

      audioRef.current.onerror = (e) => {
        console.error('Audio play error:', e)
        setDebugMsg('❌ Audio playback failed. Falling back...')
        browserSpeak(text)
      }

      await audioRef.current.play()

    } catch (err) {
      console.error('TTS Connection Error:', err)
      setDebugMsg(`❌ Connection failed. Falling back...`)
      browserSpeak(text)
    }
  }, [selectedLang, initAudioGraph])

  // ── Handle sending message ──────────────────────────────────────
  const handleSendText = async (textToSend) => {
    const query = textToSend || inputText
    if (!query.trim()) return

    setChatLog(prev => [...prev, { role: 'user', text: query }])
    setInputText('')
    setStatus('thinking')
    setDebugMsg('Consulting Xoto AI...')

    // Cancel current speaking if any
    if (audioRef.current) audioRef.current.pause()
    window.speechSynthesis.cancel()

    // Short simulated delays
    await new Promise(r => setTimeout(r, 600))

    // Check for navigation intent match
    const navMatch = checkNavigation(query)

    if (navMatch) {
      const answer = navMatch.response
      setChatLog(prev => [...prev, { role: 'assistant', text: answer }])
      setDebugMsg(`Redirecting to ${navMatch.route}...`)
      
      speakWithElevenLabs(answer)
      
      // Navigate after speech has had a moment to play
      setTimeout(() => {
        router.push(navMatch.route)
      }, 3000)
    } else {
      const answer = getAnswer(query, selectedLang)
      setChatLog(prev => [...prev, { role: 'assistant', text: answer }])
      speakWithElevenLabs(answer)
    }
  }

  // ── Speech-to-Text SpeechRecognition ─────────────────────────────
  const startVoiceListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setDebugMsg('❌ Speech recognition not supported in this browser.')
      alert('Your browser does not support Web Speech Recognition. Please try using Chrome or Safari.')
      return
    }

    // Cancel any active speech
    if (audioRef.current) audioRef.current.pause()
    window.speechSynthesis.cancel()
    setIsSpeaking(false)

    const rec = new SpeechRecognition()
    rec.lang = langSpeechMap[selectedLang] || 'en-US'
    rec.interimResults = false

    rec.onstart = () => {
      setStatus('listening')
      setDebugMsg(`🎤 Listening (${rec.lang})...`)
    }

    rec.onresult = async (e) => {
      const said = e.results[0][0].transcript
      console.log('User said:', said)
      await handleSendText(said)
    }

    rec.onerror = (e) => {
      console.error('Mic recognition error:', e)
      setDebugMsg(`❌ Mic error: ${e.error}`)
      setStatus('idle')
    }

    rec.onend = () => {
      if (status === 'listening') {
        setStatus('idle')
      }
    }

    try {
      rec.start()
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
    }
  }, [status, selectedLang, handleSendText])

  const stopSpeaking = () => {
    if (audioRef.current) audioRef.current.pause()
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setStatus('idle')
    setAvatarText('')
    setDebugMsg('⏹ Stopped speaking')
  }

  // ── Audio Visualizer Loop ───────────────────────────────────────
  useEffect(() => {
    let frameId
    const draw = () => {
      frameId = requestAnimationFrame(draw)
      if (!visualizerCanvasRef.current || !analyserRef.current) return

      const canvas = visualizerCanvasRef.current
      const ctx = canvas.getContext('2d')
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = (canvas.width / bufferLength) * 1.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height
        
        // Premium gradient color match Xoto Brand Purple
        const red = Math.floor(92 + (barHeight * 0.5))
        const green = Math.floor(3 + (barHeight * 0.8))
        const blue = Math.floor(155 + (barHeight * 0.4))
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight)
        
        x += barWidth
      }
    }

    if (isSpeaking) {
      draw()
    } else {
      // Clear visualizer when quiet
      const canvas = visualizerCanvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    return () => cancelAnimationFrame(frameId)
  }, [isSpeaking])

  return (
    <div style={styles.container}>
      {/* 3D Scene Viewport */}
      <div style={styles.canvasContainer}>
        <SceneErrorBoundary>
          <Canvas camera={{ position: [0, 1.45, 1.05], fov: 38 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[1, 3, 2]} intensity={1.4} castShadow />
            <pointLight position={[-2, 1, 1]} intensity={0.4} color="#a78bfa" />
            <Suspense fallback={null}>
              <Avatar
                modelPath="/avatars/brunette.glb"
                isSpeaking={isSpeaking}
                currentText={avatarText}
                morphRef={morphRef}
                analyser={analyser}
                audioRef={audioRef}
                language={selectedLang}
              />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              minPolarAngle={Math.PI / 2.4} 
              maxPolarAngle={Math.PI / 1.8} 
              target={[0, 1.37, 0]} 
            />
          </Canvas>
        </SceneErrorBoundary>
        
        <div style={styles.viewportGradient} />
        
        {/* Model Identifier Label */}
        <div style={styles.modelTag}>
          <div style={styles.livePulse} />
          BRUNETTE.GLB RIGGED 3D MODEL
        </div>
      </div>

      {/* Control Panel overlay */}
      <div style={styles.panel}>
        <div style={styles.header}>
          <span style={styles.assistantTitle}>XOTO AI CONSULTANT</span>
          <div style={styles.statusBar}>
            <div style={{
              ...styles.statusIndicator,
              backgroundColor: status === 'speaking' ? '#38bdf8' : status === 'listening' ? '#f97316' : status === 'thinking' ? '#a78bfa' : '#10b981'
            }} />
            <span style={styles.statusText}>{status.toUpperCase()}</span>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div style={styles.settingsRow}>
          <label style={styles.settingLabel}>Language:</label>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)} 
            style={styles.dropdown}
            disabled={status !== 'idle' && status !== 'speaking'}
          >
            <option value="en">English 🇬🇧</option>
            <option value="es">Español 🇪🇸</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="de">Deutsch 🇩🇪</option>
            <option value="ar">العربية 🇦🇪</option>
            <option value="hi">हिन्दी 🇮🇳</option>
          </select>
        </div>

        {/* Chat log window */}
        <div style={styles.chatLog}>
          {chatLog.map((chat, idx) => (
            <div key={idx} style={{
              ...styles.chatBubbleContainer,
              justifyContent: chat.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                ...styles.chatBubble,
                background: chat.role === 'user' ? 'rgba(92, 3, 155, 0.45)' : 'rgba(255, 255, 255, 0.08)',
                border: chat.role === 'user' ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={styles.bubbleRole}>{chat.role === 'user' ? 'You' : 'Xoto AI'}</div>
                <div style={styles.bubbleText}>{chat.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Live Audio Visualizer */}
        <div style={styles.visualizerRow}>
          <canvas ref={visualizerCanvasRef} width={280} height={30} style={styles.visualizerCanvas} />
          {debugMsg && <div style={styles.debugText}>{debugMsg}</div>}
        </div>

        {/* Keyboard Input Field */}
        <div style={styles.inputArea}>
          <input 
            type="text" 
            placeholder="Type your question..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            style={styles.textInput}
            disabled={status === 'listening' || status === 'thinking'}
          />
          <button 
            onClick={() => handleSendText()} 
            style={styles.sendButton}
            disabled={!inputText.trim() || status === 'listening' || status === 'thinking'}
          >
            Ask
          </button>
        </div>

        {/* Primary Speech & Audio Action Buttons */}
        <div style={styles.speechControls}>
          <button 
            onClick={startVoiceListening}
            style={{
              ...styles.actionBtn,
              backgroundColor: status === 'listening' ? '#ea580c' : '#5c039b',
              boxShadow: status === 'listening' ? '0 0 15px rgba(234, 88, 12, 0.4)' : '0 4px 12px rgba(92, 3, 155, 0.3)'
            }}
            disabled={status === 'thinking'}
          >
            {status === 'listening' ? 'Listening...' : '🎤 Speak to Assistant'}
          </button>

          {isSpeaking && (
            <button 
              onClick={stopSpeaking}
              style={{ ...styles.actionBtn, backgroundColor: '#dc2626' }}
            >
              ⏹ Stop Speech
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 80px)',
    width: '100vw',
    fontFamily: 'var(--font-sans), sans-serif',
    color: '#ffffff',
    backgroundColor: '#090514',
    overflow: 'hidden',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    height: '100%',
    background: 'radial-gradient(circle at center, #1b0a30 0%, #090514 100%)',
  },
  viewportGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '150px',
    background: 'linear-gradient(to top, #090514 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  modelTag: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(0,0,0,0.6)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '11px',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
  },
  livePulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#64ef0a',
    boxShadow: '0 0 8px #64ef0a',
    animation: 'pulse 1.5s infinite',
  },
  panel: {
    width: '400px',
    background: 'rgba(18, 10, 36, 0.65)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    boxSizing: 'border-box',
    zIndex: 10,
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '14px',
  },
  assistantTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#a78bfa',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 8px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  statusIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '9px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    color: '#cbd5e1',
  },
  settingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  settingLabel: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  dropdown: {
    background: '#130a24',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '6px 12px',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '12px',
    cursor: 'pointer',
  },
  chatLog: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chatBubbleContainer: {
    display: 'flex',
    width: '100%',
  },
  chatBubble: {
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: '12px',
    boxSizing: 'border-box',
  },
  bubbleRole: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#a78bfa',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  bubbleText: {
    fontSize: '13px',
    lineHeight: '1.45',
    color: '#e2e8f0',
    whiteSpace: 'pre-wrap',
  },
  visualizerRow: {
    height: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    gap: '6px',
  },
  visualizerCanvas: {
    background: 'rgba(0,0,0,0.15)',
    borderRadius: '6px',
  },
  debugText: {
    fontSize: '10px',
    color: '#38bdf8',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  textInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '10px 14px',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendButton: {
    background: '#5c039b',
    color: '#ffffff',
    border: 'none',
    padding: '0 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  speechControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  actionBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
  }
}
