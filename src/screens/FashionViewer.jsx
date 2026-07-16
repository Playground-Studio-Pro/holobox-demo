import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import ModelCanvas from '../components/ModelCanvas.jsx'
import HotspotCard from '../components/HotspotCard.jsx'
import Modal from '../components/Modal.jsx'

/* ── Floating control button ── */
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

/*
 * ── ProductEntryCurtain ──
 *
 * Three-phase state machine: entering → holding → exiting.
 *
 * Phases:
 *   entering  CSS enter animation starts on mount via requestAnimationFrame.
 *   holding   Curtain is fully visible. Waits for BOTH:
 *               • minHoldDone  (minimum branded hold time elapsed from mount)
 *               • modelReady   (ModelCanvas reported the GLB is normalized)
 *   exiting   Exit animation plays. After it completes, onComplete() unmounts
 *             the curtain and returns the viewer to full transparency.
 *
 * A safety timeout forces exit if the model never reports ready (e.g., the
 * user switched colorways while a transition was in progress).
 *
 * Stale readiness is handled by the parent: modelReady is only true when
 * the reported path matches transition.expectedPath, so a late callback
 * from a previously-loaded product cannot unlock the wrong curtain.
 */
function ProductEntryCurtain({ product, isInitial, modelReady, onComplete }) {
  const isNike    = product.id === 'runner'
  const brandName = product.brand?.name || ''

  // Per-brand timing constants (ms)
  const ENTER_MS    = isNike ? 260  : 440
  const EXIT_MS     = isNike ? 380  : 520
  const MIN_HOLD_MS = isInitial
    ? (isNike ? 1000 : 1300)
    : (isNike ?  720 :  920)
  const SAFETY_MS   = isInitial
    ? (isNike ? 2800 : 3500)
    : (isNike ? 2000 : 2800)

  const [hasEntered,  setHasEntered]  = useState(false)
  const [minHoldDone, setMinHoldDone] = useState(false)
  const [exiting,     setExiting]     = useState(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete })

  // Trigger CSS enter on the first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setHasEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Minimum branded hold timer (from mount, not from enter-complete)
  useEffect(() => {
    const t = setTimeout(() => setMinHoldDone(true), MIN_HOLD_MS)
    return () => clearTimeout(t)
  }, [MIN_HOLD_MS])

  // Safety: force exit if model never reports ready
  useEffect(() => {
    const t = setTimeout(() => setExiting(true), SAFETY_MS)
    return () => clearTimeout(t)
  }, [SAFETY_MS])

  // Trigger exit when both conditions are satisfied
  useEffect(() => {
    if (exiting || !minHoldDone || !modelReady) return
    setExiting(true)
  }, [exiting, minHoldDone, modelReady])

  // After exit animation, call onComplete
  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => onCompleteRef.current?.(), EXIT_MS)
    return () => clearTimeout(t)
  }, [exiting, EXIT_MS])

  // ── Nike curtain — energetic directional wipe ──
  if (isNike) {
    const slideY = exiting
      ? 'translateY(110%)'
      : hasEntered
      ? 'translateY(0%)'
      : 'translateY(-100%)'
    const slideTransition = `transform ${exiting ? EXIT_MS : ENTER_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`

    const textVisible  = hasEntered && !exiting
    const textOpacity  = textVisible ? 1 : 0
    const textTranslate = textVisible ? 'translateY(0)' : exiting ? 'translateY(-10px)' : 'translateY(18px)'
    const textDelay    = exiting ? 0 : Math.round(ENTER_MS * 0.35)
    const textDuration = exiting ? 160 : 260

    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 50,
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#f0ebe4',
          transform: slideY,
          transition: slideTransition,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Large brand wordmark */}
          <div style={{
            textAlign: 'center',
            opacity: textOpacity,
            transform: textTranslate,
            transition: `opacity ${textDuration}ms ease ${textDelay}ms, transform ${textDuration}ms ease ${textDelay}ms`,
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 64, letterSpacing: '0.12em',
              color: 'rgba(0,0,0,0.88)', textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              {brandName}
            </div>

            {/* Accent bar */}
            <div style={{
              width: 48, height: 2,
              background: 'rgba(0,0,0,0.20)',
              margin: '16px auto 0',
            }} />

            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 500,
              fontSize: 12, letterSpacing: '0.30em',
              color: 'rgba(0,0,0,0.40)', textTransform: 'uppercase',
              marginTop: 14,
            }}>
              {product.label}
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
              fontSize: 9, letterSpacing: '0.22em',
              color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase',
              marginTop: 8,
            }}>
              {product.tagline}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Rolex curtain — restrained premium fade ──
  const fadeOpacity  = exiting ? 0 : hasEntered ? 1 : 0
  const fadeTransition = `opacity ${exiting ? EXIT_MS : ENTER_MS}ms ${exiting ? 'cubic-bezier(0.4,0,1,1)' : 'cubic-bezier(0,0,0.3,1)'}`

  const contentDelay    = exiting ? 0 : Math.round(ENTER_MS * 0.45)
  const contentDuration = exiting ? 220 : 380
  const contentOpacity  = hasEntered && !exiting ? 1 : 0

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0a0a12',
        opacity: fadeOpacity,
        transition: fadeTransition,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        {/* Fine vertical line above */}
        <div style={{
          width: 1, height: 52,
          background: 'rgba(255,255,255,0.12)',
          marginBottom: 32,
          opacity: contentOpacity,
          transition: `opacity ${contentDuration}ms ease ${contentDelay}ms`,
        }} />

        <div style={{
          textAlign: 'center',
          opacity: contentOpacity,
          transition: `opacity ${contentDuration}ms ease ${contentDelay}ms`,
        }}>
          {/* Crown wordmark */}
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 32, letterSpacing: '0.36em',
            color: 'rgba(255,255,255,0.90)', textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            {brandName}
          </div>

          {/* Thin ruled separator */}
          <div style={{
            width: '100%', height: '0.5px',
            background: 'rgba(255,255,255,0.14)',
            margin: '16px 0',
          }} />

          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
            fontSize: 10, letterSpacing: '0.30em',
            color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase',
          }}>
            {product.label}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
            fontSize: 9, letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.20)', textTransform: 'uppercase',
            marginTop: 10,
          }}>
            {product.tagline}
          </div>
        </div>

        {/* Fine vertical line below */}
        <div style={{
          width: 1, height: 52,
          background: 'rgba(255,255,255,0.12)',
          marginTop: 32,
          opacity: contentOpacity,
          transition: `opacity ${contentDuration}ms ease ${contentDelay}ms`,
        }} />
      </div>
    </div>
  )
}

