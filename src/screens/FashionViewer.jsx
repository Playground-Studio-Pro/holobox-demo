import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ModelCanvas from '../components/ModelCanvas.jsx'
import HotspotCard from '../components/HotspotCard.jsx'
import Modal from '../components/Modal.jsx'

/* ── Floating control button — independent, no shared background ── */
function FashionControlBtn({ label, active, onPress }) {
  return (
    <button
      onPointerUp={onPress}
      style={{
        background: active
          ? 'rgba(0,0,0,0.86)'
          : 'rgba(255,255,255,0.68)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: active ? '1px solid rgba(0,0,0,0)' : '1px solid rgba(0,0,0,0.09)',
        borderRadius: 22,
        height: 72,
        minWidth: 140,
        padding: '0 32px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: active ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.58)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: active
          ? '0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)'
          : '0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        transition: 'all 0.22s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )
}

/* ── Branded product-entry curtain — opaque, temporary, fully removed after animation ── */
function ProductEntryCurtain({ product, brand, onComplete }) {
  const isRunner = product.id === 'runner'
  const duration = isRunner ? 1300 : 1900

  useEffect(() => {
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  }, [duration, onComplete])

  if (isRunner) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#f2ede7',
          animation: `curtainRunner ${duration}ms cubic-bezier(0.76, 0, 0.24, 1) forwards`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', animation: `curtainRunnerText ${duration}ms ease forwards` }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 42, letterSpacing: '0.20em',
              color: 'rgba(0,0,0,0.85)', textTransform: 'uppercase', lineHeight: 1,
            }}>
              {brand.name}
            </div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 600,
              fontSize: 14, letterSpacing: '0.24em',
              color: 'rgba(0,0,0,0.42)', textTransform: 'uppercase', marginTop: 10,
            }}>
              {product.label}
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
              fontSize: 10, letterSpacing: '0.16em',
              color: 'rgba(0,0,0,0.30)', textTransform: 'uppercase', marginTop: 6,
            }}>
              {product.tagline}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0c0c14',
        animation: `curtainVector ${duration}ms ease forwards`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', animation: `curtainVectorText ${duration}ms ease forwards` }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 28, letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', lineHeight: 1,
          }}>
            {brand.name} {product.label}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
            fontSize: 10, letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: 10,
          }}>
            {product.tagline}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FashionViewer({ useCase, onBack }) {
  const brand    = useCase.brand
  const products = useCase.products || []

  const [activeProduct, setActiveProduct]     = useState(products[0] || null)
  const [activeColorway, setActiveColorway]   = useState(products[0]?.colorways[0] || null)
  const [activePanel, setActivePanel]         = useState(null)
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [focusCamera, setFocusCamera]         = useState(null)
  const [isTourMode, setIsTourMode]           = useState(false)
  const [modal, setModal]                     = useState(null)
  const [transition, setTransition]           = useState(null)

  /* ── Trigger entry transition on mount ── */
  useEffect(() => {
    if (activeProduct) setTransition({ product: activeProduct })
  }, [])

  const hotspots     = activeProduct?.hotspots || []
  const colorways    = activeProduct?.colorways || []
  const hotspotIndex = hotspots.findIndex(h => h.id === activeHotspotId)
  const modelPath    = activeColorway?.path || activeProduct?.model
  const modalOpen    = modal !== null

  /* ── Navigate to a specific hotspot ── */
  function goToHotspot(hotspot) {
    setActiveHotspotId(hotspot.id)
    setSelectedHotspot(hotspot)
    setActivePanel(null)
    if (hotspot.camera) setFocusCamera(hotspot.camera)
  }

  /* ── Return to hero ── */
  function closeHotspot() {
    setActiveHotspotId(null)
    setSelectedHotspot(null)
    setFocusCamera(null)
  }

  /* ── End guided tour ── */
  function endTour() {
    setIsTourMode(false)
    setActivePanel(null)
    closeHotspot()
  }

  /* ── Product switcher ── */
  function handleProductSelect(product) {
    if (product.id === activeProduct?.id) return
    if (isTourMode) endTour()
    setActiveProduct(product)
    setActiveColorway(product.colorways[0] || null)
    setActivePanel(null)
    closeHotspot()
    setTransition({ product })
  }

  /* ── Floating control presses ── */
  function handleControlPress(id) {
    if (isTourMode) {
      if (id === 'tour') endTour()
      return
    }
    if (id === 'more') {
      setModal({ type: 'fashion-more', product: activeProduct })
      return
    }
    if (id === 'tour') {
      if (hotspots.length === 0) return
      setIsTourMode(true)
      setActivePanel('tour')
      goToHotspot(hotspots[0])
      return
    }
    setActivePanel(prev => prev === id ? null : id)
  }

  /* ── Hotspot tap from 3D pin ── */
  function handleHotspotSelect(hotspot) {
    if (activeHotspotId === hotspot.id) {
      isTourMode ? endTour() : closeHotspot()
    } else {
      if (isTourMode) endTour()
      goToHotspot(hotspot)
    }
  }

  /* ── Hotspot card close button ── */
  function handleCardClose() {
    isTourMode ? endTour() : closeHotspot()
  }

  /* ── Prev / Next navigation ── */
  function handlePrev() {
    if (hotspotIndex > 0) goToHotspot(hotspots[hotspotIndex - 1])
  }

  function handleNext() {
    const isLast = hotspotIndex === hotspots.length - 1
    if (isTourMode && isLast) { endTour(); return }
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
      {/* ── TOP ZONE — brand + product identity ── */}
      <div style={{ flexShrink: 0, zIndex: 10, position: 'relative' }}>

        {/* Branded header */}
        <div style={{
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
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
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.38)', marginTop: 4,
            }}>
              {activeProduct?.label}
            </div>
          </div>
        </div>

        {/* Product switcher */}
        {products.length > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 10, padding: '0 28px 14px',
          }}>
            {products.map(p => {
              const isActive = p.id === activeProduct?.id
              return (
                <button
                  key={p.id}
                  onPointerUp={() => handleProductSelect(p)}
                  style={{
                    background: isActive ? 'rgba(0,0,0,0.86)' : 'transparent',
                    color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.36)',
                    border: isActive ? 'none' : '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 100,
                    padding: '0 22px',
                    height: 36, minHeight: 44,
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 10,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
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
      </div>

      {/* ── CENTER ZONE — full-width 3D stage ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
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

        {/* Floating hotspot card — product remains visible */}
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

        {/* COLORWAYS panel — floats centered, right of left controls */}
        {activePanel === 'colors' && !modalOpen && colorways.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '16%', left: '50%',
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

        {/* Editorial brand text — bottom-left watermark */}
        <div style={{
          position: 'absolute', bottom: 28, left: 28,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.20em', color: 'rgba(0,0,0,0.20)',
            textTransform: 'uppercase', lineHeight: 1, marginBottom: 4,
          }}>
            {brand.name}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 9,
            letterSpacing: '0.14em', color: 'rgba(0,0,0,0.16)',
            textTransform: 'uppercase',
          }}>
            {activeProduct?.tagline}
          </div>
        </div>

        {/* ── LEFT INTERACTION ZONE — vertical floating controls ── */}
        {!selectedHotspot && (
          <div style={{
            position: 'absolute', left: 24, bottom: '18%',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            gap: 16, zIndex: 20,
            pointerEvents: 'none',
          }}>
            <FashionControlBtn
              label="Tour"
              active={isTourMode || activePanel === 'tour'}
              onPress={() => handleControlPress('tour')}
            />
            {colorways.length > 0 && (
              <FashionControlBtn
                label="Colors"
                active={activePanel === 'colors'}
                onPress={() => handleControlPress('colors')}
              />
            )}
            <FashionControlBtn
              label="More"
              active={false}
              onPress={() => handleControlPress('more')}
            />
          </div>
        )}

        {/* Product-entry curtain — opaque branded reveal, fully removed after animation */}
        {transition && (
          <ProductEntryCurtain
            product={transition.product}
            brand={brand}
            onComplete={() => setTransition(null)}
          />
        )}
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
