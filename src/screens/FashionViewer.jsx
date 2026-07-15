import { useState } from 'react'
import { createPortal } from 'react-dom'
import ModelCanvas from '../components/ModelCanvas.jsx'
import SideButtons from '../components/SideButtons.jsx'
import HotspotCard from '../components/HotspotCard.jsx'
import Modal from '../components/Modal.jsx'
import { HOTSPOTS } from '../data/hotspots.js'

const SIDE_BUTTONS = [
  { id: 'tour',   icon: '▷', label: 'TOUR'   },
  { id: 'colors', icon: '◉', label: 'COLORS' },
  { id: 'more',   icon: '↗', label: 'MORE'   },
]

export default function FashionViewer({ useCase, onBack }) {
  const brand      = useCase.brand
  const colorways  = useCase.colorways || []
  const hotspots   = HOTSPOTS.fashion || []

  const [activeColorway, setActiveColorway]       = useState(colorways[0] || null)
  const [activePanel, setActivePanel]             = useState(null)   // 'tour' | 'colors' | null
  const [activeHotspotId, setActiveHotspotId]     = useState(null)
  const [selectedHotspot, setSelectedHotspot]     = useState(null)
  const [modal, setModal]                         = useState(null)

  const modalOpen   = modal !== null
  const modelPath   = activeColorway?.path || useCase.model

  /* ── Side buttons ── */
  function handleSideBtn(btn) {
    if (btn.id === 'more') {
      setModal({ type: 'fashion-more' })
      setActivePanel(null)
      return
    }
    setActivePanel(prev => prev === btn.id ? null : btn.id)
  }

  /* ── Hotspot ── */
  function handleHotspotSelect(hotspot) {
    if (activeHotspotId === hotspot.id) {
      setActiveHotspotId(null)
      setSelectedHotspot(null)
    } else {
      setActiveHotspotId(hotspot.id)
      setSelectedHotspot(hotspot)
    }
  }

  function closeHotspotCard() {
    setActiveHotspotId(null)
    setSelectedHotspot(null)
  }

  /* ── Colorway selection ── */
  function handleColorwaySelect(cw) {
    setActiveColorway(cw)
    // Close hotspot card when switching model — positions may differ
    closeHotspotCard()
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
      {/* ── Branded header ── */}
      <div style={{
        height: 72, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        position: 'relative', zIndex: 10,
      }}>
        <button
          onPointerUp={onBack}
          style={{
            background: 'none', border: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            fontWeight: 400, letterSpacing: '0.04em',
            color: 'rgba(0,0,0,0.38)', cursor: 'pointer',
            padding: '10px 0', minHeight: 44,
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
            letterSpacing: '0.16em', color: 'rgba(0,0,0,0.88)',
            lineHeight: 1,
          }}>
            {brand.name}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.38)', marginTop: 4,
          }}>
            {brand.product}
          </div>
        </div>
      </div>

      {/* ── 2-column layout: side buttons + canvas ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        <SideButtons
          buttons={SIDE_BUTTONS}
          activeId={activePanel}
          onPress={handleSideBtn}
        />

        {/* Canvas area */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <ModelCanvas
            modelPath={modelPath}
            placeholderColor={useCase.placeholderColor}
            hotspots={hotspots}
            onHotspotSelect={handleHotspotSelect}
            activeHotspotId={activeHotspotId}
            showHotspots={!modalOpen}
            autoRotate={selectedHotspot === null && activePanel !== 'colors'}
          />

          {/* Floating hotspot card */}
          {selectedHotspot && !modalOpen && (
            <HotspotCard hotspot={selectedHotspot} onClose={closeHotspotCard} />
          )}

          {/* TOUR — placeholder */}
          {activePanel === 'tour' && !modalOpen && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', pointerEvents: 'none', zIndex: 20,
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.22)', marginBottom: 8,
              }}>
                Guided Tour
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 12,
                color: 'rgba(0,0,0,0.18)', letterSpacing: '0.04em',
              }}>
                Coming Soon
              </div>
            </div>
          )}

          {/* COLORWAYS panel */}
          {activePanel === 'colors' && !modalOpen && colorways.length > 0 && (
            <div style={{
              position: 'absolute', bottom: 108, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 14, zIndex: 20,
              animation: 'hotspotCardIn 0.22s ease forwards',
            }}>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 9,
                letterSpacing: '0.20em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.28)',
              }}>
                Colorway
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                {colorways.map(cw => {
                  const isActive = activeColorway?.id === cw.id
                  return (
                    <button
                      key={cw.id}
                      onPointerUp={() => handleColorwaySelect(cw)}
                      style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: cw.color,
                        border: isActive ? '2.5px solid rgba(0,0,0,0.80)' : '2px solid rgba(0,0,0,0.10)',
                        boxShadow: isActive ? '0 0 0 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease',
                      }} />
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: isActive ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.30)',
                        transition: 'color 0.2s ease',
                      }}>
                        {cw.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Editorial brand text — bottom left of canvas */}
          <div style={{
            position: 'absolute', bottom: 36, left: 20,
            pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11,
              letterSpacing: '0.20em', color: 'rgba(0,0,0,0.22)',
              textTransform: 'uppercase', lineHeight: 1,
              marginBottom: 4,
            }}>
              {brand.name}
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 9,
              letterSpacing: '0.14em', color: 'rgba(0,0,0,0.18)',
              textTransform: 'uppercase',
            }}>
              {brand.tagline}
            </div>
          </div>
        </div>
      </div>

      {/* Modal — portaled to body */}
      {modalOpen && createPortal(
        <Modal
          open
          onClose={() => setModal(null)}
          type={modal.type}
          useCase={useCase}
        />,
        document.body
      )}
    </div>
  )
}