export default function FashionViewer({ useCase, onBack }) {
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
  // transition = { product, expectedPath, isInitial } | null

  // Path of the model that ModelCanvas has reported as normalized and ready.
  // The curtain only unlocks when this matches transition.expectedPath.
  const [modelReadyPath, setModelReadyPath] = useState(null)

  /* ── Trigger initial entry curtain on mount ── */
  useEffect(() => {
    const product  = products[0] || null
    if (!product) return
    const colorway     = product.colorways[0] || null
    const expectedPath = colorway?.path || product.model
    setModelReadyPath(null)
    setTransition({ product, expectedPath, isInitial: true })
  }, [])

  const hotspots     = activeProduct?.hotspots || []
  const colorways    = activeProduct?.colorways || []
  const hotspotIndex = hotspots.findIndex(h => h.id === activeHotspotId)
  const modelPath    = activeColorway?.path || activeProduct?.model
  const modalOpen    = modal !== null

  /* ── ModelCanvas readiness callback ── */
  function handleModelReady(readyPath) {
    setModelReadyPath(readyPath)
  }

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
    const colorway     = product.colorways[0] || null
    const expectedPath = colorway?.path || product.model
    setActiveProduct(product)
    setActiveColorway(colorway)
    setActivePanel(null)
    closeHotspot()
    // Reset readiness and start the new transition in the same batch.
    setModelReadyPath(null)
    setTransition({ product, expectedPath, isInitial: false })
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
              {activeProduct?.brand?.name}
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
          onModelReady={handleModelReady}
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

        {/* COLORWAYS panel */}
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

        {/* Editorial brand watermark — bottom-left */}
        <div style={{
          position: 'absolute', bottom: 28, left: 28,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.20em', color: 'rgba(0,0,0,0.20)',
            textTransform: 'uppercase', lineHeight: 1, marginBottom: 4,
          }}>
            {activeProduct?.brand?.name}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 9,
            letterSpacing: '0.14em', color: 'rgba(0,0,0,0.16)',
            textTransform: 'uppercase',
          }}>
            {activeProduct?.tagline}
          </div>
        </div>

        {/* ── LEFT INTERACTION ZONE ── */}
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

        {/* Product-entry curtain — synchronized with model readiness */}
        {transition && (
          <ProductEntryCurtain
            product={transition.product}
            isInitial={transition.isInitial}
            modelReady={modelReadyPath === transition.expectedPath}
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
