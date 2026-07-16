import MultiPartCanvas from '../components/MultiPartCanvas.jsx'

/*
 * Minimal viewer for multi-part assemblies.
 * No hotspots, panels, or modals in this sprint — rendering proof only.
 */
export default function MultiPartViewer({ useCase, onBack }) {
  return (
    <div
      className="screen-enter"
      style={{
        width: '100%', height: '100%',
        background: 'transparent',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative',
      }}
    >
      <div className="viewer-header">
        <button className="back-btn" onPointerUp={onBack}>← Volver</button>
        <span className="title">{useCase.emoji} {useCase.label}</span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiPartCanvas parts={useCase.parts} />
      </div>
    </div>
  )
}
