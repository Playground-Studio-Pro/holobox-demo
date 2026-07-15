export default function SlidePanel({ open, onClose, title, description, cta }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,        /* below the 60px header */
        right: 0,
        bottom: 0,
        width: 'min(380px, 75vw)',
        background: 'transparent',
        borderLeft: 'none',
        zIndex: 30,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        overflowY: 'auto',
      }}
    >
      {/* Drag handle for touch */}
      <div style={{
        width: 36, height: 4,
        background: 'rgba(0,0,0,0.12)',
        borderRadius: 2,
        margin: '16px auto 0',
        flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: 18,
          color: 'rgba(0,0,0,0.82)',
          letterSpacing: '0.01em',
          lineHeight: 1.3,
        }}>
          {title}
        </span>
        <button
          onPointerUp={onClose}
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            width: 36, height: 36,
            borderRadius: 10,
            fontSize: 16,
            color: 'rgba(0,0,0,0.40)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', flexShrink: 0 }} />

      {/* Description */}
      <p style={{
        padding: '20px 24px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 15,
        fontWeight: 400,
        color: 'rgba(0,0,0,0.58)',
        lineHeight: 1.75,
        flex: 1,
      }}>
        {description}
      </p>

      {/* CTAs */}
      <div style={{
        padding: '0 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flexShrink: 0,
      }}>
        {cta && (
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
            onPointerUp={() => cta.onPress?.()}
          >
            {cta.label}
          </button>
        )}

        <button
          style={{
            background: 'none',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: 14,
            padding: '14px 16px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.40)',
            cursor: 'pointer',
            textAlign: 'center',
            letterSpacing: '0.03em',
            transition: 'all 0.15s ease',
            minHeight: 52,
          }}
          onPointerEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
          onPointerLeave={e => e.currentTarget.style.background = 'none'}
          onPointerUp={() => cta?.onMoreInfo?.()}
        >
          Más info sobre este demo →
        </button>
      </div>
    </div>
  )
}
