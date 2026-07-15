import { useState } from 'react'

export default function Hotspot({ hotspot, containerRef, onSelect }) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Positions are expressed as percentages of the canvas for placeholder mode.
  // When real GLB is loaded this mapping will be replaced with projected 3D coords.
  // For now we derive a stable 2D position from the 3D hint position array.
  const [px, py, pz] = hotspot.position
  // Map x: -1..1 → 20%..80%, y: -1..1 → 80%..20% (inverted)
  const left = `${((px + 1) / 2) * 60 + 20}%`
  const top  = `${((- py + 1) / 2) * 60 + 15}%`

  function handleTap(e) {
    e.stopPropagation()
    if (showTooltip) {
      onSelect(hotspot)
      setShowTooltip(false)
    } else {
      setShowTooltip(true)
    }
  }

  function handleBlur() {
    setTimeout(() => setShowTooltip(false), 200)
  }

  return (
    <div
      className="hotspot-wrapper"
      style={{ left, top }}
      onPointerUp={handleTap}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <div className="hotspot-dot" />
      {showTooltip && (
        <div className="hotspot-tooltip">{hotspot.label}</div>
      )}
    </div>
  )
}
