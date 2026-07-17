import * as THREE from 'three'
import { SceneGraph } from '../SceneGraph.js'

/**
 * HierarchicalAdapter — builds a SceneGraph from a single hierarchical GLTF.
 *
 * Pipeline:
 *   1. Clone the GLTF scene (shares material refs with original by default).
 *   2. Clone every material so each mesh owns its own instance.
 *      Track clones in SceneGraph so dispose() can clean them up later.
 *   3. Traverse clone to discover named Object3D nodes with mesh content.
 *   4. Generate unique ids — handles empty names and duplicates.
 *   5. Register one SceneNode per discovered node.
 *   6. Normalize (scale + center) the assembly group.
 *
 * Material cloning (step 2) is required so InteractionEngine can dim/restore
 * individual meshes without cross-contaminating shared material instances.
 *
 * @param {object}   gltf
 * @param {object}   [opts]
 * @param {function} [opts.classifyFn]  — (sourceName: string|null) => string|null
 *   Must be referentially stable (module-scoped or memoised) to avoid
 *   rebuilding the graph on every render when used with useMemo.
 * @param {number}   [opts.targetSize=1.8]
 * @returns {SceneGraph}
 */
export function adaptHierarchical(gltf, { classifyFn = null, targetSize = 1.8 } = {}) {
  const graph = new SceneGraph()
  if (!gltf?.scene) return graph

  const clone = gltf.scene.clone(true)

  // Break shared-material references so InteractionEngine can isolate independently.
  // THREE.js clone(true) shares material instances — each mesh must own its own copy.
  clone.traverse(obj => {
    if (!obj.isMesh) return
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map(m => {
        const c = m.clone()
        graph.trackMaterial(c)
        return c
      })
    } else if (obj.material) {
      const c = obj.material.clone()
      graph.trackMaterial(c)
      obj.material = c
    }
  })

  graph.group.add(clone)

  const seen       = new Set()
  const nameCounts = new Map()  // rawName → times seen (for duplicate resolution)
  let   anonCount  = 0

  clone.traverse(obj => {
    // Generate deterministic unique id
    const rawName = obj.name || null
    let   id

    if (!rawName) {
      id = `node_${anonCount++}`
    } else {
      const prev = nameCounts.get(rawName) ?? 0
      nameCounts.set(rawName, prev + 1)
      id = prev === 0 ? rawName : `${rawName}_${prev + 1}`
    }

    if (seen.has(id)) return

    // Only register nodes that have actual mesh content
    let hasMesh = false
    obj.traverse(c => { if (c.isMesh) hasMesh = true })
    if (!hasMesh) return

    seen.add(id)

    let triCount = 0
    const matNames = new Set()
    obj.traverse(m => {
      if (!m.isMesh || !m.geometry) return
      triCount += m.geometry.index
        ? m.geometry.index.count / 3
        : m.geometry.attributes.position.count / 3
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach(mat => mat.name && matNames.add(mat.name))
    })

    graph.registerNode(id, obj, {
      // sourceName: the original GLTF node name (null for unnamed nodes)
      sourceName:    rawName,
      // label: display name; falls back to id for unnamed nodes
      label:         rawName || id,
      // system: semantic category string returned by classifyFn
      system:        classifyFn ? classifyFn(rawName) : null,
      triCount:      Math.round(triCount),
      materialNames: [...matNames],
    })
  })

  graph.normalize({ targetSize })
  return graph
}

/**
 * discoverNodes — lightweight inspection utility.
 * Returns node descriptors from the original (un-cloned) GLTF scene.
 * Safe for read-only use; do NOT mutate the returned objects.
 *
 * @param {object}   gltf
 * @param {object}   [opts]
 * @param {function} [opts.classifyFn]
 * @returns {{ name: string, triCount: number, materialNames: string[], system: string|null }[]}
 */
export function discoverNodes(gltf, { classifyFn = null } = {}) {
  if (!gltf?.scene) return []

  const result = []
  const seen   = new Set()

  gltf.scene.traverse(obj => {
    if (!obj.name || seen.has(obj.name)) return
    let hasMesh = false
    obj.traverse(c => { if (c.isMesh) hasMesh = true })
    if (!hasMesh) return
    seen.add(obj.name)

    let triCount = 0
    const matNames = new Set()
    obj.traverse(m => {
      if (!m.isMesh || !m.geometry) return
      triCount += m.geometry.index
        ? m.geometry.index.count / 3
        : m.geometry.attributes.position.count / 3
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach(mat => mat.name && matNames.add(mat.name))
    })

    result.push({
      name:          obj.name,
      triCount:      Math.round(triCount),
      materialNames: [...matNames],
      system:        classifyFn ? classifyFn(obj.name) : null,
    })
  })

  return result
}
