/**
 * InteractionEngine — opacity-based highlight/dim for SceneGraph nodes.
 *
 * Modifies and restores ONLY: opacity, transparent, depthWrite.
 * Does NOT modify material.visible — use node.object.visible for that.
 *
 * Material safety:
 *   - Original values are saved on first encounter per material.uuid.
 *   - Saved values are never overwritten across isolation cycles.
 *   - Reset restores exact originals — preserves originally-transparent materials.
 *   - Requires adapters to clone materials upfront (no shared-material conflicts).
 *
 * Multi-node support:
 *   highlight(nodeId)        — isolate a single node
 *   highlightMany(nodeIds)   — isolate multiple nodes as one system
 *   reset()                  — restore all materials to original state
 */
export class InteractionEngine {
  /**
   * @param {import('./SceneGraph.js').SceneGraph} graph
   */
  constructor(graph) {
    this._graph    = graph
    /** @type {string|null} id of the single highlighted node (null if multi or overview) */
    this._activeId  = null
    /** @type {Set<string>|null} ids when multiple nodes are highlighted */
    this._activeIds = null
    /**
     * @type {Map<string, {opacity: number, transparent: boolean, depthWrite: boolean}>}
     * material.uuid → original state; captured once, never overwritten
     */
    this._saved    = new Map()
  }

  /** @returns {string|null} */
  get activeId() { return this._activeId }

  /**
   * Highlight a single node; dim all others.
   * @param {string} nodeId
   * @param {object} [opts]
   * @param {number} [opts.dimOpacity=0.06]
   */
  highlight(nodeId, { dimOpacity = 0.06 } = {}) {
    this._activeId  = nodeId
    this._activeIds = null
    this._applyToGroup(new Set([nodeId]), dimOpacity)
  }

  /**
   * Highlight multiple nodes as one system; dim all others.
   * Highlighted nodes retain their original material state.
   * Works with both hierarchical and multi-part graphs.
   *
   * @param {string[]} nodeIds
   * @param {object}   [opts]
   * @param {number}   [opts.dimOpacity=0.06]
   */
  highlightMany(nodeIds, { dimOpacity = 0.06 } = {}) {
    this._activeIds = new Set(nodeIds)
    this._activeId  = nodeIds.length === 1 ? nodeIds[0] : null
    this._applyToGroup(this._activeIds, dimOpacity)
  }

  /**
   * Restore all nodes to their original material state.
   */
  reset() {
    this._activeId  = null
    this._activeIds = null
    this._applyToGroup(new Set(), 0.06)  // empty set = restore all
  }

  /**
   * Toggle: highlight if not active, reset if already the active node.
   * @param {string} nodeId
   * @returns {boolean} true if now highlighted, false if reset
   */
  toggle(nodeId) {
    if (this._activeId === nodeId && !this._activeIds) { this.reset(); return false }
    this.highlight(nodeId)
    return true
  }

  /** Save original state on first encounter. Idempotent — never overwrites. */
  _saveMat(mat) {
    if (this._saved.has(mat.uuid)) return
    this._saved.set(mat.uuid, {
      opacity:     mat.opacity,
      transparent: mat.transparent,
      depthWrite:  mat.depthWrite,
    })
  }

  /**
   * Core isolation pass. Traverses all meshes in the graph group.
   * For each mesh, walks up the parent chain to test ancestry against the
   * set of active Object3D references. Using object references (not IDs)
   * is faster than repeated string lookups in the inner loop.
   *
   * @param {Set<string>} activeNodeIds — node IDs to highlight; empty set = restore all
   * @param {number}      dimOpacity
   */
  _applyToGroup(activeNodeIds, dimOpacity) {
    // Pre-resolve node IDs to Object3D references for O(1) ancestry checks
    const activeObjects = new Set()
    activeNodeIds.forEach(id => {
      const node = this._graph.getNode(id)
      if (node) activeObjects.add(node.object)
    })

    const restoreAll = activeObjects.size === 0

    this._graph.group.traverse(obj => {
      if (!obj.isMesh) return

      // Determine highlight status once per mesh, before iterating materials
      let isHighlighted = restoreAll
      if (!restoreAll) {
        let p = obj
        while (p) {
          if (activeObjects.has(p)) { isHighlighted = true; break }
          p = p.parent
        }
      }

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(mat => {
        this._saveMat(mat)
        const orig = this._saved.get(mat.uuid)

        if (isHighlighted) {
          // Restore exact original values — handles glass, decals, partially transparent mats
          mat.opacity     = orig.opacity
          mat.transparent = orig.transparent
          mat.depthWrite  = orig.depthWrite
        } else {
          mat.transparent = true
          mat.opacity     = dimOpacity
          mat.depthWrite  = false
        }
        mat.needsUpdate = true
      })
    })
  }

  /** @deprecated Use _applyToGroup — kept for call-site compatibility */
  _applyOpacity(activeNodeId, dimOpacity) {
    this._applyToGroup(activeNodeId ? new Set([activeNodeId]) : new Set(), dimOpacity)
  }
}
