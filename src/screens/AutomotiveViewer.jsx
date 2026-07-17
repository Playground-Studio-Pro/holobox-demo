import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import MultiPartCanvas from '../components/MultiPartCanvas.jsx'
import F2008Canvas     from '../components/F2008Canvas.jsx'
import AutomotiveTour  from '../components/AutomotiveTour.jsx'
import { EXPERIENCES } from '../data/automotiveExperiences.js'

/* ── F2008 classification — module-scoped for referential stability ──────── */
function classifyF2008(name) {
  if (!name) return 'Other'
  const n = name.toLowerCase()
  if (n.includes('body'))                              return 'Body'
  if (n.includes('fwing'))                             return 'Front Wing'
  if (n.includes('nose'))                              return 'Nose'
  if (n.includes('rwing'))                             return 'Rear Wing'
  if (n.includes('sdwing') || n.includes('mid_wing')) return 'Side Wing'
  if (n.includes('add_uc'))                            return 'Underfloor'
  if (n.includes('suspa'))                             return 'Suspension'
  if (n.includes('brake'))                             return 'Brake'
  if (n.includes('wheel') || n.includes('tire') || n.includes('cov')) return 'Wheel'
  if (n.includes('shaft') || n.includes('cylinder'))   return 'Drivetrain'
  return 'Other'
}

