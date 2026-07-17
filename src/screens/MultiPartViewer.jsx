import { useState, useRef } from 'react'
import MultiPartCanvas from '../components/MultiPartCanvas.jsx'

// Part IDs match the flat FERRARI_F2007_PARTS array: `${group}_${index}`
const SECTIONS = [
  {
    partId: 'aero_0',  // FerrariF2007_FWING.glb
    label: 'Front Wing',
    eyebrow: 'AERO SYSTEM · 01',
    title: 'Front Wing',
    description: 'Controls the airflow entering the vehicle and generates front-end downforce.',
    specs: [
      'Multi-element aerodynamic profile',
      'Directs airflow around the front wheels',
      'Influences balance and cornering response',
    ],
    stat: { label: 'AERODYNAMIC LOAD', value: 'High' },
    camera: { position: [0, 0.0, 1.2], target: [0, -0.32, 0.52] },
  },
  {
    partId: 'aero_1',  // FerrariF2007_RWING.glb
    label: 'Rear Wing',
    eyebrow: 'AERO SYSTEM · 02',
    title: 'Rear Wing',
    description: 'Generates the majority of rear downforce and stabilizes the car at high speed.',
    specs: [
      'Dual-plane main plane and flap assembly',
      'Adjustable angle of attack per circuit',
      'Works in tandem with the diffuser exit',
    ],
    stat: { label: 'AERODYNAMIC LOAD', value: 'Very High' },
    camera: { position: [0, 0.5, -2.0], target: [0, 0.15, -0.85] },
  },
  {
    partId: 'suspension_0',  // FerrariF2007_SuspFL.glb — front-left corner
    label: 'Suspension',
    eyebrow: 'CHASSIS · 03',
    title: 'Suspension',
    description: 'Double wishbone geometry controls wheel motion with precision, managing camber and toe under cornering loads.',
    specs: [
      'Double wishbone front and rear',
      'Push-rod actuated inboard dampers',
      'Carbon fibre composite uprights',
    ],
    stat: { label: 'CORNER WEIGHT', value: '≈160kg' },
    camera: { position: [0.9, 0.1, 1.1], target: [0.15, -0.2, 0.38] },
  },
]

export default function MultiPartViewer({ useCase, onBack }) {
  const [showEnv,      setShowEnv]      = useState(false)
  const [sectionIndex, setSectionIndex] = useState(null)  // null | 0 | 1 | ...
  const cloneMapRef = useRef({})

  const isFocused     = sectionIndex !== null
  const activeSection = sectionIndex !== null ? SECTIONS[sectionIndex] : null

  function openSection(idx) { setSectionIndex(idx) }
  function closeSection()   { setSectionIndex(null) }

  function handlePrev() {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1)
  }
  function handleNext() {
    if (sectionIndex < SECTIONS.length - 1) setSectionIndex(sectionIndex + 1)
  }

  function handleAssemblyReady(cloneMap) {
    cloneMapRef.current = cloneMap
  }

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
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="viewer-header">
        <button className="back-btn" onPointerUp={onBack}>← Volver</button>
        <span className="title">{useCase.emoji} {useCase.label}</span>

        {!isFocused && (
          <button
            onPointerUp={() => setShowEnv(v => !v)}
            style={{
              marginLeft: 'auto',
              background: showEnv ? 'rgba(0,0,0,0.80)' : 'rgba(255,255,255,0.70)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: showEnv ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
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
        )}
      </div>

      {/* ── Canvas ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <MultiPartCanvas
          parts={useCase.parts}
          showEnv={showEnv}
          onAssemblyReady={handleAssemblyReady}
          cinemaCamera={isFocused ? activeSection.camera : null}
          focusPartId={isFocused ? activeSection.partId : null}
        />

        {/* ── Section selector pills (overview only) ─────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) translateY(${isFocused ? '160%' : '0%'})`,
          transition: 'transform 0.38s cubic-bezier(0.32, 0, 0.14, 1)',
          display: 'flex',
          gap: 12,
          zIndex: 20,
          pointerEvents: isFocused ? 'none' : 'auto',
        }}>
          {SECTIONS.map((s, i) => (
            <SectionPill
              key={s.partId}
              label={s.label.toUpperCase()}
              accent="#DC143C"
              onPress={() => openSection(i)}
            />
          ))}
          <SectionPill label="BRAKES" accent="#888" disabled />
        </div>

        {/* ── Bottom cinema card (focus mode) ────────────────────── */}
        <BottomCard
          open={isFocused}
          section={activeSection}
          sectionIndex={sectionIndex}
          totalSections={SECTIONS.length}
          onReturn={closeSection}
          onPrev={sectionIndex > 0 ? handlePrev : null}
          onNext={sectionIndex < SECTIONS.length - 1 ? handleNext : null}
        />
      </div>
    </div>
  )
}

