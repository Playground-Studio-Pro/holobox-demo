export default function HotspotCard({ hotspot, onClose }) {
  if (!hotspot) return null

  return (
    <div
      key={hotspot.id}
      style={{
        position: 'absolute',
        top: '22%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        width: 'min(340px, 78%)',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 22,
        padding: '24px 22px 22px',
        boxShadow:
          '0 1px 0 rgba(255,255,255,1) inset,' +
          '0 16px 48px rgba(0,0,0,0.14),' +
          '0 0 0 1px rgba(0,0,0,0.07)',
        animation: 'hotspotCardIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        pointerEvents: 'auto',
      }}
      onPointerUp={e => e.stopPropagation()}
    >
      {/* Color accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 24, right: 24,
        height: 3,
        borderRadius: '0 0 3px 3px',
        background: 'linear-gradient(90deg, rgba(99,102,241,0.8), rgba(139,92,246,0.6))',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
      }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          color: 'rgba(0,0,0,0.84)',
          letterSpacing: '0.01em',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {hotspot.label}
        </h3>
        <button
          onPointerUp={onClose}
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: 9,
            width: 32, height: 32,
            fontSize: 14,
            color: 'rgba(0,0,0,0.35)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 12,
            marginTop: -2,
          }}
        >✕</button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 14 }} />

      {/* Description */}
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(0,0,0,0.58)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {hotspot.description}
      </p>
    </div>
  )
}
