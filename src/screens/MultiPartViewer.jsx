import { useState } from 'react'
import MultiPartCanvas from '../components/MultiPartCanvas.jsx'

export default function MultiPartViewer({ useCase, onBack }) {
  const [showEnv, setShowEnv] = useState(false)

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

        <button
          onPointerUp={() => setShowEnv(v => !v)}
          style={{
            marginLeft: 'auto',
            background: showEnv
              ? 'rgba(0,0,0,0.80)'
              : 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: showEnv
              ? '1px solid rgba(255,255,255,0.10)'
              : '1px solid rgba(0,0,0,0.08)',
            borderRadius: 22,
            height: 40,
            padding: '0 18px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.10em',
            color: showEnv ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.50)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {showEnv ? 'STUDIO' : 'FLAT'}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiPartCanvas parts={useCase.parts} showEnv={showEnv} />
      </div>
    </div>
  )
}
