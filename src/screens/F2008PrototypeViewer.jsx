import { useState, useCallback } from 'react'
import F2008Canvas from '../components/F2008Canvas.jsx'

/* ── System classification ─────────────────────────────────────────────────
 * Declared at module scope for referential stability.
 * This function is passed as classifyFn to adaptHierarchical() via F2008Canvas.
 * An unstable reference (e.g. inline arrow or re-created each render) would
 * cause the SceneGraph to rebuild on every render — keep it here.
 */
function getSystem(name) {
  if (!name) return 'Other'
  const n = name.toLowerCase()
  if (n.includes('body'))                              return 'Body'
  if (n.includes('fwing'))                             return 'Front Wing'
  if (n.includes('nose'))                              return 'Nose'
  if (n.includes('rwing'))                             return 'Rear Wing'
  if (n.includes('sdwing') || n.includes('mid_wing')) return 'Side Wing'
  if (n.includes('add_uc'))                           return 'Underfloor'
  if (n.includes('suspa'))                            return 'Suspension'
  if (n.includes('brake'))                            return 'Brake'
  if (n.includes('wheel') || n.includes('tire') || n.includes('cov')) return 'Wheel'
  if (n.includes('shaft') || n.includes('cylinder'))  return 'Drivetrain'
  return 'Other'
}

const SYSTEM_COLORS = {
  'Body':       '#DC143C',
  'Front Wing': '#E05000',
  'Nose':       '#E08000',
  'Rear Wing':  '#0070CC',
  'Side Wing':  '#007A6E',
  'Underfloor': '#6A3E9E',
  'Suspension': '#8B5A00',
  'Brake':      '#555',
  'Wheel':      '#2A5A2A',
  'Drivetrain': '#3A3A6A',
  'Other':      '#888',
}

