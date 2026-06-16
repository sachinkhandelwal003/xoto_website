import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { textToVisemes } from '../utils/phonemeMapper'

// Mapping from 15 core Oculus Visemes to Apple ARKit morph targets (for models with ARKit support)
const visemeToARKit = {
  viseme_sil: {},
  viseme_PP: {
    mouthClose: 1.0,
    mouthPressLeft: 0.25,
    mouthPressRight: 0.25,
    jawOpen: 0.0
  },
  viseme_FF: {
    mouthClose: 0.75,
    mouthRollLower: 0.55,
    mouthShrugLower: 0.45,
    jawOpen: 0.05
  },
  viseme_TH: {
    jawOpen: 0.1,
    mouthClose: 0.2,
    mouthStretchLeft: 0.15,
    mouthStretchRight: 0.15
  },
  viseme_DD: {
    jawOpen: 0.15,
    mouthStretchLeft: 0.25,
    mouthStretchRight: 0.25,
    mouthClose: 0.1
  },
  viseme_kk: {
    jawOpen: 0.18,
    mouthStretchLeft: 0.3,
    mouthStretchRight: 0.3
  },
  viseme_CH: {
    jawOpen: 0.22,
    mouthFunnel: 0.65,
    mouthPucker: 0.2
  },
  viseme_SS: {
    jawOpen: 0.08,
    mouthStretchLeft: 0.5,
    mouthStretchRight: 0.5,
    mouthClose: 0.3
  },
  viseme_nn: {
    jawOpen: 0.12,
    mouthStretchLeft: 0.2,
    mouthStretchRight: 0.2
  },
  viseme_RR: {
    jawOpen: 0.15,
    mouthFunnel: 0.4,
    mouthPucker: 0.5
  },
  viseme_aa: {
    jawOpen: 0.8,
    mouthOpen: 0.4
  },
  viseme_E: {
    jawOpen: 0.45,
    mouthStretchLeft: 0.4,
    mouthStretchRight: 0.4,
    mouthSmile: 0.1
  },
  viseme_I: {
    jawOpen: 0.2,
    mouthStretchLeft: 0.7,
    mouthStretchRight: 0.7,
    mouthSmile: 0.15
  },
  viseme_O: {
    jawOpen: 0.6,
    mouthFunnel: 0.7,
    mouthPucker: 0.3
  },
  viseme_U: {
    jawOpen: 0.3,
    mouthPucker: 0.8,
    mouthFunnel: 0.4
  }
}

