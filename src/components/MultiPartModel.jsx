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
 * props.parts            — array of { id, label, path, group, defaultVisible }
 * props.onReady          — called after the first frame renders the normalized assembly
 * props.onAssemblyReady  — called with { [partId]: clone } map after normalization
 * props.focusPartId      — when set, dims all clones except this one to 10% opacity;
 *                          when null, restores all to full opacity
 */
export default function MultiPartModel({ parts, onReady, onAssemblyReady, focusPartId }) {
  const visibleParts = useMemo(
    () => parts.filter(p => p.defaultVisible !== false),
    [parts]
  )

  const paths = useMemo(() => visibleParts.map(p => p.path), [visibleParts])

  const gltfResult = useGLTF(paths)
  const gltfArray  = Array.isArray(gltfResult) ? gltfResult : [gltfResult]

  const clones = useMemo(
    () => gltfArray.map(g => g.scene.clone(true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gltfResult]
  )

  const groupRef              = useRef()
  const { invalidate }        = useThree()
  const pendingReadyRef       = useRef(false)
  const pendingAssemblyReady  = useRef(false)
  const onReadyRef            = useRef(onReady)
  const onAssemblyReadyRef    = useRef(onAssemblyReady)
  useEffect(() => { onReadyRef.current = onReady },            [onReady])
  useEffect(() => { onAssemblyReadyRef.current = onAssemblyReady }, [onAssemblyReady])

  // ── Normalization ──────────────────────────────────────────────────────────
  useEffect(() => {
    pendingReadyRef.current      = false
    pendingAssemblyReady.current = false
    const group = groupRef.current
    if (!group) return

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
    pendingReadyRef.current      = true
    pendingAssemblyReady.current = true
  }, [clones, invalidate])

  // ── Opacity isolation ──────────────────────────────────────────────────────
  // focusPartId === undefined  → prop not provided, skip (keeps default state)
  // focusPartId === null       → restore all to full opacity
  // focusPartId === 'aero_0'   → highlight that clone, dim everything else
  useEffect(() => {
    if (focusPartId === undefined) return
    clones.forEach((clone, i) => {
      const isHighlighted = focusPartId === null || visibleParts[i].id === focusPartId
      clone.traverse(obj => {
        if (!obj.isMesh) return
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(mat => {
          mat.transparent = !isHighlighted
          mat.opacity     = isHighlighted ? 1.0 : 0.10
          mat.needsUpdate = true
        })
      })
    })
  }, [focusPartId, clones, visibleParts])

  // ── Per-frame callbacks ────────────────────────────────────────────────────
  useFrame(() => {
    // Fire onReady + onAssemblyReady one frame after normalization so Three.js
    // has committed the updated transforms to the scene.
    if (pendingReadyRef.current) {
      pendingReadyRef.current = false
      onReadyRef.current?.()
    }
    if (pendingAssemblyReady.current) {
      pendingAssemblyReady.current = false
      const cloneMap = {}
      visibleParts.forEach((p, i) => { cloneMap[p.id] = clones[i] })
      onAssemblyReadyRef.current?.(cloneMap)
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
