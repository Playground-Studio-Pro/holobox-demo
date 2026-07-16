import { useMemo, useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/*
 * Loads every part in the manifest simultaneously (single Suspense boundary),
 * clones each cached scene without touching the original, then renders all
 * clones inside one shared assembly group.
 *
 * Normalization rule: the assembly group is centered and uniformly scaled once,
 * AFTER all clones are committed to the Three.js scene graph. Individual part
 * transforms are never modified — they carry the relative positions exported
 * from the source 3D package.
 *
 * props.parts — array of { id, label, path, group, defaultVisible }
 * props.onReady — called after the first frame renders the normalized assembly
 */
export default function MultiPartModel({ parts, onReady }) {
  const visibleParts = useMemo(
    () => parts.filter(p => p.defaultVisible !== false),
    [parts]
  )

  const paths = useMemo(() => visibleParts.map(p => p.path), [visibleParts])

  // Load all parts at once. useGLTF suspends the component until every path
  // in the array is ready, then resolves with an GLTF[] in the same order.
  const gltfResult = useGLTF(paths)
  const gltfArray  = Array.isArray(gltfResult) ? gltfResult : [gltfResult]

  // Clone every cached scene. Cloning preserves all transforms encoded in the
  // GLB (position, rotation, scale at every node level) while keeping the
  // shared geometry/material resources intact on the original cached scene.
  // Never mutate gltf.scene directly — the cache hands out the same object
  // reference on every call, so mutations would compound on the next visit.
  const clones = useMemo(
    () => gltfArray.map(g => g.scene.clone(true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gltfResult]
  )

  const groupRef       = useRef()
  const { invalidate } = useThree()
  const pendingReadyRef = useRef(false)
  const onReadyRef      = useRef(onReady)
  useEffect(() => { onReadyRef.current = onReady }, [onReady])

  useEffect(() => {
    pendingReadyRef.current = false
    const group = groupRef.current
    if (!group) return

    // Reset the assembly group to identity before measuring.
    // Individual clone transforms are left untouched — they encode relative
    // positions and must be preserved for the assembly to appear correct.
    group.position.set(0, 0, 0)
    group.rotation.set(0, 0, 0)
    group.scale.set(1, 1, 1)
    group.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(group)

    if (box.isEmpty()) {
      console.warn('[MultiPartModel] Assembly bounding box is empty — verify part GLB paths and transforms')
      onReadyRef.current?.()
      return
    }

    const center = box.getCenter(new THREE.Vector3())
    const size   = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) { onReadyRef.current?.(); return }

    const scale = 1.8 / maxDim
    group.scale.setScalar(scale)
    group.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    group.updateMatrixWorld(true)

    invalidate()
    pendingReadyRef.current = true
  }, [clones, invalidate])

  useFrame(() => {
    if (pendingReadyRef.current) {
      pendingReadyRef.current = false
      onReadyRef.current?.()
    }
  })

  return (
    <group ref={groupRef}>
      {clones.map((clone, i) => (
        <primitive key={visibleParts[i].id} object={clone} dispose={null} />
      ))}
    </group>
  )
}