/* ── Pill trigger button ─────────────────────────────────────────────────── */
function SectionPill({ label, accent, onPress, disabled }) {
  return (
    <button
      onPointerUp={disabled ? undefined : onPress}
      style={{
        background: disabled ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1.5px solid ${disabled ? 'rgba(0,0,0,0.08)' : accent}`,
        borderRadius: 24,
        height: 44,
        padding: '0 20px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: disabled ? 'rgba(0,0,0,0.25)' : accent,
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transition: 'all 0.18s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {!disabled && (
        <span style={{
          width: 5, height: 5,
          borderRadius: '50%',
          background: accent,
          flexShrink: 0,
        }} />
      )}
      {label}
    </button>
  )
}

/* ── Compact bottom-center card ──────────────────────────────────────────── */
function BottomCard({ open, section, sectionIndex, totalSections, onReturn, onPrev, onNext }) {
  if (!section) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: `translateX(-50%) translateY(${open ? '0%' : 'calc(100% + 80px)'})`,
        transition: 'transform 0.44s cubic-bezier(0.32, 0, 0.14, 1)',
        width: 'min(480px, 88vw)',
        zIndex: 30,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: 20,
          boxShadow:
            '0 1px 0 rgba(255,255,255,1) inset,' +
            '0 16px 48px rgba(0,0,0,0.13),' +
            '0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
        onPointerUp={e => e.stopPropagation()}
      >
        {/* Ferrari red top accent */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #DC143C 0%, #FF3A58 100%)' }} />

        <div style={{ padding: '18px 22px 14px' }}>
          {/* Header: eyebrow + close */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#DC143C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', color: '#DC143C', textTransform: 'uppercase',
              }}>
                {section.eyebrow}
              </span>
            </div>
            <button
              onPointerUp={onReturn}
              style={{
                background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 9,
                width: 32, height: 32, fontSize: 13,
                color: 'rgba(0,0,0,0.32)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 19,
            color: 'rgba(0,0,0,0.88)', margin: '0 0 10px', lineHeight: 1.2,
          }}>
            {section.title}
          </h3>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 10 }} />

          {/* Two-column: content left, stat right */}
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                color: 'rgba(0,0,0,0.55)', lineHeight: 1.65, margin: '0 0 10px',
              }}>
                {section.description}
              </p>

              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {section.specs.map((spec, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.04em', color: 'rgba(0,0,0,0.42)',
                  }}>
                    <span style={{
                      width: 12, height: 1, background: 'rgba(220,20,60,0.45)',
                      flexShrink: 0, marginTop: 7, display: 'inline-block',
                    }} />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat badge */}
            {section.stat && (
              <div style={{
                flexShrink: 0,
                background: 'rgba(220,20,60,0.06)',
                border: '1px solid rgba(220,20,60,0.14)',
                borderRadius: 12, padding: '12px 16px',
                textAlign: 'center', minWidth: 100,
              }}>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 8, fontWeight: 700,
                  letterSpacing: '0.18em', color: 'rgba(220,20,60,0.70)',
                  textTransform: 'uppercase', lineHeight: 1.3, marginBottom: 6,
                }}>
                  {section.stat.label}
                </div>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#DC143C',
                }}>
                  {section.stat.value}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 22px 16px', borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <button
            onPointerUp={onPrev || undefined}
            style={{
              background: 'none', border: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: onPrev ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0.18)',
              padding: '8px 4px', minHeight: 36,
              display: 'flex', alignItems: 'center', gap: 5,
              cursor: onPrev ? 'pointer' : 'default',
            }}
          >
            ← Prev
          </button>

          <span style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 10,
            letterSpacing: '0.10em', color: 'rgba(0,0,0,0.28)',
          }}>
            {String(sectionIndex + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
          </span>

          <button
            onPointerUp={onNext || undefined}
            style={{
              background: 'none', border: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: onNext ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.18)',
              padding: '8px 4px', minHeight: 36,
              display: 'flex', alignItems: 'center', gap: 5,
              cursor: onNext ? 'pointer' : 'default',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
