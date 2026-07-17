import { useState } from 'react'
import Welcome from './screens/Welcome.jsx'
import Menu from './screens/Menu.jsx'
import Viewer from './screens/Viewer.jsx'
import FashionViewer from './screens/FashionViewer.jsx'
import AutomotiveViewer from './screens/AutomotiveViewer.jsx'
import F2008PrototypeViewer from './screens/F2008PrototypeViewer.jsx'

const isDevInspector =
  window.location.pathname === '/dev/f2008-inspector' ||
  new URLSearchParams(window.location.search).get('debug') === 'f2008-inspector'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  if (isDevInspector) {
    return (
      <div className="app">
        <F2008PrototypeViewer
          useCase={{ id: 'f2008-proto', label: 'F2008 Inspector', emoji: '🔬' }}
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
