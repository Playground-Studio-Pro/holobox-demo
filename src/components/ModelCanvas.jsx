import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

const HERO_POSITION = [0, 0.3, 3.5]
const HERO_TARGET   = [0, 0, 0]

/* ── Hotspot pin ── */
function HotspotPin({ hotspot, isActive, onSelect }) {
  function handlePointerUp(e) {
    e.stopPropagation()
    onSelect(hotspot)
  }

  return (
    <Html position={hotspot.position} center zIndexRange={[10, 20]}>
      <div style={{ position: 'relative', cursor: 'pointer' }} onPointerUp={handlePointerUp}>
        <div style={{
          width: 52, height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className={`hotspot-dot${isActive ? ' hotspot-dot--active' : ''}`} />
        </div>
        {isActive && (
          <div className="hotspot-tooltip" style={{ whiteSpace: 'nowrap' }}>
            {hotspot.label}
          </div>
        )}
      </div>
    </Html>
  )
}

/* ── GLB model with auto-center/scale ── */
function Model({ path }) {
  const { scene } = useGLTF(path)
  const { invalidate } = useThree()

  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return
    const scale = 1.8 / maxDim
    scene.scale.setScalar(scale)
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    invalidate()
  }, [scene, invalidate])

  return <primitive object={scene} dispose={null} />
}

/* ── Placeholder box ── */
function PlaceholderModel({ color }) {
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.4
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color={color || '#cccccc'} />
    </mesh>
  )
}

/*
 * ── Camera rig — smooth focus transitions via lerp ──
 *
 * BUG FIX: When returning to hero, autoRotate from the parent prop can interfere
 * with the lerp before the transition completes, because OrbitControls.update()
 * applies auto-rotation each frame even when called programmatically. Fix:
 *
 * 1. Immediately set orbitRef.current.autoRotate = false on the Three.js object
 *    (before React can sync the prop that might be true).
 * 2. Report transition state via onTransitionStateChange so ModelCanvas can
 *    gate effectiveAutoRotate while the camera is moving.
 * 3. On hero arrival: explicitly set enabled = true before reporting complete.
 */
function CameraRig({ focusCamera, orbitRef, onTransitionStateChange }) {
  const { camera } = useThree()
  const targetPos    = useRef(new THREE.Vector3(...HERO_POSITION))
  const targetLookAt = useRef(new THREE.Vector3(...HERO_TARGET))
  const inFocusMode  = useRef(false)
  const isAnimating  = useRef(false)

  useEffect(() => {
    if (focusCamera) {
      inFocusMode.current = true
      targetPos.current.set(...focusCamera.position)
      targetLookAt.current.set(...focusCamera.target)
    } else {
      inFocusMode.current = false
      targetPos.current.set(...HERO_POSITION)
      targetLookAt.current.set(...HERO_TARGET)
    }
    isAnimating.current = true

    if (orbitRef.current) {
      orbitRef.current.enabled = false
      // Immediately kill autoRotate on the Three.js object to prevent it from
      // fighting the lerp before React's effectiveAutoRotate prop update lands.
      orbitRef.current.autoRotate = false
    }
    onTransitionStateChange?.(true)
  }, [focusCamera])

  useFrame(() => {
    if (!isAnimating.current) return

    camera.position.lerp(targetPos.current, 0.08)
    if (orbitRef.current) {
      orbitRef.current.target.lerp(targetLookAt.current, 0.08)
      orbitRef.current.update()
    }

    const posArrived = camera.position.distanceTo(targetPos.current) < 0.008
    const tgtArrived = !orbitRef.current || orbitRef.current.target.distanceTo(targetLookAt.current) < 0.008

    if (posArrived && tgtArrived) {
      camera.position.copy(targetPos.current)
      if (orbitRef.current) {
        orbitRef.current.target.copy(targetLookAt.current)
        orbitRef.current.update()
        // Re-enable free orbit only when returning to hero state.
        // This must happen before onTransitionStateChange(false) so that
        // the user can interact immediately after the transition reports complete.
        if (!inFocusMode.current) orbitRef.current.enabled = true
      }
      isAnimating.current = false
      onTransitionStateChange?.(false)
    }
  })

  return null
}

/* ── Glass zoom/reset button ── */
function ZoomBtn({ label, onPress }) {
  return (
    <button
      onPointerUp={onPress}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(235,237,245,0.93) 100%)',
        border: 'none',
        borderRadius: 16,
        width: 60, height: 60,
        fontSize: label === '↺' ? 20 : 26,
        color: 'rgba(0,0,0,0.60)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow:
          '0 1px 0 rgba(255,255,255,1) inset,' +
          '0 -1px 0 rgba(0,0,0,0.06) inset,' +
          '0 4px 16px rgba(0,0,0,0.10),' +
          '0 0 0 1px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
      onPointerEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = 'rgba(0,0,0,0.85)' }}
      onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.color = 'rgba(0,0,0,0.60)' }}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.93)' }}
    >
      {label}
    </button>
  )
}

export default function ModelCanvas({
  modelPath, placeholderColor,
  hotspots, onHotspotSelect, activeHotspotId,
  showHotspots, autoRotate = true,
  focusCamera = null,
}) {
  const [modelExists, setModelExists] = useState(false)
  const [checked, setChecked] = useState(false)
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false)
  const orbitRef = useRef()

  useEffect(() => {
    if (!modelPath) { setChecked(true); return }
    fetch(modelPath, { method: 'HEAD' })
      .then(r => { setModelExists(r.ok); setChecked(true) })
      .catch(() => { setModelExists(false); setChecked(true) })
  }, [modelPath])

  function handleZoomIn()  { orbitRef.current?.dollyOut(1.25); orbitRef.current?.update() }
  function handleZoomOut() { orbitRef.current?.dollyIn(1.25);  orbitRef.current?.update() }
  function handleReset()   { orbitRef.current?.reset() }

  if (!checked) return null

  // autoRotate is suppressed while the camera is transitioning (lerping to focus
  // or back to hero). This prevents OrbitControls' update() from applying
  // auto-rotation and fighting the lerp, which would prevent arrival detection.
  const effectiveAutoRotate = autoRotate && !isCameraTransitioning && focusCamera === null
  const isLocked = focusCamera !== null

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: HERO_POSITION, fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 3]} intensity={0.9} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />

        <Suspense fallback={null}>
          {modelExists
            ? <Model path={modelPath} />
            : <PlaceholderModel color={placeholderColor} />
          }
        </Suspense>

        {showHotspots && hotspots?.map(hs => (
          <HotspotPin
            key={hs.id}
            hotspot={hs}
            isActive={activeHotspotId === hs.id}
            onSelect={onHotspotSelect}
          />
        ))}

        <CameraRig
          focusCamera={focusCamera}
          orbitRef={orbitRef}
          onTransitionStateChange={setIsCameraTransitioning}
        />

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={1.8}
          maxDistance={7}
          autoRotate={effectiveAutoRotate}
          autoRotateSpeed={0.6}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        />
      </Canvas>

      {/* CSS-only drop shadow */}
      <div style={{
        position: 'absolute', bottom: '13%', left: '50%',
        transform: 'translateX(-50%)',
        width: '42%', height: 22, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Zoom / Reset controls — hidden in focus mode */}
      {!isLocked && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 14, zIndex: 10,
        }}>
          <ZoomBtn label="−" onPress={handleZoomOut} />
          <ZoomBtn label="↺" onPress={handleReset} />
          <ZoomBtn label="+" onPress={handleZoomIn} />
        </div>
      )}
    </div>
  )
}
