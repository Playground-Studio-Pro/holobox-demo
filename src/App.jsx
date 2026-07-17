import { useState, useEffect } from 'react'
import Welcome from './screens/Welcome.jsx'
import Menu from './screens/Menu.jsx'
import Viewer from './screens/Viewer.jsx'
import FashionViewer from './screens/FashionViewer.jsx'
import AutomotiveViewer from './screens/AutomotiveViewer.jsx'
import F2008PrototypeViewer from './screens/F2008PrototypeViewer.jsx'

const isDevInspector =
  window.location.pathname === '/dev/f2008-inspector' ||
  new URLSearchParams(window.location.search).get('debug') === 'f2008-inspector'

// Prototype Review Mode — sessionStorage key for return URL
const PROTO_RETURN_KEY = 'holobox:proto-review-return'

function isEditableFocus() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return ['input', 'textarea', 'select'].includes(tag) || el.isContentEditable
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  // Prototype Review Mode — Command+Shift+H (macOS) / Control+Shift+H (Windows/Linux)
  useEffect(() => {
    function handleKeyDown(e) {
      const isMac = /Macintosh/.test(navigator.userAgent)
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (!mod || !e.shiftKey || e.key.toUpperCase() !== 'H') return
      if (isEditableFocus()) return
      e.preventDefault()
      if (isDevInspector) {
        const returnUrl = sessionStorage.getItem(PROTO_RETURN_KEY) || '/'
        sessionStorage.removeItem(PROTO_RETURN_KEY)
        window.location.assign(returnUrl)
      } else {
        sessionStorage.setItem(PROTO_RETURN_KEY, window.location.pathname + window.location.search)
        window.location.assign('/dev/f2008-inspector')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isDevInspector) {
    return (
      <div className="app">
        <F2008PrototypeViewer
          useCase={{ id: 'f2008-proto', label: 'F2008 Inspector' }}
          onBack={() => window.history.back()}
        />
      </div>
    )
  }

  function handleSelectUseCase(uc) {
    setSelectedUseCase(uc)
    setScreen('viewer')
  }

  const id = selectedUseCase?.id

  return (
    <div className="app">
      {screen === 'welcome' && (
        <Welcome onEnter={() => setScreen('menu')} />
      )}
      {screen === 'menu' && (
        <Menu
          onBack={() => setScreen('welcome')}
          onSelect={handleSelectUseCase}
        />
      )}
      {screen === 'viewer' && id === 'fashion' && (
        <FashionViewer
          useCase={selectedUseCase}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'viewer' && id === 'automotive' && (
        <AutomotiveViewer
          useCase={selectedUseCase}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'viewer' && id === 'f2008-proto' && (
        <F2008PrototypeViewer
          useCase={selectedUseCase}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'viewer' && selectedUseCase && id !== 'fashion' && id !== 'automotive' && id !== 'f2008-proto' && (
        <Viewer
          useCase={selectedUseCase}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  )
}
