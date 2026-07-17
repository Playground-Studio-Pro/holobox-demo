import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * CameraEngine — generalised R3F camera lerp component.
 *
 * Drop this inside any Canvas alongside OrbitControls.
 * Pass a `target` prop ({ position, target } | null) to fly to a position.
 * When `target` is null the camera returns to `overviewPosition`/`overviewTarget`.
 *
 * Props:
 *   overviewPosition  [x, y, z]          default camera home position
 *   overviewTarget    [x, y, z]          default orbit target
 *   target            {position, target} | null   fly-to destination
 *   lerpFactor        number             default 0.05
 *   orbitRef          React ref to OrbitControls instance
 *   onTransitionStateChange  (animating: boolean) => void   optional
 *   onArrival         () => void          optional — fires once per transition end
 */
export default function CameraEngine({
  overviewPosition = [0, 1, 5],
  overviewTarget   = [0, 0, 0],
  target           = null,
  lerpFactor       = 0.05,
  orbitRef,
  onTransitionStateChange,
  onArrival,
}) {
  const { camera }    = useThree()
  const targetPos     = useRef(new THREE.Vector3(...overviewPosition))
  const targetLook    = useRef(new THREE.Vector3(...overviewTarget))
  const inFocusMode   = useRef(false)
  const isAnimating   = useRef(false)
  const isMounted     = useRef(false)
  const notifyRef     = useRef(onTransitionStateChange)
  const arrivalRef    = useRef(onArrival)

  useEffect(() => { notifyRef.current = onTransitionStateChange }, [onTransitionStateChange])
  useEffect(() => { arrivalRef.current = onArrival }, [onArrival])

  useEffect(() => {
    // Skip the initial mount — we don't want to re-trigger on first render
    if (!isMounted.current) { isMounted.current = true; return }

    if (target) {
      inFocusMode.current = true
      targetPos.current.set(...target.position)
      targetLook.current.set(...target.target)
    } else {
      inFocusMode.current = false
      targetPos.current.set(...overviewPosition)
      targetLook.current.set(...overviewTarget)
    }

    isAnimating.current = true
    notifyRef.current?.(true)

    if (orbitRef?.current) {
      orbitRef.current.enabled    = false
      orbitRef.current.autoRotate = false
    }
  // overviewPosition/overviewTarget are arrays — intentionally excluded to avoid
  // re-triggering on every render; they are treated as stable initial values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, orbitRef])

  useFrame(() => {
    if (!isAnimating.current) return

    camera.position.lerp(targetPos.current, lerpFactor)
    if (orbitRef?.current) {
      orbitRef.current.target.lerp(targetLook.current, lerpFactor)
      orbitRef.current.update()
    }

    const posOk = camera.position.distanceTo(targetPos.current) < 0.008
    const tgtOk = !orbitRef?.current ||
      orbitRef.current.target.distanceTo(targetLook.current) < 0.008

    if (posOk && tgtOk) {
      camera.position.copy(targetPos.current)
      if (orbitRef?.current) {
        orbitRef.current.target.copy(targetLook.current)
        orbitRef.current.update()
        orbitRef.current.enabled    = true
        orbitRef.current.autoRotate = !inFocusMode.current
      }
      isAnimating.current = false
      notifyRef.current?.(false)
      arrivalRef.current?.()
    }
  })

  return null
}
