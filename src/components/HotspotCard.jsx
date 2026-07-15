export default function HotspotCard({ hotspot, onClose }) {
  if (!hotspot) return null

  const hasSpecs   = hotspot.specs?.length > 0
  const hasEyebrow = Boolean(hotspot.eyebrow)

  return (
    <div
      key={hotspot.id}
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        width: 'min(360px, 80%)',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 20,
        padding: hasSpecs ? '22px 22px 20px' : '22px 22px 20px',
        boxShadow:
          '0 1px 0 rgba(255,255,255,1) inset,' +
          '0 16px 48px rgba(0,0,0,0.12),' +
          '0 0 0 1px rgba(0,0,0,0.06)',
        animation: 'hotspotCardIn 0.26s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        pointerEvents: 'auto',
      }}
      onPointerUp={e => e.stopPropagation()}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Eyebrow — shown only for rich-schema hotspots (fashion) */}
          {hasEyebrow && (
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.32)',
              marginBottom: 5,
            }}>
              {hotspot.eyebrow}
            </div>
          )}
          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: hasEyebrow ? 15 : 17,
            letterSpacing: hasEyebrow ? '0.03em' : '0.01em',
            textTransform: hasEyebrow ? 'uppercase' : 'none',
            color: 'rgba(0,0,0,0.86)',
            lineHeight: 1.25,
            margin: 0,
          }}>
            {hotspot.label}
          </h3>
        </div>
        <button
          onPointerUp={onClose}
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: 9,
            width: 32, height: 32,
            fontSize: 13,
            color: 'rgba(0,0,0,0.32)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 12,
            marginTop: 2,
          }}
        >✕</button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 12 }} />

      {/* Description */}
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 13,
        fontWeight: 400,
        color: 'rgba(0,0,0,0.55)',
        lineHeight: 1.72,
        margin: 0,
        marginBottom: hasSpecs ? 14 : 0,
      }}>
        {hotspot.description}
      </p>

      {/* Specs list — only rendered for rich-schema hotspots */}
      {hasSpecs && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {hotspot.specs.map((spec, i) => (
            <li key={i} style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: 'rgba(0,0,0,0.38)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ width: 12, height: 1, background: 'rgba(0,0,0,0.25)', display: 'inline-block', flexShrink: 0 }} />
              {spec}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
