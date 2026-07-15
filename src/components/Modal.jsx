import { useEffect, useState } from 'react'

function QRContent({ url = 'playground.studio/holobox-demo' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{
        width: 200, height: 200, background: '#f6f6f6',
        borderRadius: 16, display: 'grid', placeItems: 'center',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
          <rect x="5"  y="5"  width="35" height="35" rx="4" fill="#1a1a1a"/>
          <rect x="10" y="10" width="25" height="25" rx="2" fill="white"/>
          <rect x="15" y="15" width="15" height="15" rx="1" fill="#1a1a1a"/>
          <rect x="60" y="5"  width="35" height="35" rx="4" fill="#1a1a1a"/>
          <rect x="65" y="10" width="25" height="25" rx="2" fill="white"/>
          <rect x="70" y="15" width="15" height="15" rx="1" fill="#1a1a1a"/>
          <rect x="5"  y="60" width="35" height="35" rx="4" fill="#1a1a1a"/>
          <rect x="10" y="65" width="25" height="25" rx="2" fill="white"/>
          <rect x="15" y="70" width="15" height="15" rx="1" fill="#1a1a1a"/>
          <rect x="45" y="45" width="6" height="6" fill="#1a1a1a"/>
          <rect x="55" y="45" width="6" height="6" fill="#1a1a1a"/>
          <rect x="65" y="45" width="6" height="6" fill="#1a1a1a"/>
          <rect x="45" y="55" width="6" height="6" fill="#1a1a1a"/>
          <rect x="75" y="55" width="6" height="6" fill="#1a1a1a"/>
          <rect x="45" y="65" width="6" height="6" fill="#1a1a1a"/>
          <rect x="55" y="65" width="6" height="6" fill="#1a1a1a"/>
          <rect x="65" y="75" width="6" height="6" fill="#1a1a1a"/>
          <rect x="75" y="75" width="6" height="6" fill="#1a1a1a"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'rgba(0,0,0,0.75)', marginBottom: 8 }}>
          Escanea con tu teléfono
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em' }}>
          {url}
        </p>
      </div>
    </div>
  )
}

function InfoContent({ useCase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 40, textAlign: 'center' }}>{useCase?.emoji}</div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(0,0,0,0.60)', lineHeight: 1.75, textAlign: 'center' }}>
        Experiencia 3D inmersiva para el vertical de{' '}
        <strong style={{ color: 'rgba(0,0,0,0.80)' }}>{useCase?.label}</strong>.
        Los modelos flotan sobre la pantalla LCD transparente creando una ilusión holográfica sin gafas.
      </p>
      <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 14, padding: '16px 20px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(0,0,0,0.50)', lineHeight: 1.65 }}>
          <strong style={{ color: 'rgba(0,0,0,0.75)', display: 'block', marginBottom: 6, fontFamily: 'Syne, sans-serif', fontSize: 14 }}>
            Holobox 65"
          </strong>
          Pantalla LCD transparente · Touch nativo · 4K portrait · 3840×2160
        </p>
      </div>
    </div>
  )
}

function VideoContent({ useCase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      {/* Video player placeholder */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          ▶
        </div>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 13,
          color: 'rgba(255,255,255,0.40)', letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {useCase?.label} · Demo Video
        </p>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(0,0,0,0.40)', textAlign: 'center', lineHeight: 1.6 }}>
        Coloca el archivo de video en <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 6 }}>/public/videos/{useCase?.id}.mp4</code>
      </p>
    </div>
  )
}

function LandingContent({ useCase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(0,0,0,0.55)', textAlign: 'center', lineHeight: 1.7 }}>
        Escanea para visitar la landing page de este producto y obtener más información.
      </p>
      <QRContent url={`playground.studio/${useCase?.id}`} />
    </div>
  )
}

function FashionMoreContent({ brand, product }) {
  const more = product?.more || {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Brand header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26,
          letterSpacing: '0.18em', color: 'rgba(0,0,0,0.90)',
        }}>
          {brand?.name}
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13,
          letterSpacing: '0.10em', color: 'rgba(0,0,0,0.60)',
          textTransform: 'uppercase',
        }}>
          {product?.label}
        </div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 11,
          letterSpacing: '0.14em', color: 'rgba(0,0,0,0.35)',
          textTransform: 'uppercase',
        }}>
          {brand?.tagline}
        </div>
      </div>

      {/* QR */}
      <QRContent url={more.url || 'aero01.com'} />

      {/* Technology list */}
      {more.technologies?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.32)',
          }}>
            Technology
          </div>
          {more.technologies.map(t => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              color: 'rgba(0,0,0,0.65)', letterSpacing: '0.01em',
            }}>
              <span style={{ width: 16, height: 1, background: 'rgba(0,0,0,0.20)', display: 'inline-block', flexShrink: 0 }} />
              {t}
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {more.primaryCta && (
          <button style={{
            background: '#0f0f0f', color: '#ffffff',
            border: 'none', borderRadius: 14,
            padding: '16px 24px',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: 'pointer', minHeight: 56,
          }}>
            {more.primaryCta.label}
          </button>
        )}
        {more.secondaryCta && (
          <button style={{
            background: 'none', color: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(0,0,0,0.12)', borderRadius: 14,
            padding: '14px 24px',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 12,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            cursor: 'pointer', minHeight: 52,
          }}>
            {more.secondaryCta.label}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Modal({ open, onClose, type, useCase, product }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true))
    else setVisible(false)
  }, [open])

  if (!open) return null

  const titles = {
    qr:           'Compartir Demo',
    info:         'Sobre este Demo',
    video:        'Video',
    landing:      'Landing Page',
    'fashion-more': useCase?.brand?.name || 'More',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
      onPointerUp={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 28,
          padding: '40px 36px',
          width: 'min(480px, 88vw)',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow:
            '0 1px 0 rgba(255,255,255,1) inset,' +
            '0 32px 80px rgba(0,0,0,0.16),' +
            '0 0 0 1px rgba(0,0,0,0.06)',
          transform: visible ? 'scale(1)' : 'scale(0.93)',
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}
        onPointerUp={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'rgba(0,0,0,0.82)' }}>
            {titles[type]}
          </span>
          <button
            onPointerUp={onClose}
            style={{
              background: 'rgba(0,0,0,0.05)', border: 'none',
              width: 40, height: 40, borderRadius: 12,
              fontSize: 16, color: 'rgba(0,0,0,0.35)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

        {type === 'qr'           && <QRContent />}
        {type === 'info'         && <InfoContent useCase={useCase} />}
        {type === 'video'        && <VideoContent useCase={useCase} />}
        {type === 'landing'      && <LandingContent useCase={useCase} />}
        {type === 'fashion-more' && <FashionMoreContent brand={useCase?.brand} product={product} />}
      </div>
    </div>
  )
}
