import { CLIENT } from '../config/client.js'

export default function Welcome({ onEnter }) {
  return (
    <div
      className="screen-enter"
      style={{
        width: '100%', height: '100%',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {CLIENT.bgVideo && (
        <video
          autoPlay loop muted playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
            zIndex: 0,
          }}
          src={CLIENT.bgVideo}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {CLIENT.logo ? (
          <img src={CLIENT.logo} alt={CLIENT.name} style={{ height: 72 }} />
        ) : (
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(48px, 6vw, 72px)',
            letterSpacing: '0.12em',
            color: 'rgba(0,0,0,0.88)',
            lineHeight: 1,
          }}>
            HOLOBOX
          </h1>
        )}

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 300,
          fontSize: 14,
          letterSpacing: '0.06em',
          color: 'rgba(0,0,0,0.35)',
          textTransform: 'uppercase',
        }}>
          {CLIENT.tagline}
        </p>
      </div>

      <button
        className="btn-primary screen-enter"
        style={{ position: 'relative', zIndex: 1, animationDelay: '0.15s', opacity: 0 }}
        onPointerUp={onEnter}
      >
        Explore Demo →
      </button>

      <p style={{
        position: 'absolute',
        bottom: 32,
        left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        color: 'rgba(0,0,0,0.18)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        zIndex: 1,
      }}>
        Touch to interact
      </p>
    </div>
  )
}
