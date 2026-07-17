import { useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { adaptMultiPart }    from '../engine/adapters/MultiPartAdapter.js'
import { InteractionEngine } from '../engine/InteractionEngine.js'

/*
 * Loads every part simultaneously (single Suspense boundary),
 * builds a SceneGraph via adaptMultiPart (includes normalization + material cloning),
 * and renders the assembly group.
 *
 * props.parts        — { id, label, path, group, defaultVisible }[]
 * props.onGraphReady — (SceneGraph) => void — fired after normalization
 * props.focusNodeIds — string[] | undefined
 *   undefined → no-op (keeps current state)
 *   []        → engine.reset() — restore all to full opacity
 *   [ids…]    → engine.highlightMany(ids)
 */
export default function MultiPartModel({ parts, onGraphReady, focusNodeIds }) {
  const visibleParts = useMemo(
    () => parts.filter(p => p.defaultVisible !== false),
    [parts]
  )
  const paths = useMemo(() => visibleParts.map(p => p.path), [visibleParts])

  const gltfResult = useGLTF(paths)
  const gltfArray  = Array.isArray(gltfResult) ? gltfResult : [gltfResult]

  const { invalidate } = useThree()

  const graph  = useMemo(
    () => adaptMultiPart(gltfArray, visibleParts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gltfResult]
  )
  const engine = useMemo(() => new InteractionEngine(graph), [graph])

  useEffect(() => {
    return () => { graph.dispose() }
  }, [graph])

  useEffect(() => {
    invalidate()
    onGraphReady?.(graph)
  }, [graph, invalidate, onGraphReady])

  useEffect(() => {
    if (focusNodeIds === undefined) return
    if (!focusNodeIds.length) {
      engine.reset()
    } else {
      engine.highlightMany(focusNodeIds)
    }
    invalidate()
  }, [focusNodeIds, engine, invalidate])

  return <primitive object={graph.group} dispose={null} />
}