/* ── F2008PrototypeViewer ──────────────────────────────────────────────── */
export default function F2008PrototypeViewer({ useCase, onBack }) {
  // meshes: SceneNode[] from graph.getAllNodes() via onMeshesReady
  const [meshes,       setMeshes]       = useState([])
  // selected: SceneNode | null
  const [selected,     setSelected]     = useState(null)
  const [focusCamera,  setFocusCamera]  = useState(null)
  const [activeSystem, setActiveSystem] = useState('All')
  const [showEnv,      setShowEnv]      = useState(false)

  const handleMeshesReady = useCallback(nodes => {
    setMeshes(nodes)
  }, [])

  function handleSelectRow(node) {
    if (selected?.id === node.id) {
      setSelected(null)
      setFocusCamera(null)
    } else {
      setSelected(node)
      // SceneNode.focusCamera() derives position from the world-space bbox
      setFocusCamera(node.focusCamera())
    }
  }

  function handleReturn() {
    setSelected(null)
    setFocusCamera(null)
  }

  const allSystems  = ['All', ...Object.keys(SYSTEM_COLORS)]
  const visibleMesh = activeSystem === 'All'
    ? meshes
    : meshes.filter(n => n.meta.system === activeSystem)

  const totalTris = meshes.reduce((s, n) => s + n.meta.triCount, 0)

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
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="viewer-header">
        <button className="back-btn" onPointerUp={onBack}>← Volver</button>
        <span className="title">🔬 F2008 — Prototype Inspector</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {selected && (
            <button
              onPointerUp={handleReturn}
              style={{
                background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 20,
                height: 36, padding: '0 14px',
                fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', color: 'rgba(0,0,0,0.55)',
                cursor: 'pointer',
              }}
            >
              ← Overview
            </button>
          )}
          <button
            onPointerUp={() => setShowEnv(v => !v)}
            style={{
              background: showEnv ? 'rgba(0,0,0,0.80)' : 'rgba(255,255,255,0.70)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: showEnv ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: 22, height: 36, padding: '0 14px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.10em',
              color: showEnv ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.50)',
              cursor: 'pointer',
            }}
          >
            {showEnv ? 'STUDIO' : 'FLAT'}
          </button>
        </div>
      </div>

      {/* ── Main layout: canvas left, inspector right ─────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* 3D Canvas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <F2008Canvas
            selectedMeshName={selected?.id ?? null}
            onMeshesReady={handleMeshesReady}
            focusCamera={focusCamera}
            showEnv={showEnv}
            classifyFn={getSystem}
          />
        </div>

        {/* Inspector panel */}
        <div style={{
          width: 296,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.76)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Summary bar */}
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '0.10em', color: 'rgba(0,0,0,0.70)',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Mesh Inspector
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <Stat label="Nodes"     value={meshes.length} />
              <Stat label="Materials" value={27} />
              <Stat label="Triangles" value={totalTris > 0 ? `${(totalTris / 1000).toFixed(1)}k` : '—'} />
            </div>

            {selected && (
              <div style={{
                marginTop: 10,
                background: 'rgba(0,0,0,0.04)',
                borderRadius: 10, padding: '8px 10px',
              }}>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.14em', color: 'rgba(0,0,0,0.36)',
                  textTransform: 'uppercase', marginBottom: 3,
                }}>
                  Selected
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
                  color: 'rgba(0,0,0,0.80)',
                }}>
                  {selected.meta.label}
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                  color: 'rgba(0,0,0,0.42)', marginTop: 2,
                }}>
                  {selected.meta.triCount.toLocaleString()} tris
                  &nbsp;·&nbsp;
                  {selected.meta.materialNames.join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* System filter chips */}
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', flexWrap: 'wrap', gap: 6,
            flexShrink: 0,
          }}>
            {allSystems.map(sys => {
              const isActive = activeSystem === sys
              const color    = SYSTEM_COLORS[sys] || '#888'
              return (
                <button
                  key={sys}
                  onPointerUp={() => setActiveSystem(sys)}
                  style={{
                    background: isActive ? color : 'rgba(0,0,0,0.04)',
                    border: 'none',
                    borderRadius: 20,
                    height: 22,
                    padding: '0 8px',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isActive ? '#fff' : 'rgba(0,0,0,0.42)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {sys}
                </button>
              )
            })}
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 52px 52px',
            padding: '6px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}>
            {['Mesh', 'Tris', 'Mat'].map(h => (
              <span key={h} style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', color: 'rgba(0,0,0,0.30)',
                textTransform: 'uppercase',
              }}>{h}</span>
            ))}
          </div>

          {/* Mesh rows */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {meshes.length === 0 ? (
              <div style={{
                padding: 24,
                fontFamily: 'DM Sans, sans-serif', fontSize: 12,
                color: 'rgba(0,0,0,0.28)', textAlign: 'center',
              }}>
                Loading model…
              </div>
            ) : (
              visibleMesh.map(node => {
                const isSelected = selected?.id === node.id
                const sys        = node.meta.system || 'Other'
                const color      = SYSTEM_COLORS[sys] || '#888'
                return (
                  <div
                    key={node.id}
                    onPointerUp={() => handleSelectRow(node)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 52px 52px',
                      padding: '7px 16px',
                      cursor: 'pointer',
                      background: isSelected ? `${color}14` : 'transparent',
                      borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
                      transition: 'background 0.12s ease',
                      alignItems: 'center',
                    }}
                    onPointerEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
                    }}
                    onPointerLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'rgba(0,0,0,0.82)' : 'rgba(0,0,0,0.62)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {node.meta.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: color, flexShrink: 0,
                        }} />
                        <span style={{
                          fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                          color: 'rgba(0,0,0,0.32)', letterSpacing: '0.04em',
                        }}>
                          {sys}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                      color: 'rgba(0,0,0,0.40)', letterSpacing: '0.02em',
                      textAlign: 'right', paddingRight: 4,
                    }}>
                      {node.meta.triCount.toLocaleString()}
                    </span>

                    <span
                      style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                        color: 'rgba(0,0,0,0.35)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        paddingLeft: 4,
                      }}
                      title={node.meta.materialNames.join(', ')}
                    >
                      {node.meta.materialNames[0] || '—'}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Proto badge */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              background: 'rgba(220,20,60,0.10)',
              border: '1px solid rgba(220,20,60,0.20)',
              borderRadius: 4, padding: '2px 6px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.10em', color: '#DC143C',
              textTransform: 'uppercase',
            }}>
              DEV PROTOTYPE
            </div>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 9,
              color: 'rgba(0,0,0,0.30)',
            }}>
              F2008_web_final.glb · 6.8MB · WebP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 700,
        color: 'rgba(0,0,0,0.80)', lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 500,
        letterSpacing: '0.10em', color: 'rgba(0,0,0,0.32)',
        textTransform: 'uppercase', marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  )
}