export default function AutomotiveViewer({ useCase, onBack }) {
  const cars = useCase.cars || []

  const [activeCar,      setActiveCar]      = useState(cars[0] || null)
  const [showEnv,        setShowEnv]        = useState(false)
  const [sectionIndex,   setSectionIndex]   = useState(null)   // null = overview
  const [activeVariantIdx, setActiveVariantIdx] = useState(0)
  const [inCTA,          setInCTA]          = useState(false)

  // F2008 hierarchical graph — available after onGraphReady fires
  const f2008GraphRef = useRef(null)

  const experience = EXPERIENCES[activeCar?.id] || null
  const sections   = experience?.sections || []
  const activeSection = sectionIndex !== null && sectionIndex < sections.length
    ? sections[sectionIndex]
    : null

  /* ── Active node IDs (considering variant) ──────────────────────────── */
  const focusNodeIds = useMemo(() => {
    if (!activeSection) return []
    if (activeSection.variant) {
      return activeSection.variant.configs[activeVariantIdx]?.nodeIds || []
    }
    return activeSection.nodeIds || []
  }, [activeSection, activeVariantIdx])

  /* ── Camera for active section ──────────────────────────────────────── */
  const activeCamera = useMemo(() => {
    if (!activeSection) return null
    // For aero variant sections, use the active variant's nodeIds for auto camera
    const autoIds = activeSection.variant
      ? (activeSection.variant.configs[activeVariantIdx]?.nodeIds || [])
      : activeSection.nodeIds || []

    if (activeSection.camera) return activeSection.camera

    // Hierarchical pipeline: derive camera from graph
    if (experience?.pipeline === 'hierarchical' && f2008GraphRef.current && autoIds.length) {
      return f2008GraphRef.current.groupCamera(autoIds)
    }
    return null
  // f2008GraphRef.current is mutable — include activeSection as proxy dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, activeVariantIdx, experience])

  /* ── Variant visibility management (F2008 only) ────────────────────── */
  useEffect(() => {
    const graph = f2008GraphRef.current
    if (!graph || !activeSection?.variant) return
    const varConfig = activeSection.variant.configs[activeVariantIdx]
    if (!varConfig) return
    varConfig.visible.forEach(id => {
      const node = graph.getNode(id)
      if (node) node.object.visible = true
    })
    varConfig.hidden.forEach(id => {
      const node = graph.getNode(id)
      if (node) node.object.visible = false
    })
  }, [activeSection, activeVariantIdx])

  /* ── Restore default visibility when leaving a variant section ──────── */
  const prevSectionRef = useRef(null)
  useEffect(() => {
    const prev = prevSectionRef.current
    prevSectionRef.current = activeSection
    if (prev?.variant && !activeSection?.variant) {
      const graph = f2008GraphRef.current
      if (!graph || !experience?.defaultHidden) return
      // Re-hide nodes that should be hidden by default
      experience.defaultHidden.forEach(id => {
        const node = graph.getNode(id)
        if (node) node.object.visible = false
      })
      // Ensure default-visible aero nodes are shown
      const defaultVariant = prev.variant.configs[0]
      defaultVariant?.visible.forEach(id => {
        const node = graph.getNode(id)
        if (node) node.object.visible = true
      })
    }
  }, [activeSection, experience])

  /* ── F2008 graph ready — apply default hidden nodes ─────────────────── */
  const handleF2008GraphReady = useCallback(graph => {
    f2008GraphRef.current = graph
    if (experience?.defaultHidden) {
      experience.defaultHidden.forEach(id => {
        const node = graph.getNode(id)
        if (node) node.object.visible = false
      })
    }
  }, [experience])

  /* ── Navigation handlers ────────────────────────────────────────────── */
  function handleCarSelect(car) {
    if (car.id === activeCar?.id) return
    setSectionIndex(null)
    setActiveVariantIdx(0)
    setInCTA(false)
    f2008GraphRef.current = null
    setActiveCar(car)
  }

  function handleEnterTour()        { setSectionIndex(0); setActiveVariantIdx(0) }
  function handleExitTour()         { setSectionIndex(null); setActiveVariantIdx(0); setInCTA(false) }
  function handleSelectSection(idx) { setSectionIndex(idx); setActiveVariantIdx(0) }

  function handleNext() {
    if (sectionIndex === sections.length - 1) {
      setSectionIndex(null)
      setActiveVariantIdx(0)
      setInCTA(true)
    } else {
      setSectionIndex(s => s + 1)
      setActiveVariantIdx(0)
    }
  }

  function handlePrev() {
    if (sectionIndex > 0) {
      setSectionIndex(s => s - 1)
      setActiveVariantIdx(0)
    }
  }

  const isFocused = activeSection !== null || inCTA

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
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: showEnv ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: 22, height: 40, padding: '0 18px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.10em',
              color: showEnv ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.50)',
              cursor: 'pointer', transition: 'all 0.2s ease',
              userSelect: 'none', WebkitUserSelect: 'none',
            }}
          >
            {showEnv ? 'STUDIO' : 'FLAT'}
          </button>
        )}
      </div>

      {/* ── Car switcher ───────────────────────────────────────────── */}
      {!isFocused && cars.length > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 10, padding: '0 28px 14px', flexShrink: 0, zIndex: 10,
        }}>
          {cars.map(car => {
            const isActive = car.id === activeCar?.id
            return (
              <button
                key={car.id}
                onPointerUp={() => handleCarSelect(car)}
                style={{
                  background: isActive ? 'rgba(0,0,0,0.86)' : 'transparent',
                  color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.36)',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 100, padding: '0 22px',
                  height: 36, minHeight: 44,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {car.label}
                <span style={{ fontSize: 9, letterSpacing: '0.08em', opacity: 0.55, fontWeight: 400 }}>
                  {car.year}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Canvas + Tour overlay ───────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>

        {activeCar && (
          <>
            {activeCar.type === 'hierarchical' ? (
              <F2008Canvas
                key={activeCar.id}
                focusNodeIds={focusNodeIds.length ? focusNodeIds : undefined}
                focusCamera={activeCamera}
                showEnv={showEnv}
                classifyFn={classifyF2008}
                onGraphReady={handleF2008GraphReady}
              />
            ) : (
              <MultiPartCanvas
                key={activeCar.id}
                parts={activeCar.parts}
                showEnv={showEnv}
                cinemaCamera={activeCamera}
                focusNodeIds={focusNodeIds.length ? focusNodeIds : undefined}
              />
            )}

            <AutomotiveTour
              experience={experience}
              sectionIndex={sectionIndex}
              inCTA={inCTA}
              activeVariantIdx={activeVariantIdx}
              onEnterTour={handleEnterTour}
              onExitTour={handleExitTour}
              onNext={handleNext}
              onPrev={handlePrev}
              onSelectSection={handleSelectSection}
              onVariantChange={setActiveVariantIdx}
              onCTAPrimary={() => { /* TODO: lead capture */ }}
              onCTASecondary={handleExitTour}
            />
          </>
        )}
      </div>
    </div>
  )
}