export default function Avatar({ modelPath, isSpeaking, currentText, morphRef, analyser, audioRef, language, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, group)

  // Track meshes that have morph targets
  const morphMeshes = useRef([])

  // Track key skeleton bones for procedural animation sways
  const headBone = useRef(null)
  const neckBone = useRef(null)
  const leftEye = useRef(null)
  const rightEye = useRef(null)

  // Flat array of viseme objects { viseme, duration } corresponding to the spoken text
  const visemeQueue = useRef([])
  const currentViseme = useRef('viseme_sil')

  // Tracks when speaking started (for fallback timing)
  const speechStartTimeRef = useRef(null)

  // Smoothly tracked real-time speech volume
  const smoothVolume = useRef(0)

  // Morph target influence values to interpolate toward
  const targetInfluences = useRef({})

  useEffect(() => {
    morphMeshes.current = []
    headBone.current = null
    neckBone.current = null
    leftEye.current = null
    rightEye.current = null


    console.log("--- Loading Model:", modelPath, "---");
    scene.traverse((child) => {
      // Find meshes with morph targets
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        // Log mesh blendshapes directly to dev console for inspection
        if (child.morphTargetDictionary && child.morphTargetInfluences) {
          console.log("MESH:", child.name);
          console.log("COUNT:", Object.keys(child.morphTargetDictionary).length);
          console.log(Object.keys(child.morphTargetDictionary));
          morphMeshes.current.push(child)
        }
      }
      // Find key bones dynamically
      if (child.isBone) {
        const name = child.name.toLowerCase()
        if (name === 'head' || name.endsWith('head')) headBone.current = child
        if (name === 'neck' || name.endsWith('neck')) neckBone.current = child
        if (name === 'lefteye' || name.endsWith('lefteye')) leftEye.current = child
        if (name === 'righteye' || name.endsWith('righteye')) rightEye.current = child

      }
    })

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

  // Pre-compute visemes whenever the text changes, independently of isSpeaking.
  // This ensures the queue is ready the moment audio starts, so frame 1 is already in sync.
  useEffect(() => {
    if (currentText) {
      const parsed = textToVisemes(currentText, language)
      visemeQueue.current = parsed
      currentViseme.current = parsed[0]?.viseme || 'viseme_sil'
    } else {
      visemeQueue.current = []
      currentViseme.current = 'viseme_sil'
    }
    speechStartTimeRef.current = null // reset start-time for fallback path
  }, [currentText, language])

  useFrame((state, delta) => {
    if (!morphMeshes.current.length) return

    let volumeScale = 0

    // 1. Calculate the real-time volume scale from Web Audio Analyser
    if (isSpeaking) {
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)

        let sum = 0
        // Use mid-speech frequency bins (skip bin 0 DC offset, use bins 1-6)
        const startBin = 1
        const endBin = Math.min(6, dataArray.length - 1)
        for (let i = startBin; i <= endBin; i++) {
          sum += dataArray[i]
        }
        const avgVolume = sum / (endBin - startBin + 1)

        // ElevenLabs audio is loud — use a higher divisor and power curve so
        // volumeScale reflects actual VARIATION in speech rather than being pegged at 1.0.
        const targetVolume = Math.min(1.0, Math.pow(avgVolume / 180, 0.6))
        smoothVolume.current = THREE.MathUtils.lerp(smoothVolume.current, targetVolume, delta * 12)
        volumeScale = smoothVolume.current
      } else {
        // Fallback procedural volume for Browser TTS (no analyser available)
        volumeScale = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.5 + 0.5
      }
    } else {
      // Decay volume smoothly to 0 when silent
      smoothVolume.current = THREE.MathUtils.lerp(smoothVolume.current, 0, delta * 20)
      volumeScale = smoothVolume.current
    }

    // 2. Align viseme shape to actual audio element playback progress with duration weights & blending
    let currentVisemeName = 'viseme_sil'
    let nextVisemeName = 'viseme_sil'
    let blend = 0

    if (isSpeaking && visemeQueue.current.length > 0) {
      const audioEl = audioRef?.current
      const isAudioPlaying = audioEl && !audioEl.paused && !audioEl.ended
      if (isAudioPlaying && audioEl.duration && !isNaN(audioEl.duration) && audioEl.duration > 0) {
        // Calculate total phonetic queue duration
        let totalVisemeDuration = 0
        for (let i = 0; i < visemeQueue.current.length; i++) {
          totalVisemeDuration += visemeQueue.current[i].duration
        }

        // Scale current playback time to the viseme duration timeline
        const progressTimeMs = audioEl.currentTime * 1000
        const scaledTimeMs = progressTimeMs * (totalVisemeDuration / (audioEl.duration * 1000))

        // Find active and next visemes by accumulating durations
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
        nextVisemeName = visemeQueue.current[activeIndex + 1]?.viseme || 'viseme_sil'
      } else {
        // Fallback: use time elapsed since speech started (browser TTS or audio not yet loaded)
        if (speechStartTimeRef.current === null) {
          speechStartTimeRef.current = state.clock.elapsedTime
        }
        const speechRate = 120 // ms per viseme
        const elapsedMs = (state.clock.elapsedTime - speechStartTimeRef.current) * 1000
        const totalVisemeDuration = visemeQueue.current.length * speechRate
        // Clamp at end rather than looping
        const clampedElapsed = Math.min(elapsedMs, totalVisemeDuration - 0.1)
        const preciseIndex = clampedElapsed / speechRate
        const activeIndex = Math.min(visemeQueue.current.length - 1, Math.floor(preciseIndex))
        blend = preciseIndex - Math.floor(preciseIndex)

        currentVisemeName = visemeQueue.current[activeIndex].viseme
        nextVisemeName = visemeQueue.current[activeIndex + 1]?.viseme || 'viseme_sil'
      }
    }

    currentViseme.current = currentVisemeName

    // 3. Prepare target influences for this frame's viseme & eye blinking
    const activeMorphs = new Set([
      'jawOpen', 'mouthOpen', 'mouthClose', 'mouthFunnel', 'mouthPucker',
      'mouthStretchLeft', 'mouthStretchRight', 'mouthShrugLower', 'mouthPressLeft', 'mouthPressRight',
      'mouthRollLower', 'mouthRollUpper', 'mouthShrugUpper', 'mouthSmile', 'mouthSmileLeft', 'mouthSmileRight',
      'eyeBlinkLeft', 'eyeBlinkRight',
      'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk', 'viseme_CH',
      'viseme_SS', 'viseme_nn', 'viseme_RR', 'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'
    ])

    activeMorphs.forEach(key => {
      targetInfluences.current[key] = 0
    })

    // Apply a permanent subtle friendly smile
    if (isSpeaking) {
      targetInfluences.current['mouthSmileLeft'] = 0.15
      targetInfluences.current['mouthSmileRight'] = 0.15
    } else {
      targetInfluences.current['mouthSmileLeft'] = 0.08
      targetInfluences.current['mouthSmileRight'] = 0.08
    }

    // Procedural Eye Blinking (triangle wave cycle every 3.8s, lasts 150ms)
    const blinkTimer = state.clock.elapsedTime % 3.8
    let blinkVal = 0
    if (blinkTimer < 0.15) {
      if (blinkTimer < 0.075) {
        blinkVal = blinkTimer / 0.075
      } else {
        blinkVal = 1.0 - (blinkTimer - 0.075) / 0.075
      }
    }
    targetInfluences.current['eyeBlinkLeft'] = blinkVal
    targetInfluences.current['eyeBlinkRight'] = blinkVal

    // Smoothstep transition blend curve for lip-sync
    const smoothBlend = blend * blend * (3 - 2 * blend)

    // volumeScale modulates overall lip movement intensity (min 0.3 so mouth never freezes during speech)
    const lipIntensity = isSpeaking ? Math.max(0.3, volumeScale) : volumeScale

    // Helper to add a viseme's influences to the target map
    const applyVisemeToTargets = (visemeName, weight) => {
      if (!visemeName || visemeName === 'viseme_sil') return

      const arkitMappings = visemeToARKit[visemeName] || {}

      morphMeshes.current.forEach((mesh) => {
        const hasARKit = mesh.morphTargetDictionary['jawOpen'] !== undefined && mesh.morphTargetDictionary['mouthClose'] !== undefined
        const hasNativeViseme = mesh.morphTargetDictionary[visemeName] !== undefined

        if (hasARKit) {
          // Let the viseme mapping fully control jaw position — do NOT multiply jawOpen by
          // volumeScale because ElevenLabs audio is consistently loud (scale ≈ 1.0 always),
          // which was making the jaw permanently max-open regardless of the sound.
          // Instead, modulate ALL shapes together via lipIntensity so the whole mouth
          // scales up/down naturally with speech energy.
          Object.entries(arkitMappings).forEach(([key, val]) => {
            targetInfluences.current[key] = (targetInfluences.current[key] || 0) + val * weight * lipIntensity
          })
        } else if (hasNativeViseme) {
          // Oculus native viseme fallback — scale by lipIntensity
          targetInfluences.current[visemeName] = (targetInfluences.current[visemeName] || 0) + weight * lipIntensity
        }
      })
    }

    // Blend current and next visemes using smoothstep
    applyVisemeToTargets(currentVisemeName, 1 - smoothBlend)
    applyVisemeToTargets(nextVisemeName, smoothBlend)

    // 4. Procedural Bone Movements (Blinking, Swaying, Breathing, Looking, Nodding)
    const time = state.clock.elapsedTime

    if (headBone.current) {
      // Gentle idle sway
      headBone.current.rotation.y = Math.sin(time * 0.6) * 0.03
      headBone.current.rotation.x = Math.sin(time * 0.4) * 0.02
      
      // Speech sways & rhythmic nods
      if (isSpeaking) {
        headBone.current.rotation.x += Math.sin(time * 8.5) * 0.018 * volumeScale
        headBone.current.rotation.z = Math.sin(time * 4) * 0.01 * volumeScale
      } else {
        headBone.current.rotation.z = 0
      }
    }

    if (neckBone.current) {
      // Neck follows head sway gently
      neckBone.current.rotation.y = Math.sin(time * 0.6) * 0.015
      neckBone.current.rotation.x = Math.sin(time * 0.4) * 0.01
    }

    if (leftEye.current && rightEye.current) {
      // Natural eye micro focus shifts
      leftEye.current.rotation.y = Math.sin(time * 0.8) * 0.03 + Math.cos(time * 2) * 0.01
      rightEye.current.rotation.y = leftEye.current.rotation.y
      
      leftEye.current.rotation.x = Math.sin(time * 0.4) * 0.015
      rightEye.current.rotation.x = leftEye.current.rotation.x
    }



    // 5. Smoothly interpolate (lerp) current morph influences toward the target values
    morphMeshes.current.forEach((mesh) => {
      activeMorphs.forEach((key) => {
        const idx = mesh.morphTargetDictionary[key]
        if (idx !== undefined) {
          const currentVal = mesh.morphTargetInfluences[idx]
          const targetVal = targetInfluences.current[key] || 0
          mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(currentVal, targetVal, delta * 20)
        }
      })
    })
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the brunette model file
useGLTF.preload('/avatars/brunette.glb')
