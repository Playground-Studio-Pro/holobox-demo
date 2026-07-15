import { useState } from 'react'
import { createPortal } from 'react-dom'
import ModelCanvas from '../components/ModelCanvas.jsx'
import SideButtons from '../components/SideButtons.jsx'
import SlidePanel from '../components/SlidePanel.jsx'
import HotspotCard from '../components/HotspotCard.jsx'
import Modal from '../components/Modal.jsx'
import { HOTSPOTS } from '../data/hotspots.js'

const LEFT_BUTTONS = [
  { id: 'specs',   icon: '📋', label: 'Specs'   },
  { id: 'video',   icon: '▶️', label: 'Video'   },
  { id: 'landing', icon: '🔗', label: 'Landing'  },
]

const RIGHT_BUTTONS = [
  { id: 'info', icon: '💬', label: 'Info' },
  { id: 'qr',   icon: '📱', label: 'QR'  },
]

const PANEL_CONTENT = {
  specs: {
    title: 'Specifications',
    description: 'Especificaciones técnicas detalladas del producto. Materiales, dimensiones y características de rendimiento. Toca los puntos sobre el modelo para más información de cada componente.',
  },
  info: {
    title: 'Product Info',
    description: 'Esta experiencia demuestra cómo el Holobox transforma la presentación de productos con visualización 3D inmersiva sin gafas.',
  },
}

export default function Viewer({ useCase, onBack }) {
  // Side panel state (side buttons only)
  const [activePanel, setActivePanel] = useState(null)
  // Hotspot card state (independent from side panel)
  const [activeHotspotId, setActiveHotspotId]     = useState(null)
  const [selectedHotspot, setSelectedHotspot]     = useState(null)
  // Modal state
  const [modal, setModal] = useState(null)

  const hotspots  = HOTSPOTS[useCase.id] || []
  const modalOpen = modal !== null

  /* ── Side buttons ── */
  function handleLeftBtn(btn) {
    if (btn.id === 'video') {
      setModal({ type: 'video' })
      setActivePanel(null)
    } else if (btn.id === 'landing') {
      setModal({ type: 'landing' })
      setActivePanel(null)
    } else {
      setActivePanel(prev => prev === btn.id ? null : btn.id)
    }
    // Don't close hotspot card — it's independent
  }

  function handleRightBtn(btn) {
    if (btn.id === 'qr')   setModal({ type: 'qr' })
    if (btn.id === 'info') setModal({ type: 'info' })
    setActivePanel(null)
  }

  /* ── Hotspot card ── */
  function handleHotspotSelect(hotspot) {
    if (activeHotspotId === hotspot.id) {
      closeHotspotCard()
    } else {
      setActiveHotspotId(hotspot.id)
      setSelectedHotspot(hotspot)
    }
    // Never touches activePanel — slide panel is independent
  }

  function closeHotspotCard() {
    setActiveHotspotId(null)
    setSelectedHotspot(null)
  }

  const panelOpen  = activePanel !== null
  const panelTitle = PANEL_CONTENT[activePanel]?.title || ''
  const panelDesc  = PANEL_CONTENT[activePanel]?.description || ''

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
      {/* Header */}
      <div className="viewer-header">
        <button className="back-btn" onPointerUp={onBack}>← Volver</button>
        <span className="title">{useCase.emoji} {useCase.label}</span>
      </div>

      {/* 3-column layout */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <SideButtons buttons={LEFT_BUTTONS}  activeId={activePanel} onPress={handleLeftBtn} />

        {/* Canvas + floating hotspot card */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <ModelCanvas
            modelPath={useCase.model}
            placeholderColor={useCase.placeholderColor}
            hotspots={hotspots}
            onHotspotSelect={handleHotspotSelect}
            activeHotspotId={activeHotspotId}
            showHotspots={!modalOpen}
            autoRotate={selectedHotspot === null}
          />

          {/* Floating card — appears over the model, independent of side panel */}
          {selectedHotspot && !modalOpen && (
            <HotspotCard hotspot={selectedHotspot} onClose={closeHotspotCard} />
          )}
        </div>

        <SideButtons buttons={RIGHT_BUTTONS} activeId={null}        onPress={handleRightBtn} />
      </div>

      {/* Slide panel — side buttons only, anchored to viewer root right edge */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setActivePanel(null)}
        title={panelTitle}
        description={panelDesc}
        cta={{
          label: 'Más información',
          onPress:    () => setModal({ type: 'info' }),
          onMoreInfo: () => setModal({ type: 'info' }),
        }}
      />

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
