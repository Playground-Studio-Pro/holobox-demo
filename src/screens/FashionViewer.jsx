import { useState } from 'react'
import { createPortal } from 'react-dom'
import ModelCanvas from '../components/ModelCanvas.jsx'
import SideButtons from '../components/SideButtons.jsx'
import HotspotCard from '../components/HotspotCard.jsx'
import Modal from '../components/Modal.jsx'

const SIDE_BUTTONS = [
  { id: 'tour',   icon: '▷', label: 'TOUR'   },
  { id: 'colors', icon: '◉', label: 'COLORS' },
  { id: 'more',   icon: '↗', label: 'MORE'   },
]

export default function FashionViewer({ useCase, onBack }) {
  const brand    = useCase.brand
  const products = useCase.products || []

  const [activeProduct, setActiveProduct]   = useState(products[0] || null)
  const [activeColorway, setActiveColorway] = useState(products[0]?.colorways[0] || null)
  const [activePanel, setActivePanel]       = useState(null)
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [focusCamera, setFocusCamera]         = useState(null)
  const [isTourMode, setIsTourMode]           = useState(false)
  const [modal, setModal]                     = useState(null)

  const modalOpen    = modal !== null
  const hotspots     = activeProduct?.hotspots || []
  const colorways    = activeProduct?.colorways || []
  const hotspotIndex = hotspots.findIndex(h => h.id === activeHotspotId)
  const modelPath    = activeColorway?.path || activeProduct?.model

  /* ── Internal: navigate to a specific hotspot ── */
  function goToHotspot(hotspot) {
    setActiveHotspotId(hotspot.id)
    setSelectedHotspot(hotspot)
    if (hotspot.camera) setFocusCamera(hotspot.camera)
  }

  /* ── Internal: close hotspot and return to hero ── */
  function closeHotspot() {
    setActiveHotspotId(null)
    setSelectedHotspot(null)
    setFocusCamera(null)
  }

  /* ── Internal: end tour ── */
  function endTour() {
    setIsTourMode(false)
    setActivePanel(null)
    closeHotspot()
  }

  /* ── Product switcher ── */
  function handleProductSelect(product) {
    if (product.id === activeProduct?.id) return
    setActiveProduct(product)
    setActiveColorway(product.colorways[0] || null)
    setActivePanel(null)
    setIsTourMode(false)
    closeHotspot()
  }

  /* ── Side buttons ── */
  function handleSideBtn(btn) {
    if (isTourMode) {
      if (btn.id === 'tour') endTour()
      return
    }
    if (btn.id === 'more') {
      setModal({ type: 'fashion-more', product: activeProduct })
      setActivePanel(null)
      return
    }
    if (btn.id === 'tour') {
      if (hotspots.length === 0) return
      setIsTourMode(true)
      setActivePanel('tour')
      goToHotspot(hotspots[0])
      return
    }
    setActivePanel(prev => prev === btn.id ? null : btn.id)
  }

  /* ── Hotspot selection (from 3D pins) ── */
  function handleHotspotSelect(hotspot) {
    if (activeHotspotId === hotspot.id) {
      if (isTourMode) {
        endTour()
      } else {
        closeHotspot()
      }
    } else {
      if (isTourMode) endTour()
      goToHotspot(hotspot)
    }
  }

  /* ── Hotspot card close ── */
  function handleCardClose() {
    if (isTourMode) {
      endTour()
    } else {
      closeHotspot()
    }
  }

  /* ── Prev / Next hotspot navigation ── */
  function handlePrev() {
    if (hotspotIndex <= 0) return
    goToHotspot(hotspots[hotspotIndex - 1])
  }

  function handleNext() {
    const isLast = hotspotIndex === hotspots.length - 1
    if (isTourMode && isLast) {
      endTour()
      return
    }
    if (!isLast) goToHotspot(hotspots[hotspotIndex + 1])
  }

  /* ── Colorway selection ── */
  function handleColorwaySelect(cw) {
    setActiveColorway(cw)
    closeHotspot()
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
            {activeProduct?.label}
          </div>
        </div>
      </div>

      {/* ── Product switcher ── */}
      {products.length > 1 && (
        <div style={{
          flexShrink: 0,
          display: 'flex', justifyContent: 'center',
          gap: 8, padding: '0 28px 12px',
          zIndex: 10,
        }}>
          {products.map(p => {
            const isActive = p.id === activeProduct?.id
            return (
              <button
                key={p.id}
                onPointerUp={() => handleProductSelect(p)}
                style={{
                  background: isActive ? 'rgba(0,0,0,0.88)' : 'transparent',
                  color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.38)',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.14)',
                  borderRadius: 100,
                  padding: '0 20px',
                  height: 36, minHeight: 44,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 10,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      )}

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
            focusCamera={focusCamera}
          />

          {/* Floating hotspot card */}
          {selectedHotspot && !modalOpen && (
            <HotspotCard
              hotspot={selectedHotspot}
              onClose={handleCardClose}
              onPrev={hotspotIndex > 0 ? handlePrev : null}
              onNext={handleNext}
              hotspotIndex={hotspotIndex}
              totalHotspots={hotspots.length}
              isTourMode={isTourMode}
            />
          )}

          {/* TOUR — Coming soon placeholder (shown only when no hotspot is focused) */}
          {activePanel === 'tour' && !selectedHotspot && !modalOpen && (
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
                Loading…
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

          {/* Editorial brand text */}
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
          product={modal.product}
        />,
        document.body
      )}
    </div>
  )
}
