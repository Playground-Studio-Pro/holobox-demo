import * as THREE from 'three'

/**
 * SceneGraph — canonical node registry shared by all adapters.
 */
export class SceneGraph {
  constructor() {
    this.group = new THREE.Group()
    this._nodes = new Map()
    this._normalized = false
    this._ownedMaterials = []
  }

  registerNode(id, object, meta = {}) {
    const node = new SceneNode(id, object, meta)
    this._nodes.set(id, node)
    return node
  }

  getNode(id)      { return this._nodes.get(id) }
  getAllNodes()     { return [...this._nodes.values()] }
  get nodeCount()  { return this._nodes.size }

  trackMaterial(mat) { this._ownedMaterials.push(mat) }

  dispose() {
    this._ownedMaterials.forEach(mat => { try { mat.dispose() } catch (_) {} })
    this._ownedMaterials = []
  }

  normalize({ targetSize = 1.8 } = {}) {
    const g = this.group
    g.position.set(0, 0, 0)
    g.rotation.set(0, 0, 0)
    g.scale.set(1, 1, 1)
    g.updateMatrixWorld(true)

    const box    = new THREE.Box3().setFromObject(g)
    if (box.isEmpty()) return

    const size   = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return

    const scale  = targetSize / maxDim
    const center = box.getCenter(new THREE.Vector3())
    g.scale.setScalar(scale)
    g.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    g.updateMatrixWorld(true)

    this._nodes.forEach(node => node._snapshot())
    this._normalized = true
  }

  /**
   * Compute a camera that frames a group of nodes by their combined bbox.
   * Falls back to a single node's focusCamera() when nodeIds has one entry.
   * @param {string[]} nodeIds
   * @param {object}   [overrides] — forwarded to SceneNode.focusCamera
   * @returns {{ position: number[], target: number[] } | null}
   */
  groupCamera(nodeIds, overrides = {}) {
    if (!nodeIds?.length) return null
    const nodes = nodeIds.map(id => this._nodes.get(id)).filter(Boolean)
    if (!nodes.length) return null
    if (nodes.length === 1) return nodes[0].focusCamera(overrides)

    const combined = new THREE.Box3()
    nodes.forEach(n => { if (n.bbox) combined.union(n.bbox) })
    if (combined.isEmpty()) return null

    const c      = combined.getCenter(new THREE.Vector3())
    const s      = combined.getSize(new THREE.Vector3())
    const maxDim = Math.max(s.x, s.y, s.z)
    const mult   = overrides.distanceMultiplier ?? 2.0
    const minD   = overrides.minDistance ?? 0.4
    const dist   = Math.max(maxDim * mult, minD)
    const camOff = overrides.cameraOffset ?? [0, 0.25, 1.1]
    const tgtOff = overrides.targetOffset ?? [0, 0, 0]
    return {
      position: [c.x + camOff[0] * dist, c.y + camOff[1] * dist, c.z + camOff[2] * dist],
      target:   [c.x + tgtOff[0],        c.y + tgtOff[1],        c.z + tgtOff[2]],
    }
  }

  get isNormalized() { return this._normalized }
}

export class SceneNode {
  constructor(id, object, meta = {}) {
    this.id     = id
    this.object = object
    this.meta   = meta
    this.bbox   = null
    this.center = null
    this.size   = null
  }

  _snapshot() {
    this.bbox   = new THREE.Box3().setFromObject(this.object)
    const c     = this.bbox.getCenter(new THREE.Vector3())
    const s     = this.bbox.getSize(new THREE.Vector3())
    this.center = c.toArray()
    this.size   = s.toArray()
  }

  /**
   * @param {object} [overrides]
   * @param {number} [overrides.distanceMultiplier]
   * @param {number} [overrides.minDistance]
   * @param {number[]} [overrides.cameraOffset]
   * @param {number[]} [overrides.targetOffset]
   */
  focusCamera(overrides = {}) {
    if (!this.center) return null
    const [cx, cy, cz] = this.center
    const maxDim = Math.max(...this.size)
    const mult   = overrides.distanceMultiplier ?? this.meta.camera?.distanceMultiplier ?? 2.0
    const minD   = overrides.minDistance        ?? this.meta.camera?.minDistance        ?? 0.4
    const dist   = Math.max(maxDim * mult, minD)
    const camOff = overrides.cameraOffset ?? this.meta.camera?.cameraOffset ?? [0, 0.25, 1.1]
    const tgtOff = overrides.targetOffset ?? this.meta.camera?.targetOffset ?? [0, 0, 0]
    return {
      position: [cx + camOff[0] * dist, cy + camOff[1] * dist, cz + camOff[2] * dist],
      target:   [cx + tgtOff[0],        cy + tgtOff[1],        cz + tgtOff[2]],
    }
  }
}
