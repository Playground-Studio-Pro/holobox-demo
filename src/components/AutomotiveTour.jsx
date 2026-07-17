/**
 * AutomotiveTour — reusable guided tour overlay for automotive experiences.
 *
 * Renders three states:
 *  overview  (sectionIndex === null, !inCTA)  → "Start Experience" button
 *  tour      (sectionIndex !== null)           → section card + navigation
 *  cta       (inCTA)                           → final CTA card
 *
 * Pure UI — no Three.js or engine calls. All state changes go through callbacks.
 */

const ACCENT = '#DC143C'

/* ── AutomotiveTour ─────────────────────────────────────────────────────── */
export default function AutomotiveTour({
  experience,
  sectionIndex,
  inCTA,
  activeVariantIdx = 0,
  onEnterTour,
  onExitTour,
  onNext,
  onPrev,
  onSelectSection,
  onVariantChange,
  onCTAPrimary,
  onCTASecondary,
}) {
  if (!experience) return null

  const sections = experience.sections
  const activeSection = sectionIndex !== null && sectionIndex < sections.length
    ? sections[sectionIndex]
    : null

  const inTour    = activeSection !== null
  const isSummary = activeSection?.nodeIds?.length === 0 && !activeSection?.variant
  const hasVariant = !!activeSection?.variant

  const canPrev = sectionIndex > 0
  const canNext = sectionIndex < sections.length - 1
  const isLast  = sectionIndex === sections.length - 1

  return (
    <>
      {/* ── Section pills — visible only in overview ─────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 100, left: '50%',
        transform: `translateX(-50%) translateY(${inTour || inCTA ? '200%' : '0%'})`,
        transition: 'transform 0.38s cubic-bezier(0.32, 0, 0.14, 1)',
        display: 'flex', gap: 10, zIndex: 20, flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: '90vw',
        pointerEvents: inTour || inCTA ? 'none' : 'auto',
      }}>
        {sections.map((s, i) => (
          <SectionPill
            key={s.id}
            label={s.label.toUpperCase()}
            onPress={() => onSelectSection(i)}
          />
        ))}
      </div>

      {/* ── Start Experience CTA — overview only ─────────────────────── */}
      {!inTour && !inCTA && (
        <div style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
        }}>
          <button
            onPointerUp={onEnterTour}
            style={{
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 28, height: 52, padding: '0 32px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              userSelect: 'none', WebkitUserSelect: 'none',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT }} />
            Start Experience
          </button>
        </div>
      )}

      {/* ── Section card ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '8%', left: '50%',
        transform: `translateX(-50%) translateY(${inTour ? '0%' : 'calc(100% + 100px)'})`,
        opacity: inTour ? 1 : 0,
        transition: 'transform 0.44s cubic-bezier(0.32, 0, 0.14, 1), opacity 0.28s ease',
        width: 'min(520px, 90vw)', zIndex: 30,
        pointerEvents: inTour ? 'auto' : 'none',
      }}>
        {activeSection && (
          <div style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderRadius: 20,
            boxShadow:
              '0 1px 0 rgba(255,255,255,1) inset,' +
              '0 16px 48px rgba(0,0,0,0.13),' +
              '0 0 0 1px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
            onPointerUp={e => e.stopPropagation()}
          >
            {/* Ferrari red accent stripe */}
            <div style={{ height: 2, background: `linear-gradient(90deg, ${ACCENT} 0%, #FF3A58 100%)` }} />

            <div style={{ padding: '18px 22px 14px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.16em', color: ACCENT, textTransform: 'uppercase',
                  }}>
                    {activeSection.eyebrow}
                  </span>
                </div>
                <button
                  onPointerUp={onExitTour}
                  style={{
                    background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 9,
                    width: 32, height: 32, fontSize: 13,
                    color: 'rgba(0,0,0,0.32)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Exit Tour"
                >✕</button>
              </div>

              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 19,
                color: 'rgba(0,0,0,0.88)', margin: '0 0 10px', lineHeight: 1.2,
              }}>
                {activeSection.title}
              </h3>

              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 10 }} />

              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                    color: 'rgba(0,0,0,0.55)', lineHeight: 1.65, margin: '0 0 10px',
                  }}>
                    {activeSection.description}
                  </p>

                  {activeSection.bullets?.length > 0 && (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {activeSection.bullets.map((b, i) => (
                        <li key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
                          letterSpacing: '0.04em', color: 'rgba(0,0,0,0.42)',
                        }}>
                          <span style={{
                            width: 12, height: 1, background: `${ACCENT}66`,
                            flexShrink: 0, marginTop: 7, display: 'inline-block',
                          }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Variant switcher */}
                  {hasVariant && (
                    <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {activeSection.variant.configs.map((vc, vi) => (
                        <button
                          key={vc.id}
                          onPointerUp={() => onVariantChange(vi)}
                          style={{
                            background: activeVariantIdx === vi ? ACCENT : 'rgba(0,0,0,0.05)',
                            border: 'none', borderRadius: 16, height: 28, padding: '0 12px',
                            fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: activeVariantIdx === vi ? '#fff' : 'rgba(0,0,0,0.40)',
                            cursor: 'pointer', transition: 'all 0.15s ease',
                          }}
                        >
                          {vc.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stat badge */}
                {activeSection.stat && (
                  <div style={{
                    flexShrink: 0,
                    background: `${ACCENT}0f`,
                    border: `1px solid ${ACCENT}24`,
                    borderRadius: 12, padding: '12px 16px',
                    textAlign: 'center', minWidth: 100,
                  }}>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 8, fontWeight: 700,
                      letterSpacing: '0.18em', color: `${ACCENT}b3`,
                      textTransform: 'uppercase', lineHeight: 1.3, marginBottom: 6,
                    }}>
                      {activeSection.stat.label}
                    </div>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700,
                      color: ACCENT,
                    }}>
                      {activeSection.stat.value}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 22px 16px', borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              <button
                onPointerUp={canPrev ? onPrev : undefined}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: canPrev ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0.18)',
                  padding: '8px 4px', minHeight: 36,
                  display: 'flex', alignItems: 'center', gap: 5,
                  cursor: canPrev ? 'pointer' : 'default',
                }}
              >
                ← Prev
              </button>

              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                letterSpacing: '0.10em', color: 'rgba(0,0,0,0.28)',
              }}>
                {String(sectionIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
              </span>

              <button
                onPointerUp={onNext}
                style={{
                  background: isLast ? ACCENT : 'none',
                  border: 'none',
                  borderRadius: isLast ? 20 : 0,
                  padding: isLast ? '0 16px' : '8px 4px',
                  height: isLast ? 36 : 'auto',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: isLast ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: isLast ? '#fff' : 'rgba(0,0,0,0.65)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  cursor: 'pointer', minHeight: 36,
                  transition: 'all 0.18s ease',
                }}
              >
                {isLast ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Final CTA card ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: `translateX(-50%) translateY(${inCTA ? '0%' : 'calc(100% + 100px)'})`,
        opacity: inCTA ? 1 : 0,
        transition: 'transform 0.44s cubic-bezier(0.32, 0, 0.14, 1), opacity 0.28s ease',
        width: 'min(480px, 88vw)', zIndex: 31,
        pointerEvents: inCTA ? 'auto' : 'none',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderRadius: 20,
          boxShadow:
            '0 1px 0 rgba(255,255,255,1) inset,' +
            '0 16px 48px rgba(0,0,0,0.13),' +
            '0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
          onPointerUp={e => e.stopPropagation()}
        >
          <div style={{ height: 2, background: `linear-gradient(90deg, ${ACCENT} 0%, #FF3A58 100%)` }} />

          <div style={{ padding: '28px 28px 24px', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.20em', color: ACCENT, textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Interactive · Immersive · Scalable
            </div>

            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22,
              color: 'rgba(0,0,0,0.88)', margin: '0 0 12px', lineHeight: 1.2,
            }}>
              {experience.finalCTA.title}
            </h2>

            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              color: 'rgba(0,0,0,0.50)', lineHeight: 1.7,
              margin: '0 0 24px',
            }}>
              {experience.finalCTA.body}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onPointerUp={onCTAPrimary}
                style={{
                  background: ACCENT,
                  border: 'none', borderRadius: 24, height: 48, padding: '0 28px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: '#fff', cursor: 'pointer',
                  userSelect: 'none', WebkitUserSelect: 'none',
                }}
              >
                {experience.finalCTA.primaryCta}
              </button>
              <button
                onPointerUp={onCTASecondary}
                style={{
                  background: 'rgba(0,0,0,0.06)',
                  border: 'none', borderRadius: 24, height: 48, padding: '0 24px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.55)', cursor: 'pointer',
                  userSelect: 'none', WebkitUserSelect: 'none',
                }}
              >
                {experience.finalCTA.secondaryCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionPill({ label, onPress }) {
  return (
    <button
      onPointerUp={onPress}
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: `1.5px solid ${ACCENT}`,
        borderRadius: 24, height: 44, padding: '0 18px',
        fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.12em',
        color: ACCENT, cursor: 'pointer',
        userSelect: 'none', WebkitUserSelect: 'none',
        transition: 'all 0.18s ease',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
      {label}
    </button>
  )
}
