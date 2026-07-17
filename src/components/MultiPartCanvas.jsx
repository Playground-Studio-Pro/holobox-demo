import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import MultiPartModel from './MultiPartModel.jsx'

const OVERVIEW_POSITION = [0, 0.5, 4.5]
const OVERVIEW_TARGET   = [0, 0,   0  ]

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

/*
 * CameraRig — lerps camera toward cinemaCamera when set, otherwise returns
 * to OVERVIEW_POSITION. Disables OrbitControls while animating or in focus.
 *
 * props.cinemaCamera — { position: [x,y,z], target: [x,y,z] } | null
 * props.orbitRef     — ref to the OrbitControls instance
 */
function CameraRig({ cinemaCamera, orbitRef }) {
  const { camera } = useThree()
  const targetPos    = useRef(new THREE.Vector3(...OVERVIEW_POSITION))
  const targetLookAt = useRef(new THREE.Vector3(...OVERVIEW_TARGET))
  const inFocusMode  = useRef(false)
  const isAnimating  = useRef(false)
  const isMounted    = useRef(false)

  useEffect(() => {
    // Skip the initial mount — camera starts at overview, no transition needed.
    if (!isMounted.current) { isMounted.current = true; return }

    if (cinemaCamera) {
      inFocusMode.current = true
      targetPos.current.set(...cinemaCamera.position)
      targetLookAt.current.set(...cinemaCamera.target)
    } else {
      inFocusMode.current = false
      targetPos.current.set(...OVERVIEW_POSITION)
      targetLookAt.current.set(...OVERVIEW_TARGET)
    }
    isAnimating.current = true

    if (orbitRef.current) {
      orbitRef.current.enabled    = false
      orbitRef.current.autoRotate = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinemaCamera])

  useFrame(() => {
    if (!isAnimating.current) return

    camera.position.lerp(targetPos.current, 0.05)
    if (orbitRef.current) {
      orbitRef.current.target.lerp(targetLookAt.current, 0.05)
      orbitRef.current.update()
    }

    const posArrived = camera.position.distanceTo(targetPos.current) < 0.008
    const tgtArrived = !orbitRef.current ||
      orbitRef.current.target.distanceTo(targetLookAt.current) < 0.008

    if (posArrived && tgtArrived) {
      camera.position.copy(targetPos.current)
      if (orbitRef.current) {
        orbitRef.current.target.copy(targetLookAt.current)
        orbitRef.current.update()
        // Re-enable orbit in both directions:
        // — focus arrival: user can inspect the part freely (no autoRotate)
        // — overview return: also re-enable autoRotate
        orbitRef.current.enabled    = true
        orbitRef.current.autoRotate = !inFocusMode.current
      }
      isAnimating.current = false
    }
  })

  return null
}

/*
 * Transparent Canvas for multi-part assemblies.
 * Renders MultiPartModel inside a single Suspense boundary so all parts
 * appear at once after loading — not one by one.
 *
 * props.parts           — array of { id, label, path, group, defaultVisible }
 * props.onReady         — forwarded to MultiPartModel
 * props.onAssemblyReady — forwarded to MultiPartModel; called with { [partId]: clone }
 * props.showEnv         — toggle Studio environment map
 * props.cinemaCamera    — { position, target } | null; drives CameraRig
 * props.focusPartId     — forwarded to MultiPartModel for opacity isolation
 */
export default function MultiPartCanvas({
  parts,
  onReady,
  onAssemblyReady,
  showEnv = false,
  cinemaCamera = null,
  focusPartId,
}) {
  const orbitRef = useRef()

  useEffect(() => {
    parts
      .filter(p => p.defaultVisible !== false)
      .forEach(p => useGLTF.preload(p.path))
  }, [parts])

  function handleZoomIn()  { orbitRef.current?.dollyOut(1.25); orbitRef.current?.update() }
  function handleZoomOut() { orbitRef.current?.dollyIn(1.25);  orbitRef.current?.update() }
  function handleReset()   { orbitRef.current?.reset() }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: OVERVIEW_POSITION, fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 6, 4]}  intensity={1.0} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />
        <directionalLight position={[0, -2, 2]}  intensity={0.2} />

        {showEnv && <Environment preset="studio" background={false} />}

        <CameraRig cinemaCamera={cinemaCamera} orbitRef={orbitRef} />

        <Suspense fallback={null}>
          <MultiPartModel
            parts={parts}
            onReady={onReady}
            onAssemblyReady={onAssemblyReady}
            focusPartId={focusPartId}
          />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={0.6}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        />
      </Canvas>

      {/* Drop shadow */}
      <div style={{
        position: 'absolute', bottom: '12%', left: '50%',
        transform: 'translateX(-50%)',
        width: '55%', height: 24, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Zoom / Reset controls — hidden in cinema mode */}
      {!cinemaCamera && (
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
