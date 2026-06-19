// components/Avatar.jsx
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PHONEME_TO_VISEME, VISEME_TO_ARKIT } from '../utils/phonemeMapper'

// Viseme timing in milliseconds (fallback when no phoneme timing)
const visemeTiming = {
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

// Fallback function to convert text to visemes when phoneme timing is not available
function textToVisemesFallback(text) {
  if (!text) return []
  
  const normalized = text.toLowerCase().trim()
  const words = normalized.split(/\s+/)
  const visemes = []
  
  // Add initial silence
  visemes.push({ viseme: 'viseme_sil', duration: 80 })
  
  words.forEach((word, wordIndex) => {
    if (!word) return
    
    const chars = [...word]
    let i = 0
    
    while (i < chars.length) {
      let phoneme = chars[i]
      let found = false
      
      // Check for multi-character phonemes
      if (i + 1 < chars.length) {
        const twoChar = chars[i] + chars[i + 1]
        if (PHONEME_TO_VISEME[twoChar]) {
          phoneme = twoChar
          i += 2
          found = true
        }
      }
      
      if (!found) {
        if (PHONEME_TO_VISEME[phoneme]) {
          i += 1
          found = true
        } else {
          // Skip unknown characters
          i += 1
          continue
        }
      }
      
      const viseme = PHONEME_TO_VISEME[phoneme] || 'viseme_sil'
      const duration = visemeTiming[viseme] || 80
      
      // Add small pause between words
      if (wordIndex > 0 && i === 0) {
        visemes.push({ viseme: 'viseme_sil', duration: 50 })
      }
      
      visemes.push({ viseme, duration })
    }
    
    // Pause between words
    if (wordIndex < words.length - 1) {
      visemes.push({ viseme: 'viseme_sil', duration: 35 })
    }
  })
  
  // Add final silence
  visemes.push({ viseme: 'viseme_sil', duration: 100 })
  
  return visemes
}

export default function Avatar({ 
  modelPath, 
  isSpeaking, 
  currentText, 
  morphRef, 
  analyser, 
  audioRef, 
  language, 
  phonemeTiming = null, // ← NEW: Receive phoneme timing from TTS
  ...props 
}) {
  const group = useRef()
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, group)

  const morphMeshes = useRef([])
  const headBone = useRef(null)
  const neckBone = useRef(null)
  const leftEye = useRef(null)
  const rightEye = useRef(null)
  const breastLeft = useRef(null)
  const breastRight = useRef(null)

  // Spring physics state for breast jiggle
  const breastPhysics = useRef({
    leftRot: new THREE.Vector2(0, 0),
    rightRot: new THREE.Vector2(0, 0),
    leftVel: new THREE.Vector2(0, 0),
    rightVel: new THREE.Vector2(0, 0),
    prevHeadY: 0,
    prevHeadX: 0,
  })

  const visemeQueue = useRef([])
  const currentViseme = useRef('viseme_sil')
  const speechStartTimeRef = useRef(null)
  const smoothVolume = useRef(0)
  const targetInfluences = useRef({})
  const smoothJaw = useRef(0)
  const previousViseme = useRef('viseme_sil')
  const lastBlendshapeLogTime = useRef(0)

  // Initialize model
  useEffect(() => {
    morphMeshes.current = []
    headBone.current = null
    neckBone.current = null
    leftEye.current = null
    rightEye.current = null

    console.log("--- Loading Model:", modelPath, "---")
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        if (child.morphTargetDictionary && child.morphTargetInfluences) {
          morphMeshes.current.push(child)
          
          // Log if model has ARKit shapes
          const hasARKit = ['jawOpen', 'mouthClose', 'mouthFunnel'].every(
            shape => child.morphTargetDictionary[shape] !== undefined
          )
          if (hasARKit) {
            console.log(`✅ Mesh ${child.name} has ARKit blend shapes`)
          }
        }
      }
      
      if (child.isBone) {
        const name = child.name.toLowerCase()
        if (name === 'head' || name.endsWith('head')) headBone.current = child
        if (name === 'neck' || name.endsWith('neck')) neckBone.current = child
        if (name === 'lefteye' || name.endsWith('lefteye')) leftEye.current = child
        if (name === 'righteye' || name.endsWith('righteye')) rightEye.current = child

        // Detect breast/chest bones by common naming conventions
        const isBreastBone = name.includes('breast') || name.includes('bust') || name.includes('boob') || name.includes('pectoral')
        if (isBreastBone) {
          const isLeft = name.includes('left') || name.includes('_l') || name.endsWith('l')
          if (isLeft) breastLeft.current = child
          else breastRight.current = child
        }
      }
    })

    // Play idle animation
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0) {
      const idleAction = actionNames.find(name => name.toLowerCase().includes('idle'))
      if (idleAction) {
        actions[idleAction].play()
      } else {
        actions[actionNames[0]].play()
      }
    }

    return () => {
      Object.values(actions).forEach((action) => action.stop())
    }
  }, [scene, actions, modelPath])

  // Pre-compute visemes (fallback when no phoneme timing)
  useEffect(() => {
    if (currentText && currentText.length > 0) {
      const parsed = textToVisemesFallback(currentText)
      visemeQueue.current = parsed
      currentViseme.current = parsed[0]?.viseme || 'viseme_sil'
      speechStartTimeRef.current = null
      previousViseme.current = 'viseme_sil'
    } else {
      visemeQueue.current = []
      currentViseme.current = 'viseme_sil'
    }
  }, [currentText])

  useFrame((state, delta) => {
    if (!morphMeshes.current.length) return

    let volumeScale = 0

    // Get audio volume
    if (isSpeaking) {
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)
        
        let sum = 0
        const startBin = 2
        const endBin = Math.min(10, dataArray.length - 1)
        for (let i = startBin; i <= endBin; i++) {
          sum += dataArray[i]
        }
        const avgVolume = sum / (endBin - startBin + 1)
        
        // Better volume curve for natural movement
        const rawScale = avgVolume / 180
        const targetVolume = Math.min(1.0, Math.pow(rawScale, 0.6) * 1.1)
        smoothVolume.current = THREE.MathUtils.lerp(smoothVolume.current, targetVolume, delta * 18)
        volumeScale = smoothVolume.current
      } else {
        // Fallback for browser TTS
        const time = state.clock.elapsedTime
        const raw = Math.sin(time * 7) * 0.5 + 0.5
        const targetVolume = Math.max(0.3, raw * 0.8 + 0.1)
        smoothVolume.current = THREE.MathUtils.lerp(smoothVolume.current, targetVolume, delta * 15)
        volumeScale = smoothVolume.current
      }
    } else {
      smoothVolume.current = THREE.MathUtils.lerp(smoothVolume.current, 0, delta * 30)
      volumeScale = smoothVolume.current
    }

    // Determine current viseme
    let currentVisemeName = 'viseme_sil'
    let nextVisemeName = 'viseme_sil'
    let blend = 0

    // ===== PRIORITY 1: Use phoneme timing from TTS (MOST ACCURATE) =====
    if (phonemeTiming && phonemeTiming.length > 0 && isSpeaking) {
      const audioEl = audioRef?.current
      if (audioEl && !audioEl.paused && !audioEl.ended) {
        const currentTime = audioEl.currentTime * 1000 // Convert to ms
        
        // Find current phoneme
        for (let i = 0; i < phonemeTiming.length; i++) {
          const p = phonemeTiming[i]
          const start = p.start * 1000
          const end = p.end * 1000
          
          if (currentTime >= start && currentTime < end) {
            const phoneme = p.phoneme
            currentVisemeName = PHONEME_TO_VISEME[phoneme] || 'viseme_sil'
            blend = (currentTime - start) / (end - start)
            
            if (i + 1 < phonemeTiming.length) {
              const nextPhoneme = phonemeTiming[i + 1].phoneme
              nextVisemeName = PHONEME_TO_VISEME[nextPhoneme] || 'viseme_sil'
            }
            break
          }
        }
      }
    }
    
    // ===== PRIORITY 2: Fallback to text-based viseme queue =====
    if ((!currentVisemeName || currentVisemeName === 'viseme_sil') && isSpeaking && visemeQueue.current.length > 0) {
      const audioEl = audioRef?.current
      const isAudioPlaying = audioEl && !audioEl.paused && !audioEl.ended
      
      if (isAudioPlaying && audioEl.duration && !isNaN(audioEl.duration) && audioEl.duration > 0) {
        // Calculate total duration
        let totalVisemeDuration = 0
        for (let i = 0; i < visemeQueue.current.length; i++) {
          totalVisemeDuration += visemeQueue.current[i].duration
        }
        
        // Map audio time to viseme timeline
        const progressTimeMs = audioEl.currentTime * 1000
        const scaledTimeMs = progressTimeMs * (totalVisemeDuration / (audioEl.duration * 1000))
        
        let accumulatedTime = 0
        let activeIndex = 0
        for (let i = 0; i < visemeQueue.current.length; i++) {
          const nextAccumulated = accumulatedTime + visemeQueue.current[i].duration
          if (scaledTimeMs >= accumulatedTime && scaledTimeMs < nextAccumulated) {
            activeIndex = i
            blend = (scaledTimeMs - accumulatedTime) / visemeQueue.current[i].duration
            break
          }
          accumulatedTime = nextAccumulated
        }
        
        if (scaledTimeMs >= totalVisemeDuration) {
          activeIndex = visemeQueue.current.length - 1
          blend = 1.0
        }
        
        currentVisemeName = visemeQueue.current[activeIndex].viseme
        nextVisemeName = visemeQueue.current[Math.min(activeIndex + 1, visemeQueue.current.length - 1)]?.viseme || 'viseme_sil'
      } else {
        // Fallback timing using elapsed time
        if (speechStartTimeRef.current === null) {
          speechStartTimeRef.current = state.clock.elapsedTime
        }
        const speechRate = 90 // ms per viseme
        const elapsedMs = (state.clock.elapsedTime - speechStartTimeRef.current) * 1000
        const totalDuration = visemeQueue.current.length * speechRate
        const clampedElapsed = Math.min(elapsedMs, totalDuration - 1)
        const preciseIndex = clampedElapsed / speechRate
        const activeIndex = Math.min(visemeQueue.current.length - 1, Math.floor(preciseIndex))
        blend = preciseIndex - Math.floor(preciseIndex)
        
        currentVisemeName = visemeQueue.current[activeIndex].viseme
        nextVisemeName = visemeQueue.current[Math.min(activeIndex + 1, visemeQueue.current.length - 1)]?.viseme || 'viseme_sil'
      }
    }

    currentViseme.current = currentVisemeName

    // Viseme change logs
    if (isSpeaking && currentVisemeName !== previousViseme.current) {
      console.log(`[Lip-Sync Viseme Change] Viseme changed from "${previousViseme.current}" to "${currentVisemeName}" at system time: ${new Date().toISOString()} (Audio current time: ${audioRef?.current?.currentTime ? audioRef.current.currentTime.toFixed(3) : '0.000'}s)`);
      previousViseme.current = currentVisemeName;
    }
    
    if (!isSpeaking && previousViseme.current !== 'viseme_sil') {
      console.log(`[Lip-Sync Stop] Visemes reset to silence at system time: ${new Date().toISOString()}`);
      previousViseme.current = 'viseme_sil';
    }

    // Reset targets
    const activeKeys = new Set([
      'jawOpen', 'mouthOpen', 'mouthClose', 'mouthFunnel', 'mouthPucker',
      'mouthStretchLeft', 'mouthStretchRight', 'mouthShrugLower', 'mouthPressLeft', 'mouthPressRight',
      'mouthRollLower', 'mouthRollUpper', 'mouthShrugUpper', 'mouthSmile', 'mouthSmileLeft', 'mouthSmileRight',
      'eyeBlinkLeft', 'eyeBlinkRight', 'mouthDimpleLeft', 'mouthDimpleRight',
      'browDownLeft', 'browDownRight', 'browInnerUp'
    ])
    
    activeKeys.forEach(key => {
      targetInfluences.current[key] = 0
    })

    // Apply viseme with improved smoothing
    const applyViseme = (visemeName, weight) => {
      if (!visemeName || visemeName === 'viseme_sil') {
        // Add slight mouth closure for silence
        if (isSpeaking) {
          targetInfluences.current['mouthClose'] = 0.1
        }
        return
      }
      
      const visemeData = VISEME_TO_ARKIT[visemeName] || {}
      
      // Intensity scaling - keep mouth moving even at low volume
      const intensity = isSpeaking ? Math.max(0.25, volumeScale) : volumeScale
      
      Object.entries(visemeData).forEach(([key, val]) => {
        let scaledVal = val
        
        // Special handling for jaw - make it more responsive
        if (key === 'jawOpen') {
          // Scale jaw based on volume for natural feel
          const jawScale = 0.85 + (intensity * 0.15)
          scaledVal = val * jawScale
        }
        
        // Add slight emphasis for certain visemes
        if (key === 'mouthClose' && visemeName === 'viseme_PP') {
          scaledVal = Math.min(1.0, val * 1.1)
        }
        
        targetInfluences.current[key] = (targetInfluences.current[key] || 0) + scaledVal * weight * intensity
      })
    }

    // Smooth blend between visemes (cubic interpolation)
    const smoothBlend = blend * blend * (3 - 2 * blend)
    
    // Apply current and next viseme
    if (currentVisemeName !== 'viseme_sil' || nextVisemeName !== 'viseme_sil') {
      applyViseme(currentVisemeName, 1 - smoothBlend)
      applyViseme(nextVisemeName, smoothBlend)
    }

    // Always maintain slight smile and natural expression
    const smileAmount = isSpeaking ? 0.15 : 0.08
    targetInfluences.current['mouthSmileLeft'] = smileAmount
    targetInfluences.current['mouthSmileRight'] = smileAmount
    
    // Subtle brow movement for expression
    if (isSpeaking) {
      targetInfluences.current['browInnerUp'] = 0.1 * volumeScale
    }

    // Natural eye blink
    const blinkTimer = state.clock.elapsedTime % 4.2
    let blinkVal = 0
    if (blinkTimer < 0.2) {
      blinkVal = blinkTimer < 0.1 ? blinkTimer / 0.1 : 1 - (blinkTimer - 0.1) / 0.1
    }
    targetInfluences.current['eyeBlinkLeft'] = blinkVal * 0.9
    targetInfluences.current['eyeBlinkRight'] = blinkVal * 0.9

    // Procedural bone movements
    const time = state.clock.elapsedTime
    
    if (headBone.current) {
      // Gentle idle sway with speech emphasis
      const swaySpeed = isSpeaking ? 0.7 : 0.5
      headBone.current.rotation.y = Math.sin(time * swaySpeed) * 0.025
      headBone.current.rotation.x = Math.sin(time * 0.4) * 0.015
      
      // Speech movements
      if (isSpeaking) {
        headBone.current.rotation.x += Math.sin(time * 8) * 0.018 * volumeScale
        headBone.current.rotation.z = Math.sin(time * 4.5) * 0.008 * volumeScale
        
        // Small nod on emphasis
        if (volumeScale > 0.7) {
          headBone.current.rotation.x += Math.sin(time * 3) * 0.005 * volumeScale
        }
      } else {
        headBone.current.rotation.z = 0
      }
    }

    if (neckBone.current) {
      neckBone.current.rotation.y = Math.sin(time * 0.5) * 0.01
      neckBone.current.rotation.x = Math.sin(time * 0.4) * 0.008
    }

    if (leftEye.current && rightEye.current) {
      // Micro eye movements for natural look
      const eyeY = Math.sin(time * 0.6) * 0.02 + Math.cos(time * 1.5) * 0.008
      const eyeX = Math.sin(time * 0.35) * 0.01
      leftEye.current.rotation.y = eyeY
      rightEye.current.rotation.y = eyeY
      leftEye.current.rotation.x = eyeX
      rightEye.current.rotation.x = eyeX
    }

    // Breast jiggle spring physics — reacts to head movement
    if (breastLeft.current || breastRight.current) {
      const stiffness = 38
      const damping = 7
      const bp = breastPhysics.current

      const curHeadY = headBone.current?.rotation.y ?? 0
      const curHeadX = headBone.current?.rotation.x ?? 0
      const headVelY = (curHeadY - bp.prevHeadY) / Math.max(delta, 0.001)
      const headVelX = (curHeadX - bp.prevHeadX) / Math.max(delta, 0.001)
      bp.prevHeadY = curHeadY
      bp.prevHeadX = curHeadX

      // External force: head angular velocity drives breast inertia
      const forceX = -headVelX * 0.07
      const forceZ = -headVelY * 0.10

      // Left breast spring
      const accLX = forceX - stiffness * bp.leftRot.x - damping * bp.leftVel.x
      const accLZ = forceZ - stiffness * bp.leftRot.y - damping * bp.leftVel.y
      bp.leftVel.x += accLX * delta
      bp.leftVel.y += accLZ * delta
      bp.leftRot.x = THREE.MathUtils.clamp(bp.leftRot.x + bp.leftVel.x * delta, -0.12, 0.12)
      bp.leftRot.y = THREE.MathUtils.clamp(bp.leftRot.y + bp.leftVel.y * delta, -0.12, 0.12)
      if (breastLeft.current) {
        breastLeft.current.rotation.x = bp.leftRot.x
        breastLeft.current.rotation.z = bp.leftRot.y
      }

      // Right breast spring (slightly asymmetric for natural feel)
      const accRX = forceX * 0.93 - stiffness * bp.rightRot.x - damping * bp.rightVel.x
      const accRZ = forceZ * 1.07 - stiffness * bp.rightRot.y - damping * bp.rightVel.y
      bp.rightVel.x += accRX * delta
      bp.rightVel.y += accRZ * delta
      bp.rightRot.x = THREE.MathUtils.clamp(bp.rightRot.x + bp.rightVel.x * delta, -0.12, 0.12)
      bp.rightRot.y = THREE.MathUtils.clamp(bp.rightRot.y + bp.rightVel.y * delta, -0.12, 0.12)
      if (breastRight.current) {
        breastRight.current.rotation.x = bp.rightRot.x
        breastRight.current.rotation.z = bp.rightRot.y
      }
    }

    // Apply morph targets with optimized interpolation
    morphMeshes.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary
      if (!dict) return
      
      // Batch apply all morph targets
      Object.entries(targetInfluences.current).forEach(([key, targetVal]) => {
        const idx = dict[key]
        if (idx !== undefined) {
          const currentVal = mesh.morphTargetInfluences[idx]
          // Faster interpolation for more responsive lip sync
          const lerpSpeed = key === 'jawOpen' ? 30 : 22
          mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(currentVal, targetVal, delta * lerpSpeed)
        }
      })
    })

    // Throttled real-time blendshapes log
    const currentTimeSec = state.clock.elapsedTime
    if (isSpeaking && (currentTimeSec - lastBlendshapeLogTime.current > 0.15)) { // every 150ms
      lastBlendshapeLogTime.current = currentTimeSec
      
      const activeBlendshapes = {}
      Object.entries(targetInfluences.current).forEach(([key, val]) => {
        if (val > 0.01 && (key.startsWith('mouth') || key.startsWith('jaw') || key.startsWith('lip'))) {
          activeBlendshapes[key] = val.toFixed(3)
        }
      })
      
      console.log(`[Lip-Sync Real-Time Blendshapes] Time: ${currentTimeSec.toFixed(2)}s | Audio time: ${audioRef?.current?.currentTime ? audioRef.current.currentTime.toFixed(3) : '0.000'}s | Viseme: "${currentVisemeName}" | Active Blendshapes:`, JSON.stringify(activeBlendshapes));
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/avatars/brunette.glb')