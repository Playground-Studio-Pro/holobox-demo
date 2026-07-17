import { SceneGraph } from '../SceneGraph.js'

/**
 * MultiPartAdapter — builds a SceneGraph from an array of GLTF results.
 *
 * Each GLTF corresponds to one "part" (an independent GLB file).
 * Materials are cloned per-mesh so InteractionEngine can isolate parts
 * without shared-material cross-contamination. Clones are tracked in
 * the SceneGraph for disposal on teardown.
 *
 * @param {object[]} gltfResults — GLTF objects (must have .scene)
 * @param {object[]} parts       — part descriptors matching gltfResults by index
 *   { id, label, group, defaultVisible }
 * @param {object}   [opts]
 * @param {number}   [opts.targetSize=1.8]
 * @returns {SceneGraph}
 */
export function adaptMultiPart(gltfResults, parts, { targetSize = 1.8 } = {}) {
  const graph = new SceneGraph()

  parts.forEach((part, i) => {
    const gltf = gltfResults[i]
    if (!gltf?.scene) return

    const clone = gltf.scene.clone(true)

    // Clone materials so each mesh owns its own instance.
    // Prevents shared-material conflicts during opacity isolation.
    // Track clones in SceneGraph so dispose() can clean them up.
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

    let triCount = 0
    const matNames = new Set()
    clone.traverse(obj => {
      if (!obj.isMesh || !obj.geometry) return
      triCount += obj.geometry.index
        ? obj.geometry.index.count / 3
        : obj.geometry.attributes.position.count / 3
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => m.name && matNames.add(m.name))
    })

    graph.registerNode(part.id, clone, {
      label:          part.label,
      group:          part.group,
      defaultVisible: part.defaultVisible ?? true,
      triCount:       Math.round(triCount),
      materialNames:  [...matNames],
    })
  })

  graph.normalize({ targetSize })
  return graph
}
