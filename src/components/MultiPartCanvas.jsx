import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import MultiPartModel from './MultiPartModel.jsx'

const CAMERA_POSITION = [0, 0.5, 4.5]

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
 * Transparent Canvas for multi-part assemblies.
 * Renders MultiPartModel inside a single Suspense boundary so all parts
 * appear at once after loading — not one by one.
 *
 * props.parts — array of { id, label, path, group, defaultVisible }
 * props.onReady — forwarded to MultiPartModel
 */
export default function MultiPartCanvas({ parts, onReady }) {
  const orbitRef = useRef()

  // Kick off all GLB fetches as soon as this component mounts so the files
  // are in the browser cache when the inner Suspense resolves.
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
        camera={{ position: CAMERA_POSITION, fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 6, 4]}  intensity={1.0} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />
        <directionalLight position={[0, -2, 2]}  intensity={0.2} />

        <Suspense fallback={null}>
          <MultiPartModel parts={parts} onReady={onReady} />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={2}
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

      {/* Zoom / Reset controls */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 14, zIndex: 10,
      }}>
        <ZoomBtn label="−" onPress={handleZoomOut} />
        <ZoomBtn label="↺" onPress={handleReset} />
        <ZoomBtn label="+" onPress={handleZoomIn} />
      </div>
    </div>
  )
}
