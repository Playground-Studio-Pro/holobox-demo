import { USE_CASES } from '../data/usecases.js'

export default function Menu({ onBack, onSelect }) {
  return (
    <div
      className="screen-enter"
      style={{
        width: '100%', height: '100%',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="viewer-header">
        <button className="back-btn" onPointerUp={onBack}>
          ← Back
        </button>
        <span className="title">Select Experience</span>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
        padding: '32px 40px',
        alignContent: 'center',
        overflowY: 'auto',
      }}>
        {USE_CASES.filter(uc => !uc.debugOnly && uc.visibility !== 'hidden' && uc.type !== 'internal').map((uc, i) => (
          <button
            key={uc.id}
            className="category-card"
            style={{
              animationDelay: `${i * 0.06}s`,
              background: `linear-gradient(160deg, rgba(255,255,255,0.95) 0%, ${uc.color} 100%)`,
              minHeight: 140,
            }}
            onPointerUp={() => onSelect(uc)}
          >
            <span className="icon">{uc.emoji}</span>
            <span className="label">{uc.label}</span>
            <span className="sublabel">{uc.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
