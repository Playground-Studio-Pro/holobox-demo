import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { adaptHierarchical } from '../engine/adapters/HierarchicalAdapter.js'
import { InteractionEngine }  from '../engine/InteractionEngine.js'
import CameraEngine           from '../engine/CameraEngine.jsx'

const GLB_PATH          = '/models/automotive/ferrari-f2008/F2008_web_final.glb'
const OVERVIEW_POSITION = [0, 0.5, 4.5]
const OVERVIEW_TARGET   = [0, 0, 0]

/* ── F2008Model ─────────────────────────────────────────────────────────── */
/*
 * props.selectedMeshName — single SceneNode id (inspector use; overridden by focusNodeIds)
 *   NOTE: carries a SceneNode id, not a raw GLTF name. Future rename: selectedNodeId.
 * props.focusNodeIds     — string[] — multi-node isolation (tour use; takes precedence)
 *   undefined → no-op; [] → reset; [ids…] → highlightMany
 * props.onMeshesReady    — (SceneNode[]) => void
 * props.onGraphReady     — (SceneGraph) => void — for variant visibility management
 * props.classifyFn       — (name: string|null) => string|null — MUST be module-scoped/stable
 */
function F2008Model({ selectedMeshName, focusNodeIds, onMeshesReady, onGraphReady, classifyFn }) {
  const gltf           = useGLTF(GLB_PATH)
  const { invalidate } = useThree()

  const graph  = useMemo(() => adaptHierarchical(gltf, { classifyFn }), [gltf, classifyFn])
  const engine = useMemo(() => new InteractionEngine(graph), [graph])

  useEffect(() => { return () => { graph.dispose() } }, [graph])

  useEffect(() => {
    invalidate()
    onMeshesReady?.(graph.getAllNodes())
    onGraphReady?.(graph)
  }, [graph, invalidate, onMeshesReady, onGraphReady])

  useEffect(() => {
    // focusNodeIds (tour) takes precedence over selectedMeshName (inspector)
    const ids = focusNodeIds?.length
      ? focusNodeIds
      : selectedMeshName
        ? [selectedMeshName]
        : null

    if (!ids?.length) {
      engine.reset()
    } else if (ids.length === 1) {
      engine.highlight(ids[0])
    } else {
      engine.highlightMany(ids)
    }
    invalidate()
  }, [selectedMeshName, focusNodeIds, engine, invalidate])

  return <primitive object={graph.group} dispose={null} />
}

/* ── F2008Canvas ─────────────────────────────────────────────────────────── */
/*
 * props.selectedMeshName — inspector: single node id (prototype viewer)
 * props.focusNodeIds     — tour: string[] for multi-node isolation
 * props.onMeshesReady    — (SceneNode[]) => void
 * props.onGraphReady     — (SceneGraph) => void
 * props.focusCamera      — { position, target } | null
 * props.showEnv          — toggle studio environment
 * props.classifyFn       — must be referentially stable (module-scoped)
 */
export default function F2008Canvas({
  selectedMeshName = null,
  focusNodeIds,
  onMeshesReady,
  onGraphReady,
  focusCamera      = null,
  showEnv          = false,
  classifyFn,
}) {
  const orbitRef = useRef()

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
        <directionalLight position={[4, 6, 4]}   intensity={1.0} />
        <directionalLight position={[-3, 2, -3]}  intensity={0.4} />
        <directionalLight position={[0, -2, 2]}   intensity={0.2} />

        {showEnv && <Environment preset="studio" background={false} />}

        <CameraEngine
          target={focusCamera}
          overviewPosition={OVERVIEW_POSITION}
          overviewTarget={OVERVIEW_TARGET}
          orbitRef={orbitRef}
        />

        <Suspense fallback={null}>
          <F2008Model
            selectedMeshName={selectedMeshName}
            focusNodeIds={focusNodeIds}
            onMeshesReady={onMeshesReady}
            onGraphReady={onGraphReady}
            classifyFn={classifyFn}
          />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={0.4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.4}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: '12%', left: '50%',
        transform: 'translateX(-50%)',
        width: '55%', height: 24, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
